// ===============================
// Random Photo Viewer v2.0
// ===============================

import{

commentsCollection,

loginAnonymous

}

from "./firebase.js";


let photos=[];

let currentIndex=0;

let unsubscribe=null;


// ===============================
// User Name
// ===============================

function getUserName(){

    let name=localStorage.getItem("userName");

    while(!name || name.trim()===""){

        name=prompt("نام خود را وارد کنید");

        if(name===null){

            continue;

        }

        name=name.trim();

    }

    localStorage.setItem("userName",name);

    return name;

}


// ===============================
// Load Photos
// ===============================

async function loadPhotos(){

    try{

        const response=await fetch("photos.json");

        photos=await response.json();

        displayPhoto();

    }

    catch(error){

        console.error(error);

        alert("خطا در بارگذاری عکس‌ها");

    }

}


// ===============================
// Display Photo
// ===============================

function displayPhoto(){

    const photo=photos[currentIndex];

    document.getElementById("photo").src=photo.image;

    document.getElementById("photoDate").innerHTML=

    "🗓️ "+photo.date;

    loadComments();

}


// ===============================
// Next
// ===============================

function showNextPhoto(){

    if(currentIndex<photos.length-1){

        currentIndex++;

        displayPhoto();

    }

}


// ===============================
// Previous
// ===============================

function showPreviousPhoto(){

    if(currentIndex>0){

        currentIndex--;

        displayPhoto();

    }

}


// ===============================
// Comments
// ===============================

function loadComments(){

    console.log("Loading comments...");

    // در مرحله بعد کامل می‌شود

}


// ===============================
// Save Comment
// ===============================

async function saveComment(){

    console.log("Saving Comment...");

    // در مرحله بعد کامل می‌شود

}


// ===============================
// Events
// ===============================

document
.getElementById("nextButton")
.onclick=showNextPhoto;

document
.getElementById("previousButton")
.onclick=showPreviousPhoto;

document
.getElementById("sendComment")
.onclick=saveComment;


// ===============================
// Start
// ===============================

(async()=>{

    await loginAnonymous();

    getUserName();

    loadPhotos();

})();
