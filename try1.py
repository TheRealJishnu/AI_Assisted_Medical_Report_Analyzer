from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import sqlite3
from datetime import datetime


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
conn = sqlite3.connect("predictions.db", check_same_thread=False)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS prediction_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hemoglobin REAL,
    wbc REAL,
    platelets REAL,
    glucose REAL,
    risk_level TEXT,
    confidence REAL,
    timestamp TEXT
)
""")

conn.commit()


model = joblib.load("catboost_model.joblib")
scaler = joblib.load("standard_scaler.joblib")
from pydantic import BaseModel

class PatientData(BaseModel):
    hemoglobin: float
    wbc: float
    platelets: float
    glucose: float

@app.post("/predict")
def predict(data: PatientData):

    features = np.array([[
        data.hemoglobin,
        data.wbc,
        data.platelets,
        data.glucose
    ]])

    scaled = scaler.transform(features)

    prediction = model.predict(scaled)

    probabilities = model.predict_proba(scaled)[0]
    confidence = max(probabilities)

    label_map = {
        0: "low",
        1: "medium",
        2: "high"
    }

    risk = label_map[int(prediction[0][0])]
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    INSERT INTO prediction_history (
        hemoglobin,
        wbc,
        platelets,
        glucose,
        risk_level,
        confidence,
        timestamp
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data.hemoglobin,
        data.wbc,
        data.platelets,
        data.glucose,
        risk,
        float(confidence),
        timestamp
    ))

    conn.commit()


    return {
        "risk_level": risk,
        "confidence": float(confidence)
    }

# @app.post("/predict")
# def predict(data: PatientData):

#     features = np.array([[
#         data.hemoglobin,
#         data.wbc,
#         data.platelets,
#         data.glucose
#     ]])

#     scaled = scaler.transform(features)

#     prediction = model.predict(scaled)[0]

#     probabilities = model.predict_proba(scaled)[0]
#     confidence = float(max(probabilities))

#     return {
#         "risk_level": prediction,
#         "confidence": confidence
#     }
@app.get("/history")
def get_history():

    cursor.execute("""
    SELECT * FROM prediction_history
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    history = []

    for row in rows:
        history.append({
            "id": row[0],
            "hemoglobin": row[1],
            "wbc": row[2],
            "platelets": row[3],
            "glucose": row[4],
            "risk_level": row[5],
            "confidence": row[6],
            "timestamp": row[7]
        })

    return history