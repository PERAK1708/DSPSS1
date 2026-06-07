const settingsRef =
    firebase.firestore()
    .collection("chatdansosmed")
    .doc("HAMUNA");

// global settings
window.appSettings = {};

settingsRef.onSnapshot((doc) => {

    if (!doc.exists) return;

    const data = doc.data();

    const waLink = document.getElementById("waLink");
    const telLink = document.getElementById("telLink");
    const telegramLink = document.getElementById("telegramLink");

    // WhatsApp
    if(data.whatsapp){
        waLink.href = `https://wa.me/${data.whatsapp}`;
        waLink.textContent = "📱 WhatsApp";
    }

    // Telepon
    if(data.telepon){
        telLink.href = `tel:${data.telepon}`;
        telLink.textContent = "☎️ Telepon";
    }

    // Telegram
    if(data.telegram){
        telegramLink.href = `https://t.me/${data.telegram}`;
        telegramLink.textContent = "✈️ Telegram";
    }
});
