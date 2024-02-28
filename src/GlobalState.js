// GlobalState.js
import React, { createContext, useContext, useState } from "react";
import { getAdmin } from "./firebase/firebase_func";

// 초기 상태
const initialState = {
  uid: "",
  admin: {},
  setAdminInfo: () => {},
  setAdminUid: () => {},
};

// 컨텍스트 생성
const GlobalStateContext = createContext(initialState);

// 컨텍스트 제공자
export const GlobalStateProvider = ({ children }) => {
  const [uid, setUid] = useState("");
  const [admin, setAdmin] = useState({});

  const setAdminUid = (uid) => {
    setUid(uid);
  };

  const setAdminInfo = async (uid) => {
    const currentAdmin = await getAdmin(uid);
    if (currentAdmin) {
      setAdmin(currentAdmin);
      setUid(uid);
    }
  };

  return (
    <GlobalStateContext.Provider
      value={{ uid, setAdminUid, admin, setAdminInfo }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// 컨텍스트 사용 훅
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
