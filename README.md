# AI-Assisted Medical Report Analyzer

A fullstack machine learning web application for predicting patient risk levels

The application allows users to:
- Enter patient medical parameters
- Predict patient risk levels using a trained ML model
- Store prediction history
- View previous predictions through a frontend dashboard

---

# Technologies Used

## Frontend
- React
- Vite
- JavaScript

## Backend
- FastAPI
- Python

## Database
- SQLite (Tried Postgresql but time constraint did not allow)

## Machine Learning
- Scikit-learn
- CatBoost
- NumPy
- Pandas
- Joblib

---

# Project Architecture

React Frontend
↓
FastAPI Backend
↓
ML Model and Scaling Object
↓
SQLite Database

The frontend communicates with the backend using APIs.
The backend loads the trained ML model and scaler object for inference.
Prediction history is stored in SQLite.

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/TheRealJishnu/AI_Assisted_Medical_Report_Analyzer.git
cd AI_Assisted_Medical_Report_Analyzer
```

## backend setup

```bash
conda create -n sbi_l python=3.12
conda activate sbi_l
```

## Install Dependencies
```bash
pip install -r requirements.txt
```
## Run Backend
```bash
python -m uvicorn try1:app --reload
```
## Backend runs at:

http://127.0.0.1:8000

## Frontend Setup
- Navigate to Frontend
```
cd frontend
```
## Install Dependencies
```
npm install
Run Frontend
npm run dev
```

## Frontend runs at:

http://localhost:5173

## ML Approach

The uses a supervised machine learning classification pipeline for predicting patient risk levels.

### Workflow
- Data loading from CSV dataset
- Data preprocessing
- Feature scaling using StandardScaler
- Model training using number of Classifier
- Model evaluation
- Model serialization using Joblib
- Real-time inference through FastAPI APIs

### Features Used
- Hemoglobin
- WBC
- Platelets
- Glucose
### Output Classes
- Low Risk
- Medium Risk
- High Risk

# The full data processing and ML model training code is available in the "sbi_lab.ipynb" file in this repo

# Deployment
backend has been deployed on render. Front-end remains. Will not be possible before deadline. Will update after deadline