# Evara Yoga

A modern full-stack yoga and wellness platform built to deliver a premium digital experience for discovering classes, exploring instructors, submitting enquiries, and booking yoga sessions.

Evara Yoga combines a responsive public website with a Node.js/Express API and a Supabase-powered PostgreSQL backend.

## Features

### Public Experience
- Responsive multi-page wellness website
- Classes and instructor discovery
- Benefits and testimonials
- Contact and enquiry form
- Mobile-friendly layouts

### Booking System
- Live session availability
- Capacity-aware bookings
- Database-level overbooking protection
- Customer details and booking notes
- Booking status management

### Backend & Database
- Node.js and Express API
- Supabase PostgreSQL integration
- Supabase Auth foundation
- Role-based access control
- Row Level Security policies
- Database migrations
- Centralized error handling
- Environment validation
- CORS and Helmet security

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Security | Supabase RLS, Helmet, CORS |
| Deployment | Vercel |
| Typography | Playfair Display, DM Sans |

## Project Structure

```text
evarayoga/
├── api/                         # Vercel serverless API entrypoint
├── backend/
│   ├── src/
│   │   ├── config/              # Environment configuration
│   │   ├── middleware/          # Authentication and error handling
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Supabase integration
│   │   ├── app.js               # Express application
│   │   └── server.js            # Local server bootstrap
│   └── supabase/
│       └── migrations/          # Database migrations
├── js/
│   └── api.js                   # Shared frontend API client
├── index.html
├── about.html
├── classes.html
├── benefits.html
├── testimonials.html
├── booking.html
├── contact.html
├── vercel.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health status |
| GET | `/api/classes` | Available classes |
| GET | `/api/instructors` | Instructor information |
| GET | `/api/testimonials` | Published testimonials |
| GET | `/api/bookings/schedules` | Upcoming open sessions |
| POST | `/api/bookings` | Create a booking |
| POST | `/api/contact` | Submit a contact enquiry |

Administrative endpoints are protected through authentication and role-based authorization.

## Local Development

### Clone the repository

```bash
git clone https://github.com/chamanvashishth/evarayoga.git
cd evarayoga
```

### Install dependencies

```bash
cd backend
npm install
```

### Configure environment variables

Create `backend/.env`:

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:5500

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Never commit real credentials.

### Apply database migrations

Apply migrations in order:

```text
001_initial_schema.sql
002_atomic_booking.sql
```

### Start the API

```bash
npm run dev
```

The API runs locally on:

```text
http://localhost:4000
```

## Booking Architecture

A naive booking workflow checks capacity and then creates a booking:

```text
Check capacity → Create booking
```

Under concurrent requests, multiple users can pass the same capacity check.

Evara Yoga uses an atomic database-side workflow:

```text
Lock schedule
   ↓
Validate availability
   ↓
Validate remaining capacity
   ↓
Create booking
   ↓
Update booked count
   ↓
Commit
```

This prevents concurrent booking requests from exceeding session capacity.

## Deployment

The project is configured for Vercel.

Required production variables:

```env
NODE_ENV=production
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CORS_ORIGIN=https://your-production-domain.com
```

The Supabase service-role key must remain server-side only.

## Security

The project includes:

- Supabase Row Level Security
- Role-based authorization
- Server-side service-role usage
- Helmet security headers
- Restricted CORS origins
- Environment validation
- Request body limits
- Input normalization
- Email validation
- Centralized error handling
- Atomic booking operations

## Roadmap

Planned improvements may include:

- Online payments
- Email confirmations
- Customer accounts
- Booking cancellation flow
- Instructor dashboards
- Full admin dashboard
- Calendar integration
- Real-time availability
- Automated reminders
- Analytics
- Automated test coverage
- CI/CD workflows

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Test your changes.
5. Open a pull request with a clear description.

## License

No explicit open-source license is currently included. Add an appropriate license before distributing the project under specific legal terms.

---

Built for **Evara Yoga** — combining wellness-focused design with a scalable full-stack booking foundation.
