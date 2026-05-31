const ordersList = document.getElementById("ordersList");

// format rupiah
function formatRupiah(angka){
    return Number(angka || 0).toLocaleString('id-ID');
}

// realtime listener
db.ref("orders").on("value", (snapshot) => {

    ordersList.innerHTML = "";

    const data = snapshot.val();

    if(!data){
        ordersList.innerHTML = `<p>Belum ada pesanan</p>`;
        return;
    }

    Object.entries(data).forEach(([id, order], index) => {

        let itemsHTML = "";

        (order.items || []).forEach((item, indexItem) => {

            itemsHTML += `
            <div class="item-row">

                <!-- MENU -->
                <div class="item-left">
                    <span>${item.nama}</span>
                    <small>Rp ${formatRupiah(item.harga)}</small>
                </div>

                <!-- QTY CONTROL -->
                <div class="qty-control">
                    <button class="qty-btn"
                        onclick="ubahQty('${id}', ${indexItem}, -1)">
                        −
                    </button>

                    <span class="qty-number">
                        ${item.qty}
                    </span>

                    <button class="qty-btn"
                        onclick="ubahQty('${id}', ${indexItem}, 1)">
                        +
                    </button>
                </div>

                <!-- SUBTOTAL -->
                <div class="item-right">
                    <b>Rp ${formatRupiah(item.harga * item.qty)}</b>
                </div>

            </div>
            `;
        });

        ordersList.innerHTML += `
        <div class="order-card ${index % 2 === 0 ? 'card-a' : 'card-b'}">

            <!-- MENU -->
            <div class="menu-section">
                <div class="items-box">
                    ${itemsHTML}
                </div>
            </div>

            <!-- INFO -->
            <div class="info-section">

                <div class="order-id">
                    #${order.nomorOrder || id}
                </div>

                <div class="info-row">
                    👤 ${order.nama}
                </div>

                <div class="info-row">
                    🪑 Meja ${order.meja}
                </div>

                <div class="info-row total">
                    💰 Rp ${formatRupiah(order.total)}
                </div>

                <div class="status ${order.status}">
                    ${order.status}
                </div>

                <div class="action">

                    <button class="btn-proses"
                        onclick="ubahStatus('${id}','proses')">
                        Proses
                    </button>

                    <button class="btn-selesai"
                        onclick="ubahStatus('${id}','selesai')">
                        Selesai
                    </button>

                    <button class="btn-hapus"
                        onclick="hapusOrder('${id}')">
                        Hapus
                    </button>

                </div>

            </div>

        </div>
        `;
    });
});


// ================= STATUS =================
function ubahStatus(id, status){
    db.ref("orders/" + id).update({ status });
}


// ================= HAPUS =================
function hapusOrder(id){
    if(confirm("Hapus pesanan ini?")){
        db.ref("orders/" + id).remove();
    }
}


// ================= QTY CONTROL =================
function ubahQty(orderId, itemIndex, perubahan){

    db.ref("orders/" + orderId).once("value")
    .then(snapshot => {

        const order = snapshot.val();

        if(!order || !order.items) return;

        let qtyBaru = order.items[itemIndex].qty + perubahan;

        if(qtyBaru < 1) return;

        order.items[itemIndex].qty = qtyBaru;

        // hitung ulang total
        let totalBaru = 0;

        order.items.forEach(item => {
            totalBaru += item.harga * item.qty;
        });

        db.ref("orders/" + orderId).update({
            items: order.items,
            total: totalBaru
        });

    });
}