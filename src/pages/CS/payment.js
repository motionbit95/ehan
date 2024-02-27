import {
  Button,
  Flex,
  HStack,
  Stack,
  Input,
  Box,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postPayment } from "../../firebase/firebase_func";
import { auth } from "../../firebase/firebase_conf";

function Payment(props) {
  const { AUTHNICE } = window;
  const location = useLocation();
  const navigate = useNavigate();
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
    console.log(location.state.productList);
    await postPayment({
      ...formData,
      uid: auth.currentUser.uid,
      order_id: order_id,
      pay_product: location.state.productList,
    });

    window.confirm("주문 정보가 저장되었나요?");

    const clientId = "S2_af4543a0be4d49a98122e01ec2059a56";
    // const secretKey = "9eb85607103646da9f9c02b128f2e5ee";

    AUTHNICE.requestPay({
      clientId: clientId,
      appScheme: "test",
      method: payMethod,
      orderId: order_id,
      amount: location.state.totalCost,
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
    <Stack position={"relative"} height={"100vh"} gap={"1vh"}>
      <Flex
        bgColor={"white"}
        align={"center"}
        w={"100%"}
        h={"5vh"}
        justify={"space-between"}
      >
        <Flex
          w={"5vh"}
          h={"5vh"}
          bgColor={"#white"}
          color={"#black"}
          display={"flex"}
          align={"center"}
          justify={"center"}
          onClick={() => navigate(-1)}
        >
          ←
        </Flex>
        <div>결제하기</div>
        <div>홈으로</div>
      </Flex>
      <Stack padding={"2vh"} bgColor={"#f5f5f5"}>
        <FormControl isRequired>
          <FormLabel>배송지</FormLabel>
          <Input
            placeholder="배달받을 주소를 입력하세요."
            onChange={(e) =>
              setFormData({ ...formData, order_address: e.target.value })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>주문 코드</FormLabel>
          <Input
            placeholder="매장에서 확인 가능한 주문 코드를 입력하세요."
            onChange={(e) =>
              setFormData({ ...formData, order_address: e.target.value })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>배송메세지</FormLabel>
          <Input
            placeholder="배송메세지를 입력하세요."
            onChange={(e) =>
              setFormData({ ...formData, order_address: e.target.value })
            }
          />
        </FormControl>
      </Stack>
      {/* {payMethod === "vbank" && (
        <div>
          예금주명
          <input></input>
        </div>
      )} */}
      <Stack padding={"2vh"} bgColor={"#f5f5f5"}>
        <FormControl isRequired>
          <FormLabel>배송지</FormLabel>
          <HStack gap={"1vh"}>
            <Button onClick={() => setPayMethod("kakaopay")}>카카오페이</Button>
            <Button onClick={() => setPayMethod("naverpayCard")}>
              네이버페이
            </Button>
            <Button onClick={() => setPayMethod("card")}>신용카드</Button>
            <Button onClick={() => setPayMethod("vbank")}>무통장입금</Button>
          </HStack>
        </FormControl>
      </Stack>

      <Stack width={"100%"} mt={"2vh"} gap={"2vh"} padding={"2vh"}>
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 주문금액</div>
          <div>{location.state.totalCost}원</div>
        </HStack>
        <Box style={{ borderBottom: "1px solid black" }} />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>결제예정금액</div>
          <div>{location.state.totalCost}원</div>
        </HStack>
      </Stack>

      <Flex
        id="button"
        align={"center"}
        justify={"center"}
        position={"absolute"}
        bottom={"2vh"}
        w={"100%"}
      >
        <Button w={"80%"} onClick={callNicePayPopup}>
          결제하기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Payment;
