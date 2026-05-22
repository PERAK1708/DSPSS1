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

    const uid = user.uid;

    // ambil nama dari firestore
    firestore.collection("users")
    .doc(uid)
    .get()
    .then((doc)=>{

        const userData = doc.data();

        db.ref("pengeluaran").push({

            nama:nama,

            jumlah:jumlah,

            uid:uid,

            dibuatOleh:userData.username, // 👈 INI FIX

            waktu:new Date().toLocaleString()

        });

    });

    document.getElementById("nama").value = "";

    document.getElementById("jumlah").value = "";

}


// tampilkan data semua user
auth.onAuthStateChanged((user)=>{

    if(!user){

        window.top.location.href="../index.html";

        return;

    }

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

});


function hapus(id){

    db.ref("pengeluaran/" + id).remove();

}
