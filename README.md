# Idea Voting Platform

A full-stack web application for crowdsourcing ideas with voting functionality. Built with **Django REST Framework** (backend) and **React + Tailwind CSS** (frontend).

Demo Video: https://share.vidyard.com/watch/S45XCssjoSbyeu4nojNYKC
---

## Features

### Backend (Django)
- **JWT authentication** (sign-in only, seeded test user)
- **Ideas** – Create, read, update, delete
- **Voting** – Cast / remove vote (one vote per user per idea)
- **Sorting** – by popularity (vote count) or recency
- **Rate limiting** – 60 votes/minute on voting endpoints
- **Swagger documentation** (`/swagger/`)

### Frontend (React)
- **Sign-in form** with password visibility toggle
- **Ideas board** – list ideas with vote counts, create new ideas
- **Voting** – instant optimistic updates, error handling
- **Sorting** – switch between “Most Votes” and “Most Recent”
- **Statistics dashboard** – platform stats, personal activity history
- **Responsive design** – Tailwind CSS, dark/light ready

### Bonus
Optimistic voting updates UI immediately, then syncs with the server. On error, changes are reverted with a toast notification.

---

##  Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Backend  | Django 5.0, Django REST Framework, Simple JWT, drf-yasg, SQLite (dev) |
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router, React Hot Toast, date-fns |
| Tooling  | Git, GitHub Issues, pytest, ESLint, Prettier |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

---

### 1. Clone the repository
```
git clone https://github.com/matimba-maholobela/idea-voting-app.git
cd idea-voting-app ```

cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env.local

python manage.py migrate

# create user
python manage.py seed_users   # creates testuser / testpass123
python manage.py runserver

cd frontend
npm install
cp .env.example .env.local
npm run dev

Open the app
Frontend: http://localhost:5173
Backend API: http://localhost:8000/api/v1/
Swagger: http://localhost:8000/

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | /auth/login/        | Get JWT tokens                    |
| POST   | /auth/refresh/      | Refresh token                     |
| POST   | /auth/logout/       | Blacklist refresh token           |
| GET    | /auth/profile/      | Current user                      |
| GET    | /ideas/             | List ideas (sort_by=votes/recent) |
| POST   | /ideas/             | Create idea                       |
| PUT    | /ideas/{id}/        | Update idea                       |
| DELETE | /ideas/{id}/        | Delete idea                       |
| POST   | /votes/cast/{id}/   | Vote for idea                     |
| DELETE | /votes/remove/{id}/ | Remove vote                       |
| GET    | /votes/my-votes/    | User vote history                 |
| GET    | /votes/stats/       | Platform statistics               |

cd backend
pytest -v
pytest vote/tests/ -v
