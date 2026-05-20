let total = 0;

function tambahData(){

    const nama = document.getElementById('nama').value;

    const jumlah = parseInt(
        document.getElementById('jumlah').value
    );

    if(nama == '' || isNaN(jumlah)){
        alert('Isi data dulu');
        return;
    }

    const tbody = document.getElementById('tbody');

    tbody.innerHTML += `
        <tr>
            <td>${nama}</td>
            <td>Rp ${jumlah.toLocaleString()}</td>
        </tr>
    `;

    total += jumlah;

    document.getElementById('total').innerHTML =
        total.toLocaleString();

}
