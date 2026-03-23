# 🎉 eventBy — Smart Event Management Platform

<p align="center">
  <img src="./i.png" width="800" alt="eventBy Banner"/>
</p>

<p align="center">
  <b>📅 Plan • 🎟️ Manage • 🚀 Experience Events Seamlessly</b>
</p>

<p align="center">
  <a href="https://github.com/sharadhkr/eventBy"><img src="https://img.shields.io/badge/Repo-GitHub-000?style=for-the-badge&logo=github"/></a>
  <img src="https://img.shields.io/badge/Full--Stack-Project-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/React-Vite-61dafb?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

**eventBy** is a **modern, full-stack event management platform** that empowers users to **discover, create, and manage events effortlessly**. Built with scalability and exceptional UX in mind, it serves three distinct user roles:

- **👤 Event Attendees**: Discover, browse, and register for events
- **🎯 Event Organizers**: Create, manage, and analyze events
- **⚙️ Administrators**: Oversee platform operations and manage content

The platform combines a powerful backend API with intuitive, role-based frontends to deliver a seamless event management experience.

---

## ✨ Key Features

### 🎟️ Event Management
- ✅ Create, update, and delete events with rich details
- ✅ Multiple event types: Hackathons, Workshops, Expert Talks, Competitions, Meetups
- ✅ Event rules and guidelines management
- ✅ High-quality banner images with Cloudinary integration
- ✅ Real-time event status tracking

### 👥 User System & Authentication
- ✅ Secure JWT-based authentication
- ✅ Firebase authentication support
- ✅ Role-based access control (User, Organizer, Admin)
- ✅ User profiles with event participation history
- ✅ Password encryption with bcryptjs

### 🔍 Event Discovery & Search
- ✅ Browse events by categories and types
- ✅ Advanced search and filtering
- ✅ Trending and featured events display
- ✅ Date-based event filtering
- ✅ Location-based discovery

### 💳 Payment Integration
- ✅ Razorpay payment gateway integration
- ✅ Secure transaction handling
- ✅ Multiple payment methods support

### 📊 Analytics & Dashboard
- ✅ Organizer event analytics and insights
- ✅ Attendee registration tracking
- ✅ Performance metrics and visualizations
- ✅ User engagement analytics

### ⚡ Performance & Security
- ✅ Fast load times with Vite bundler
- ✅ Helmet.js for enhanced security headers
- ✅ CORS protection
- ✅ Real-time updates with Socket.IO
- ✅ Image optimization with Cloudinary

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Firebase Admin** | Authentication & verification |
| **JWT** | Token-based authentication |
| **Razorpay** | Payment processing |
| **Cloudinary** | Image hosting & management |
| **Socket.IO** | Real-time communication |
| **Helmet.js** | Security middleware |
| **Morgan** | HTTP request logging |

### Frontend (Client)
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **React Context API** | State management |
| **Radix UI** | Component library |
| **Day.js** | Date handling |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Cloud database |
| **Firebase** | Auth & real-time DB |
| **Cloudinary** | Cloud storage |
| **Render/Heroku** | API deployment |

---

## 📁 Project Structure

```
eventBy/
├── server/                      # Backend API
│   ├── config/                 # Configuration files
│   │   ├── db.js              # MongoDB connection
│   │   ├── firebase.js        # Firebase setup
│   │   └── cloudinary.js      # Cloudinary setup
│   ├── controllers/            # Business logic
│   │   ├── event/
│   │   ├── organiser/
│   │   └── user/
│   ├── models/                # MongoDB schemas
│   │   ├── Event.model.js
│   │   ├── User.model.js
│   │   └── organiser.model.js
│   ├── routes/                # API endpoints
│   │   ├── organiser/
│   │   └── user/
│   ├── middlewares/           # Custom middleware
│   │   ├── firebase.middleware.js
│   │   └── organiser/auth.middleware.js
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
│
├── client/                     # Frontend applications
│   ├── user/                  # User attendee app
│   │   ├── src/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── pages/         # Page components
│   │   │   ├── context/       # Auth context
│   │   │   ├── middleware/    # Protected routes
│   │   │   ├── routes/        # Route definitions
│   │   │   ├── api/           # API calls
│   │   │   └── utils/         # Utilities
│   │   └── package.json
│   ├── organizer/             # Organizer app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── CreateEvent.jsx
│   │   │   │   ├── EditEvent.jsx
│   │   │   │   ├── ManageEvents.jsx
│   │   │   │   └── Analytics.jsx
│   │   │   └── context/
│   │   └── package.json
│   └── admin/                 # Admin panel
│       ├── src/
│       └── package.json
│
└── README.md

```

