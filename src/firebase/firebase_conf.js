// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8yuGgaywCwOjPQyifWg27wr43ad8QfPA",
  authDomain: "ehan-database.firebaseapp.com",
  projectId: "ehan-database",
  storageBucket: "ehan-database.appspot.com",
  messagingSenderId: "773807449409",
  appId: "1:773807449409:web:2ac56865272905c64a2dc0",
  measurementId: "G-JCDJD8E7N4",
};

export const vapidKey =
  "BM_VcRb5uHv6a5CF_Bf6n8CYn8AJNY0We75CmFC-IaQ8SaW2Z6N04FYx3CFKnXLnj_b_xYqcaluGjMi6jPTW9JU";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// 인스턴스 추가
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDB = getDatabase(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
