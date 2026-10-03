# CrediSense Credit Risk Assessment

> An end-to-end Machine Learning application that evaluates borrower information and generates a probability-based credit risk assessment through an interactive web interface.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)
![Scikit--learn](https://img.shields.io/badge/scikit--learn-1.6.1-F7931E?logo=scikit-learn)
![XGBoost](https://img.shields.io/badge/XGBoost-3.2.0-189FDD)
![Pandas](https://img.shields.io/badge/Pandas-2.2.2-150458?logo=pandas)
![License](https://img.shields.io/badge/License-MIT-green)

## 📌 Overview

**CrediSense** is a machine-learning-powered credit risk assessment system designed to evaluate a borrower's financial and credit profile and generate a clear risk signal.

The application combines:

- Machine Learning
- Data preprocessing and analysis
- Probability-based classification
- FastAPI REST API
- Interactive HTML/CSS/JavaScript frontend
- Serialized ML model deployment
- Real-time prediction
- Model threshold-based decision making

Instead of requiring users to interact directly with Python or a Jupyter Notebook, CrediSense provides a guided web interface where borrower information can be entered and evaluated through the trained machine-learning model.

---

## 🎯 Project Objective

The primary objective of this project is to build a practical credit-risk prediction system that can:

1. Accept borrower and loan information.
2. Process the information using a trained machine-learning model.
3. Calculate the probability of loan default.
4. Compare the probability against an optimized classification threshold.
5. Generate a **High Risk** or **Low Risk** result.
6. Present the result through an easy-to-use web interface.

The project demonstrates how a machine-learning model can be transformed from an analytical notebook into a deployable application.

---

## 🖥️ Application

The project contains a modern interactive frontend called **CrediSense Credit Risk Intelligence**.

The interface allows users to enter:

### Borrower Information

- Age
- Annual income
- Home ownership
- Employment length

### Loan Information

- Loan purpose
- Loan grade
- Loan amount
- Interest rate
- Loan-to-income ratio

### Credit History

- Previous default on file
- Credit history length

After submitting the information, the application sends the data to the FastAPI backend.

The backend passes the information to the trained machine-learning model and returns:

- Default probability
- Model threshold
- Risk prediction
- High Risk / Low Risk result

---

## 🔄 How the System Works

```text
                 ┌──────────────────────┐
                 │      User Input      │
                 │                      │
                 │ Borrower Information │
                 │ Loan Information     │
                 │ Credit History       │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Web Interface      │
                 │ HTML / CSS / JS      │
                 └──────────┬───────────┘
                            │
                            │ POST /predict
                            ▼
                 ┌──────────────────────┐
                 │     FastAPI API      │
                 │       main.py        │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Trained ML Model     │
                 │ credit_risk_model    │
                 │       .pkl           │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Default Probability  │
                 │        +             │
                 │ Decision Threshold   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Risk Assessment    │
                 │                      │
                 │   HIGH RISK /        │
                 │   LOW RISK           │
                 └──────────────────────┘
```

---

# 🧠 Machine Learning Approach

The machine-learning workflow was developed in the accompanying Jupyter Notebook:

```text
Credit_Risk.ipynb
```

The workflow includes the major stages required for developing a classification-based credit-risk model.

### Typical workflow

```text
Raw Dataset
     ↓
Data Exploration
     ↓
Data Cleaning
     ↓
Feature Preparation
     ↓
Categorical Feature Handling
     ↓
Train / Test Split
     ↓
Model Training
     ↓
Model Evaluation
     ↓
Threshold Selection
     ↓
Model Serialization
     ↓
FastAPI Integration
     ↓
Web Application
```

The trained model is stored as:

```text
credit_risk_model.pkl
```

The selected decision threshold is stored separately as:

```text
best_threshold.pkl
```

Keeping the threshold separately allows the API to apply the selected classification threshold during prediction.

---

# 📊 Dataset

The project uses:

```text
credit_risk_dataset.csv
```

The dataset contains borrower, loan, and credit-history information.

Important variables include:

| Feature | Description |
|---|---|
| `person_age` | Borrower's age |
| `person_income` | Annual income |
| `person_home_ownership` | Home ownership status |
| `person_emp_length` | Employment length |
| `loan_intent` | Purpose of the loan |
| `loan_grade` | Loan grade |
| `loan_amnt` | Requested loan amount |
| `loan_int_rate` | Loan interest rate |
| `loan_percent_income` | Loan amount relative to income |
| `cb_person_default_on_file` | Previous default indicator |
| `cb_person_cred_hist_length` | Credit history length |

The target variable represents whether the borrower is associated with loan default risk.

---

# 🤖 Model Prediction

The API uses the trained model's probability output rather than relying only on the raw classification result.

Conceptually:

```python
probability = model.predict_proba(input_data)[:, 1]
```

The probability is then compared with the saved model threshold:

```python
prediction = probability >= threshold
```

This produces the final risk classification.

### Example

```text
Default Probability = 0.27
Model Threshold     = 0.20

0.27 >= 0.20

Result → HIGH RISK
```

Another example:

```text
Default Probability = 0.12
Model Threshold     = 0.20

0.12 < 0.20

Result → LOW RISK
```

The actual threshold is loaded dynamically from:

```text
best_threshold.pkl
```

---

# ⚙️ Technology Stack

## Backend

- Python
- FastAPI
- Pydantic
- Uvicorn

## Machine Learning

- Scikit-learn
- XGBoost
- Joblib
- Pandas

## Frontend

- HTML5
- CSS3
- JavaScript
- Google Fonts

## Deployment

- Render
- Gunicorn/Uvicorn-compatible ASGI deployment through Uvicorn

---

# 📁 Project Structure

```text
credit-risk-assessment-ml/
│
├── static/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── Credit_Risk.ipynb
│
├── credit_risk_dataset.csv
│
├── credit_risk_model.pkl
│
├── best_threshold.pkl
│
├── main.py
│
├── requirements.txt
│
├── render.yaml
│
├── runtime.txt
│
├── .gitignore
│
└── README.md
```

### File descriptions

#### `main.py`

The FastAPI backend.

It:

- Loads the trained ML model.
- Loads the optimized threshold.
- Defines the input schema.
- Provides the prediction endpoint.
- Provides the health-check endpoint.
- Serves the frontend.

#### `Credit_Risk.ipynb`

The machine-learning development notebook containing the data analysis and model development workflow.

#### `credit_risk_dataset.csv`

The dataset used for the credit-risk project.

#### `credit_risk_model.pkl`

Serialized trained machine-learning model.

#### `best_threshold.pkl`

Serialized classification threshold used by the API.

#### `static/index.html`

Main frontend page.

#### `static/style.css`

Frontend styling, responsive layout, animations, cards, form controls, risk gauge, and visual components.

#### `static/script.js`

Frontend logic responsible for:

- Form interaction
- Profile completion
- Loan-to-income ratio calculation
- API communication
- Loading state
- Prediction result display
- Risk visualization
- API health status

#### `requirements.txt`

Python dependencies required to run the application.

#### `render.yaml`

Deployment configuration for Render.

#### `runtime.txt`

Specifies the Python runtime required by the application.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/credit-risk-assessment-ml.git
```

Move into the project:

```bash
cd credit-risk-assessment-ml
```

---

# 🐍 2. Create a Virtual Environment

Python **3.11.x** is recommended because the serialized model was created using the project's specified Scikit-learn environment.

Create the environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

---

# 📦 3. Install Dependencies

```bash
pip install -r requirements.txt
```

The main dependencies include:

```text
fastapi
uvicorn
pydantic
pandas
scikit-learn
xgboost
joblib
```

---

# ▶️ 4. Run the Application

Start the FastAPI server:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

You should see a message indicating that the server is running.

Open the application in your browser:

```text
http://127.0.0.1:8000
```

---

# 🧪 API Endpoints

The application exposes several endpoints.

## Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

This endpoint can be used to verify whether the trained model has successfully loaded.

---

## Prediction

```http
POST /predict
```

The endpoint accepts borrower information and returns the model prediction.

Example request:

```json
{
  "person_age": 30,
  "person_income": 600000,
  "person_home_ownership": "RENT",
  "person_emp_length": 5,
  "loan_intent": "PERSONAL",
  "loan_grade": "B",
  "loan_amnt": 100000,
  "loan_int_rate": 11.5,
  "loan_percent_income": 0.17,
  "cb_person_default_on_file": "N",
  "cb_person_cred_hist_length": 6
}
```

Example response:

```json
{
  "default_probability": 0.123,
  "default_prediction": 0,
  "threshold": 0.20,
  "Result": "Low Risk"
}
```

The exact probability and threshold depend on the trained model.

---

# 📚 Interactive API Documentation

Because the backend uses FastAPI, interactive API documentation is automatically available.

After starting the server, open:

```text
http://127.0.0.1:8000/docs
```

This allows you to test API endpoints directly from the browser.

---

# 🌐 Deployment

The project includes:

```text
render.yaml
```

which can be used to deploy the application on Render.

## Deployment Steps

### 1. Push the project to GitHub

Create a GitHub repository named:

```text
credit-risk-assessment-ml
```

Push the project files.

### 2. Create a Render Web Service

Connect the GitHub repository to Render.

Render can use the included:

```text
render.yaml
```

configuration.

The application uses:

```text
Build Command:
pip install -r requirements.txt
```

and:

```text
Start Command:
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3. Open the deployed application

Once deployment finishes, Render provides a public URL.

---

# ⚠️ Model Compatibility

One important consideration is model serialization compatibility.

The project pins:

```text
scikit-learn==1.6.1
```

because the serialized model was created with this Scikit-learn version.

For reproducibility, avoid casually upgrading the Scikit-learn version without retraining or re-serializing the model.

The project's `requirements.txt` contains the required dependency versions.

---

# 🔐 Data & Privacy

This project is intended for educational, demonstration, and machine-learning application development purposes.

Do not use real sensitive financial or personally identifiable information when experimenting with the publicly hosted version.

If deploying this system for real financial use, additional requirements would need to be considered, including:

- Data privacy
- Security
- Authentication
- Authorization
- Data encryption
- Model monitoring
- Bias and fairness evaluation
- Regulatory compliance
- Auditability
- Human review
- Production-grade infrastructure

The prediction generated by this project should not be treated as a real-world lending decision.

---

# 📈 Possible Future Improvements

Several improvements could make the project more production-ready.

### 1. Explainable AI

Add model explanation using tools such as:

- SHAP
- Feature importance
- Local prediction explanations

This would help users understand which factors contributed to a prediction.

### 2. User Authentication

Add:

- Login
- Registration
- Role-based access
- Secure sessions

### 3. Prediction History

Store previous assessments in a database.

For example:

```text
Applicant
    ↓
Prediction
    ↓
Probability
    ↓
Decision
    ↓
Timestamp
```

### 4. Dashboard

Create an analytics dashboard containing:

- Total assessments
- High-risk percentage
- Low-risk percentage
- Average risk probability
- Risk distribution
- Loan amount distribution

### 5. Model Monitoring

Track:

- Prediction drift
- Feature drift
- Model performance
- Data quality
- Prediction distribution

### 6. Better Model Evaluation

Add metrics such as:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- Precision-Recall AUC
- Confusion matrix

### 7. Fairness Analysis

Evaluate whether the model behaves differently across relevant borrower groups and investigate potential sources of bias.

---

# 🧩 Example User Flow

A typical user interaction looks like this:

```text
Open CrediSense
       ↓
Enter borrower details
       ↓
Enter loan details
       ↓
Enter credit history
       ↓
Loan-to-income ratio calculated
automatically
       ↓
Click "Run Risk Assessment"
       ↓
Frontend sends POST /predict
       ↓
FastAPI receives the request
       ↓
Trained ML model calculates
default probability
       ↓
Probability is compared
with saved threshold
       ↓
Risk result displayed
       ↓
Probability + threshold +
decision shown visually
```

---

# 💡 Why This Project Is Useful

This project demonstrates an important transition in machine learning:

```text
Machine Learning Notebook
          ↓
       Trained Model
          ↓
      Saved Model
          ↓
       REST API
          ↓
      Web Interface
          ↓
    Deployable ML App
```

Rather than stopping at model training, the project demonstrates how a machine-learning solution can be integrated into a usable application.

---

# 🛠️ Troubleshooting

## Model loading error

If you encounter an error while loading:

```text
credit_risk_model.pkl
```

verify that the installed Scikit-learn version matches the version used to serialize the model.

Check:

```bash
pip show scikit-learn
```

The project expects:

```text
1.6.1
```

---

## Port already in use

If port `8000` is already being used, start the server on another port:

```bash
uvicorn main:app --host 127.0.0.1 --port 8001
```

Then open:

```text
http://127.0.0.1:8001
```

---

## Dependencies not installed

Run:

```bash
pip install -r requirements.txt
```

If using a virtual environment, make sure it is activated first.

---

# 👨‍💻 Author

**Shreyas Patil**

Data Science / Machine Learning Project

---

# ⭐ Project Highlights

- End-to-end Machine Learning project
- Credit risk classification
- Probability-based prediction
- Custom decision threshold
- Trained model serialization
- FastAPI REST API
- Interactive frontend
- Real-time prediction
- Automatic loan-to-income calculation
- Model health monitoring
- API documentation
- Render deployment configuration
- Reproducible Python environment

---

# 📄 License

This project is intended for educational and demonstration purposes.

You may modify and extend the project for learning and portfolio development.

## 📥 Clone the Project

To get a local copy of this project, open your terminal and run:

```bash
git clone https://github.com/Shreyasgit-hubs/credit-risk-prediction-system.git
```

Navigate to the project directory:

```bash
cd credit-risk-prediction-system
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI application:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

Open the application in your browser:

```text
http://127.0.0.1:8000
```

For the interactive FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### Quick Setup

```bash
git clone https://github.com/Shreyasgit-hubs/credit-risk-prediction-system.git
cd credit-risk-prediction-system
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

> **Note:** The `venv/` folder is intentionally excluded from the Git repository. Create your own virtual environment locally and install the dependencies using `requirements.txt`.