---

## 🚀 Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** v8+ or **yarn**
- **MongoDB** (Local or Atlas)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/sharadhkr/eventBy.git
cd eventBy
```

### Step 2: Backend Setup
```bash
cd server
npm install
```

### Step 3: Frontend Setup
```bash
# For user app
cd ../client/user
npm install

# For organizer app
cd ../organizer
npm install

# For admin app
cd ../admin
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventBy

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file in `client/user/`, `client/organizer/`, and `client/admin/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### Firebase Service Account

Place `firebase-service-account.json` in the `server/` directory:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-email@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## 🏃 Running the Application

### Start Backend Server
```bash
cd server
npm install
npm run dev    # Development mode with nodemon
# OR
node server.js # Production mode
```
Backend will be available at: `http://localhost:5000`

### Start User App (Frontend)
```bash
cd client/user
npm run dev
```
User app will be available at: `http://localhost:5173`

### Start Organizer App
```bash
cd client/organizer
npm run dev
```
Organizer app will be available at: `http://localhost:5174`

### Start Admin App
```bash
cd client/admin
npm run dev
```
Admin app will be available at: `http://localhost:5175`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /user/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /user/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Organizer Register
```http
POST /organiser/auth/register
Content-Type: application/json

{
  "name": "Event Hub Co",
  "email": "organizer@example.com",
  "password": "securePassword123"
}
```

### Event Endpoints

#### Create Event (Organizer)
```http
POST /organiser/events/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Tech Summit 2024",
  "description": "Annual tech conference",
  "eventType": "expert-talk",
  "date": "2024-04-15",
  "time": "10:00",
  "location": "San Francisco, CA",
  "capacity": 500,
  "banner": <file>
}
```

#### Get All Events
```http
GET /user/events
```

#### Get Event Details
```http
GET /user/events/:eventId
```

#### Update Event (Organizer)
```http
PUT /organiser/events/:eventId
Authorization: Bearer <token>
```

#### Delete Event (Organizer)
```http
DELETE /organiser/events/:eventId
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json
```

#### Get User Events
```http
GET /user/my-events
Authorization: Bearer <token>
```

---

## 🔐 Security Features

- ✅ **Helmet.js**: HTTP header security
- ✅ **CORS**: Cross-origin resource sharing protection
- ✅ **JWT Tokens**: Secure stateless authentication
- ✅ **Password Hashing**: bcryptjs encryption
- ✅ **Firebase Auth**: Additional authentication layer
- ✅ **Input Validation**: Data sanitization & validation
- ✅ **Rate Limiting**: DDoS protection ready
- ✅ **Environment Variables**: Sensitive data protection

---

## 🧪 Testing

### Run Tests (Backend)
```bash
cd server
npm test
```

### Build Frontend for Production
```bash
cd client/user
npm run build

cd ../organizer
npm run build

cd ../admin
npm run build
```

---

## 📈 Performance Optimization

- **Vite**: Lightning-fast build and HMR
- **MongoDB Indexing**: Optimized database queries
- **Cloudinary**: Image optimization & CDN delivery
- **Socket.IO**: Efficient real-time updates
- **Lazy Loading**: Component code splitting

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Ensure all tests pass
- Update documentation if needed
- Add meaningful commit messages

---

## 🐛 Known Issues & Roadmap

### Current Version
- ✅ Core event management
- ✅ User authentication
- ✅ Payment integration
- ✅ Real-time updates

