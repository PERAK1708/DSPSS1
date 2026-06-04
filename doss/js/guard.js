auth.onAuthStateChanged(async (user) => {

    const path = window.location.pathname;

    // PUBLIC AREA
    const publicPages = [
        "/public/",
        "public/index.html"
    ];

    const isPublic = publicPages.some(p => path.includes(p));

    // =========================
    // ❌ BELUM LOGIN
    // =========================
    if (!user) {

        if (!isPublic) {

            alert("⚠️ Anda belum login! Silakan login terlebih dahulu.");

            window.location.replace("/public/index.html");
        }

        return;
    }

    // =========================
    // 🔥 SUDAH LOGIN
    // =========================

    // ambil nama user (prioritas displayName)
    let displayName = user.displayName;

    // fallback kalau kosong
    if (!displayName) {
        displayName = user.email.split("@")[0];
    }

    const el = document.getElementById("loginUser");
    if (el) {
        el.innerText = displayName;
    }

});

function showAlert(msg) {
    const div = document.createElement("div");
    div.innerText = msg;
    div.style = `
        position:fixed;
        top:20px;
        right:20px;
        background:#e74c3c;
        color:white;
        padding:10px 15px;
        border-radius:8px;
        z-index:9999;
    `;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}