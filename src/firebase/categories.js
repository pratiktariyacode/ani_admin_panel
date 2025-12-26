import { db } from "./firebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";

const COLLECTION_NAME = "categories";

export const getCategories = async () => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addCategory = async (categoryName) => {
    return await addDoc(collection(db, COLLECTION_NAME), {
        name: categoryName,
        createdAt: new Date().toISOString()
    });
};

export const deleteCategory = async (id) => {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    return await deleteDoc(categoryRef);
};
