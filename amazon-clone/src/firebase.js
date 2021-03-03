import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDxaXqvnF0N_qKhbv431JIAfBfUnySRJxw",
  authDomain: "maneesh--clone.firebaseapp.com",
  projectId: "maneesh--clone",
  storageBucket: "maneesh--clone.appspot.com",
  messagingSenderId: "840780904576",
  appId: "1:840780904576:web:b33eab6af97db2cb518e65",
  measurementId: "G-WN38Z54VMM"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };