const url = new URLSearchParams(window.location.search);
let currentId = url.get("id");

const orderIdEl = document.getElementById("orderId");
const inputId = document.getElementById("inputId");
const statusBox = document.getElementById("statusBox");
const totalEl = document.getElementById("total");
const orderInfo = document.getElementById("orderInfo");

let currentRef = null;

// ================= INIT =================
if (currentId) {
    orderIdEl.innerText = currentId;
    inputId.value = "";
}

totalEl.innerText = "Rp 0";
statusBox.innerHTML = "";
orderInfo.innerHTML = "";

// ================= COPY =================
function copyId() {
    navigator.clipboard.writeText(inputId.value);
    alert("ID tersalin!");
}

// ================= REALTIME =================
function listenOrder(id) {

    if (!window.db) {
        alert("Firebase belum siap");
        return;
    }

    // stop listener lama
    if (currentRef) {
        db.ref("orders/" + currentRef).off();
    }

    currentRef = id;

    db.ref("orders/" + id).on("value", (snap) => {

if (!snap.exists()) {

    statusBox.innerText = "ORDER TIDAK DITEMUKAN";
    statusBox.className = "status error";

    // kosongkan data
    orderIdEl.innerText = "-";
    totalEl.innerText = "Rp 0";
    orderInfo.innerHTML = "";

    return;
}

        const data = snap.val();

        orderIdEl.innerText = id;

        totalEl.innerText =
            "Rp " + Number(data.total || 0).toLocaleString("id-ID");

        statusBox.innerText = (data.status || "pending").toUpperCase();

        statusBox.className =
            "status " + (data.status || "pending");

        renderInfo(id, data);
    });
}

// ================= RENDER INFO =================
function renderInfo(id, data) {

    orderInfo.innerHTML = `
        <div class="info-box">

            <p><b>ID Pesanan:</b> ${id}</p>
            <p><b>Nama Pemesan:</b> ${data.nama || "-"}</p>
                        <p>
                <b>Metode:</b>
                ${
                    data.jenisPesanan === "delivery"
                    ? "Delivery 🛵"
                    : "Dine In 🍽️"
                }
            </p>
            <p><b>Status:</b> ${data.status || "-"}</p>

            <p>
                <b>Total Bayar:</b>
                Rp ${Number(data.total || 0).toLocaleString("id-ID")}
            </p>



        </div>
    `;
}

// ================= MANUAL CHECK =================
function cekStatus() {
    const id = inputId.value.trim();
    if (!id) return alert("Masukkan ID order");
    listenOrder(id);
}
function waitFirebase(callback) {
    if (window.db) {
        callback();
    } else {
        setTimeout(() => waitFirebase(callback), 200);
    }
}