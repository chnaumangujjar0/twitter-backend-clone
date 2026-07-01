# 🐦 Social Media Backend API

A production-ready backend API for a modern social media platform inspired by **Twitter (X)** and **YouTube**, built using **Node.js**, **Express.js**, and **MongoDB**.

This project demonstrates scalable backend architecture, secure authentication, media handling, MongoDB aggregation pipelines, and RESTful API development.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User Registration
- Secure Login & Logout
- JWT Access Token Authentication
- Refresh Token Rotation
- HTTP-Only Cookie Authentication
- Protected Routes Middleware
- Password Hashing with bcrypt

---

### 👤 User Management

- Register New User
- Login / Logout
- Get Current User
- Update Account Details
- Change Password
- Upload Avatar
- Upload Cover Image
- View Public User Profile
- Channel Profile API
- Watch History

---

### 📝 Tweets

- Create Tweet
- Update Tweet
- Delete Tweet
- Get User Tweets
- View Individual Tweet

---

### 💬 Comments

- Add Comment
- Edit Comment
- Delete Comment
- Get Comments for a Tweet

---

### ❤️ Likes

Users can like or unlike:

- Tweets
- Comments

Retrieve likes and like counts efficiently using MongoDB Aggregation.

---

### 🔔 Notifications

- Notification APIs
- User Activity Notifications
- Notification Management

---

### 📺 Subscription System

YouTube-style subscription functionality.

Features include:

- Subscribe to a Channel
- Unsubscribe from a Channel
- Get Channel Subscribers
- Get User Subscriptions
- Subscriber Count

---

### ❤️ Social Features

- Public User Profiles
- Subscriber Count
- User Relationships
- Engagement APIs

---

### ☁️ Media Uploads

Integrated with **Cloudinary** for media management.

Supports:

- Avatar Upload
- Cover Image Upload

---

### 🛡 Security Features

- JWT Authentication
- Refresh Token Validation
- Password Encryption
- Cookie-Based Authentication
- Authentication Middleware
- Centralized Error Handling

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | NoSQL Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Encryption |
| Multer | File Upload |
| Cloudinary | Cloud Media Storage |
| Cookie Parser | Cookie Management |
| dotenv | Environment Variables |

---

## 📁 Project Structure

```
src/
│
├── controllers/
│   ├── comment.controller.js
│   ├── healthcheck.controller.js
│   ├── like.controller.js
│   ├── notification.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   └── user.controller.js
│
├── middlewares/
├── models/
├── routes/
├── utils/
├── db/
├── constants/
├── app.js
└── index.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/chnaumangujjar0/twitter-backend-clone.git
```

Move into the project.

```bash
cd twitter-backend-clone
```

Install dependencies.

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## ▶️ Run the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 📡 API Modules

The backend is divided into the following modules:

- Authentication
- Users
- Tweets
- Comments
- Likes
- Notifications
- Subscriptions
- Health Check

Each module follows RESTful API principles with proper validation and centralized error handling.

---

## 🧠 Project Architecture

```
             Client
                │
                ▼
          Express Routes
                │
                ▼
          Authentication
                │
                ▼
          Controllers
                │
                ▼
       Business Logic
                │
                ▼
          MongoDB Database
```

---

## 🔐 Authentication Flow

```
User Login
      │
      ▼
Generate Access Token
Generate Refresh Token
      │
      ▼
Store Refresh Token in Database
      │
      ▼
Send Tokens to Client
      │
      ▼
Protected Routes
      │
      ▼
JWT Middleware Verification
      │
      ▼
Access Granted
```

---

## 📚 Key Concepts Implemented

- JWT Authentication
- Refresh Token Rotation
- Cookie-Based Authentication
- MongoDB Aggregation Pipelines
- Mongoose Population & Relationships
- Async Error Handling
- MVC Architecture
- RESTful API Design
- Cloudinary Integration
- File Uploads with Multer
- Secure Password Storage
- Environment Variable Management

---

## 🚀 Future Improvements

- Tweet Replies
- Retweets / Reposts
- Hashtags
- Search API
- Bookmarks
- Direct Messaging
- Trending Topics
- API Documentation with Swagger
- Unit & Integration Testing
- Docker Support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

## 📄 License

This project is built for educational purposes and backend learning.

---

## 👨‍💻 Author

**Muhammad Nauman**

GitHub: https://github.com/chnaumangujjar0

If you found this project helpful, consider giving it a ⭐ on GitHub!
