// ===============================
// Firebase Configuration
// Random Photo Viewer v2.0
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// Firebase Config
// ===============================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};


// ===============================
// Initialize
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// Anonymous Login
// ===============================

async function loginAnonymous(){

    try{

        await signInAnonymously(auth);

        console.log("Firebase Connected");

        return true;

    }

    catch(error){

        console.error(error);

        return false;

    }

}


// ===============================
// Collections
// ===============================

const commentsCollection = collection(db,"comments");


// ===============================
// Export
// ===============================

export{

    db,

    auth,

    commentsCollection,

    loginAnonymous

};
