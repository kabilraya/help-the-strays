from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "*",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained functional model
model = load_model("animals_classifier_mobilenet_functional_trained.keras", compile=False)

def preprocess_image(image_bytes):
   
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((128, 128))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = preprocess_image(image_bytes)
        prediction = model.predict(img)[0][0]  
        is_animal = prediction < 0.5  # 0 = Animal, 1 = Non-Animal
        return {
            "accepted": bool(is_animal),
            "score": float(prediction)  
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
