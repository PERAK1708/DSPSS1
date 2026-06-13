const settingsRef = firebase.firestore()
    .collection("chatdansosmed")
    .doc("HAMUNA");

settingsRef.onSnapshot((doc) => {

    if (!doc.exists) return;

    const data = doc.data();

    // Hapus @ di depan jika ada
    const username = (value) => {
        return (value || "").trim().replace(/^@/, "");
    };

    const setLink = (id, visible, href) => {

        const el = document.getElementById(id);
        if (!el) return;

        const hasValue =
            href &&
            href !== "#" &&
            href !== "https://wa.me/" &&
            href !== "https://t.me/" &&
            href !== "https://instagram.com/" &&
            href !== "https://facebook.com/" &&
            href !== "https://www.tiktok.com/@" &&
            href !== "tel:" &&
            href !== "mailto:";

        if (visible && hasValue) {
            el.href = href;
            el.style.display = "inline-flex";
        } else {
            el.style.display = "none";
        }
    };

    // WhatsApp
    setLink(
        "waLink",
        data.whatsapp_visible ?? true,
        `https://wa.me/${data.whatsapp || ""}`
    );

    // Telepon
    setLink(
        "telLink",
        data.telepon_visible ?? true,
        `tel:${data.telepon || ""}`
    );

    // Telegram
    setLink(
        "telegramLink",
        data.telegram_visible ?? true,
        `https://t.me/${username(data.telegram)}`
    );

    // Instagram
    setLink(
        "igLink",
        data.instagram_visible ?? true,
        `https://instagram.com/${username(data.instagram)}`
    );

    // Facebook
    setLink(
        "fbLink",
        data.facebook_visible ?? true,
        `https://facebook.com/${username(data.facebook)}`
    );

    // TikTok
    setLink(
        "ttLink",
        data.tiktok_visible ?? true,
        `https://www.tiktok.com/@${username(data.tiktok)}`
    );

    // Email
    setLink(
        "mailLink",
        data.email_visible ?? true,
        `mailto:${data.email || ""}`
    );

});