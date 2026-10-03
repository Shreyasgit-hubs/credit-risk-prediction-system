# CrediSense AI — Credit Risk Assessment

Modern UI for the existing credit-risk machine-learning project.

## Requirements

- Windows 10/11
- **Python 3.11.x** (required for the serialized model compatibility)
- Internet connection for the first dependency installation

## Easiest way to run

1. Extract this ZIP.
2. Install Python 3.11.x if it is not installed.
3. Double-click **`run.bat`**.
4. Wait for the server to start.
5. Open **http://127.0.0.1:8000**.

The first run creates a local `venv` folder and installs the exact versions required by the saved model.

## Manual VS Code method

Open a terminal in this folder:

```text
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## API

- `GET /health` — confirms the API/model is loaded
- `POST /predict` — returns the model's credit-risk prediction
- `GET /docs` — FastAPI interactive API documentation

## Important model compatibility note

`credit_risk_model.pkl` was serialized with **scikit-learn 1.6.1**. Do not upgrade scikit-learn to 1.8.x for this project unless the model is retrained/re-serialized.
