# Society Activity Tracker 🚀

## Problem Statement
This project is an internal society management tool built to track how actively members participate in meetings, events, projects, and society-related work. It replaces manual attendance sheets and subjective activity tracking with a simple, automated, and data-driven internal system. 

The system combines attendance and contribution data to generate an Activity Score for every member and automatically identifies members whose participation has dropped.

## Technology Stack
*   **Frontend:** React.js (Vite)
*   **Backend:** Node.js + Express.js
*   **Database:** MongoDB
*   **Tools & Libraries:** Mongoose, JWT Authentication, REST APIs, Axios, CORS, Helmet, Express-Rate-Limit.

---

## ⚙️ Environment Variables Required

To run this project, you will need to add the following environment variables to your `.env` files.

**Backend (`/backend/.env`)**
*   `PORT` = 5000
*   `MONGO_URI` = <Your_MongoDB_Atlas_Connection_String>
*   `JWT_SECRET` = <Your_Secure_Random_Secret_Key>
*   `NODE_ENV` = development
*   `FRONTEND_URL` = http://localhost:5173

**Frontend (`/frontend/.env`)**
*   `VITE_API_URL` = http://localhost:5000

---

## 🛠️ Project Setup & Run Instructions

Follow these steps to run the frontend and backend locally:

**1. Clone the repository**
```bash
git clone <your-github-repo-link>
cd Society-ActivityTracker
