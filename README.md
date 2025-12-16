# SmartDine – AI-Powered Food Discovery Assistant

SmartDine is a full-stack application that helps users discover restaurants using natural language queries such as mood, cravings, budget, or situation.

The system combines a modern user interface, a secure backend, and an AI-powered recommendation engine built using Retrieval-Augmented Generation (RAG).

---

## What This Project Does

- Allows users to sign up and log in securely
- Accepts natural language food queries
- Recommends restaurants intelligently using AI
- Explains why a recommendation fits the user’s request
- Stores user search history
- Learns from user feedback (like / dislike)
- Allows users to clear their history

---

## Project Structure

The project is divided into three independent parts:

smartdine/
├── frontend/ # React user interface
├── backend/ # Authentication, history, feedback APIs
├── model_smartdine/ # AI recommendation engine (RAG + FAISS)
├── README.md
└── PROJECT_OVERVIEW.md


Each part runs separately and communicates through APIs.

---

## Prerequisites

Before running the project, ensure the following are installed:

- Python 3.10 or later
- Node.js (LTS version)
- MySQL Server
- Git

---



## Setup and Installation Guide

This project consists of three independent services:

1. Backend API (Authentication, History, Feedback)
2. Model Service (AI Recommendation Engine)
3. Frontend Application (User Interface)

Each service must be started in the correct order.

---

## Step 1: Backend Setup (Authentication, History, Feedback)

Open a terminal window and navigate to the backend folder:

```bash
cd smartdine-backend

Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate   # Windows


Install backend dependencies:

pip install -r requirements.txt


Ensure MySQL is running and a database named smartdine exists.

Start the backend server:

uvicorn main:app --reload --port 8000


The backend API will be available at:

http://localhost:8000

```

### Database Configuration (Backend Service)

- The backend uses MySQL to store users, search history, and feedback.

- Where to configure it

- Open the following file:

- smartdine-backend/database.py


- You will see the database configuration section:

``` bash

DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "smartdine")

```

- What to do

- Update the values according to your local MySQL setup.

- Example:

```bash 

DB_USER = "root"
DB_PASS = "your_mysql_password"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "smartdine"

```
- Database requirement

- Make sure a MySQL database named smartdine exists before starting the backend.

- You can create it using:

```bash

CREATE DATABASE smartdine;

```

#### Order of Configuration

- Make sure you complete the following before running the servers:

- Set OpenAI API key in model_smartdine/api.py

- Set MySQL credentials in smartdine-backend/database.py

- Ensure MySQL server is running

- Start backend → model service → frontend

#### Why This Configuration Is Required

- Without the OpenAI API key, AI recommendations cannot be generated

- Without correct database credentials, login, history, and feedback will fail

- These settings allow the system to work end-to-end as designed


### Step 2: Model Service Setup (AI Recommendation Engine)

Open a new terminal window and Navigate to the model service folder:


```bash
cd model_smartdine

Create and activate a virtual environment (recommended):

python -m venv venv
venv\Scripts\activate   # Windows


Install model dependencies:

pip install -r requirements.txt


If FAISS indexes and embeddings are not already generated, run:

python train_embeddings.py


This step prepares:

Sentence embeddings

FAISS vector indexes

Metadata files for retrieval

Start the model service:

uvicorn api:app --host 0.0.0.0 --port 5001


The model service will be available at:

http://localhost:5001

```
### OpenAI API Key Setup (AI Model Service)

#### The AI recommendation engine uses the OpenAI API to generate responses.

- Where to set it

- Open the following file:

- model_smartdine/api.py

- Locate this line:

- client = OpenAI(api_key="")

- What to do

- Replace the empty string with your OpenAI API key:

``` bash
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

Example:

client = OpenAI(api_key="sk-xxxxxxxxxxxxxxxxxxxx")

```


## Embedding Model Setup

The fine-tuned embedding model is not included in the repository due to file size limits.

To generate embeddings locally:
```bash
cd model_smartdine
python train_embedding.py

```

### Step 3: Frontend Setup (User Interface)

Open another terminal window and navigate to the frontend folder:


```bash

cd smartdine-frontend


Install frontend dependencies:

npm install


Start the frontend application:

npm start


The application will open automatically at:

http://localhost:3000

```

### How the System Works

- The user interacts with the React frontend.

- Requests are sent to the backend API (port 8000).

- The backend forwards search queries to the AI model service (port 5001).

- The model service retrieves relevant restaurants using FAISS.

- The AI generates a contextual recommendation using only retrieved data.

- User feedback (like/dislike) is recorded.

- Search history and feedback are stored in the database.

- Feedback is used to re-rank future recommendations.

### Notes

- The first AI response may take a few seconds due to model loading.

- All recommendations are strictly restricted to retrieved restaurant data to prevent hallucination.

- User feedback directly improves future ranking and recommendation quality.

- Each service runs independently and communicates via HTTP APIs.