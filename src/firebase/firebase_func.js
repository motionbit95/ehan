import {
  addDoc,
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, messaging, vapidKey } from "./firebase_conf";
import { getToken, onMessage } from "firebase/messaging";
import {
  EmailAuthCredential,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { debug, error, timestampToDate } from "./api";
import { get, getDatabase, onValue, ref, set } from "firebase/database";

// 상품 컬렉션(collection)을 기준으로 카테고리 필드(field)를 오름차순으로 정렬하여 가져오는 예제
export const fetchProducts = async (collection_name, field_name, shop_id) => {
  try {
    let q;
    if (shop_id) {
      q = query(
        collection(db, collection_name),
        where("shop_id", "==", shop_id)
        // orderBy(field_name)
      );
    } else {
      q = query(collection(db, collection_name));
    }
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

export const getProductCount = async (shop_id) => {
  // 콜렉션 레퍼런스
  var q = query(collection(db, "PRODUCT"));
  if (shop_id)
    q = query(collection(db, "PRODUCT"), where("shop_id", "==", shop_id));
  const querySnapshot = await getDocs(q);

  if (querySnapshot) {
    return querySnapshot.size;
  }
};

export const getProduct = async (lastDocumentSnapshot, shop_id) => {
  // 이전 페이지의 마지막 문서 스냅샷
  const documentsPerPage = 10;
  // 시작 위치 계산
  var startAfterDocument = null;

  // 이전 페이지의 마지막 문서 스냅샷이 존재하는 경우
  if (lastDocumentSnapshot) {
    startAfterDocument = lastDocumentSnapshot;
  }

  try {
    let q;
    if (shop_id) {
      q = query(
        collection(db, "PRODUCT"),
        orderBy("product_category"),
        where("shop_id", "==", shop_id),
        limit(documentsPerPage)
      );
    } else {
      q = query(
        collection(db, "PRODUCT"),
        orderBy("product_category"),
        limit(documentsPerPage)
      );
    }

    // 시작 문서가 있는 경우에만 startAfter() 메서드 사용
    if (startAfterDocument) {
      q = query(
        collection(db, "PRODUCT"),
        orderBy("product_category"),
        startAfter(startAfterDocument),
        limit(documentsPerPage)
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      return { products: [], lastDocumentSnapshot: null };
    }

    lastDocumentSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        ...doc.data(),
        doc_id: doc.id,
      });
    });

    return { products, lastDocumentSnapshot };
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
    console.log(data);
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
    cart.push({ ...doc.data(), product_id: doc.data().doc_id, doc_id: doc.id });
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

export const getTotalOrder = async (dateRange, shop_id) => {
  var q = query(collection(db, "PAYMENT"));
  if (shop_id)
    q = query(collection(db, "PAYMENT"), where("shop_id", "==", shop_id));
  const querySnapshot = await getDocs(q);

  const order = [];
  let totalPrice = 0;
  let totalOriginPrice = 0;
  // const startDate = dateRange[0].toLocaleDateString();
  // const endDate = dateRange[1].toLocaleDateString();
  querySnapshot.forEach((doc) => {
    if (doc.data().createAt) {
      const createAt = timestampToDate(doc.data().createAt);
      if (
        new Date(createAt.replace(".", "-")) >= dateRange[0] &&
        new Date(createAt.replace(".", "-")) <= dateRange[1]
      ) {
        order.push({ ...doc.data(), doc_id: doc.id });
        totalPrice += parseFloat(doc.data().pay_price);
        for (let i = 0; i < doc.data().pay_product.length; i++) {
          totalOriginPrice += parseFloat(
            doc.data().pay_product[i].product_origin_price
          );
        }
      }
    }
  });

  return { order, totalPrice, totalOriginPrice };
};

export const getOrder = async (lastDocumentSnapshot, shop_id) => {
  // 이전 페이지의 마지막 문서 스냅샷
  const documentsPerPage = 10;
  // 시작 위치 계산
  var startAfterDocument = null;

  // 이전 페이지의 마지막 문서 스냅샷이 존재하는 경우
  if (lastDocumentSnapshot) {
    startAfterDocument = lastDocumentSnapshot;
  }

  try {
    let q;
    if (shop_id) {
      q = query(
        collection(db, "PAYMENT"),
        where("shop_id", "==", shop_id),
        orderBy("pay_date", "desc"),
        limit(documentsPerPage)
      );
    } else {
      q = query(
        collection(db, "PAYMENT"),
        orderBy("pay_date", "desc"),
        limit(documentsPerPage)
      );
    }

    // 시작 문서가 있는 경우에만 startAfter() 메서드 사용
    if (startAfterDocument) {
      q = query(
        collection(db, "PAYMENT"),
        orderBy("pay_date", "desc"),
        startAfter(startAfterDocument),
        limit(documentsPerPage)
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      return { products: [], lastDocumentSnapshot: null };
    }

    lastDocumentSnapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        ...doc.data(),
        doc_id: doc.id,
      });
    });

    return { products, lastDocumentSnapshot };
  } catch (error) {
    console.error("데이터 가져오기 중 오류 발생:", error);
    return {};
  }
};

