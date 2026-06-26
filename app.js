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
