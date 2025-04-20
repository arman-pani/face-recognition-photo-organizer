# face_encoder.py
import json
import sys
from io import BytesIO

import face_recognition
import numpy as np
import requests
from PIL import Image


def create_encodings_from_image_url(image_url: str):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content)).convert('RGB')
    img_np = np.array(img)

    face_locations = face_recognition.face_locations(img_np)
    encodings = face_recognition.face_encodings(img_np, face_locations)

    return [enc.tolist() for enc in encodings]

if __name__ == "__main__":
    image_url = sys.argv[1]
    try:
        encodings = create_encodings_from_image_url(image_url)
        print(json.dumps(encodings))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
