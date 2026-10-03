from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "credit_risk_model.pkl"
THRESHOLD_PATH = BASE_DIR / "best_threshold.pkl"
STATIC_DIR = BASE_DIR / "static"

ml_model = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # The model was trained/serialized with scikit-learn 1.6.1.
    ml_model["model"] = joblib.load(MODEL_PATH)
    ml_model["threshold"] = float(joblib.load(THRESHOLD_PATH))
    yield
    ml_model.clear()


app = FastAPI(title="CrediSense AI - Credit Risk Assessment", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoanApplication(BaseModel):
    person_age: int
    person_income: float
    person_home_ownership: str
    person_emp_length: float
    loan_intent: str
    loan_grade: str
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cb_person_default_on_file: str
    cb_person_cred_hist_length: int


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": "model" in ml_model}


@app.post("/predict")
def predict(data: LoanApplication):
    input_df = pd.DataFrame([data.model_dump()])
    probability = float(ml_model["model"].predict_proba(input_df)[:, 1][0])
    prediction = int(probability >= ml_model["threshold"])

    return {
        "default_probability": probability,
        "default_prediction": prediction,
        "threshold": ml_model["threshold"],
        "Result": "High Risk" if prediction == 1 else "Low Risk",
    }


app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
