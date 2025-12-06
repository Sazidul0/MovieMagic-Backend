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
