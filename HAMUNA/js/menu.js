const btnTambah = document.getElementById("btnTambah");
const formBox = document.getElementById("formBox");
const btnSimpan = document.getElementById("btnSimpan");
const menuList = document.getElementById("menuList");
const editModal = document.getElementById("editModal");
const btnUpdate = document.getElementById("btnUpdate");
const IMGBB_KEY = "f8204dd0bbbe08678f5e52a0d528b9d2";

let editId = null;
let kategoriFilter = "Semua";

// ================= FILTER =================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        kategoriFilter = btn.dataset.kategori;
        loadMenu();
    });
});

// ================= FORM =================
btnTambah.addEventListener("click", () => {
    formBox.classList.toggle("active");
});

// ================= SAVE =================
btnSimpan.addEventListener("click", async () => {

    const nama = document.getElementById("namaMenu").value;
    const harga = Number(document.getElementById("hargaMenu").value);
    const kategori = document.getElementById("kategoriMenu").value;
    const file = document.getElementById("gambarMenu").files[0];

    if (!nama || !harga) return alert("Isi lengkap!");

    let gambarUrl = "";

    if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
            { method: "POST", body: formData }
        );

        const data = await res.json();
        if (data.success) gambarUrl = data.data.display_url;
    }

    if (editId) {
        await firestore.collection("menus").doc(editId).update({
            nama, harga, kategori,
            ...(gambarUrl && { gambar: gambarUrl })
        });

        editId = null;

    } else {
        await firestore.collection("menus").add({
            nama,
            harga,
            kategori,
            gambar: gambarUrl,
            stok: true,
            bestSeller: false,
            createdAt: Date.now()
        });
    }

    formBox.classList.remove("active");
    loadMenu();
});

// ================= LOAD MENU =================
function loadMenu() {

    firestore.collection("menus").onSnapshot(snapshot => {

        menuList.innerHTML = "";

        snapshot.forEach(doc => {

            const m = doc.data();

            if (kategoriFilter !== "Semua" && m.kategori !== kategoriFilter) return;

            const img = m.gambar || "https://via.placeholder.com/200";

            menuList.innerHTML += `
            <div class="menu-card">

                <img src="${img}" class="menu-img">

                <h3>${m.nama} ${m.bestSeller ? "🔥" : ""}</h3>

                <p>Rp ${Number(m.harga).toLocaleString()}</p>
                <p>${m.kategori}</p>
                <p>${m.stok === false ? "Habis" : "Tersedia"}</p>

                <div>

                    <button class="btn-edit" onclick="editMenu('${doc.id}')">Edit</button>

                    <button class="btn-delete" onclick="hapusMenu('${doc.id}')">Hapus</button>

                    <button class="btn-stok" onclick="toggleStok('${doc.id}', ${m.stok !== false})">
                        Stok
                    </button>

                    <button class="btn-best" onclick="toggleBest('${doc.id}', ${m.bestSeller})">
                        Best
                    </button>

                </div>

            </div>
            `;
        });
    });
}

// ================= EDIT =================
window.editMenu = async (id) => {

    const doc = await firestore.collection("menus").doc(id).get();
    const d = doc.data();

    document.getElementById("editNama").value = d.nama;
    document.getElementById("editHarga").value = d.harga;
    document.getElementById("editKategori").value = d.kategori;
    document.getElementById("previewEdit").src =
    d.gambar || "https://via.placeholder.com/300";
    editId = id;

    editModal.style.display = "flex";
};

// ================= ACTION =================
window.toggleStok = async (id, val) => {
    await firestore.collection("menus").doc(id).update({ stok: !val });
};

window.toggleBest = async (id, val) => {
    await firestore.collection("menus").doc(id).update({ bestSeller: !val });
};

window.hapusMenu = async (id) => {
    if (!confirm("Hapus?")) return;
    await firestore.collection("menus").doc(id).delete();
};

// INIT
loadMenu();
window.closeModal = () => {
    editModal.style.display = "none";
    editId = null;
};

btnUpdate.addEventListener("click", async () => {

    if(!editId) return;

    const nama = document.getElementById("editNama").value;
    const harga = Number(document.getElementById("editHarga").value);
    const kategori = document.getElementById("editKategori").value;
    const file = document.getElementById("editGambar").files[0];

    let gambarUrl = "";

    if(file){

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
            {
                method:"POST",
                body:formData
            }
        );

        const data = await res.json();

        if(data.success){
            gambarUrl = data.data.display_url;
        }
    }

    await firestore.collection("menus").doc(editId).update({
        nama,
        harga,
        kategori,
        ...(gambarUrl && { gambar:gambarUrl })
    });

    editModal.style.display = "none";
    editId = null;
});

editModal.addEventListener("click", (e) => {
    if(e.target === editModal){
        closeModal();
    }
});

document.getElementById("editGambar")
.addEventListener("change", function(){

    const file = this.files[0];

    if(file){
        document.getElementById("previewEdit").src =
            URL.createObjectURL(file);
    }
});