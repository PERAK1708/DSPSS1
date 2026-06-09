auth.onAuthStateChanged((user) => {

    if (user) {

        window.location.replace("dashboard.html");

    }

});

    // Firebase Auth nanti di sini


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

        auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {

            sessionStorage.setItem("adminLogin", "true");

            window.location.replace("dashboard.html");

        })
        .catch((error) => {

            alert("Login gagal: " + error.message);

        });
});