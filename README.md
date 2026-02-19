# 🛡️ DeceptiScan - Cyber Carnival 2026

![Hackathon](https://img.shields.io/badge/Event-Cyber%20Carnival%202026-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Phase%202%20Prototype-orange?style=for-the-badge)
![Team](https://img.shields.io/badge/Team-Binary%20Baniyas-success?style=for-the-badge)

> **"Don't just read about phishing. Experience it."**

**DeceptiScan** is an interactive, gamified cybersecurity platform designed to train users against social engineering attacks. Unlike static blogs, our platform simulates real-world phishing scenarios (Emails, SMS, DMs) in a safe environment, teaching users to spot the red flags before they get hooked.

---

## 🚀 Key Features

* **📧 Realistic Simulation Engine:** Mimics the UI of popular email clients (Gmail/Outlook) to test users in a familiar environment.
* **🎮 Gamified Scoring:** Earn points for reporting threats; lose points for clicking malicious links.
* **🎓 Instant Feedback:** "You Got Phished!" analysis breakdowns explain exactly *why* an email was dangerous (e.g., mismatched domains, urgency tactics).
* **📊 User Dashboard:** Track your "Vulnerability Score" and improvement over time.
* **🔒 Secure Auth:** Full user registration and login system with hashed security.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python (Flask), SQLAlchemy |
| **Database** | SQLite (Lightweight & Portable) |
| **Frontend** | HTML5, CSS3 (Tailwind/Bootstrap), Vanilla JS |
| **DevOps** | Docker & Docker Compose |
| **Version Control** | Git & GitHub |

---

## ⚡ Installation & Setup

You can run DeceptiScan using **Docker** (Recommended) or strictly with **Python**.

### Option 1: Docker (The "it just works" method)
*Prerequisite: Docker Desktop installed.*

```bash
# 1. Clone the repository
git clone [https://github.com/VITianYash42/DeceptiScan-CyberCarnival.git](https://github.com/VITianYash42/DeceptiScan-CyberCarnival.git)
cd DeceptiScan-CyberCarnival

# 2. Build and Run containers
docker-compose up --build

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
