// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDad2xNkZi1VyPB5O5-VVG_pgULMA0f5bE",
  authDomain: "video-drive-8d636.firebaseapp.com",
  projectId: "video-drive-8d636",
  storageBucket: "video-drive-8d636.appspot.com",
  messagingSenderId: "937972772483",
  appId: "1:937972772483:web:730b7937bd3dee987935b6",
  measurementId: "G-TLJDMDLB0Y",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
