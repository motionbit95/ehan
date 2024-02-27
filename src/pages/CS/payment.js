import { Button, HStack, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { postPayment } from "../../firebase/firebase_func";
import { auth } from "../../firebase/firebase_conf";

function Payment(props) {
  const { AUTHNICE } = window;
  const location = useLocation();
  const [payMethod, setPayMethod] = useState("card");
  const [formData, setFormData] = useState({
    order_address: "",
    order_code: "",
    order_message: "",
  });

  const callNicePayPopup = async () => {
    console.log("popup!");
    // PAYMENT DATA를 저장합니다.
    const order_id = random();
    await postPayment({
      ...formData,
      uid: auth.currentUser.uid,
      order_id: order_id,
    });

    window.confirm("주문 정보가 저장되었나요?");

    const clientId = "S2_af4543a0be4d49a98122e01ec2059a56";
    // const secretKey = "9eb85607103646da9f9c02b128f2e5ee";

    AUTHNICE.requestPay({
      clientId: clientId,
      appScheme: "test",
      method: payMethod,
      orderId: order_id,
      amount: location.state,
      goodsName: "나이스페이-상품",
      returnUrl:
        "https://port-0-nicepay-module-17xco2nlszge3vt.sel5.cloudtype.app/serverAuth",
      vbankHolder: "레드스위치",
      fnError: function (result) {
        alert(result.errorMsg + "");
      },
    });
  };

  //Test orderId 생성
  const random = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
  };

  return (
    <div>
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
        <div>결제하기</div>
        <div>홈으로</div>
      </div>

      <div>
        배송지
        <input
          onChange={(e) =>
            setFormData({ ...formData, order_address: e.target.value })
          }
        ></input>
      </div>
      <div>
        주문코드
        <input
          onChange={(e) =>
            setFormData({ ...formData, order_code: e.target.value })
          }
        ></input>
      </div>
      <div>
        배송메세지
        <input
          onChange={(e) =>
            setFormData({ ...formData, order_message: e.target.value })
          }
        ></input>
      </div>
      {/* {payMethod === "vbank" && (
        <div>
          예금주명
          <input></input>
        </div>
      )} */}
      <div>
        결제수단
        <button onClick={() => setPayMethod("kakaopay")}>카카오페이</button>
        <button onClick={() => setPayMethod("naverpayCard")}>네이버페이</button>
        <button onClick={() => setPayMethod("card")}>신용카드</button>
        <button onClick={() => setPayMethod("vbank")}>무통장입금</button>
      </div>

      <Stack bgColor={"white"} width={"100%"}>
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 주문금액</div>
          <div>{location.state}원</div>
        </HStack>
        <div
          style={{ height: "1px", width: "100%", backgroundColor: "#d9d9d9" }}
        />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>결제예정금액</div>
          <div>{location.state}원</div>
        </HStack>
      </Stack>
      <Button onClick={callNicePayPopup}>결제하기</Button>
    </div>
  );
}

export default Payment;
