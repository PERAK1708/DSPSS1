const firebaseConfig = {
    apiKey: "AIzaSyDIsm1NJMdTQkwTV-48S-UYmIsY7S7NAEk",
    authDomain: "loginweb-dssps.firebaseapp.com",
    databaseURL: "https://loginweb-dssps-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "loginweb-dssps",
    storageBucket: "loginweb-dssps.appspot.com",
    messagingSenderId: "664175528014",
    appId: "1:664175528014:web:4c789c14fe5de28ee3db1f"
};

firebase.initializeApp(firebaseConfig);

// DATABASE
const db = firebase.database();

// FIRESTORE
const firestore = firebase.firestore();

// 🔥 WAJIB EXPORT GLOBAL
window.db = db;
window.firestore = firestore;