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
import { auth, db } from "../../firebase/firebase_conf";
import { useNavigate } from "react-router-dom";
import { SERVER_URL, debug } from "../../firebase/api";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { formatCurrency } from "../CS/home";
import $ from "jquery";

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
      console.log(user);
      if (user) {
        // 익명으로 로그인 된 사용자라면 로그인 페이지로 이동합니다.
        if (!user.isAnonymous) {
          setAdminInfo(user.uid);
        } else {
          navigate("/admin/login");
        }
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

  const cancelOrder = async (order) => {
    if (window.confirm("결제를 취소하시겠습니까?")) {
      // jQuery를 사용하여 POST 요청을 보냅니다.
      $.ajax({
        url: SERVER_URL + "/cancel", // 요청을 보낼 엔드포인트 URL
        method: "POST",
        contentType: "application/json", // 요청 본문의 데이터 형식
        data: JSON.stringify({
          order_id: order.order_id,
          reason: "관리자 취소",
          tid: order.pay_id,
          amount: order.pay_price,
        }), // POST할 데이터를 JSON 문자열로 변환하여 전송
        success: async function (response) {
          // 성공적으로 요청이 완료되었을 때 처리할 작업
          console.log("POST 요청 성공:", response);

          if (response.resultCode === "0000") {
            await updateDoc(doc(db, "PAYMENT", order.doc_id), {
              // 1000 : 취소 성공
              pay_state: "1000",
              pay_result: response.resultMsg,
              cancel_date: response.cancelledAt,
            });

            // 알림을 발생시킵니다.
            addDoc(collection(db, "ALARM"), {
              type: "order",
              shop_id: order.shop_id,
              createAt: new Date(),
              order_id: order.doc_id,
              alarm_code: "I002",
              alarm_title: `${order.doc_id} 주문을 취소하였습니다.`,
            });

            window.location.reload();
          } else {
            alert(response.resultMsg);
          }
        },
        error: function (xhr, status, error) {
          // 요청이 실패했을 때 처리할 작업
          console.error("POST 요청 실패:", error);
        },
      });
    }
  };

  // U - update order
  const handleChangeState = async (value, order) => {
    console.log(value);
    await updateDoc(doc(db, "PAYMENT", order.doc_id), {
      pay_state: value,
    });

    // 알림을 발생시킵니다.
    addDoc(collection(db, "ALARM"), {
      type: "order",
      shop_id: order.shop_id,
      createAt: new Date(),
      order_id: order.doc_id,
      alarm_code: "I" + value.substring(1),
      alarm_title: `상품 배송이 ${
        value === "0001" ? "시작" : "완료"
      }되었습니다.`,
      alarm_msg: `주문번호 ${order.doc_id}의 상품 배송이 ${
        value === "0001" ? "시작" : "완료"
      }되었습니다.`,
    });

    window.location.reload();
  };

  return (
    <Box overflow="hidden">
      <RHeader onChangeMenu={changeMenu} />
      {getPage()}
      <div>
        {showPopup && (
          <Modal isOpen={showPopup} onClose={() => window.location.reload()}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
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
                  <Button
                    onClick={() => {
                      cancelOrder(newOrder);
                    }}
                  >
                    거부
                  </Button>
                  <Button
                    onClick={() => handleChangeState("0001", newOrder)}
                    colorScheme="red"
                  >
                    배송
                  </Button>
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
