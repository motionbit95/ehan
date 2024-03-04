import React, { useEffect, useState } from "react";
import RHeader from "../../components/RHeader";
import {
  currentAdmin,
  getAdmin,
  isCurrentUserAnonymous,
} from "../../firebase/firebase_func";
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
import { useNavigate } from "react-router-dom";
import { debug } from "../../firebase/api";

function Dashboard(props) {
  const navigate = useNavigate();
  const { admin, uid, setAdminInfo, shopList, setGlobalShopList } =
    useGlobalState();
  const [menu, setMenu] = useState(
    localStorage.getItem("menu") ? localStorage.getItem("menu") : "home"
  );

  useEffect(() => {
    if (admin.doc_id) {
      setGlobalShopList();
      changeMenu(localStorage.getItem("menu"));
    }
  }, [admin]);

  // 아래 계정 정보의 state가 변경 될 때마다 사용자 uid를 로드하여 저장합니다.
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // 익명으로 로그인 된 사용자라면 로그인 페이지로 이동합니다.
        if (!isCurrentUserAnonymous()) {
          setAdminInfo(user.uid);
        }
      } else {
        navigate("/admin/login");
      }
    });
  }, [uid]);

  const changeMenu = (menu) => {
    debug(menu, " 페이지를 렌더링합니다");
    localStorage.setItem("menu", menu);
    setMenu(menu);
  };

  const getPage = () => {
    switch (menu) {
      case "home":
        return <Home />;
      case "account":
        return <Account shopList={shopList} />;
      case "order":
        return <Order />;
      case "income":
        return <Income />;
      case "inventory":
        return <Inventory />;
      case "product":
        return <Product shopList={shopList} />;
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
