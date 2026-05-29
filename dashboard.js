/* ================= CLOCK ================= */

function updateClock(){

    const now = new Date();

    const time = now.toLocaleTimeString('id-ID');

    const date = now.toLocaleDateString('id-ID',{
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
    });

    document.getElementById('clock').innerHTML =
        date + ' | ' + time;
}

setInterval(updateClock,1000);

updateClock();

/* ================= SIDEBAR ================= */

const sidebar = document.getElementById('sidebar');

const main = document.getElementById('main');

const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.onclick = function(){

    sidebar.classList.toggle('hide');

    main.classList.toggle('full');

}

/* ================= AUTO HIDE ================= */

let pinned = false;

sidebar.addEventListener('mouseleave', ()=>{

    if(!pinned){

        sidebar.classList.add('hide');

        main.classList.add('full');

    }

});

sidebar.addEventListener('mouseenter', ()=>{

    sidebar.classList.remove('hide');

    main.classList.remove('full');

});

/* ================= PIN MENU ================= */

const pinBtn = document.getElementById('pinBtn');

pinBtn.onclick = function(){

    pinned = !pinned;

    if(pinned){

        pinBtn.style.color = "#38bdf8";

    }else{

        pinBtn.style.color = "white";

    }

}
/* ================= LOAD PAGE ================= */

function loadPage(page){

    // ganti iframe
    document.getElementById('contentFrame').src = page;

    // simpan halaman terakhir
    localStorage.setItem("lastPage", page);

}

// ================= LOAD LAST PAGE =================

window.addEventListener("DOMContentLoaded", () => {

    const lastPage =
    localStorage.getItem("lastPage")
    || "pages/Home.html";

    document.getElementById("contentFrame").src = lastPage;

});
// ================= PROTECT DASHBOARD =================
if (localStorage.getItem("login") !== "true") {
    window.location.href = "index.html";
}

function logout() {
    localStorage.clear(); // lebih bersih

    setTimeout(() => {
        window.location.href = "index.html";
    }, 100);
}
const loginName = localStorage.getItem("username");

if (loginName) {
    document.getElementById("loginUser").innerText = loginName;
} else {
    document.getElementById("loginUser").innerText = "Guest";
}
