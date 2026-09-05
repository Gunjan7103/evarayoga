# Evara Yoga

A modern full-stack yoga and wellness platform designed for class discovery, instructor exploration, customer enquiries, and session booking.

The project combines a responsive public-facing website with a Node.js/Express backend and a managed PostgreSQL-based data layer.

> **Security note:** This repository intentionally does not contain production credentials, API secrets, database connection values, or other sensitive configuration.

## Features

### Public Experience
- Responsive multi-page wellness website
- Class and instructor discovery
- Benefits and testimonials
- Contact and enquiry workflow
- Mobile-friendly layouts

### Booking System
- Live session availability
- Capacity-aware bookings
- Database-level protection against overbooking
- Customer details and booking notes
- Booking status management

### Backend
- REST API architecture
- Authentication and role-based access-control foundation
- Row-level data protection
- Database migrations
- Centralized error handling
- Environment validation
- CORS and security middleware

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express |
| Database | Managed PostgreSQL |
| Authentication | Managed authentication service |
| Security | Row-level policies, Helmet, CORS |
| Deployment | Serverless-compatible hosting |

## Project Structure

```text
evarayoga/
├── api/                         # Serverless API entrypoint
├── backend/
│   ├── src/
│   │   ├── config/              # Runtime configuration
│   │   ├── middleware/          # Authentication and error handling
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # External service integration
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
└── README.md
```

## API Overview

The application exposes endpoints for:

- Service health checks
- Classes
- Instructors
- Testimonials
- Available schedules
- Booking creation
- Contact enquiries
- Protected administrative operations

Public and protected operations are separated through server-side authorization controls.

## Local Development

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/chamanvashishth/evarayoga.git
cd evarayoga
cd backend
npm install
```

### Configuration

The application requires environment-specific configuration to run locally or in production.

Use the provided example configuration file as a template:

```text
backend/.env.example
```

Create your own local environment file from that template and provide values through your deployment platform or local environment.

**Do not commit secrets, production credentials, private keys, or service-role credentials to Git.**

## Database Setup

Database schema changes are managed through versioned migrations.

Apply migrations sequentially in your database environment before running the application against a fresh instance.

The booking workflow uses a database-side atomic operation to ensure that concurrent requests cannot exceed session capacity.

## Booking Architecture

A naive booking workflow can fail under concurrent traffic:

```text
Check capacity → Create booking
```

Evara Yoga instead performs booking validation atomically:

```text
Lock schedule
   ↓
Validate availability
   ↓
Validate remaining capacity
   ↓
Create booking
   ↓
Update booking count
   ↓
Commit
```

This design prevents multiple concurrent requests from independently passing a stale capacity check.

## Security Practices

The project follows these principles:

- Secrets are supplied through environment configuration
- No production credentials are stored in source control
- Sensitive server credentials remain server-side
- Protected operations require authorization
- Database access uses row-level protection where applicable
- CORS is restricted by environment
- Security headers are enabled
- Request payload sizes are limited
- User input is validated and normalized
- Errors are handled centrally without exposing unnecessary internal details

## Deployment

The application is designed for a serverless-compatible deployment environment.

Before deployment:

1. Configure environment variables directly in the hosting platform.
2. Apply database migrations to the target environment.
3. Configure the production application's allowed origin.
4. Verify that no secrets are exposed to client-side code.
5. Run application checks and smoke tests.

## Roadmap

Potential future improvements:

- Online payments
- Email confirmations
- Customer accounts
- Booking cancellation flow
- Instructor dashboards
- Full administrative dashboard
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
