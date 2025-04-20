import os

import boto3
import cv2
import numpy as np
from bson import ObjectId
from bson.errors import InvalidId
from keras_facenet import FaceNet
from pymongo import MongoClient

# Add this temporary diagnostic code
mongo = MongoClient("mongodb://localhost:27017")
db = mongo['test']
print("Existing collections:", db.list_collection_names())
class FolderFaceSearch:
    def __init__(self, mongo_uri, s3_bucket):
        try:
            # MongoDB connection with validation
            self.mongo = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            self.mongo.server_info()  # Test connection
            self.db = self.mongo['test']
            
            # Verify collections exist
            if 'folders' not in self.db.list_collection_names():
                raise ValueError("'folders' collection not found in database")
            
            # AWS S3 setup
            self.s3 = boto3.client('s3')
            self.s3_bucket = s3_bucket
            
            # Face recognition setup
            self.embedder = FaceNet()
            
        except Exception as e:
            raise ConnectionError(f"Initialization failed: {str(e)}")

    def _get_image_from_url(self, url):
        """Download image from S3 URL with error handling"""
        try:
            key = url.split(f'/{self.s3_bucket}/')[-1]
            response = self.s3.get_object(Bucket=self.s3_bucket, Key=key)
            return response['Body'].read()
        except Exception as e:
            print(f"Error fetching image from S3: {str(e)}")
            return None

    def _get_face_embeddings(self, image_bytes):
        try:
            # Validate image input
            if not image_bytes or len(image_bytes) < 1024:
                raise ValueError("Invalid image data")

            # Decode image with OpenCV
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if image is None:
                raise ValueError("Failed to decode image")

            # Convert to RGB for MTCNN
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Detect faces with detailed logging
            detections = self.embedder.extract(
                image_rgb,
                threshold=0.95,  # Higher confidence threshold
                min_face_size=80  # Minimum face size in pixels
            )

            if not detections:
                logger.warning("No faces detected after threshold filtering")
                return None

            # Validate and process detections
            valid_embeddings = []
            for idx, detection in enumerate(detections):
                x, y, w, h = detection['box']
                
                # Skip invalid bounding boxes
                if w <= 0 or h <= 0 or x < 0 or y < 0:
                    logger.warning(f"Skipping invalid detection {idx}: {detection['box']}")
                    continue
                    
                # Extract face region
                face_img = image_rgb[y:y+h, x:x+w]
                
                # Validate face dimensions
                if face_img.shape[0] < 40 or face_img.shape[1] < 40:
                    logger.warning(f"Face too small in detection {idx}: {face_img.shape}")
                    continue
                    
                # Generate embedding
                try:
                    embedding = self.embedder.embeddings([face_img])[0]
                    valid_embeddings.append(embedding)
                except Exception as e:
                    logger.error(f"Embedding failed for detection {idx}: {str(e)}")

            return valid_embeddings if valid_embeddings else None

        except Exception as e:
            logger.error(f"Face processing failed: {str(e)}")
            return None

    def find_matching_photos(self, folder_id, selfie_bytes, threshold=0.7):
        """
        Find matching photos with improved error handling
        Returns: {
            'data': list of matches,
            'error': string if error,
            'code': http status code
        }
        """
        try:
            # Validate folder ID format
            if not ObjectId.is_valid(folder_id):
                return {
                    "error": "Invalid folder ID format - must be 24-character hex string",
                    "code": 400,
                    "example_valid_id": "507f1f77bcf86cd799439011"
                }

            # Convert to ObjectId and query
            folder = self.db.folders.find_one({'_id': ObjectId(folder_id)})
            
            if not folder:
                available_ids = list(self.db.folders.find().limit(5).distinct('_id'))
                return {
                    "error": f"Folder {folder_id} not found",
                    "code": 404,
                    "suggestions": [
                        "Check if folder exists in 'folders' collection",
                        {
                            "Recent folder IDs": [str(id) for id in available_ids]
                        }
                    ]
                }
                

            # Process selfie
            selfie_embeddings = self._get_face_embeddings(selfie_bytes)
            if not selfie_embeddings:
                return {"error": "No faces detected in selfie", "code": 400}

            matches = []
            
            # Process each photo in the folder
            for photo_url in folder.get('photos', []):
                image_bytes = self._get_image_from_url(photo_url)
                if not image_bytes: continue

                photo_embeddings = self._get_face_embeddings(image_bytes)
                if not photo_embeddings: continue

                # Calculate best similarity score
                best_similarity = max(
                    np.inner(se, pe)
                    for se in selfie_embeddings
                    for pe in photo_embeddings
                )

                if best_similarity >= threshold:
                    matches.append({
                        'url': photo_url,
                        'similarity': float(best_similarity),
                        'folder_info': {
                            'name': folder.get('name', 'Unnamed Folder'),
                            'id': str(folder['_id']),
                            'client': folder.get('client', 'Unknown')
                        }
                    })

            return {
                "data": sorted(matches, key=lambda x: x['similarity'], reverse=True),
                "count": len(matches),
                "code": 200
            }

        except InvalidId:
            return {"error": "Invalid folder ID format", "code": 400}
        except Exception as e:
            return {"error": str(e), "code": 500}

if __name__ == "__main__":
    try:
        # Initialize system with environment variables
        system = FolderFaceSearch(
            mongo_uri="mongodb://localhost:27017",
            s3_bucket="event-images-by-photographers"
        )
        
        # Example usage with error handling
        folder_id = "67f4f5a0f15d10c969a4eacd"  # Replace with valid ID
        
        with open("face-recogintion/test_selfie.jpg", "rb") as f:
            result = system.find_matching_photos(folder_id, f.read())
            
        if result['code'] != 200:
            print(f"Error {result['code']}: {result['error']}")
            if 'suggestions' in result:
                print("Suggestions:", *result['suggestions'], sep="\n- ")
        else:
            print(f"Found {result['count']} matches:")
            for match in result['data'][:5]:  # Show top 5 results
                print(f"\nURL: {match['url']}")
                print(f"Similarity: {match['similarity']:.2%}")
                print(f"Folder: {match['folder_info']['name']}")
                print(f"Client: {match['folder_info']['client']}")

    except Exception as e:
        print(f"Critical error: {str(e)}")