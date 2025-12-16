# SmartDine – Project Overview

AI-Powered Food Discovery Assistant

---

## 1. Introduction

SmartDine is an intelligent food discovery platform designed to help users make better dining decisions quickly and confidently.

College students and young professionals often struggle with questions such as:

* Where should I eat today?
* What food matches my current mood?
* Which place fits my budget and preferences?

SmartDine addresses this problem by combining Artificial Intelligence with real-world restaurant data to deliver **personalized, context-aware recommendations** through a clean and interactive web interface.

---

## 2. Problem Statement

Most existing food discovery platforms rely on:

* Manual searching
* Static filters
* Generic sorting (ratings, popularity)

These approaches:

* Do not understand natural language queries
* Do not adapt based on user behavior
* Often overwhelm users with too many choices

There is a need for a system that:

* Understands conversational food queries
* Recommends only relevant restaurants
* Improves recommendations over time using user feedback

---

## 3. Solution Overview

SmartDine is implemented as a **three-layer architecture**, where each component has a clear responsibility:

1. **Frontend Application** – User interaction and experience
2. **Backend API** – Authentication, history, feedback, and coordination
3. **AI Model Service** – Intelligent recommendation engine using RAG

Each service runs independently and communicates through well-defined APIs.

---

## 4. Dataset

The restaurant dataset used in SmartDine is sourced from **Kaggle**.

The dataset contains structured information such as:

* Restaurant descriptions
* Cuisine types
* Locations and areas
* Ratings and pricing indicators

This data is preprocessed and indexed using vector embeddings to support fast and accurate similarity search.

---

## 5. Key Features

### 5.1 Conversational Food Search

Users can type natural language queries such as:

* “Comfort food after a long day”
* “Healthy breakfast options”
* “Budget-friendly pizza nearby”

SmartDine understands the intent behind the query instead of relying only on keywords.

---

### 5.2 Retrieval-Augmented Generation (RAG)

SmartDine uses a Retrieval-Augmented Generation approach to ensure accurate and reliable recommendations.

Process:

1. Relevant restaurants are retrieved using FAISS vector search.
2. Only retrieved data is passed to the AI model.
3. The AI generates responses strictly based on this data.

This approach prevents hallucination and ensures that recommendations are grounded in real information.

---

### 5.3 City-Based Recommendations

Restaurants are indexed and searched city-wise.

Users receive recommendations only from the selected city, ensuring:

* Local relevance
* Practical recommendations
* Better user trust

---

### 5.4 Feedback Loop and Re-Ranking

Users can provide feedback on recommendations using like and dislike actions.

This feedback:

* Is stored in the database
* Contributes to dynamic re-ranking of restaurants
* Improves future recommendations without retraining the model

This creates a continuous learning loop based on real user interactions.

---

### 5.5 Search History Management

SmartDine maintains a personalized search history for each logged-in user.

Features include:

* Stored queries and AI responses
* Timestamped results
* Ability to clear history

This improves transparency and usability.

---

### 5.6 Surprise Me option - Spin Wheel Recommendation Feature 

For spontaneous discovery, users can select a “Surprise Me” option.
SmartDine includes an interactive **Spin Wheel** feature to enhance user engagement when the surprise me option is clicked.

Purpose:

* Helps users who are unsure what to search
* Randomly selects a dining style or category
* Instantly triggers a relevant recommendation

This feature adds a playful and intuitive discovery experience while still using the same intelligent recommendation pipeline.

---

## 6. System Architecture

### 6.1 Frontend (React)

Responsibilities:

* User authentication flow
* Search interface and results display
* Feedback actions
* History view and management
* Spin wheel and discovery features

Technology stack:

* React
* Mantine UI
* Tailwind CSS
* React Router

---

### 6.2 Backend API (FastAPI)

Responsibilities:

* User authentication using JWT
* History and feedback storage
* Secure communication with the model service

Technology stack:

* FastAPI
* MySQL
* SQLAlchemy
* JWT-based authentication

Runs on port **8000**.

---

### 6.3 AI Model Service (RAG Engine)

Responsibilities:

* Sentence embedding generation
* FAISS similarity search
* Context preparation
* Controlled AI response generation

Technology stack:

* Sentence Transformers
* FAISS
* OpenAI API
* FastAPI

Runs on port **5001**.

---

## 7. End-to-End Data Flow

1. User submits a query from the frontend
2. Request is sent to the backend API
3. Backend forwards the query to the AI model service
4. Relevant restaurants are retrieved using FAISS
5. The AI generates a contextual recommendation
6. Response is sent back to the frontend
7. User feedback is recorded and used for future ranking

---

## 8. Performance Considerations

* Embedding model is loaded once at service startup
* FAISS indexes are prebuilt for fast similarity search
* AI prompt context is intentionally limited for lower latency
* Initial requests may take slightly longer due to model warm-up

---

## 9. Security and Reliability

* Passwords are securely hashed
* JWT tokens protect authenticated routes
* AI responses are restricted to retrieved dataset content
* No external or fabricated information is generated

---

## 10. Conclusion

SmartDine is a practical, real-world AI application that demonstrates how intelligent systems can enhance everyday decision-making.

By combining conversational AI, retrieval-based grounding, user feedback, and thoughtful UI design, SmartDine delivers accurate, adaptive, and engaging food recommendations.

The project reflects strong fundamentals in:

* AI and machine learning
* Backend system design
* Frontend user experience
* Full-stack integration

---