```bash
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

## 📝 Important Assumptions Made During Development

1. **Self-Registration Role:** Any user signing up directly from the public web portal is assigned the `member` role by default to prevent unauthorized admin access. Admins must be manually upgraded in the database or created by a super-admin.
2. **Event Windows:** It is assumed that an event's check-in window is controlled manually by the admin toggling the event status (e.g., Open/Closed), rather than a strict automated timer. This accounts for real-world delays in college events.
3. **Score Trust:** It is assumed that only Admins have the authority to log contributions and assign points. Members have strictly read-only access to their own Activity Scores and timelines.

---
**Developed by:** AYUSH SINGH
