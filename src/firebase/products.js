import { db } from "./firebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";

const COLLECTION_NAME = "products";

export const getProducts = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (product) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...product,
        createdAt: new Date().toISOString()
    });
};

export const updateProduct = async (id, updates) => {
    const productRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(productRef, updates);
};

export const deleteProduct = async (id) => {
    const productRef = doc(db, COLLECTION_NAME, id);
    return await deleteDoc(productRef);
};
