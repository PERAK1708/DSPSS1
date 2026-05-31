const firebaseConfig = {
    apiKey: "AIzaSyDIsm1NJMdTQkwTV-48S-UYmIsY7S7NAEk",
    authDomain: "loginweb-dssps.firebaseapp.com",
    databaseURL: "https://loginweb-dssps-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "loginweb-dssps",
    storageBucket: "loginweb-dssps.firebasestorage.app",
    messagingSenderId: "664175528014",
    appId: "1:664175528014:web:4c789c14fe5de28ee3db1f"
};

// INIT
firebase.initializeApp(firebaseConfig);

// SERVICES
const auth = firebase.auth();
const db = firebase.database();      // Orders (Realtime DB)
const firestore = firebase.firestore(); // Menu (Firestore)