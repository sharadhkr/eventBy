// const admin = require("firebase-admin");
// const path = require("path");

// if (!admin.apps.length) {
//   const serviceAccountPath = path.resolve(
//     __dirname,
//     "../firebase-service-account.json"
//   );

//   try {
//     const serviceAccount = require(serviceAccountPath);

//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });

//     console.log("🔥 Firebase Admin initialized");
//   } catch (err) {
//     console.error("❌ Firebase Admin init failed");
//     console.error(err);
//     process.exit(1); // ❗ fail fast — do NOT run with broken auth
//   }
// }

// module.exports = { admin };

require("dotenv").config();
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(
  path.resolve(__dirname, "../firebase-service-account.json")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "eventrix-36302", // 🔥 HARD-CODE (TEMPORARILY)
});

console.log("🔥 Firebase Admin project:", admin.app().options.projectId);

module.exports = { admin };
