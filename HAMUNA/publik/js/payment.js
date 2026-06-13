const url = new URLSearchParams(window.location.search);

let currentId = url.get("id");
const mode = url.get("mode");

const payBox = document.querySelector(".pay-box");
if (payBox && mode !== "payment") {
    payBox.style.display = "none";
}

const orderIdEl = document.getElementById("orderId");
const inputId = document.getElementById("inputId");
const statusBox = document.getElementById("statusBox");
const totalEl = document.getElementById("total");
const orderInfo = document.getElementById("orderInfo");
const actionArea = document.getElementById("actionArea");

let currentRef = null;

// ================= INIT =================
if (currentId) {
    if (orderIdEl) orderIdEl.innerText = currentId;
    if (inputId) inputId.value = "";

    waitFirebase(() => {
        listenOrder(currentId);
    });
}

totalEl.innerText = "Rp 0";
statusBox.innerHTML = "";
orderInfo.innerHTML = "";

// ================= COPY =================
function copyId() {
    navigator.clipboard.writeText(currentId || orderIdEl.innerText);
    alert("ID tersalin!");
}

// ================= REALTIME =================
function listenOrder(id) {

    if (!window.db) {
        alert("Firebase belum siap");
        return;
    }

    if (currentRef) {
        db.ref("orders/" + currentRef).off();
    }

    currentRef = id;

    db.ref("orders/" + id).on("value", (snap) => {

        if (!snap.exists()) {
            statusBox.innerText = "ORDER TIDAK DITEMUKAN";
            statusBox.className = "status error";

            orderIdEl.innerText = "-";
            totalEl.innerText = "Rp 0";
            orderInfo.innerHTML = "";
            actionArea.innerHTML = "";
            return;
        }

        const data = snap.val();

        orderIdEl.innerText = id;

        totalEl.innerText =
            "Rp " + Number(data.total || 0).toLocaleString("id-ID");

        const status = (data.status || "pending").toLowerCase();

        statusBox.innerText = status.toUpperCase();
        statusBox.className = "status " + status;

        renderInfo(id, data);
        renderAction(id, data);
    });
}

// ================= INFO =================
function renderInfo(id, data) {

    orderInfo.innerHTML = `
        <div class="info-box">

            <p><b>ID:</b> ${id}</p>
            <p><b>Nama:</b> ${data.nama || "-"}</p>
            <p><b>Metode:</b> ${
                data.jenisPesanan === "delivery"
                    ? "Delivery 🛵"
                    : "Dine In 🍽️"
            }</p>

            <p><b>Status:</b> ${data.status || "-"}</p>

            <p><b>Total:</b> Rp ${Number(data.total || 0).toLocaleString("id-ID")}</p>

        </div>
    `;
}

// ================= ACTION =================
function renderAction(id, data) {

    const status = (data.status || "").toLowerCase();
    const uploadBox = document.getElementById("uploadProofBox");

    // default hide
    if (uploadBox) {
        uploadBox.style.display = status === "pending" ? "block" : "none";
    }

    if (status === "pending") {

        actionArea.innerHTML = `
            <div class="upload-proof">

                <input type="file" id="proofFile" accept="image/*">

                <button onclick="uploadBukti()">
                    📤 Kirim Bukti Pembayaran
                </button>

            </div>

            ${mode !== "payment" ? `
            <button onclick="bayarSekarang('${id}')">
                💳 Bayar Sekarang
            </button>
            ` : ""}
        `;
    }

    else if (status === "menunggu_verifikasi") {
        actionArea.innerHTML = `
            <div class="info-msg">
                📋 Bukti sudah dikirim<br>
                Menunggu verifikasi admin
            </div>
        `;
    }

    else {
        actionArea.innerHTML = "";
    }
}

// ================= BAYAR =================
function bayarSekarang(id) {
    window.location.href =
        "payment.html?id=" +
        encodeURIComponent(id) +
        "&mode=payment";
}

// ================= UPLOAD BUKTI (FIXED TOTAL) =================
const IMGBB_KEY = "f8204dd0bbbe08678f5e52a0d528b9d2";

async function uploadBukti() {

    const file = document.getElementById("proofFile")?.files[0];

    if (!file) {
        alert("Pilih gambar dulu");
        return;
    }

    if (!currentId) {
        alert("ID tidak ditemukan");
        return;
    }

    const snap = await db.ref("orders/" + currentId).get();
    const data = snap.val();

    if (!data) {
        alert("Order tidak ditemukan");
        return;
    }

    // 🔒 LOCK FULL
    if (data.status !== "pending") {
        alert("Tidak bisa upload (sudah diproses)");
        return;
    }

    if (data.buktiTransfer) {
        alert("Bukti sudah pernah dikirim");
        return;
    }

    try {

        const btn = document.querySelector("button[onclick='uploadBukti()']");
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Mengirim...";
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
            {
                method: "POST",
                body: formData
            }
        );

        const result = await res.json();

        if (!result.success) {
            throw new Error("Upload gagal");
        }

        const imageUrl = result.data.display_url;

        await db.ref("orders/" + currentId).update({
            status: "menunggu_verifikasi",
            buktiTransfer: imageUrl,
            waktuUpload: Date.now()
        });

        alert("Bukti berhasil dikirim");
        const uploadBox = document.getElementById("uploadProofBox");
        if (uploadBox) uploadBox.style.display = "none";

    } catch (err) {
        console.error(err);
        alert("Gagal upload bukti");
    }
}

// ================= FIREBASE WAIT =================
function waitFirebase(callback) {
    if (window.db) callback();
    else setTimeout(() => waitFirebase(callback), 200);
}

// ================= MANUAL CHECK =================
function cekStatus() {
    const id = inputId.value.trim();
    if (!id) return alert("Masukkan ID");
    listenOrder(id);
}