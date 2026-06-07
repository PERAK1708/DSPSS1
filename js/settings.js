const docRef = db.collection("chatdansosmed").doc("HAMUNA");

// ================= LOAD =================
async function loadSettings(){

    const doc = await docRef.get();

    if(!doc.exists) return;

    const data = doc.data();

    document.getElementById("whatsapp").value = data.whatsapp || "";
    document.getElementById("telepon").value = data.telepon || "";
    document.getElementById("instagram").value = data.instagram || "";
    document.getElementById("facebook").value = data.facebook || "";
    document.getElementById("tiktok").value = data.tiktok || "";
    document.getElementById("email").value = data.email || "";
}

// ================= UPDATE =================
async function updateField(field){

    const value = document.getElementById(field).value.trim();

    try {

        await docRef.set({
            [field]: value
        }, { merge:true });

        alert(field + " berhasil diupdate");

    } catch(err) {

        console.error(err);
        alert("Gagal update");
    }
}

loadSettings();