import json
import sys

import face_recognition
import numpy as np
from PIL import Image


def create_encodings_from_file(file_path):
    
    try:
        img = Image.open(file_path).convert('RGB')
        img_np = np.array(img)

        face_locations = face_recognition.face_locations(img_np)
        encodings = face_recognition.face_encodings(img_np, face_locations)

        return [enc.tolist() for enc in encodings]
    except Exception as e:
        raise Exception(f"Error processing image file: {e}")


def compare_encodings(selfie_encoding, images):
    matched_urls = []
    selfie_np = np.array(selfie_encoding)

    for image in images:
        url = image["url"]
        encodings = image.get("encoding", [])  # Note: should match your schema

        for enc in encodings:
            enc_np = np.array(enc)
            distance = np.linalg.norm(selfie_np - enc_np)
            if distance < 0.6:  # threshold for face match
                matched_urls.append(url)
                break

    return matched_urls


if __name__ == "__main__":
    try:
        mode = sys.argv[1]  # "encode" or "compare"

        if mode == "encode":
            file_path = sys.argv[2]
            encodings = create_encodings_from_file(file_path)
            print(json.dumps(encodings))

        elif mode == "compare":
            selfie_encoding = json.loads(sys.argv[2])
            images = json.loads(sys.argv[3])

            result = compare_encodings(selfie_encoding, images)
            print(json.dumps({ "matched": result }))
        
        else:
            raise Exception("Invalid mode. Use 'encode' or 'compare'.")

    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)
