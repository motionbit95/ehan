import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, messaging, vapidKey } from "./firebase_conf";
import { getToken } from "firebase/messaging";

// 상품 컬렉션(collection)을 기준으로 카테고리 필드(field)를 오름차순으로 정렬하여 가져오는 예제
export const fetchProducts = async (collection_name, field_name) => {
  try {
    const q = query(collection(db, collection_name), orderBy(field_name));
    const querySnapshot = await getDocs(q);
    const categories = new Set();

    const products = [];
    querySnapshot.forEach((doc) => {
      categories.add(doc.data().product_category);
      products.push({ ...doc.data(), doc_id: doc.id });
    });

    return { products, categories };
  } catch (error) {
    console.error("데이터 가져오기 중 오류 발생:", error);
    return {};
  }
};

export const postCart = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "CART"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getCart = async (uid) => {
  const q = query(collection(db, "CART"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const cart = [];
  let totalCost = 0;
  querySnapshot.forEach((doc) => {
    totalCost += doc.data().product_price * doc.data().count;
    cart.push({ ...doc.data(), doc_id: doc.id });
  });
  console.log(totalCost);
  return { cart, totalCost };
};

export const postPayment = async (data) => {
  try {
    await setDoc(doc(db, "PAYMENT", data.order_id), {
      ...data,
      doc_id: data.order_id,
    });
    console.log("Document written with ID: ", data.order_id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getPayment = async (orderId) => {
  const docRef = doc(db, "PAYMENT", orderId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const getMessageToken = async (uid) => {
  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  getToken(messaging, {
    vapidKey: vapidKey,
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
};
