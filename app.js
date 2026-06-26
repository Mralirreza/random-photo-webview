// ===========================================
// Random Photo Viewer v2.0
// app.js
// ===========================================

import {

    db,

    commentsCollection,

    loginAnonymous

} from "./firebase.js";

import {

    addDoc,

    query,

    where,

    orderBy,

    onSnapshot,

    serverTimestamp,

    deleteDoc,

    doc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===========================================
// Variables
// ===========================================

let photos = [];

let currentIndex = 0;

let unsubscribe = null;

let sendingComment = false;

const ADMIN_PASSWORD = "123456";


// ===========================================
// DOM
// ===========================================

const photoElement = document.getElementById("photo");

const dateElement = document.getElementById("photoDate");

const commentsElement = document.getElementById("comments");

const commentInput = document.getElementById("commentInput");

const sendButton = document.getElementById("sendComment");

const nextButton = document.getElementById("nextButton");

const previousButton = document.getElementById("previousButton");

const adminButton = document.getElementById("adminLogin");


// ===========================================
// User
// ===========================================

function getUserName() {

    let name = localStorage.getItem("userName");

    while (!name || name.trim() === "") {

        name = prompt("لطفاً نام خود را وارد کنید:");

        if (name === null) {

            continue;

        }

        name = name.trim();

    }

    localStorage.setItem("userName", name);

    return name;

}


// ===========================================
// Photo Helpers
// ===========================================

function getPhotoKey() {

    if (!photos.length) {

        return "";

    }

    return photos[currentIndex].image;

}


// ===========================================
// Load Photos
// ===========================================

async function loadPhotos() {

    try {

        const response = await fetch("photos.json");

        if (!response.ok) {

            throw new Error("photos.json پیدا نشد.");

        }

        photos = await response.json();

        if (!Array.isArray(photos) || photos.length === 0) {

            throw new Error("لیست عکس‌ها خالی است.");

        }

        currentIndex = 0;

        displayPhoto();

    }

    catch (error) {

        console.error(error);

        alert("بارگذاری تصاویر انجام نشد.");

    }

}


// ===========================================
// Display Photo
// ===========================================

function displayPhoto() {

    const photo = photos[currentIndex];

    photoElement.src = photo.image;

    photoElement.alt = "Photo";

    dateElement.innerHTML = "🗓️ " + photo.date;

    loadComments();

}


// ===========================================
// Navigation
// ===========================================

function nextPhoto() {

    if (currentIndex >= photos.length - 1) {

        return;

    }

    currentIndex++;

    displayPhoto();

}

function previousPhoto() {

    if (currentIndex <= 0) {

        return;

    }

    currentIndex--;

    displayPhoto();

}


// ===========================================
// Events
// ===========================================

nextButton.addEventListener(

    "click",

    nextPhoto

);

previousButton.addEventListener(

    "click",

    previousPhoto

);
// ===========================================
// Comments
// ===========================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "";

    }

    const date = timestamp.toDate();

    return date.toLocaleString("fa-IR");

}


// ===========================================
// Create Comment HTML
// ===========================================

function createCommentHTML(id, comment) {

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    return `

    <div class="comment">

        <div class="comment-name">

            👤 ${comment.name || "کاربر"}

        </div>

        <div class="comment-text">

            ${comment.text}

        </div>

        <div class="comment-date">

            🕒 ${formatDate(comment.createdAt)}

        </div>

        ${

            isAdmin

            ?

            `<button
                class="comment-delete"
                data-id="${id}">
                حذف
            </button>`

            :

            ""

        }

    </div>

    `;

}


// ===========================================
// Load Comments
// ===========================================

function loadComments() {

    if (unsubscribe) {

        unsubscribe();

    }

    commentsElement.innerHTML =

        '<div class="loading">در حال بارگذاری...</div>';

    const q = query(

        commentsCollection,

        where("photo", "==", getPhotoKey()),

        orderBy("createdAt", "desc")

    );

    unsubscribe = onSnapshot(

        q,

        (snapshot) => {

            if (snapshot.empty) {

                commentsElement.innerHTML =

                    '<div class="empty">هنوز کامنتی ثبت نشده است.</div>';

                return;

            }

            let html = "";

            snapshot.forEach((docSnap) => {

                html += createCommentHTML(

                    docSnap.id,

                    docSnap.data()

                );

            });

            commentsElement.innerHTML = html;

            document

                .querySelectorAll(".comment-delete")

                .forEach((button) => {

                    button.addEventListener(

                        "click",

                        () => {

                            deleteComment(

                                button.dataset.id

                            );

                        }

                    );

                });

        },

        (error) => {

            console.error(error);

            commentsElement.innerHTML =

                '<div class="empty">خطا در دریافت کامنت‌ها.</div>';

        }

    );

}


// ===========================================
// Save Comment
// ===========================================

