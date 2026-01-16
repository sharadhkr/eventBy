const admin = require("firebase-admin");
const path = require("path");

const initializeFirebase = () => {
  if (admin.apps.length > 0) return admin.app(); // Prevent multiple initializations

  try {
    const serviceAccount = require(path.resolve(__dirname, "../firebase-service-account.json"));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin initialized");
  } catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
  }
};

module.exports = { admin, initializeFirebase };
