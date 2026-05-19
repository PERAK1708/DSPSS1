function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (user === "admin" && pass === "12345") {
        message.style.color = "#22c55e";
        message.innerText = "Login berhasil!";
    } else {
        message.style.color = "#ef4444";
        message.innerText = "Username atau password salah!";
    }
}