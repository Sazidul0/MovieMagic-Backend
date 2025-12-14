# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## User Endpoints

### Register User
```
POST /users/register
Body: { email, password, name }
Response: { success, message, token, user }
```

### Login User
```
POST /users/login
Body: { email, password }
Response: { success, message, token, user }
```

---

## Movie Endpoints

### Get All Movies
```
GET /movies
Response: { success, movies }
```

### Get Movie by ID
```
GET /movies/:id
Response: { success, movie }
```

### Create Movie (Admin)
```
POST /movies
Auth: Required
Body: { title, description, genre, price, image, duration }
Response: { success, message, movie }
```

### Update Movie (Admin)
```
PUT /movies/:id
Auth: Required
Body: { title, description, genre, price, image, duration }
Response: { success, message, movie }
```

### Delete Movie (Admin)
```
DELETE /movies/:id
Auth: Required
Response: { success, message }
```

---

## Cart Endpoints

### Add to Cart
```
POST /cart/add
Auth: Required
Body: { movieId, bookingDate, showtime, seats, pricePerSeat }
Response: { success, message, cart }
```

### Get Cart
```
GET /cart
Auth: Required
Response: { success, message, cart }
```

### Update Cart Item
```
PUT /cart/update/:itemId
Auth: Required
Body: { seats, pricePerSeat }
Response: { success, message, cart }
```

### Remove from Cart
```
DELETE /cart/remove/:itemId
Auth: Required
Response: { success, message, cart }
```

### Checkout Cart
```
POST /cart/checkout
Auth: Required
Response: { success, message, bookings }
```

### Clear Cart
```
DELETE /cart/clear
Auth: Required
Response: { success, message }
```

---

## Booking Endpoints

### Get User Bookings
```
GET /bookings
Auth: Required
Response: { success, bookings }
```

### Get Booking by ID
```
GET /bookings/:id
Auth: Required
Response: { success, booking }
```

### Cancel Booking
```
DELETE /bookings/:id
Auth: Required
Response: { success, message }
```

---

## Admin Endpoints

### Get All Users
```
GET /admin/users
Auth: Required (Admin only)
Response: { success, users }
```

### Get All Bookings
```
GET /admin/bookings
Auth: Required (Admin only)
Response: { success, bookings }
```

### Get System Stats
```
GET /admin/stats
Auth: Required (Admin only)
Response: { success, stats }
```

---
## Feedback Endpoints

### Submit Feedback
```
POST /feedback
Auth: Required
Body: { movieId?: string, rating?: number (1-5), comment?: string }
Response: { success, message, feedback }
```

### Get All Feedbacks
```
GET /feedback
Auth: Not required
Response: { success, feedbacks }
```

### Get Feedbacks For Movie
```
GET /feedback/movie/:movieId
Auth: Not required
Response: { success, feedbacks }
```

### Get Current User Feedbacks
```
GET /feedback/user
Auth: Required
Response: { success, feedbacks }
```

### Delete Feedback (Admin)
```
DELETE /feedback/:id
Auth: Required (Admin)
Response: { success, message }
```

---

## Payment (Stripe) Endpoints

### Create PaymentIntent
```
POST /payment/stripe/create
Auth: Required
Body: { amount: number (decimal, e.g. 12.5), currency?: string, meta?: object }
Response (201): { success, message, paymentId, clientSecret, stripePaymentIntentId, publishableKey }
```

### Verify PaymentIntent
```
POST /payment/stripe/verify
Auth: Required
Body: { paymentId?: string, stripePaymentIntentId?: string }
Response: { success, message, payment }
```

### Get Payment Status
```
GET /payment/:id
Auth: Required (owner or admin)
Response: { success, payment }
```

Notes:
- The frontend needs Stripe's publishable key to initialize Stripe.js. Set `VITE_STRIPE_PUBLISHABLE_KEY` in frontend env or return `publishableKey` from the create endpoint and initialize Stripe dynamically.
- Server must have `STRIPE_SECRET_KEY` in `.env` to contact Stripe.

---

## Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```