export function handleMessage(event) {
  const message = event.data;
  if (message.type === "push") {
    const pushData = message.data;
    console.log(pushData);
    // 여기서 모달 창을 띄우는 로직을 추가합니다.
    // 예: 모달 상태를 업데이트하고, 모달을 보여줍니다.
  }
}

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
        requestPermission();
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
      return;
    });
};

// 관리자 계정 생성 함수
export const adminSignUp = async (email, password, admin) => {
  console.log(email, password);

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...

      const docRef = doc(db, "ACCOUNT", admin.doc_id);

      // 가입된 관리자의 uid를 저장합니다,
      await updateDoc(docRef, { uid: user.uid });

      // ...
      // console.log("문서 Id : ", admin.doc_id);
      // console.log("계정의 uid를 저장합니다 : ", user.uid);

      // 계정 생성이 완료 되면 대시보드로 이동합니다.
      if (user.uid) {
        // console.log("로그인 성공!", user.uid);
        window.location.replace("/admin/dashboard");
      }

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

  const admin = [];
  querySnapshot.forEach(async (doc) => {
    console.log(doc.data());
    admin.push({ ...doc.data(), doc_id: doc.id });
  });

  if (admin.length) {
    return admin[0];
  } else {
    return null;
  }
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
      // console.log("로그인 성공!");
      if (user) {
        window.location.replace("/admin/dashboard");
      }
    })
    .catch(async (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      let err_msg = "";

      let existUser = await firstLogin(e.target[0].value, e.target[1].value);
      // console.log(existUser);
      if (existUser) {
        // 계정 생성된 관리자의 최초 로그인 시 계정을 생성합니다.
        await adminSignUp(e.target[0].value, e.target[1].value, existUser);
        return;
      } else {
        if (
          errorCode == "auth/invalid-credential" ||
          errorCode == "auth/network-request-failed"
        ) {
          err_msg = "계정을 다시 확인해주세요.";
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

        alert(err_msg);
        return;
      }
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

// 현재 로그인된 사용자가 익명인지 여부를 판단하는 함수
export const isCurrentUserAnonymous = () => {
  const currentUser = auth.currentUser;

  // 현재 사용자가 있고, 사용자의 프로바이더 데이터에 'anonymous'가 포함되어 있는지 확인
  return currentUser && currentUser.isAnonymous;
};

export const changeAdminPassword = (oldPassword, newPassword, doc_id) => {
  const user = auth.currentUser;

  // TODO(you): prompt the user to re-provide their sign-in credentials
  const credential = EmailAuthProvider.credential(user.email, oldPassword);

  reauthenticateWithCredential(user, credential)
    .then(async () => {
      // User re-authenticated.
      // 재인증 성공 시, 새 비밀번호로 업데이트
      console.log(doc_id);
      const docRef = doc(db, "ACCOUNT", doc_id);
      await updateDoc(docRef, { admin_password: newPassword });

      updatePassword(user, newPassword);

      alert("비밀번호가 업데이트 되었습니다. 재로그인을 진행해주세요.");

      window.location.replace("/admin/login");

      return true;
    })
    .catch((error) => {
      // An error ocurred
      // ...
    });
};

// 상품 저장 함수
export const postProduct = async (product) => {
  const productInfo = {
    ...product,
    createAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, "PRODUCT"), productInfo);
    debug("[PRODUCT] 문서가 저장되었습니다.\n문서번호 :", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return true;
};

export const updateProduct = async (data) => {
  //  setDoc -> 모든 데이터가 data로 치환됩니다.
  //  updateDoc -> data로 들어온 필드가 업데이트 됩니다.
  try {
    const docRef = doc(db, "PRODUCT", data.doc_id);

    // db의 CART 컬렉션에서 해당 doc_id의 문서를 set
    await updateDoc(docRef, data);
    debug("[PRODUCT] 문서가 수정되었습니다.", data.doc_id);
    return true;
  } catch (error) {
    console.error("Error update document: ", error);
    return false;
  }
};

// 푸시 알림 권한 요청 함수
function requestPermission() {
  messaging
    .requestPermission()
    .then(() => {
      console.log("Notification permission granted.");
      // 권한이 부여되면 FCM 토큰을 가져옵니다.
      return messaging.getToken();
    })
    .then((token) => {
      console.log("FCM Token:", token);
      // FCM 토큰을 서버로 전송하거나 저장합니다.
    })
    .catch((err) => {
      console.log("Unable to get permission to notify.", err);
    });
}

//# 다시 체크해봐야함
export async function createInventoryData(data) {
  try {
    const docRef = await addDoc(collection(db, "INVENTORY"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function readInventoryData(shop_id) {
  var q = query(collection(db, "INVENTORY"));
  if (shop_id)
    q = query(collection(db, "INVENTORY"), where("shop_id", "==", shop_id));
  const querySnapshot = await getDocs(q);

  const inventories = [];
  querySnapshot.forEach((doc) => {
    inventories.push({ ...doc.data(), doc_id: doc.id });
  });

  return inventories;
}

export const getTotalProducts = async (shop_id) => {
  // 콜렉션 레퍼런스
  var q = query(collection(db, "PRODUCT"));
  if (shop_id)
    q = query(collection(db, "PRODUCT"), where("shop_id", "==", shop_id));
  const querySnapshot = await getDocs(q);

  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ ...doc.data(), doc_id: doc.id });
  });

  return products;
};

export const queryShop = async (shop_depth1, shop_depth2) => {
  const shops = [];
  try {
    let q;
    if (shop_depth1 === "" && shop_depth2 === "") {
      // 전체
      q = query(collection(db, "SHOP"));
    } else if (shop_depth2 === "") {
      q = query(
        collection(db, "SHOP"),
        where("shop_depth1", "==", shop_depth1)
      );
    } else
      q = query(
        collection(db, "SHOP"),
        where("shop_depth1", "==", shop_depth1),
        where("shop_depth2", "==", shop_depth2)
      );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      shops.push({ ...doc.data(), doc_id: doc.id });
    });
  } catch (error) {
    console.error("Error querying posts:", error);
  }
  return shops;
};

// 손익 저장함수
export const postIncome = async (income) => {
  const incomeInfo = {
    ...income,
    createAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, "INCOME"), incomeInfo);
    debug("[INCOME] 문서가 저장되었습니다.\n문서번호 :", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return true;
};

export const getIncomeList = async (shop_id) => {
  var q = query(collection(db, "INCOME"));
  if (shop_id)
    q = query(collection(db, "INCOME"), where("shop_id", "==", shop_id));
  const querySnapshot = await getDocs(q);

  const incomes = [];
  querySnapshot.forEach((doc) => {
    incomes.push({ ...doc.data(), doc_id: doc.id });
  });

  return incomes;
};

export const getFilteredShop = async (value) => {
  var q = query(collection(db, "SHOP"));
  if (!value[0]) {
    var q = query(collection(db, "SHOP"));
  } else if (value[0] && !value[1]) {
    var q = query(collection(db, "SHOP"), where("shop_depth1", "==", value[0]));
  } else if (value[0] && value[1] && !value[2]) {
    var q = query(
      collection(db, "SHOP"),
      where("shop_depth1", "==", value[0]),
      where("shop_depth2", "==", value[1])
    );
  } else if (value[0] && value[1] && value[2]) {
    var q = query(
      collection(db, "SHOP"),
      where("shop_depth1", "==", value[0]),
      where("shop_depth2", "==", value[1]),
      where("shop_id", "==", value[2])
    );
  } else {
    var q = query(collection(db, "SHOP"));
  }
  const querySnapshot = await getDocs(q);

  const filteredList = [];
  querySnapshot.forEach((doc) => {
    filteredList.push({ ...doc.data(), doc_id: doc.id });
  });

  return filteredList;
};

export const getFilteredIncome = async (dateRange, shop_id) => {
  console.log(dateRange, shop_id);
  var q = query(collection(db, "INCOME"));
  if (shop_id)
    q = query(collection(db, "INCOME"), where("shop_id", "==", shop_id));
  const querySnapshot = await getDocs(q);

  const incomes = [];
  querySnapshot.forEach((doc) => {
    incomes.push({ ...doc.data(), doc_id: doc.id });
  });

  return incomes;
};
