import { db } from "./firebaseConfig";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc
} from "firebase/firestore";

const COLLECTION_NAME = "orders";

export const getOrders = async () => {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateOrderStatus = async (id, status) => {
    const orderRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(orderRef, { status });
};
