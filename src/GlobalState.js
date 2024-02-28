// GlobalState.js
import React, { createContext, useContext, useState } from "react";

// 초기 상태
const initialState = {
  uid: "",
  setAdminUid: () => {},
};

// 컨텍스트 생성
const GlobalStateContext = createContext(initialState);

// 컨텍스트 제공자
export const GlobalStateProvider = ({ children }) => {
  const [uid, setUid] = useState("");

  const setAdminUid = (uid) => {
    console.log("전역 변수에 로그인 된 사용자의 uid를 저장합니다.");
    setUid(uid);
  };

  return (
    <GlobalStateContext.Provider value={{ uid, setAdminUid }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// 컨텍스트 사용 훅
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
