// COLLECTION
const bankRef = db.collection("paymentBanks").doc("HAMUNA");
const qrisRef = db.collection("paymentQRIS").doc("HAMUNA");


// ================= ADD BANK =================
async function addBank(){

    const type = document.getElementById("bankName").value.trim();
    const rekening = document.getElementById("bankRek").value.trim();
    const owner = document.getElementById("bankOwner").value.trim();

    if(!type || !rekening || !owner){
        alert("Lengkapi data bank");
        return;
    }

    const snap = await bankRef.get();
    const data = snap.data() || {};

    let banks = data.banks || [];

    banks.push({
        id: Date.now().toString(),
        type,
        rekening,
        owner
    });

    await bankRef.set({ banks });

    document.getElementById("bankName").value = "";
    document.getElementById("bankRek").value = "";
    document.getElementById("bankOwner").value = "";

    renderBanks();
}


// ================= RENDER BANK =================
async function renderBanks(){

    const snap = await bankRef.get();
    const data = snap.data() || {};

    const list = document.getElementById("bankList");
    list.innerHTML = "";

    (data.banks || []).forEach(b => {

        list.innerHTML += `
        <div style="border:1px solid #ddd;padding:10px;margin:5px;">
            <b>${b.type}</b><br>
            ${b.rekening}<br>
            ${b.owner}<br>

            <button onclick="deleteBank('${b.id}')">Hapus</button>
        </div>
        `;
    });
}


// ================= DELETE BANK =================
async function deleteBank(id){

    const snap = await bankRef.get();
    const data = snap.data() || {};

    let banks = (data.banks || []).filter(b => b.id !== id);

    await bankRef.set({ banks });

    renderBanks();
}


// ================= QRIS UPLOAD (IMGBB) =================
async function uploadQRIS(){

    const file = document.getElementById("qrisFile").files[0];
    if(!file){
        alert("Pilih gambar QRIS");
        return;
    }

    const form = new FormData();
    form.append("image", file);

    const res = await fetch("https://api.imgbb.com/1/upload?key=ec9648ed3d45b193ff7aca58466e427d", {
        method: "POST",
        body: form
    });

    const json = await res.json();
    const url = json.data.url;

    await qrisRef.set({
        image: url
    });

    document.getElementById("previewQRIS").src = url;
    document.getElementById("previewQRIS").style.display = "block";

    alert("QRIS berhasil diupload");
}


// INIT
renderBanks();

const sosmedRef = db.collection("chatdansosmed").doc("HAMUNA");

async function updateField(field) {

    const value = document.getElementById(field).value.trim();

    await sosmedRef.set({
        [field]: value
    }, { merge: true });

    alert(field + " berhasil disimpan");
}
async function loadSosmed() {

    const doc = await sosmedRef.get();

    if (!doc.exists) return;

    const data = doc.data();

    const fields = [
        "whatsapp",
        "telepon",
        "telegram",
        "instagram",
        "facebook",
        "tiktok",
        "email",
        "alamat"
    ];

    fields.forEach(field => {
        const el = document.getElementById(field);

        if (el) {
            el.value = data[field] || "";
        }
    });
}

loadSosmed();
async function toggleVisible(field){

    const docRef =
    db.collection("chatdansosmed")
    .doc("HAMUNA");

    const doc = await docRef.get();

    const data = doc.data() || {};

    const current =
    data[field + "_visible"] ?? true;

    const newValue = !current;

    await docRef.set({
        [field + "_visible"]: newValue
    }, { merge:true });

    updateButton(field, newValue);

    updateButton(
    "whatsapp",
    data.whatsapp_visible ?? true
);

updateButton(
    "telepon",
    data.telepon_visible ?? true
);

updateButton(
    "instagram",
    data.instagram_visible ?? true
);

updateButton(
    "facebook",
    data.facebook_visible ?? true
);

updateButton(
    "telegram",
    data.telegram_visible ?? true
);

updateButton(
    "tiktok",
    data.tiktok_visible ?? true
);

updateButton(
    "email",
    data.email_visible ?? true
);

updateButton(
    "alamat",
    data.alamat_visible ?? true
);
}
function updateButton(field, visible){

    const btn =
    document.getElementById("btn-" + field);

    if(!btn) return;

    btn.textContent =
        visible ? "👁️ Show" : "🙈 Hidden";
}