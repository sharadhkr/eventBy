# 🎉 eventBy — Smart Event Management Platform

<p align="center">
  <img src="./banner.png" width="800" alt="eventBy Banner"/>
</p>

<p align="center">
  <b>📅 Plan • 🎟️ Manage • 🚀 Experience Events Seamlessly</b>
</p>

<p align="center">
  <a href="https://github.com/sharadhkr/eventBy"><img src="https://img.shields.io/badge/Repo-GitHub-000?style=for-the-badge&logo=github"/></a>
  <img src="https://img.shields.io/badge/Full--Stack-Project-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
</p>

---

## 🧠 Overview

**eventBy** is a **modern full-stack event management platform** that allows users to **discover, create, and manage events effortlessly**.

Designed with scalability and usability in mind, it provides a seamless experience for both **event organizers and attendees**.

💡 Built as a real-world system with clean architecture and optimized performance.

---

## ✨ Key Features

### 🎟️ Event Management

* Create, update, and delete events
* Event details with date, time, and location
* Category-based event browsing

### 👥 User System

* Secure authentication system
* User profiles & event participation
* Role-based usage (organizer / attendee)

### 🔍 Discovery & Search

* Browse events by categories
* Search functionality for quick access
* Trending / featured events

### ⚡ Performance & UX

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

```bash id="k9j3pa"

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
