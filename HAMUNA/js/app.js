const menuList = document.getElementById("menuList");


let cart = [];
// =====================
// LOAD MENU REALTIME
// =====================
firestore.collection("menus")
.onSnapshot((snap) => {

    menuList.innerHTML = "";

    snap.forEach((doc) => {

        const m = doc.data();

        menuList.innerHTML += `
        <div class="card">
            <h3>${m.nama}</h3>
            <p>Rp ${m.harga}</p>

            <button onclick="addCart('${m.nama}', ${m.harga})">
                + Keranjang
            </button>
        </div>
        `;
    });

});

// =====================
// ADD CART (REAL)
// =====================
function addCart(nama, harga){

    let item = cart.find(i => i.nama === nama);

    if(item){
        item.qty += 1;
    }else{
        cart.push({ nama, harga, qty: 1 });
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
        cart.splice(index, 1);
    }

    renderCart();
}
function removeItem(index){
    cart.splice(index, 1);
    renderCart();
}

// =====================
// RENDER CART
// =====================
function renderCart(){

    const checkoutBox = document.querySelector(".checkout");

    let total = 0;

    let html = cart.map((item, index) => {

        total += item.harga * item.qty;

        return `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:6px;
            margin:6px 0;
            background:#f3f3f3;
            border-radius:8px;
        ">

            <div>
                <b>${item.nama}</b><br>
                Rp ${item.harga * item.qty}
            </div>

            <div style="display:flex;align-items:center;gap:5px;">

                <button onclick="minus(${index})">-</button>

                <span>${item.qty}</span>

                <button onclick="plus(${index})">+</button>

                <button onclick="removeItem(${index})">❌</button>

            </div>

        </div>
        `;
    }).join("");
checkoutBox.innerHTML = `
        <input type="text" id="customerName" placeholder="Nama Kamu">
        <input type="text" id="tableNumber" placeholder="Nomor Meja">

        <div style="margin:10px 0;font-weight:bold;">
            Total: Rp ${total}
        </div>

        ${html}

        <button onclick="checkout(${total})">
            Kirim Pesanan
        </button>
    `;
}


// =====================
// CHECKOUT
// =====================
function checkout(total){

    const nama = document.getElementById("customerName").value.trim();
    const meja = document.getElementById("tableNumber").value.trim();

    if(cart.length === 0){
        alert("Keranjang kosong");
        return;
    }

    if(!nama || !meja){
        alert("Isi nama & meja!");
        return;
    }

    const nomorOrder = "ORD-" + Date.now();

    db.ref("orders").push({
        nomorOrder,
        nama,
        meja,
        items: cart,
        total,
        status: "pending",
        waktu: Date.now()
    })
    .then(() => {

        alert("Pesanan berhasil dikirim!");

        cart = [];
        renderCart();

        document.getElementById("customerName").value = "";
        document.getElementById("tableNumber").value = "";

    })
    .catch((error) => {

        console.error(error);

        alert("Gagal mengirim pesanan");

    });

}