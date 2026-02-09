# EduSaaS API Testing Guide

## Quick Start

1. Start the server: `npm run dev`
2. Import `EduSaaS_API.postman_collection.json` into Postman
3. Set variables: `baseUrl = http://localhost:5000`

---

## Test Flows

### 1. Authentication Flow
```
POST /api/auth/register → Register user
POST /api/auth/login → Get tokens (copy accessToken)
GET  /api/auth/me → Verify auth works
```

### 2. Pricing Flow (Public)
```
GET  /api/pricing/all → Get all pricing
POST /api/pricing/calculate → Test price calculation
```

### 3. Payment Flow (Requires Auth)
```
POST /api/payment/create-order → Create Razorpay order
POST /api/payment/verify → Verify payment (needs Razorpay checkout)
GET  /api/payment/history → View payment history
```

### 4. User Dashboard (Requires Auth)
```
GET  /api/user/dashboard → Dashboard summary
GET  /api/user/subscription → Active subscription
GET  /api/user/payments → Payment history with pagination
```

### 5. Admin APIs (Requires Admin Role)
First, set user as admin in MongoDB:
```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Then test:
```
GET /api/admin/dashboard → Metrics & stats
GET /api/admin/users → All users
GET /api/admin/subscriptions → All subscriptions
GET /api/admin/payments → All payments
```

---

## Expected Responses

| Endpoint | Success Status | Failure Status |
|----------|----------------|----------------|
| Register | 201 | 400 (validation/exists) |
| Login | 200 | 400/403 (invalid/unverified) |
| Protected routes | 200 | 401 (no/invalid token) |
| Admin routes | 200 | 403 (not admin) |

---

## Environment Variables Required

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=xxx
BREVO_SMTP_PASS=xxx
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
```
