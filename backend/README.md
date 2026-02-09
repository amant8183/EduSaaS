# SaaS Platform Backend

Backend API for a multi-portal SaaS platform with subscription management, Razorpay payment integration, and admin dashboard.

## Features

- 🔐 JWT-based authentication with email verification
- 💳 Razorpay payment integration
- 📧 Email service (Brevo SMTP)
- 👥 Multi-portal subscription system (Admin, Teacher, Student)
- 📊 Admin dashboard with user & payment management
- 🔄 Refresh token support for multi-device sessions
- 💰 Dynamic pricing with bundle discounts

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Payment Gateway:** Razorpay
- **Email:** Nodemailer (Brevo SMTP)
- **Validation:** Zod

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (test mode)
- Brevo account for SMTP

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Saas_Platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT (min 32 characters)
   - `BREVO_SMTP_*` - Brevo SMTP credentials
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Razorpay credentials
   - `FROM_EMAIL` - Sender email address
   - `FRONTEND_URL` - Frontend application URL

## Running the Application

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:5000` with auto-reload

### Production Mode
```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database, Razorpay configuration
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, validation middleware
│   ├── services/        # Email, payment services
│   ├── utils/           # Helper functions, validation
│   ├── types/           # TypeScript types/interfaces
│   └── index.ts         # Entry point
├── .env                 # Environment variables (gitignored)
├── .env.example         # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify-email?token=` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate refresh token)
- `POST /api/auth/logout-all` - Logout from all devices
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user (protected)

### Pricing
- `POST /api/pricing/calculate` - Calculate price for selected portals/features
- `GET /api/pricing/portals` - Get available portals
- `GET /api/pricing/features` - Get available features

### Payment
- `POST /api/payment/create-order` - Create Razorpay order (protected)
- `POST /api/payment/verify` - Verify payment (protected)
- `GET /api/payment/history` - Get payment history (protected)
- `GET /api/payment/:paymentId` - Get payment details (protected)

### User Dashboard
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `GET /api/user/subscription` - Get subscription details (protected)
- `PUT /api/user/subscription` - Update subscription (protected)
- `DELETE /api/user/subscription` - Cancel subscription (protected)

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/subscriptions` - Get all subscriptions
- `GET /api/admin/metrics` - Get dashboard metrics

## Development Workflow

This project follows a phased development approach with proper commit messages:

1. ✅ Phase 1: Project Setup & Core Configuration
2. Phase 2: Authentication System
3. Phase 3: Data Models & Pricing Logic
4. Phase 4: Razorpay Payment Integration
5. Phase 5: User Dashboard APIs
6. Phase 6: Admin Portal APIs
7. Phase 7: Testing & Validation
8. Phase 8: Documentation

Each phase is tested before committing and moving to the next phase.

## Testing

Use Postman or similar API testing tools.

**Razorpay Test Credentials:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- UPI: `success@razorpay`

## License

ISC