### Planned Features
- 📋 Email notifications
- 🔔 Push notifications
- 📱 Mobile app
- 🎫 QR code tickets
- 🗺️ Enhanced location services
- 🎤 Live streaming support

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/sharadhkr/eventBy/issues)
- **Email**: sharadhkr@example.com
- **Repository**: [eventBy GitHub](https://github.com/sharadhkr/eventBy)

---

## 🙌 Acknowledgments

- MongoDB for robust database solutions
- Firebase for authentication
- Cloudinary for image management
- Razorpay for payment processing
- The amazing React & Node.js communities

---

<p align="center">
  Made with ❤️ by the eventBy Team
</p>

<p align="center">
  ⭐ If you found this project helpful, please consider giving it a star!
</p>

* Responsive UI for all devices
* Optimized API handling
* Smooth navigation & user flow

---

## 🏗️ Tech Stack

### 🖥️ Frontend

* React.js
* Tailwind CSS
* Axios

### ⚙️ Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### 🔐 Authentication

* JWT-based authentication

---

## 📂 Project Structure


```
eventby
└─ eventBy
   ├─ .env
   ├─ client
   │  ├─ admin
   │  │  ├─ .env
   │  │  ├─ eslint.config.js
   │  │  ├─ index.html
   │  │  ├─ package-lock.json
   │  │  ├─ package.json
   │  │  ├─ public
   │  │  │  └─ vite.svg
   │  │  ├─ README.md
   │  │  ├─ src
   │  │  │  ├─ api
   │  │  │  │  ├─ api.js
   │  │  │  │  ├─ dasboard.api.js
   │  │  │  │  ├─ organizer.js
   │  │  │  │  └─ topevent.js
   │  │  │  ├─ App.jsx
   │  │  │  ├─ assets
   │  │  │  │  └─ react.svg
   │  │  │  ├─ components
   │  │  │  │  ├─ LineChart.jsx
   │  │  │  │  ├─ StatCard.jsx
   │  │  │  │  └─ TopEventSlot.jsx
   │  │  │  ├─ context
   │  │  │  │  ├─ admin.jsx
   │  │  │  │  ├─ dashboard.jsx
   │  │  │  │  └─ Topevent.jsx
   │  │  │  ├─ index.css
   │  │  │  ├─ layout
   │  │  │  │  └─ AdminLayout.jsx
   │  │  │  ├─ main.jsx
   │  │  │  ├─ middleware
   │  │  │  │  └─ protected.jsx
   │  │  │  └─ pages
   │  │  │     ├─ AdminDashboard.jsx
   │  │  │     ├─ AdminOrganisers.jsx
   │  │  │     ├─ Login.jsx
   │  │  │     └─ Topevents.jsx
   │  │  └─ vite.config.js
   │  ├─ organizer
   │  │  ├─ .env
   │  │  ├─ eslint.config.js
   │  │  ├─ index.html
   │  │  ├─ package-lock.json
   │  │  ├─ package.json
   │  │  ├─ public
   │  │  │  └─ vite.svg
   │  │  ├─ README.md
   │  │  ├─ src
   │  │  │  ├─ api
   │  │  │  │  ├─ api.js
   │  │  │  │  └─ event.api.js
   │  │  │  ├─ App.css
   │  │  │  ├─ App.jsx
   │  │  │  ├─ assets
   │  │  │  │  └─ react.svg
   │  │  │  ├─ components
   │  │  │  │  ├─ EventCard.jsx
   │  │  │  │  ├─ Loading.jsx
   │  │  │  │  ├─ NavBar.jsx
   │  │  │  │  └─ OrganiserDisabled.jsx
   │  │  │  ├─ components copy
   │  │  │  │  ├─ EventCard.jsx
   │  │  │  │  ├─ Loading.jsx
   │  │  │  │  ├─ NavBar.jsx
   │  │  │  │  └─ OrganiserDisabled.jsx
   │  │  │  ├─ context
   │  │  │  │  └─ organiser.auth.context.jsx
   │  │  │  ├─ context copy
   │  │  │  │  └─ organiser.auth.context.jsx
   │  │  │  ├─ index.css
   │  │  │  ├─ layouts
   │  │  │  │  └─ NavLayout.jsx
   │  │  │  ├─ main.jsx
   │  │  │  ├─ middleware
   │  │  │  │  └─ OrganiserProtectedRoute.jsx
   │  │  │  ├─ pages
   │  │  │  │  ├─ Analytics.jsx
   │  │  │  │  ├─ CreateEvent.jsx
   │  │  │  │  ├─ Dashboard.jsx
   │  │  │  │  ├─ EditEvent.jsx
   │  │  │  │  ├─ EditProfile.jsx
   │  │  │  │  ├─ EventAnnouncements.jsx
   │  │  │  │  ├─ Login.jsx
   │  │  │  │  ├─ ManageEvents.jsx
   │  │  │  │  ├─ Register.jsx
   │  │  │  │  └─ Settings.jsx
   │  │  │  ├─ pages copy
   │  │  │  │  ├─ Analytics.jsx
   │  │  │  │  ├─ CreateEvent.jsx
   │  │  │  │  ├─ Dashboard.jsx
   │  │  │  │  ├─ EditEvent.jsx
   │  │  │  │  ├─ EditProfile.jsx
   │  │  │  │  ├─ EventAnnouncements.jsx
   │  │  │  │  ├─ Login.jsx
   │  │  │  │  ├─ ManageEvents.jsx
   │  │  │  │  ├─ Register.jsx
   │  │  │  │  └─ Settings.jsx
   │  │  │  └─ routes
   │  │  │     └─ index.jsx
   │  │  └─ vite.config.js
   │  └─ user
   │     ├─ .env
   │     ├─ components.json
   │     ├─ eslint.config.js
   │     ├─ index.html
   │     ├─ package-lock.json
   │     ├─ package.json
   │     ├─ public
   │     │  └─ vite.svg
   │     ├─ README.md
   │     ├─ src
   │     │  ├─ App.jsx
   │     │  ├─ assets
   │     │  │  ├─ bg.jpg
   │     │  │  ├─ loading.gif
   │     │  │  ├─ loading.mp4
   │     │  │  └─ logo.png
   │     │  ├─ components
   │     │  │  ├─ CreateTeamWizard.jsx
   │     │  │  ├─ Datefilter.jsx
   │     │  │  ├─ Editprofile.jsx
   │     │  │  ├─ EventCard.jsx
   │     │  │  ├─ events
   │     │  │  │  ├─ AnnouncementFeed.jsx
   │     │  │  │  ├─ JoinedEventCard.jsx
   │     │  │  │  └─ RecommendedEventCard.jsx
   │     │  │  ├─ Home
   │     │  │  │  └─ Backgound.jsx
   │     │  │  ├─ JoinedEvents.jsx
   │     │  │  ├─ Loading.jsx
   │     │  │  ├─ MiniStats.jsx
   │     │  │  ├─ NavBar.jsx
   │     │  │  ├─ ProfileHeader.jsx
   │     │  │  ├─ TeamInvites.jsx
   │     │  │  ├─ TeamsList.jsx
   │     │  │  ├─ Topbar.jsx
   │     │  │  ├─ TopEvent.jsx
   │     │  │  ├─ Topevents.jsx
   │     │  │  ├─ Toporganiser.jsx
   │     │  │  ├─ ui
   │     │  │  │  ├─ avatar.tsx
   │     │  │  │  ├─ button.tsx
   │     │  │  │  ├─ card.tsx
   │     │  │  │  ├─ drawer.tsx
   │     │  │  │  ├─ separator.tsx
   │     │  │  │  ├─ skeleton.tsx
   │     │  │  │  └─ tabs.tsx
   │     │  │  └─ UserProfileHero.jsx
   │     │  ├─ context
   │     │  │  └─ auth.context.jsx
   │     │  ├─ index.css
   │     │  ├─ layouts
   │     │  │  └─ NavLayout.jsx
   │     │  ├─ lib
   │     │  │  ├─ api.js
   │     │  │  ├─ socket.js
   │     │  │  └─ utils.ts
   │     │  ├─ main.jsx
   │     │  ├─ middleware
   │     │  │  └─ ProtectedRoute.jsx
   │     │  ├─ pages
   │     │  │  ├─ auth
   │     │  │  │  └─ Login.jsx
   │     │  │  ├─ dashboard
   │     │  │  │  └─ Profile.jsx
   │     │  │  ├─ EditProfilepage.jsx
   │     │  │  ├─ EventMapPage.jsx
   │     │  │  ├─ Home.jsx
   │     │  │  ├─ JoinEventPage.jsx
   │     │  │  ├─ profile
   │     │  │  │  └─ ProfilePage.jsx
   │     │  │  └─ UserEvents.jsx
   │     │  ├─ routes
   │     │  │  └─ index.jsx
   │     │  └─ utils
   │     │     └─ firebase.js
   │     ├─ tsconfig.app.json
   │     ├─ tsconfig.json
   │     ├─ tsconfig.node.json
   │     └─ vite.config.js
   ├─ readme.MD
   └─ server
      ├─ .env
      ├─ app.js
      ├─ config
      │  ├─ cloudinary.js
      │  ├─ db.js
      │  ├─ firebase.js
      │  └─ rajorpay.js
      ├─ controllers
      │  ├─ admin
      │  │  ├─ auth.controller.js
      │  │  ├─ dashboard.controller.js
      │  │  ├─ organiser.controller.js
      │  │  └─ topevent.controller.js
      │  ├─ event
      │  │  └─ controller.js
      │  ├─ organiser
      │  │  └─ auth.controller.js
      │  └─ user
      │     ├─ auth.controller.js
      │     ├─ Teamcontroller.js
      │     └─ user.controller.js
      ├─ firebase-service-account.json
      ├─ middlewares
      │  ├─ admin
      │  │  └─ auth.middleware.js
      │  ├─ firebase.middleware.js
      │  └─ organiser
      │     └─ auth.middleware.js
      ├─ models
      │  ├─ admin.model.js
      │  ├─ Announcement.model.js
      │  ├─ Event.model.js
      │  ├─ Event.participation.model.js
      │  ├─ Event.pass.model.js
      │  ├─ Notification.model.js
      │  ├─ organiser.model.js
      │  ├─ Payment.model.js
      │  ├─ team.model.js
      │  ├─ Top.event.js
      │  └─ User.model.js
      ├─ package-lock.json
      ├─ package.json
      ├─ routes
      │  ├─ admin
      │  │  ├─ auth.router.js
      │  │  ├─ dashboard.routes.js
      │  │  ├─ organizer.routes.js
      │  │  └─ Top.event.router.js
      │  ├─ organiser
      │  │  ├─ auth.routes.js
      │  │  └─ Event.routes.js
      │  └─ user
      │     ├─ auth.routes.js
      │     ├─ Payment.routes.js
      │     └─ Team.routes.js
      ├─ server.js
      ├─ socket
      │  └─ index.js
      └─ utils
         ├─ autoVerifyOrganiser.js
         └─ Genrate.pass.js

```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash id="0e3cln"
git clone https://github.com/sharadhkr/eventBy.git
cd eventBy
```

### 2️⃣ Install Dependencies

```bash id="6c0h3q"
cd frontend && npm install
cd ../backend && npm install
```

### 3️⃣ Setup Environment Variables

Create `.env` in backend:

```env id="6l8j7v"
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
```

### 4️⃣ Run the App

```bash id="p7cbcz"
# backend
npm run dev

# frontend
npm start
```

---

## 📸 Screenshots

> Add screenshots here to showcase UI 🚀

---

## 🧪 Future Enhancements

* 🎟️ Ticket booking system
* 💳 Payment integration
* 📍 Map-based event discovery
* 📱 Mobile app version

---

## 🤝 Contributing

Contributions are welcome!
Fork the repo and create a PR 🚀

---

## 👨‍💻 Author

**Sharad Rathore**
🚀 Full Stack Developer

---

## ⭐ Support

If you like this project:

👉 Star ⭐ the repo
👉 Share with others

---

## ⚡ Final Thought

> “eventBy simplifies event management into a seamless digital experience.”
