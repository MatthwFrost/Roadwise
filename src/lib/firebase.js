import { writable, derived } from "svelte/store";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { GeoFirestore } from 'geofirestore';

const firebaseConfig = {
 // Firebase config
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
