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

                <div class="item-left">
                    <span>${item.nama}</span>
                    <small>Rp ${formatRupiah(item.harga)}</small>
                </div>

                <div class="qty-control">
                    <button onclick="ubahQty('${id}', ${indexItem}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="ubahQty('${id}', ${indexItem}, 1)">+</button>
                </div>

                <div class="item-right">
                    <b>Rp ${formatRupiah(item.harga * item.qty)}</b>
                </div>

            </div>
            `;
        });

        ordersList.innerHTML += `
        <div class="order-card ${index % 2 === 0 ? 'card-a' : 'card-b'}">

            <div class="menu-section">
                <div class="items-box">
                    ${itemsHTML}

                    ${order.status === "menunggu_verifikasi" ? `
                    <div style="margin-top:10px;">
                        <b>📷 Bukti Pembayaran:</b><br>
                        <a href="${order.buktiTransfer}" target="_blank">
                            <img src="${order.buktiTransfer}"
                                style="width:120px;border-radius:8px;margin-top:5px;">
                        </a>
                    </div>
                    ` : ""}
                </div>
            </div>

            <div class="info-section">

                <div class="order-id">
                    #${order.nomorOrder || id}
                </div>

                <div class="info-row">👤 ${order.nama}</div>

                <div class="info-row">🪑 Meja ${order.meja || "-"}</div>

                <div class="info-row total">
                    💰 Rp ${formatRupiah(order.total)}
                </div>

                    <div class="status ${order.status}">
                        ${
                            order.status === "diproses"
                            ? "Sedang Diproses"
                            : order.status === "menunggu_verifikasi"
                            ? "Menunggu Verifikasi"
                            : order.status
                        }
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

                    ${order.buktiTransfer ? `
                    <button class="btn-verify"
                        onclick="verifikasiBayar('${id}')">
                        ✔ Verifikasi
                    </button>
                    ` : ""}

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


// ================= FUNCTIONS (HARUS DI LUAR LOOP) =================

function ubahStatus(id, status){
    db.ref("orders/" + id).update({ status });
}

function hapusOrder(id){
    if(confirm("Hapus pesanan ini?")){
        db.ref("orders/" + id).remove();
    }
}

function ubahQty(orderId, itemIndex, perubahan){

    db.ref("orders/" + orderId).once("value")
    .then(snapshot => {

        const order = snapshot.val();

        if(!order || !order.items) return;

        let qtyBaru = order.items[itemIndex].qty + perubahan;

        if(qtyBaru <= 0){
            order.items.splice(itemIndex, 1);
        } else {
            order.items[itemIndex].qty = qtyBaru;
        }

        if(order.items.length === 0){
            db.ref("orders/" + orderId).remove();
            return;
        }

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

function verifikasiBayar(id){

    if(!confirm("Yakin pembayaran sudah valid?")) return;

    db.ref("orders/" + id).update({
        status: "diproses",
        verifiedAt: Date.now()
    });

    alert("Pembayaran dikonfirmasi → Pesanan sedang diproses");
}