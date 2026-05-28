const firebaseConfig = {
  apiKey: "AIzaSyDIsm1NJMdTQkwTV-48S-UYmIsY7S7NAEk",
  authDomain: "loginweb-dssps.firebaseapp.com",
  projectId: "loginweb-dssps",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

async function login() {

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value.trim();

    const message = document.getElementById("message");

    if(username === "" || password === ""){

        message.style.color = "red";
        message.innerText = "Isi username dan password";

        return;
    }

    try {

        // Cari username di Firestore
        const snapshot = await db.collection("users")
        .where("username", "==", username)
        .get();

        // Jika tidak ada user
        if(snapshot.empty){

            message.style.color = "#ef4444";
            message.innerText = "Username tidak ditemukan";

            return;
        }

        // Ambil data user
        const userData = snapshot.docs[0].data();

        const email = userData.email;

        // Login Firebase Auth
        await auth.signInWithEmailAndPassword(email,password);

        // Simpan session
        localStorage.setItem("login","true");

        localStorage.setItem("username",username);

        localStorage.setItem("email",email);

        message.style.color = "#22c55e";
        message.innerText = "Login berhasil";

        // pindah dashboard
        setTimeout(()=>{

            window.location.href = "dashboard.html";

        },1000);

    } catch(error){

        message.style.color = "#ef4444";

        if(error.code === "auth/wrong-password"){

            message.innerText = "Password salah";

        }else if(error.code === "auth/invalid-credential"){

            message.innerText = "Password salah";

        }else{

            message.innerText = error.message;

        }

    }

}