async function saveComment() {

    if (sendingComment) {

        return;

    }

    const text = commentInput.value.trim();

    if (!text) {

        alert("کامنت را وارد کنید.");

        return;

    }

    sendingComment = true;

    sendButton.disabled = true;

    try {

        await addDoc(

            commentsCollection,

            {

                photo: getPhotoKey(),

                name: getUserName(),

                text: text,

                createdAt: serverTimestamp()

            }

        );

        commentInput.value = "";

    }

    catch (error) {

        console.error(error);

        alert("ثبت کامنت انجام نشد.");

    }

    sendingComment = false;

    sendButton.disabled = false;

}


// ===========================================
// Event
// ===========================================

sendButton.addEventListener(

    "click",

    saveComment

);
// ===========================================
// Admin
// ===========================================

function adminLogin() {

    const password = prompt("رمز مدیر را وارد کنید:");

    if (password === null) {

        return;

    }

    if (password === ADMIN_PASSWORD) {

        localStorage.setItem("isAdmin", "true");

        alert("ورود مدیر موفق بود.");

        loadComments();

    }

    else {

        alert("رمز اشتباه است.");

    }

}


// ===========================================
// Admin Logout
// ===========================================

function adminLogout() {

    localStorage.removeItem("isAdmin");

    alert("از حساب مدیر خارج شدید.");

    loadComments();

}


// ===========================================
// Delete Comment
// ===========================================

async function deleteComment(id) {

    const isAdmin =

        localStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {

        alert("دسترسی غیرمجاز.");

        return;

    }

    const ok = confirm(

        "آیا از حذف این کامنت مطمئن هستید؟"

    );

    if (!ok) {

        return;

    }

    try {

        await deleteDoc(

            doc(db, "comments", id)

        );

    }

    catch (error) {

        console.error(error);

        alert("حذف کامنت انجام نشد.");

    }

}


// ===========================================
// Keyboard Shortcut
// Ctrl + Shift + A
// ===========================================

document.addEventListener(

    "keydown",

    (event) => {

        if (

            event.ctrlKey &&

            event.shiftKey &&

            event.key.toLowerCase() === "a"

        ) {

            adminLogin();

        }

    }

);


// ===========================================
// Admin Button
// ===========================================

adminButton.addEventListener(

    "click",

    adminLogin

);


// ===========================================
// Start Application
// ===========================================

function showStatus(message, type = "info") {

    let status = document.getElementById("statusMessage");

    if (!status) {

        status = document.createElement("div");

        status.id = "statusMessage";

        status.style.position = "fixed";
        status.style.bottom = "20px";
        status.style.left = "50%";
        status.style.transform = "translateX(-50%)";
        status.style.padding = "12px 20px";
        status.style.borderRadius = "10px";
        status.style.color = "#fff";
        status.style.zIndex = "9999";
        status.style.fontFamily = "inherit";

        document.body.appendChild(status);

    }

    switch (type) {

        case "success":

            status.style.background = "#4CAF50";

            break;

        case "error":

            status.style.background = "#E53935";

            break;

        default:

            status.style.background = "#333";

    }

    status.innerHTML = message;

    status.style.display = "block";

    setTimeout(() => {

        status.style.display = "none";

    }, 2500);

}


// ===========================================
// Network
// ===========================================

window.addEventListener(

    "online",

    () => {

        showStatus(

            "اتصال اینترنت برقرار شد.",

            "success"

        );

    }

);

window.addEventListener(

    "offline",

    () => {

        showStatus(

            "اتصال اینترنت قطع شد.",

            "error"

        );

    }

);


// ===========================================
// Preload Next Image
// ===========================================

function preloadNextImage() {

    if (currentIndex >= photos.length - 1) {

        return;

    }

    const img = new Image();

    img.src = photos[currentIndex + 1].image;

}


// ===========================================
// Improve Display Photo
// ===========================================

const oldDisplayPhoto = displayPhoto;

displayPhoto = function () {

    oldDisplayPhoto();

    preloadNextImage();

};


// ===========================================
// Auto Resize Comment Box
// ===========================================

commentInput.addEventListener(

    "input",

    function () {

        this.style.height = "auto";

        this.style.height =

            this.scrollHeight + "px";

    }

);


// ===========================================
// Enter Key
// ===========================================

commentInput.addEventListener(

    "keydown",

    function (event) {

        if (

            event.key === "Enter" &&

            !event.shiftKey

        ) {

            event.preventDefault();

            saveComment();

        }

    }

);


// ===========================================
// Init
// ===========================================

async function init() {

    showStatus(

        "در حال اتصال به Firebase..."

    );

    const ok = await loginAnonymous();

    if (!ok) {

        commentsElement.innerHTML =

            "<div class='empty'>اتصال به Firebase برقرار نشد.</div>";

        showStatus(

            "خطا در اتصال",

            "error"

        );

        return;

    }

    getUserName();

    await loadPhotos();

    showStatus(

        "آماده استفاده",

        "success"

    );

}


// ===========================================
// Start
// ===========================================

init();
