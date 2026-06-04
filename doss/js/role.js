function protectPages(role) {

    const page = window.location.pathname;

    // ADMIN FULL ACCESS
    if (role === "admin") return;

    // KASIR ONLY ORDERS
    if (role === "kasir") {
        if (!page.includes("orders.html")) {
            window.location.replace("index.html");
        }
        return;
    }

    // USER / UNKNOWN → KICK OUT
    firebase.auth().signOut();
    window.location.replace("index.html");
}