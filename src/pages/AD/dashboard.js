import React, { useEffect, useState } from "react";
import RHeader from "../../components/RHeader";
import { currentAdmin } from "../../firebase/firebase_func";
import { useGlobalState } from "../../GlobalState";
import { Flex, HStack, Stack, calc, useMediaQuery } from "@chakra-ui/react";
import RFilter from "../../components/RFilter";
import Home from "./home";
import Account from "./account";
import Order from "./order";
import Income from "./income";
import Product from "./product";
import Inventory from "./inventory";
import { auth } from "../../firebase/firebase_conf";

function Dashboard(props) {
  const { uid, setAdminUid } = useGlobalState();
  const [menu, setMenu] = useState(
    localStorage.getItem("menu") ? localStorage.getItem("menu") : "home"
  );

  // 아래 계정 정보의 state가 변경 될 때마다 사용자 uid를 로드하여 저장합니다.
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("사용자 uid를 로드하여 저장! > ", user.uid);
        setAdminUid(user.uid);
      }
    });
  }, [uid]);

  const changeMenu = (menu) => {
    console.log(">>>", menu);
    setMenu(menu);
  };

  const getPage = () => {
    switch (menu) {
      case "home":
        return <Home />;
      case "account":
        return <Account />;
      case "order":
        return <Order />;
      case "income":
        return <Income />;
      case "inventory":
        return <Inventory />;
      case "product":
        return <Product />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <RHeader onChangeMenu={changeMenu} />
      {getPage()}
    </div>
  );
}

export default Dashboard;
