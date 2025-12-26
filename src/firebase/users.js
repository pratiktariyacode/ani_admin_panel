import { db } from "./firebaseConfig";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

const COLLECTION_NAME = "users";

export const getUsers = async () => {
    // Assuming 'createdAt' or similar field exists, or just default order. 
    // If 'users' collection doesn't have 'createdAt', we might remove orderBy or use another field.
    // For now, let's try just getting the collection or order by email if appropriate, 
    // but usually 'createdAt' is a safe bet if we control creation. 
    // However, if these are Auth users mirrored to Firestore, we need to be sure.
    // Let's stick to simple get for now to be safe, or try-catch the order.
    // Safe bet: just collection() for now, can add orderBy later.

    // Actually, let's add orderBy 'createdAt' desc if it aligns with other services, 
    // but the user might not have this field on existing docs. 
    // Given the previous files used 'createdAt', I'll assume it might be there, 
    // but better to allow returning unordered if it fails? 
    // No, let's just use collection ref for now to avoid missing index errors if they haven't set it up.
    // Wait, products.js uses orderBy("createdAt", "desc"). orders.js uses orderBy("orderDate", "desc").
    // I will try orderBy("joined", "desc") or similar if I knew the schema, but I don't.
    // The sample data had 'joined'. I'll try to stick to a simple fetch first.

    const q = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
