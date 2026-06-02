const menuList = document.getElementById("menuList");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");

let allMenus = [];
let kategoriAktif = "Semua";
let cart = [];
let currentOrderId = null;
let currentOrderData = null;
// ================= MENU REALTIME =================
firestore.collection("menus")
.onSnapshot((snap)=>{

    allMenus = [];

    snap.forEach((doc)=>{
        allMenus.push({
            id: doc.id,
            ...doc.data()
        });
    });

    renderMenu();
});

// ================= RENDER MENU =================
function renderMenu(){

    const keyword = document
        .getElementById("searchMenu")
        .value
        .toLowerCase();

    menuList.innerHTML = "";

    allMenus.forEach((m)=>{


        if(kategoriAktif !== "Semua" && m.kategori !== kategoriAktif){
            return;
        }

        if(!m.nama.toLowerCase().includes(keyword)){
            return;
        }

menuList.innerHTML += `
<div class="card ${m.stok === false ? 'out-stock' : ''}">

    <div class="img-box">

        <img src="${m.gambar || 'https://via.placeholder.com/300'}" class="menu-img">

        ${m.bestSeller ? `<span class="best-badge">🔥 Best Seller</span>` : ""}

        ${m.stok === false ? `<span class="stock-badge">STOK HABIS</span>` : ""}

    </div>

    <div class="card-body">

        <h3>${m.nama}</h3>

        <div class="kategori">${m.kategori}</div>

        <div class="harga">
            Rp ${Number(m.harga).toLocaleString("id-ID")}
        </div>

        <button class="btn-cart"
            onclick="addCart('${m.nama}', ${m.harga})"
            ${m.stok === false ? "disabled" : ""}>
            ${m.stok === false ? "Stok Habis" : "+ Tambah Keranjang"}
        </button>

    </div>

</div>
`;
    });
}

// ================= CART =================
function addCart(nama, harga){

    let item = cart.find(i => i.nama === nama);

    if(item){
        item.qty++;
    }else{
        cart.push({ nama, harga, qty:1 });
    }

    renderCart();
}

function plus(index){
    cart[index].qty++;
    renderCart();
}

function minus(index){
    cart[index].qty--;

    if(cart[index].qty <= 0){
        cart.splice(index,1);
    }

    renderCart();
}

// ================= RENDER CART =================
function renderCart(){

    let total = 0;
    let totalItem = 0;

    cartItems.innerHTML = "";

    cart.forEach((item,index)=>{

        total += item.harga * item.qty;
        totalItem += item.qty;

        cartItems.innerHTML += `
        <div class="cart-item">

            <div>
                <b>${item.nama}</b><br>
                Rp ${(item.harga * item.qty).toLocaleString('id-ID')}
            </div>

            <div class="qty-box">

                <button onclick="minus(${index})">-</button>
                <span>${item.qty}</span>
                <button onclick="plus(${index})">+</button>

            </div>

        </div>
        `;
    });

    cartSummary.innerHTML = `
        <hr>

        <div class="summary-row">
            <span>Total Item</span>
            <b>${totalItem}</b>
        </div>

        <div class="summary-row">
            <span>Total Bayar</span>
            <b>Rp ${total.toLocaleString('id-ID')}</b>
        </div>
    `;
}

// ================= CHECKOUT =================
function checkout(){

    const nama = document.getElementById("customerName").value.trim();
    const meja = document.getElementById("tableNumber").value.trim();

    if(cart.length === 0){
        alert("Keranjang kosong");
        return;
    }

    if(!nama || !meja){
        alert("Isi nama & meja");
        return;
    }

    let total = 0;
    cart.forEach(i => total += i.harga * i.qty);

    currentOrderId = "ORD-" + Date.now();

    currentOrderData = {
        nomorOrder: currentOrderId,
        nama,
        meja,
       items: cart.map(item => ({
    nama:item.nama,
    harga:item.harga,
    qty:item.qty
})),
        
        total,
        status: "draft",
        waktu: Date.now()
    };

    // SIMPAN KE FIREBASE (DRAFT)
        db.ref("draftOrders")
        .child(currentOrderId)
        .set(currentOrderData);

    showModal(currentOrderData);
}

// ================= FILTER =================
document.querySelectorAll(".category button")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".category button")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        kategoriAktif = btn.dataset.kategori;

        renderMenu();

    });

});

// ================= SEARCH =================
document.getElementById("searchMenu")
.addEventListener("input", renderMenu);

// INIT
renderCart();

// ================= MODAL LOGIC=================
function showModal(order){

    currentOrderData = order;

    document.getElementById("orderModal").classList.remove("hidden");

    document.getElementById("modalOrderId").innerText = order.nomorOrder;
    document.getElementById("modalNama").innerText = order.nama;
    document.getElementById("modalMeja").innerText = order.meja;
    document.getElementById("modalTotal").innerText = order.total.toLocaleString("id-ID");

    let html = "";
    order.items.forEach(i=>{
        html += `<p>${i.nama} x${i.qty}</p>`;
    });

    document.getElementById("modalItems").innerHTML = html;
}
function closeModal(){

    // HAPUS DATA DI FIREBASE
    if(currentOrderId){
        db.ref("draftOrders")
        .child(currentOrderId)
        .remove();
    }

    // TUTUP MODAL
    document.getElementById("orderModal").classList.add("hidden");

    // KEMBALI KE MENU (TIDAK HAPUS CART)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // RESET ORDER STATE
    currentOrderId = null;
    currentOrderData = null;
}
function saveOrder(){

    if(!currentOrderId) return;

    currentOrderData.status = "pending";

    // simpan ke orders
    db.ref("orders")
    .child(currentOrderId)
    .set(currentOrderData)
    .then(()=>{

        // hapus draft
        return db.ref("draftOrders")
        .child(currentOrderId)
        .remove();

    })
    .then(()=>{

        alert(
            "Pesanan berhasil dikonfirmasi.\n\nSimpan ID pesanan untuk cek status."
        );

        cart = [];
        renderCart();

        document.getElementById("customerName").value = "";
        document.getElementById("tableNumber").value = "";

        document.getElementById("orderModal")
        .classList.add("hidden");

        currentOrderId = null;
        currentOrderData = null;

    })
.catch((err)=>{

    console.error("ERROR:", err);

    alert(err.message);

});
}
function copyOrderId(){

    const id = document.getElementById("modalOrderId").innerText;

    navigator.clipboard.writeText(id);

    alert("ID berhasil disalin!");
}