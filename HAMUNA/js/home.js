document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("totalOrders").textContent = "125";
    document.getElementById("income").textContent = "Rp3.500.000";
    document.getElementById("menuCount").textContent = "48";
    document.getElementById("waitingOrder").textContent = "12";

    const latestOrders = document.getElementById("latestOrders");

    const orders = [
        {
            meja:"A01",
            detail:"2x Nasi Goreng • 1x Es Teh",
            status:"pending"
        },
        {
            meja:"A03",
            detail:"1x Ayam Geprek • 2x Jus Alpukat",
            status:"process"
        },
        {
            meja:"B02",
            detail:"3x Mie Goreng",
            status:"done"
        }
    ];

    orders.forEach((order,index)=>{

        latestOrders.innerHTML += `
        <div class="order">

            <div class="order-info">
                <h4>#00${index+1} - Meja ${order.meja}</h4>
                <p>${order.detail}</p>
            </div>

            <div class="status ${order.status}">
                ${
                    order.status==="pending" ? "Menunggu" :
                    order.status==="process" ? "Diproses" :
                    "Selesai"
                }
            </div>

        </div>
        `;
    });

});