import React, { useEffect, useState } from "react";
import RHeader from "../../components/RHeader";
import {
  currentAdmin,
  getAdmin,
  isCurrentUserAnonymous,
} from "../../firebase/firebase_func";
import { useGlobalState } from "../../GlobalState";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  calc,
  useMediaQuery,
} from "@chakra-ui/react";
import RFilter from "../../components/RFilter";
import Home, { payMethod } from "./home";
import Account from "./account";
import Order from "./order";
import Income from "./income";
import Product from "./product";
import Inventory from "./inventory";
import { auth, db, messaging } from "../../firebase/firebase_conf";
import { useNavigate } from "react-router-dom";
import { debug } from "../../firebase/api";
import { collection, onSnapshot } from "firebase/firestore";
import { formatCurrency } from "../CS/home";

function Dashboard(props) {
  const navigate = useNavigate();
  const { admin, uid, setAdminInfo, shopList, setGlobalShopList } =
    useGlobalState();
  const [menu, setMenu] = useState(
    localStorage.getItem("menu") ? localStorage.getItem("menu") : "home"
  );
  const [showPopup, setShowPopup] = useState(false);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "PAYMENT"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // 결제창 호출 시 결제 정보를 입력하므로 여기에 들어옵니다.
        }
        if (change.type === "modified") {
          // 결제 완료 시 결제 결과 코드를 저장하므로 여기에 들어옵니다.

          // doc 의 상점 id와 현재 로그인 된 admin의 id를 비교한 후
          // 로그인 된 admin 상점에 주문이 결제완료 상태일 경우 alert를 표시합니다.
          getAdmin(auth.currentUser.uid).then((admin) => {
            if (
              admin.shop_id === change.doc.data().shop_id &&
              change.doc.data().pay_state === "0000"
            ) {
              // 주문이 추가되었을 때 팝업을 띄움
              setShowPopup(true);
              setNewOrder(change.doc.data());
              return;
            }
          });
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
        }
      });
    });
  }, []);

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
        return <Home shopList={shopList} />;
      case "account":
        return <Account shopList={shopList} />;
      case "order":
        return <Order shopList={shopList} />;
      case "income":
        return <Income shopList={shopList} />;
      case "inventory":
        return <Inventory shopList={shopList} />;
      case "product":
        return <Product shopList={shopList} />;
      default:
        return <Home />;
    }
  };

  const callNicePayCancel = async () => {
    // post 하기
  };

  return (
    <Box overflow="hidden">
      <RHeader onChangeMenu={changeMenu} />
      {getPage()}
      <div>
        {showPopup && (
          <Modal isOpen={showPopup} onClose={() => setShowPopup(false)}>
            <ModalOverlay />
            <ModalContent>
              {/* <ModalCloseButton /> */}
              <ModalHeader>주문번호 [{newOrder?.doc_id}]</ModalHeader>
              <ModalBody>
                <Stack>
                  <Text fontWeight="bold" fontSize={"16px"}>
                    배송지 주소 : {newOrder?.order_address}
                  </Text>
                  <Text fontWeight="bold" fontSize={"15px"}>
                    주문 상품 {newOrder?.pay_product.length}개 / 총{" "}
                    {formatCurrency(newOrder?.pay_price)}원{" / "}
                    {newOrder?.pay_state === "0000" ? "결제완료" : ""}
                  </Text>
                  {newOrder?.pay_product.map((product) => {
                    return (
                      <Stack direction="row" key={product.doc_id}>
                        <Text fontSize={"13px"}>
                          {product.product_name} /{" "}
                          {formatCurrency(product.product_price)}원
                        </Text>
                        <Text fontSize={"13px"}>x {product.count}개</Text>
                      </Stack>
                    );
                  })}
                  {/* <Text>결제수단 : {newOrder?.pay_method}</Text> */}
                </Stack>
              </ModalBody>
              <ModalFooter>
                <ButtonGroup>
                  <Button>거부</Button>
                  <Button colorScheme="red">배송</Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        {/* 이곳에 나머지 컴포넌트 내용을 추가 */}
      </div>
    </Box>
  );
}

export default Dashboard;
