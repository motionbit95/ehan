// GlobalState.js
import React, { createContext, useContext, useState } from "react";
import { fetchShopList, getAdmin } from "./firebase/firebase_func";
import { debug } from "./firebase/api";

// 초기 상태
const initialState = {
  uid: "",
  admin: {},
  shopList: [],
  setGlobalShopList: () => {},
  setAdminInfo: () => {},
  setAdminUid: () => {},
};

// 컨텍스트 생성
const GlobalStateContext = createContext(initialState);

// 컨텍스트 제공자
export const GlobalStateProvider = ({ children }) => {
  const [uid, setUid] = useState("");
  const [admin, setAdmin] = useState({});
  const [shopList, setShopList] = useState([]);

  const setAdminUid = (uid) => {
    setUid(uid);
  };

  const setAdminInfo = async (uid) => {
    const currentAdmin = await getAdmin(uid);
    if (currentAdmin) {
      debug(
        "로그인 된 유저정보를 저장합니다. \n",
        currentAdmin.admin_name,
        "(",
        uid.slice(0, 6),
        ")"
      );
      setAdmin(currentAdmin);
      setUid(uid);
    }
  };

  const setGlobalShopList = async () => {
    debug("가맹점 리스트를 가지고 옵니다.");
    const shopList = await fetchShopList();
    setShopList(shopList);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        uid,
        setAdminUid,
        admin,
        setAdminInfo,
        shopList,
        setGlobalShopList,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// 컨텍스트 사용 훅
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
