
// ================= CLOCK =================
function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString('id-ID');

    const date = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const clock = document.getElementById('clock');
    if (clock) {
        clock.innerHTML = date + ' | ' + time;
    }
}

setInterval(updateClock, 1000);
updateClock();


// ================= ELEMENT SAFE =================
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');
const toggleBtn = document.getElementById('toggleBtn');
const pinBtn = document.getElementById('pinBtn');


// ================= SIDEBAR TOGGLE =================
if (toggleBtn && sidebar && main) {
    toggleBtn.onclick = function () {
        sidebar.classList.toggle('hide');
        main.classList.toggle('full');
    };
}


// ================= AUTO HIDE =================
let pinned = false;

if (sidebar && main) {

    sidebar.addEventListener('mouseleave', () => {
        if (!pinned) {
            sidebar.classList.add('hide');
            main.classList.add('full');
        }
    });

    sidebar.addEventListener('mouseenter', () => {
        sidebar.classList.remove('hide');
        main.classList.remove('full');
    });

}


// ================= PIN MENU =================
if (pinBtn) {
    pinBtn.onclick = function () {
        pinned = !pinned;

        pinBtn.style.color = pinned ? "#38bdf8" : "white";
    };
}


// ================= LOAD PAGE =================
function loadPage(page) {
    const frame = document.getElementById('contentFrame');

    if (frame) {
        frame.src = page;
        localStorage.setItem("lastPage", page);
    }
}


// ================= LAST PAGE =================
window.addEventListener("DOMContentLoaded", () => {

    const frame = document.getElementById('contentFrame');

    const lastPage = localStorage.getItem("lastPage") || "pages/Home.html";

    if (frame) {
        frame.src = lastPage;
    }
});


// ================= FIREBASE AUTH PROTECT =================
firebase.auth().onAuthStateChanged((user) => {

    const el = document.getElementById("loginUser");

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    if (el) {
        el.innerText = user.email;
    }

});


// ================= LOGOUT =================
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.replace("index.html");
    });
}

auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

function logout(){
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
}