# SkillSwap Hub - Backend API

RESTful API for the SkillSwap Hub skill-sharing platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **User Management**: Profile management, stats tracking, achievements
- **Skill Marketplace**: Create, browse, and manage skills
- **Session Booking**: Schedule, manage, and track learning sessions
- **Reviews & Ratings**: Rate teachers and skills
- **Community Forums**: Discussions, replies, likes, and trending topics
- **Payment Integration**: Stripe payment processing (ready to integrate)
- **Email Notifications**: NodeMailer integration for email alerts

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/skillswap-backend.git
cd skillswap-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skillswap

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

### 5. Run the server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:id
```

#### Update User Profile
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Passionate teacher",
  "hourlyRate": 50
}
```

#### Get All Users
```http
GET /api/users?role=teacher&page=1&limit=20
```

### Skill Endpoints

#### Get All Skills
```http
GET /api/skills?category=technology&page=1&limit=12
```

Query parameters:
- `category`: technology, creative, business, languages, etc.
- `search`: Search term
- `level`: beginner, intermediate, advanced
- `minPrice`, `maxPrice`: Price range
- `sort`: price-asc, price-desc, rating, popular

#### Get Single Skill
```http
GET /api/skills/:id
```

#### Create Skill
```http
POST /api/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Development Basics",
  "category": "technology",
  "description": "Learn HTML, CSS, and JavaScript",
  "level": "beginner",
  "duration": 60,
  "price": 50,
  "teacherId": "userId",
  "format": {
    "online": true,
    "oneOnOne": true
  }
}
```

#### Update Skill
```http
PUT /api/skills/:id
Authorization: Bearer <token>
```

#### Delete Skill
```http
DELETE /api/skills/:id
Authorization: Bearer <token>
```

### Session Endpoints

#### Get Sessions
```http
GET /api/sessions?userId=123&status=scheduled&type=teaching
```

#### Get Single Session
```http
GET /api/sessions/:id
Authorization: Bearer <token>
```

#### Book Session
```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "skillId": "skillId",
  "skillName": "Web Development",
  "teacherId": "teacherId",
  "studentId": "studentId",
  "scheduledDate": "2026-02-20T15:00:00Z",
  "duration": 60,
  "format": "online",
  "price": 50
}
```

#### Complete Session
```http
PUT /api/sessions/:id/complete
Authorization: Bearer <token>
```

#### Cancel Session
```http
PUT /api/sessions/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "userId",
  "reason": "Schedule conflict"
}
```

### Review Endpoints

#### Get Reviews
```http
GET /api/reviews?teacherId=123&page=1
```

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "skillId": "skillId",
  "teacherId": "teacherId",
  "studentId": "studentId",
  "sessionId": "sessionId",
  "rating": 5,
  "comment": "Excellent teacher!"
}
```

#### Teacher Response to Review
```http
PUT /api/reviews/:id/response
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Thank you for the feedback!"
}
```

### Community Endpoints

#### Get Discussions
```http
GET /api/community/discussions?category=technology&sort=popular
```

#### Get Single Discussion
```http
GET /api/community/discussions/:id
```

#### Create Discussion
```http
POST /api/community/discussions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Best practices for teaching coding?",
  "content": "What are your tips...",
  "authorId": "userId",
  "category": "teaching-tips",
  "tags": ["coding", "teaching"]
}
```

#### Add Reply
```http
POST /api/community/discussions/:id/replies
Authorization: Bearer <token>
Content-Type: application/json

{
  "authorId": "userId",
  "content": "Here are my suggestions..."
}
```

#### Like Discussion
```http
PUT /api/community/discussions/:id/like
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "userId"
}
```

#### Get Trending Topics
```http
GET /api/community/trending
```

## 🗄️ Database Models

### User
- Authentication (email, password)
- Profile (name, bio, avatar, title)
- Teaching/Learning skills
- Stats (sessions, ratings, earnings)
- Achievements
- Availability & preferences

### Skill
- Name, description, category
- Teacher information
- Pricing, duration, level
- Format (online/in-person, one-on-one/group)
- Stats (sessions, students, ratings)

### Session
- Skill and participants (teacher, student)
- Scheduling (date, duration, format)
- Payment status
- Session status (scheduled, completed, cancelled)
- Notes and feedback

### Review
- Rating (1-5 stars)
- Comment and teacher response
- Associated skill and session
- Helpful votes

### Discussion
- Title, content, author
- Category and tags
- Replies with nested likes
- Views and engagement metrics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Token is received after successful login/registration and expires after 7 days (configurable).

## 🌐 CORS

CORS is enabled for the frontend URL specified in `.env`. Update `FRONTEND_URL` to match your frontend application.

## 📊 Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Success responses:

```json
{
  "success": true,
  "data": {}
}
```

## 🚢 Deployment

### Deploying to Render/Railway/Heroku

1. **Create account** on your chosen platform
2. **Connect GitHub repository**
3. **Set environment variables** in platform dashboard
4. **Deploy**

### Environment Variables for Production

Make sure to set all required environment variables:
- `MONGODB_URI` (use MongoDB Atlas for production)
- `JWT_SECRET` (use a strong random string)
- `NODE_ENV=production`
- Email, Cloudinary, Stripe credentials

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Add database user
4. Whitelist IP addresses (or allow all: 0.0.0.0/0)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm test         # Run tests
```

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing
- **Email**: NodeMailer
- **Payments**: Stripe (ready to integrate)
- **File Upload**: Multer + Cloudinary (ready to integrate)

## 📂 Project Structure

```
skillswap-backend/
├── models/              # Mongoose models
│   ├── User.js
│   ├── Skill.js
│   ├── Session.js
│   ├── Review.js
│   └── Discussion.js
├── routes/              # Express routes
│   ├── auth.js
│   ├── users.js
│   ├── skills.js
│   ├── sessions.js
│   ├── reviews.js
│   └── community.js
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
├── server.js           # Entry point
└── README.md           # Documentation
```

## 🔮 Future Enhancements

- [ ] Real-time chat with Socket.io
- [ ] Video call integration (Zoom/Twilio)
- [ ] Advanced search with Elasticsearch
- [ ] Caching with Redis
- [ ] Rate limiting
- [ ] File upload handling
- [ ] Email templates
- [ ] Payment webhooks
- [ ] Admin dashboard
- [ ] Analytics tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the SkillSwap Hub community
