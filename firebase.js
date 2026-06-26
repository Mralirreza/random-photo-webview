// ======================================
// Firebase
// Random Photo Viewer v2.0
// ======================================

import {

initializeApp
console.log(firebaseConfig);
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

apiKey:"AIzaSyCvcRGbuSMPcE4vXpewgdmP37LfvChIfXQ",

authDomain:"random-photo-alireza.firebaseapp.com",

projectId:"random-photo-alireza",

storageBucket:"random-photo-alireza.firebasestorage.app",

messagingSenderId:"233987316766",

appId:"1:233987316766:web:95b51081a120d49ffee20f"

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
