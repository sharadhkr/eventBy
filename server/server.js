require("dotenv").config();
const http = require("http");
const admin = require("firebase-admin"); // Add this
const app = require("./app");
const connectDB = require("./config/db");

// 1. Initialize Firebase Admin SDK
// You can use environment variables for security
const serviceAccount = require("./firebase-service-account.json"); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("🔥 Firebase Admin initialized");
}

// 2. Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`🚀 Eventrix server running on port ${port}`);
});