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
console.log({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET
});
const server = http.createServer(app); // ✅ DEFINE SERVER HERE

const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

// make io accessible in controllers
app.set("io", io);

// socket logic
require("./socket")(io);
// 2. Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`🚀 Eventrix server running on port ${port}`);
});