# Athenaeum Bookstore

A full-stack bookstore application with Django REST Framework, React, PostgreSQL, Redis, Celery, and Nginx.

## Stack

- **Backend:** Django 5.2, DRF, SimpleJWT, django-allauth (Google OAuth)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, TanStack Query
- **Infrastructure:** Docker Compose, PostgreSQL, Redis, Celery, Nginx

## Quick start (development)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env
python manage.py migrate
python manage.py seed_books
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Docker (production-like)

```bash
cp .env.example .env
# Edit .env with your SECRET_KEY and optional Google OAuth credentials

cd frontend && npm install && npm run build && cd ..

docker compose up --build
```

Visit http://localhost

## API endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register/` | Public |
| POST | `/api/auth/login/` | Public (returns JWT + user) |
| POST | `/api/auth/logout/` | JWT |
| POST | `/api/auth/token/refresh/` | Public |
| GET | `/api/auth/me/` | JWT |
| GET | `/api/books/` | Public |
| GET | `/api/cart/me/` | JWT |
| POST | `/api/orders/checkout/` | JWT |
| GET | `/api/orders/` | JWT (scoped to user) |

## Security

- Object-level permissions and queryset scoping prevent cross-user data access
- JWT with refresh token rotation and blacklist on logout
- Custom exception handler returns consistent `{ detail, code }` errors
- Environment-based secrets (no hardcoded credentials)

## Running tests

```bash
cd backend
python manage.py test account catalog orders
```
