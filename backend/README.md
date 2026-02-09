# 🎓 EduSaaS Platform — Backend

A production-ready Node.js/TypeScript backend for a multi-portal education SaaS platform with Razorpay payment integration, role-based access control, and dynamic pricing.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js + TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT + bcrypt + Refresh Tokens |
| **Payments** | Razorpay (Orders, Verification, Webhooks) |
| **Email** | Nodemailer + Brevo SMTP |
| **Validation** | Zod |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database, Razorpay, Pricing configs
│   │   ├── database.ts
│   │   ├── razorpay.ts
│   │   └── pricing.ts
│   ├── controllers/     # Request handlers
│   │   ├── authController.ts
│   │   ├── pricingController.ts
│   │   ├── paymentController.ts
│   │   ├── userController.ts
│   │   └── adminController.ts
│   ├── middleware/       # Auth & Admin guards
│   │   ├── auth.ts
│   │   └── adminAuth.ts
│   ├── models/           # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Subscription.ts
│   │   ├── Payment.ts
│   │   └── Order.ts
│   ├── routes/           # Express route definitions
│   │   ├── authRoutes.ts
│   │   ├── pricingRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── adminRoutes.ts
│   ├── services/         # Email service
│   │   └── emailService.ts
│   ├── types/            # TypeScript declarations
│   │   └── express.d.ts
│   ├── utils/            # Validation schemas
│   │   └── validation.ts
│   └── index.ts          # App entry point
├── .env.example
├── package.json
├── tsconfig.json
└── TESTING.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** account (or local MongoDB)
- **Razorpay** account (test mode)
- **Brevo** account (for SMTP emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/amant8183/EduSaaS.git
cd EduSaaS/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your actual credentials

# Start development server
npm run dev
```

The server starts on `http://localhost:5000`.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start with hot-reload (nodemon) |
| Build | `npm run build` | Compile TypeScript to `dist/` |
| Start | `npm start` | Run production build |
| Clean | `npm run clean` | Remove `dist/` directory |

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT + refresh token |
| GET | `/verify-email?token=` | ❌ | Verify email address |
| POST | `/resend-verification` | ❌ | Resend verification email |
| POST | `/forgot-password` | ❌ | Request password reset |
| POST | `/reset-password` | ❌ | Reset password with token |
| POST | `/refresh` | ❌ | Refresh access token |
| POST | `/logout` | ✅ | Logout (invalidate refresh token) |
| POST | `/logout-all` | ✅ | Logout all devices |
| GET | `/me` | ✅ | Get current user |

### Pricing (`/api/pricing`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/all` | ❌ | Complete pricing page data |
| GET | `/portals` | ❌ | Available portals |
| GET | `/features` | ❌ | Available features by portal |
| GET | `/discounts` | ❌ | Bundle discount info |
| POST | `/calculate` | ❌ | Calculate total price |

### Payments (`/api/payment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-order` | ✅ | Create Razorpay order |
| POST | `/verify` | ✅ | Verify payment & activate subscription |
| GET | `/history` | ✅ | User's payment history |
| POST | `/webhook` | ❌* | Razorpay webhook handler |

*\*Verified via Razorpay signature*

### User Dashboard (`/api/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ | User profile |
| GET | `/dashboard` | ✅ | Dashboard summary |
| GET | `/subscription` | ✅ | Active subscription details |
| GET | `/payments` | ✅ | Payment history (paginated) |
| PATCH | `/subscription/auto-renew` | ✅ | Toggle auto-renewal |
| POST | `/subscription/cancel` | ✅ | Cancel subscription |

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | 🔒 | Platform metrics & stats |
| GET | `/users` | 🔒 | All users (search, filter, paginate) |
| GET | `/users/:userId` | 🔒 | User details with payments |
| PATCH | `/users/:userId/role` | 🔒 | Update user role |
| GET | `/subscriptions` | 🔒 | All subscriptions |
| GET | `/payments` | 🔒 | All payments |

> ✅ = Requires Bearer token &nbsp;|&nbsp; 🔒 = Requires Bearer token + Admin role

---

## 💰 Pricing Model

### Portal Base Prices (per month)

| Portal | Price |
|--------|-------|
| School Admin | ₹2,000 |
| Teacher | ₹800 |
| Student | ₹400 |

### Bundle Discounts

| Bundle | Discount |
|--------|----------|
| Admin + Teacher | 15% off portal prices |
| Teacher + Student | 10% off portal prices |
| All Three Portals | 20% off portal prices |

### Billing Options

- **Monthly** — Standard pricing
- **Annual** — 2 months free (pay for 10, get 12)

Each portal includes core features. Optional add-on features are available at ₹100–₹500/month per feature.

---

## 🔐 Authentication Flow

```
Register → Email Verification → Login → Access Token (15 min) + Refresh Token (7 days)
```

- **Access Token**: Short-lived JWT, sent in `Authorization: Bearer <token>` header
- **Refresh Token**: Long-lived, hashed and stored in DB, supports up to 5 devices
- **Password Reset**: Secure token-based flow via email

---

## 💳 Payment Flow

```
1. Client calls POST /api/payment/create-order
2. Server creates Razorpay order, returns order ID + Razorpay public key
3. Client opens Razorpay Checkout with order ID
4. User completes payment on Razorpay
5. Client calls POST /api/payment/verify with payment details
6. Server verifies signature, activates subscription
7. Confirmation email sent to user
```

---

## 🧪 Testing

Import the Postman collection for easy testing:

```bash
backend/EduSaaS_API.postman_collection.json
```

See [`TESTING.md`](TESTING.md) for detailed testing instructions.

---

## 📝 Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret |
| `BREVO_SMTP_*` | Brevo SMTP credentials |
| `FROM_EMAIL` | Sender email address |
| `FRONTEND_URL` | Frontend URL for email links |

---

## 📄 License

ISC
