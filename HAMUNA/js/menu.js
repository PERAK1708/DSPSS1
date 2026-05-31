const btnTambah = document.getElementById("btnTambah");
const formBox = document.getElementById("formBox");
const btnSimpan = document.getElementById("btnSimpan");
const menuList = document.getElementById("menuList");

let editId = null;

// BUKA/TUTUP FORM
btnTambah.addEventListener("click", () => {
    formBox.classList.toggle("active");
});

// SIMPAN MENU
btnSimpan.addEventListener("click", async () => {

    const nama = document.getElementById("namaMenu").value.trim();
    const harga = Number(document.getElementById("hargaMenu").value);
    const kategori = document.getElementById("kategoriMenu").value;

    if (!nama || !harga) {
        alert("Lengkapi data menu");
        return;
    }

    try {

        if (editId) {

            await firestore
                .collection("menus")
                .doc(editId)
                .update({
                    nama,
                    harga,
                    kategori
                });

            editId = null;

        } else {

            await firestore
                .collection("menus")
                .add({
                    nama,
                    harga,
                    kategori,
                    aktif: true,
                    createdAt: Date.now()
                });

        }

        document.getElementById("namaMenu").value = "";
        document.getElementById("hargaMenu").value = "";

    } catch (err) {

        console.error(err);
        alert("Gagal menyimpan menu");

    }

});

// TAMPILKAN MENU REALTIME
firestore.collection("menus")
.onSnapshot((snapshot) => {

    menuList.innerHTML = "";

    snapshot.forEach((doc) => {

        const menu = doc.data();

        menuList.innerHTML += `
        <div class="menu-card">

            <h3>${menu.nama}</h3>

            <p>
                💰 Rp ${Number(menu.harga).toLocaleString('id-ID')}
            </p>

            <p>
                📂 ${menu.kategori}
            </p>

            <div class="action">

                <button
                    class="edit"
                    onclick="editMenu('${doc.id}')">
                    Edit
                </button>

                <button
                    class="hapus"
                    onclick="hapusMenu('${doc.id}')">
                    Hapus
                </button>

            </div>

        </div>
        `;
    });

});

// EDIT MENU
window.editMenu = async (id) => {

    const docRef = await firestore
        .collection("menus")
        .doc(id)
        .get();

    const data = docRef.data();

    document.getElementById("namaMenu").value = data.nama;
    document.getElementById("hargaMenu").value = data.harga;
    document.getElementById("kategoriMenu").value = data.kategori;

    editId = id;

    formBox.classList.add("active");
};

// HAPUS MENU
window.hapusMenu = async (id) => {

    const konfirmasi =
        confirm("Yakin ingin menghapus menu ini?");

    if (!konfirmasi) return;

    await firestore
        .collection("menus")
        .doc(id)
        .delete();
};