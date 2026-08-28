# Society Activity Tracker 

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
cd Society-ActivityTracker```bash
cd backend
npm install
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 3. Frontend Setup
Open a **new** terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*The React app will launch on `http://localhost:5173`.*

---

## 🔐 Test Credentials

To review the application and access different dashboard features, please use the following test accounts:

**1. Admin Access (For transmitting points, creating events, and viewing system logs)**
- **Email:** `review@dtutimes.com` 
- **Password:** `admin123`

**2. Member Access (For viewing personal dashboard and activity score)**
- **Email:** `kabir@dtu.ac.in`
- **Password:** `kabir123`

*(Note: The backend is deployed on Railway, so the initial API request might take a few seconds to wake up).*


## 📝 Important Assumptions Made During Development

1. **Self-Registration Role:** Any user signing up directly from the public web portal is assigned the `member` role by default to prevent unauthorized admin access. Admins must be manually upgraded in the database or created by a super-admin.
2. **Event Windows:** It is assumed that an event's check-in window is controlled manually by the admin toggling the event status (e.g., Open/Closed), rather than a strict automated timer. This accounts for real-world delays in college events.
3. **Score Trust:** It is assumed that only Admins have the authority to log contributions and assign points. Members have strictly read-only access to their own Activity Scores and timelines.

---
**Developed by:** AYUSH SINGH
