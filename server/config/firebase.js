const admin = require('firebase-admin');

const initializeFirebase = () => {
  const serviceAccount = require('../../firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  console.log('✓ Firebase Admin initialized');
};

module.exports = { admin, initializeFirebase };