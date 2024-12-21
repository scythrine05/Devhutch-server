require("dotenv").config();

const firebaseAdmin = require("firebase-admin");
var serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set!");
}
var serviceAccount = require(serviceAccountPath);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

module.exports = { firebaseAdmin };