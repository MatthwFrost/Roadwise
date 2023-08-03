// // import { initializeApp } from "firebase/app";
// // import { getFirestore, doc, onSnapshot } from "firebase/firestore"
// // import { getAuth, onAuthStateChanged } from "firebase/auth"
// // import { getStorage } from "firebase/storage"
// import { writable, derived } from "svelte/store";
// // import * as geofirestore from 'geofirestore';

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import 'firebase/compat/auth';
// import 'firebase/compat/storage';
// import { GeoFirestore } from 'geofirestore';




// const firebaseConfig = {
//     apiKey: "AIzaSyBkvOFdodxbm-sUiBqE3OUCCA1yEL4r5UA",
//     authDomain: "routewise-54d38.firebaseapp.com",
//     projectId: "routewise-54d38",
//     storageBucket: "routewise-54d38.appspot.com",
//     messagingSenderId: "703015408763",
//     appId: "1:703015408763:web:5abc3b8e92756a9382fede",
//     measurementId: "G-1L2LKQJX5H"
//   };


// // export const app = initializeApp(firebaseConfig);
// // export const db = getFirestore();
// // export const auth = getAuth();
// // export const storage = getStorage();
// // export const GeoFirestore = geofirestore.initializeApp(db);
// export const app = firebase.initializeApp(firebaseConfig);
// export const db = firebase.firestore(app);
// export const auth = firebase.auth(app);
// export const storage = firebase.storage(app);
// export const geofirestore = new GeoFirestore(db);


// function userStore() {
//   let unsubscribe;

//   if (!auth || !globalThis.window) {
//     console.warn('Auth is not initialized or not in browser');
//     const { subscribe } = writable(null);
//     return {
//       subscribe,
//     }
//   }

//   const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
//     unsubscribe = onAuthStateChanged(auth, (user) => {
//       set(user);
//     });

//     return () => unsubscribe();
//   });

//   return {
//     subscribe,
//   };
// }

// export const user = userStore();

// export function docStore(
//   path,
// ) {
//   let unsubscribe;

//   const docRef = doc(db, path);

//   const { subscribe } = writable(null, (set) => {
//     unsubscribe = onSnapshot(docRef, (snapshot) => {
//       set((snapshot.data()) ?? null);
//     });

//     return () => unsubscribe();
//   });

//   return {
//     subscribe,
//     ref: docRef,
//     id: docRef.id,
//   };
// }



// export const userData = derived(user, ($user, set) => { 
//   if ($user) {
//     return docStore(`users/${$user.uid}`).subscribe(set);
//   } else {
//     set(null); 
//     return () => {};
//   }
// });

import { writable, derived } from "svelte/store";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { GeoFirestore } from 'geofirestore';

const firebaseConfig = {
    apiKey: "AIzaSyBkvOFdodxbm-sUiBqE3OUCCA1yEL4r5UA",
    authDomain: "routewise-54d38.firebaseapp.com",
    projectId: "routewise-54d38",
    storageBucket: "routewise-54d38.appspot.com",
    messagingSenderId: "703015408763",
    appId: "1:703015408763:web:5abc3b8e92756a9382fede",
    measurementId: "G-1L2LKQJX5H"
};

export const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore(app);
export const auth = firebase.auth(app);
export const storage = firebase.storage(app);
export const geofirestore = new GeoFirestore(db);

function userStore() {
    let unsubscribe;

    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable(null);
        return {
            subscribe,
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = auth.onAuthStateChanged(user => {
            set(user);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
    };
}

export const user = userStore();

export function docStore(path) {
    let unsubscribe;

    const docRef = db.doc(path);

    const { subscribe } = writable(null, (set) => {
        unsubscribe = docRef.onSnapshot((snapshot) => {
            set(snapshot.data() ?? null);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id,
    };
}

export const userData = derived(user, ($user, set) => { 
    if ($user) {
        return docStore(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null); 
        return () => {};
    }
});
