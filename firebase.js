// ======================================
// Firebase
// Random Photo Viewer v2.0
// ======================================

import {

initializeApp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getAuth,

signInAnonymously

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

getFirestore,

collection,

addDoc,

query,

where,

orderBy,

onSnapshot,

serverTimestamp,

deleteDoc,

doc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================
// Firebase Config
// ======================================

const firebaseConfig={

apiKey:"YOUR_API_KEY",

authDomain:"YOUR_PROJECT.firebaseapp.com",

projectId:"YOUR_PROJECT",

storageBucket:"YOUR_PROJECT.appspot.com",

messagingSenderId:"YOUR_SENDER",

appId:"YOUR_APP_ID"

};


// ======================================

const app=initializeApp(firebaseConfig);

const auth=getAuth(app);

const db=getFirestore(app);


// ======================================

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


// ======================================

const commentsCollection=

collection(

db,

"comments"

);


// ======================================

export{

db,

auth,

commentsCollection,

loginAnonymous,

addDoc,

query,

where,

orderBy,

onSnapshot,

serverTimestamp,

deleteDoc,

doc

};
