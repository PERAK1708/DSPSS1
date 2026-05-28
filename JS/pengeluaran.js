let dataPengeluaran = [];

function tambahPengeluaran(){

    const nama =
    document.getElementById("nama").value;

    const jumlah =
    document.getElementById("jumlah").value;

    if(nama === "" || jumlah === ""){

        alert("Isi data dulu!");

        return;

    }

    const user = auth.currentUser;

    db.ref("pengeluaran").push({

        nama:nama,

        jumlah:jumlah,

        uid:user.uid,

        dibuatOleh:user.email,

        waktu:new Date().toLocaleString()

    });

    document.getElementById("nama").value = "";

    document.getElementById("jumlah").value = "";

}
function tampilkanData(){
    const tbody = document.getElementById("listPengeluaran");
    tbody.innerHTML = "";

    dataPengeluaran.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>Rp ${item.jumlah}</td>
                <td><button class="delete" onclick="hapus(${index})">Hapus</button></td>
            </tr>
        `;
    });
}

function hapus(index){
    dataPengeluaran.splice(index, 1);
    tampilkanData();
}
auth.onAuthStateChanged((user)=>{

    if(user){

        db.ref("pengeluaran")
        .on("value",(snapshot)=>{

            const tbody =
            document.getElementById("listPengeluaran");

            tbody.innerHTML = "";

            snapshot.forEach((child)=>{

                const data = child.val();

                const id = child.key;

                tbody.innerHTML += `
                    <tr>

                        <td>${data.nama}</td>

                        <td>Rp ${data.jumlah}</td>

                        <td>${data.dibuatOleh}</td>

                        <td>

                        <button class="delete"
                        onclick="hapus('${id}')">

                        Hapus

                        </button>

                        </td>

                    </tr>
                `;

            });

        });

    }else{

        window.top.location.href="../index.html";

    }

});

auth.onAuthStateChanged((user)=>{

    if(user){

        const uid = user.uid;

        db.ref("pengeluaran/" + uid)
        .on("value",(snapshot)=>{

            const tbody =
            document.getElementById("listPengeluaran");

            tbody.innerHTML = "";

            snapshot.forEach((child)=>{

                const data = child.val();

                const id = child.key;

                tbody.innerHTML += `
                    <tr>
                        <td>${data.nama}</td>
                        <td>Rp ${data.jumlah}</td>
                        <td>
                        <button class="delete"
                        onclick="hapus('${id}')">
                        Hapus
                        </button>
                        </td>
                    </tr>
                `;

            });

        });

    }else{

        window.top.location.href="../index.html";

    }

});
function hapus(id){

    db.ref("pengeluaran/" + id).remove();

}