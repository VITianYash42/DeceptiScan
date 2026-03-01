# 🛡️ DeceptiScan - Cyber Carnival 2026

🏆 **Top 9 Finalist (Out of 300+ Teams) - Cyber Carnival Hackathon**

*"Don't just read about phishing. Experience it."*

**DeceptiScan** is an interactive, full-stack cybersecurity platform designed to train users against social engineering attacks. Unlike static blogs, our platform simulates real-world phishing scenarios in a safe environment, teaching users to spot the red flags before they get hooked.

---

## 🚀 Key Features

* **📖 Educational Checklist:** Teaches users the "5 Golden Rules" of social engineering defense before they enter the simulation.
* **📧 Realistic Simulation Engine:** Mimics the UI of popular email clients to test users in a familiar environment with dynamically injected JSON scenarios.
* **🎮 Gamified Scoring & Leaderboard:** Earn points for accurately reporting threats, lose points for clicking malicious links, and compete on a live Global Leaderboard.
* **🎓 Instant Feedback:** "You Got Phished!" modals provide analytical breakdowns explaining exactly *why* an email was dangerous (e.g., mismatched domains, urgency tactics).
* **📊 User Dashboard:** Track your vulnerability metrics and improvement over time.
* **🔒 Secure Auth:** Full user registration, login system, and session management.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python (Flask), SQLAlchemy |
| **Database** | SQLite (Lightweight & Portable) |
| **Frontend** | HTML5, Tailwind CSS, Vanilla JS |
| **DevOps** | Docker & Docker Compose |
| **Version Control** | Git & GitHub |

---

## ⚡ Installation & Setup

You can run DeceptiScan using **Docker** (Recommended) or strictly with **Python**.

### Option 1: Docker (The "It Just Works" Method)
*Prerequisite: Docker Desktop installed.*

```bash
# 1. Clone the repository
git clone [https://github.com/VITianYash42/DeceptiScan-CyberCarnival.git](https://github.com/VITianYash42/DeceptiScan-CyberCarnival.git)
cd DeceptiScan-CyberCarnival

# 2. Build and Run containers
docker compose up --build

# 3. Access the App
# Open http://localhost:5000 in your browser
```

---

### Option 2: Manual Python Setup
*Prerequisite: Python 3.9+ installed.*

```bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
python app.py
```

---

## 📂 Project Structure

```text
DeceptiScan/
├── app.py              # Main Application Entry Point
├── auth.py             # Authentication Routes & Logic
├── models.py           # Database Models (User, Scenario, Score)
├── requirements.txt    # Python Dependencies
├── scenarios.json      # Phishing Simulation Data
├── Dockerfile          # Container Configuration
├── static/             # CSS, Images, JS
│   ├── style.css
│   └── game.js
└── templates/          # HTML Templates
    ├── base.html       # Master Layout
    ├── index.html      # Landing Page
    ├── auth/           # Login & Register Pages
    └── game/           # Simulation Interface
```

---

## 👥 Team: Binary Baniyas

| Name | Role | Responsibility |
| :--- | :--- | :--- |
| **Yash Singhal** | 👑 Architect | Backend, Database, DevOps, Master Layout & Landing Page |
| **Aditya Mittal** | 🔐 Gatekeeper | Auth Backend, Security, User Management, Auth UI |
| **Swapnil** | 🎮 Game Master | Simulation Logic (JS), Content Scenarios, Game Interface UI |
