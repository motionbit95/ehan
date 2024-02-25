import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../../firebase/firebase_func";
import { auth } from "../../firebase/firebase_conf";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  StackDivider,
} from "@chakra-ui/react";

function Cart(props) {
  const { AUTHNICE } = window;
  const navigate = useNavigate();
  const location = useLocation();
  const [cartList, setCartList] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const getCartList = async () => {
    if (location.state) {
      const cartlist = await getCart(location.state);
      setCartList(cartlist.cart);
      setTotalCost(cartlist.totalCost);
    }
  };

  const callNicePayPopup = () => {
    console.log("popup!");

    const clientId = "S2_af4543a0be4d49a98122e01ec2059a56";
    const secretKey = "9eb85607103646da9f9c02b128f2e5ee";

    AUTHNICE.requestPay({
      clientId: clientId,
      method: "card",
      orderId: random(),
      amount: 1004,
      goodsName: "나이스페이-상품",
      returnUrl:
        "https://port-0-nicepay-module-17xco2nlszge3vt.sel5.cloudtype.app/serverAuth",
      fnError: function (result) {
        alert("개발자확인용 : " + result.errorMsg + "");
      },
    });
  };

  //Test orderId 생성
  const random = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
  };

  useEffect(() => {
    // 현재 유저 세션에 담긴 장바구니 정보를 가지고 옵니다.
    getCartList();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      <div
        style={{
          backgroundColor: "white",
          alignItems: "center",
          height: "5vh",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>뒤로가기</div>
        <div>장바구니</div>
        <div>홈으로</div>
      </div>
      {cartList?.map((item) => (
        <div
          key={item.doc_id}
          style={{
            display: "flex",
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Stack width={"100%"} padding={"10px"}>
            <HStack>
              {item.product_images && item.product_images.length > 0 ? (
                <Image
                  bgColor={"#d9d9d9"}
                  width={"100px"}
                  height={"100px"}
                  borderRadius={"10px"}
                  alt=""
                  src={item.product_images ? item.product_images[0] : ""}
                />
              ) : (
                <Box
                  borderRadius={"10px"}
                  bgColor={"#d9d9d9"}
                  width={"100px"}
                  height={"100px"}
                />
              )}
              <Stack>
                <div>{item.product_name}</div>
                <div>{item.product_price}원</div>
              </Stack>
            </HStack>
            <div
              style={{
                display: "flex",
                gap: "1vh",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <div>-</div>
              <div>{item.count}</div>
              <div>+</div>
            </div>
          </Stack>
        </div>
      ))}

      <Stack bgColor={"white"} width={"100%"}>
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 주문금액</div>
          <div>{totalCost}원</div>
        </HStack>
        <div
          style={{ height: "1px", width: "100%", backgroundColor: "#d9d9d9" }}
        />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>결제예정금액</div>
          <div>{totalCost}원</div>
        </HStack>
      </Stack>

      <Button onClick={callNicePayPopup}>결제하기</Button>
    </div>
  );
}

export default Cart;
