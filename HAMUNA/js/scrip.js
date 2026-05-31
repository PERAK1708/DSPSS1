const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Email:", email);
    console.log("Password:", password);

    // Firebase Auth nanti di sini
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {

            alert("Login berhasil!");

            // arahkan ke dashboard
            window.location.href = "dashboard.html";

        })
        .catch((error) => {
            alert("Login gagal: " + error.message);
        });
});