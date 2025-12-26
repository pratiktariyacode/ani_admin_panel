import { auth } from "./firebaseConfig";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const loginAdmin = async (email, password) => {
    // Step 1: Login with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = userCredential.user;

    // Step 2: Check admin role in Firestore 'users' collection
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // User doc doesn't exist -> deny access
        await signOut(auth);
        throw new Error("NOT_ADMIN");
    }

    // Role check: must be 'admin'
    const data = userSnap.data();
    if (data.role !== "admin") {
        await signOut(auth);
        throw new Error("NOT_ADMIN");
    }

    return user;
};

export const logoutAdmin = async () => {
    await signOut(auth);
};

export const subscribeToAuth = (callback) => {
    return onAuthStateChanged(auth, callback);
};
