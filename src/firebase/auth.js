import { auth } from "./firebaseConfig";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

export const loginAdmin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const logoutAdmin = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

export const subscribeToAuth = (callback) => {
    return onAuthStateChanged(auth, callback);
};
