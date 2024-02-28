import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, messaging, vapidKey } from "./firebase_conf";
import { getToken } from "firebase/messaging";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// 상품 컬렉션(collection)을 기준으로 카테고리 필드(field)를 오름차순으로 정렬하여 가져오는 예제
export const fetchProducts = async (collection_name, field_name, shop_id) => {
  try {
    const q = query(
      collection(db, collection_name),
      where("shop_id", "==", shop_id)
      // orderBy(field_name)
    );
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

export const updateCart = async (data) => {
  //  setDoc -> 모든 데이터가 data로 치환됩니다.
  //  updateDoc -> data로 들어온 필드가 업데이트 됩니다.
  try {
    console.log(data);
    const docRef = doc(db, "CART", data.doc_id);

    // db의 CART 컬렉션에서 해당 doc_id의 문서를 set
    await updateDoc(docRef, data);
    console.log("Document update with ID: ", data.doc_id);
  } catch (error) {
    console.error("Error update document: ", error);
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
    console.log(totalCost);
  });
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

// 관리자 계정 생성 함수
export const adminSignUp = (email, password) => {
  console.log(email, password);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      console.log(user);

      return user.uid;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..

      alert(errorCode, errorMessage);

      return null;
    });
};

async function firstLogin(id, password) {
  const uid = null;
  const q = query(collection(db, "ACCOUNT"), where("admin_email", "==", id));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    console.log(doc.data());

    // 하나라도 있으면 리턴
    return true;
  });

  return false;
}

// 관리자 로그인 함수
export const adminSignIn = (e) => {
  e.preventDefault();

  console.log(e.target[0].value, e.target[1].value);

  signInWithEmailAndPassword(auth, e.target[0].value, e.target[1].value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      // 로그인에 성공했다면, 대시보드로 이동합니다.
      if (user) {
        window.location.replace("/admin/dashboard");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      let err_msg = "";

      if (errorCode == "auth/invalid-credential") {
        let existUser = firstLogin(e.target[0].value, e.target[1].value);
        if (existUser) {
          // 계정 생성된 관리자의 최초 로그인 시 계정을 생성합니다.
          let uid = adminSignUp(e.target[0].value, e.target[1].value);
          console.log(uid);
        } else {
          err_msg = "계정을 다시 확인해주세요.";
        }
      }
      if (errorCode == "auth/invalid-email") {
        err_msg = "이메일 형식이 올바르지 않습니다.";
      }
      if (errorCode == "auth/user-not-found") {
        err_msg = "일치하는 계정이 존재하지 않습니다.";
      }
      if (errorCode == "auth/wrong-password") {
        err_msg = "비밀번호를 다시 확인해주세요";
      }
      if (errorCode == "auth/too-many-requests") {
        err_msg = "잠시 후 다시 시도해 주세요";
      }
      if (errorCode == "auth/too-many-requests") {
        err_msg = "잠시 후 다시 시도해 주세요";
      }
      if (errorCode == "auth/email-already-in-use") {
        err_msg = "이미 존재하는 아이디입니다.";
      }

      alert(errorMessage);
    });
};

export const getAdmin = async (uid) => {
  const q = query(collection(db, "ACCOUNT"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const admin = [];
  querySnapshot.forEach((doc) => {
    admin.push({ ...doc.data(), doc_id: doc.id });
  });
  return admin.length > 0 ? admin[0] : null;
};

// 전체 관리자 목록 출력
export const fetchAdminList = async () => {
  const q = query(collection(db, "ACCOUNT"));
  const querySnapshot = await getDocs(q);

  const admin = [];
  querySnapshot.forEach((doc) => {
    admin.push({ ...doc.data(), doc_id: doc.id });
    console.log(doc.data());
  });
  return admin;
};

// 전체 가맹점 목록 출력
export const fetchShopList = async () => {
  const q = query(collection(db, "SHOP"));
  const querySnapshot = await getDocs(q);

  const shop = [];
  querySnapshot.forEach((doc) => {
    shop.push({ ...doc.data(), doc_id: doc.id });
    console.log(doc.data());
  });
  return shop;
};

export const postShop = async (e) => {
  const shopInfo = {
    [e.target[0].name]: e.target[0].value, // doc_id
    [e.target[1].name]: e.target[1].value, // shop_name
    [e.target[2].name]: e.target[2].value, // shop_address
    [e.target[3].name]: e.target[3].value, // shop_depth1
    [e.target[4].name]: e.target[4].value, // shop_depth2
    [e.target[5].name]: e.target[5].value, // shop_img
    [e.target[6].name]: e.target[6].value, // logo_img
    createAt: new Date(),
  };

  await setDoc(doc(db, "SHOP", shopInfo.doc_id), shopInfo);
  console.log("Document written with ID: ", shopInfo.doc_id);
  return true;
};

// 관리자 계정 정보 저장 함수
export const postAdmin = async (e) => {
  const adminInfo = {
    [e.target[0].name]: e.target[0].value, // admin_name
    [e.target[1].name]: e.target[1].value, // admin_email
    [e.target[2].name]: e.target[2].value, // admin_password
    // [e.target[3].name]: e.target[3].value, // admin_password_confirm
    [e.target[4].name]: e.target[4].value, // shop_id
    [e.target[5].name]: e.target[5].value, // permission
    createAt: new Date(),
  };

  console.log(adminInfo);

  try {
    const docRef = await addDoc(collection(db, "ACCOUNT"), adminInfo);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return true;
};
