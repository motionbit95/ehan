import {
  Button,
  Flex,
  HStack,
  Stack,
  Input,
  Box,
  FormControl,
  FormLabel,
  Text,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getShop,
  getShopName,
  postPayment,
} from "../../firebase/firebase_func";
import { auth } from "../../firebase/firebase_conf";
import { formatCurrency } from "./home";
import { PG_CLIENT_ID, SERVER_URL } from "../../firebase/api";

function Payment(props) {
  const { AUTHNICE } = window;
  const location = useLocation();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState("card");
  const [formData, setFormData] = useState({
    order_address: "",
    order_code: "",
    order_message: "",
    user_phone: "",
  });

  const shop_id = location.state?.shop_id;
  const [shopData, setShopData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    // 필수 정보가 입력되었을 때
    console.log("모든 정보가 입력되었습니다!!");
    // callNicePayPopup();

    window.location.replace(process.env.REACT_APP_SERVER_URL + `/payment`);
  };

  const callNicePayPopup = async () => {
    // PAYMENT DATA를 저장합니다.
    const order_id = random();
    console.log(location.state.productList);
    await postPayment({
      ...formData,
      shop_id: shop_id,
      uid: auth.currentUser.uid,
      order_id: order_id,
      pay_product: location.state.productList,
    });

    AUTHNICE.requestPay({
      clientId: PG_CLIENT_ID,
      method: payMethod,
      orderId: order_id,
      amount: location.state.totalCost,
      goodsName: "나이스페이-상품",
      returnUrl: SERVER_URL + "/serverAuth",
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

  useEffect(() => {
    console.log(shop_id);
    if (shop_id) {
      getShop(shop_id).then((res) => {
        console.log(res);
        setShopData(res);
      });
    }
  }, [shop_id]);

  return (
    <Stack
      position={"relative"}
      gap={"10px"}
      height={window.innerHeight}
      overflow={"auto"}
    >
      <Flex
        bgColor={"white"}
        align={"center"}
        w={"100%"}
        h={"40px"}
        p={"25px 20px"}
        justify={"space-between"}
        position={"sticky"}
        top={0}
        zIndex={"20"}
        boxShadow={"lg"}
      >
        <Image
          w={"3vh"}
          h={"3vh"}
          onClick={() => navigate(-1)}
          src={require("../../image/CkChevronLeft.png")}
        />
        <Text fontSize={"large"} fontWeight={"bold"}>
          결제하기
        </Text>
        <Image
          src={require("../../image/Homebutton.png")}
          onClick={() => navigate(`/home/${location.state.shop_id}`)}
        />
      </Flex>
      <form onSubmit={handleSubmit}>
        <Stack minH={"calc(100vh - 60px)"} justify={"space-between"}>
          <Stack overflow={"auto"}>
            <Stack padding={"2vh"} bgColor={"white"}>
              <FormControl isRequired>
                <FormLabel>지점</FormLabel>
                <Input
                  value={shopData?.shop_address + " " + shopData?.shop_name}
                  readOnly
                  placeholder="배달받을 지점의 주소를 입력하세요."
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_address: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>호실</FormLabel>
                <Input
                  placeholder="숙박중이신 호실을 입력해주세요."
                  onChange={(e) =>
                    setFormData({ ...formData, order_code: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>배송메세지</FormLabel>
                <Input
                  placeholder="배송메세지를 입력하세요."
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_message: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Text>연락처</Text>
                    <Text color={"gray.500"} fontSize={"xs"}>
                      미기입시 배송 알림을 전송하지 않습니다.
                    </Text>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder="알림받을 연락처를 입력해주세요."
                  onChange={(e) =>
                    setFormData({ ...formData, user_phone: e.target.value })
                  }
                />
              </FormControl>
            </Stack>

            <Stack padding={"2vh"} bgColor={"white"}>
              <FormControl isRequired>
                <FormLabel>결제수단</FormLabel>
                <HStack gap={"1vh"}>
                  {/* <Button
                    colorScheme={payMethod === "kakaopay" ? "red" : "gray"}
                    onClick={() => setPayMethod("kakaopay")}
                  >
                    카카오페이
                  </Button>
                  <Button
                    colorScheme={payMethod === "naverpayCard" ? "red" : "gray"}
                    onClick={() => setPayMethod("naverpayCard")}
                  >
                    네이버페이
                  </Button> */}
                  <Button
                    colorScheme={payMethod === "card" ? "red" : "gray"}
                    onClick={() => setPayMethod("card")}
                  >
                    신용카드
                  </Button>
                  <Button
                    colorScheme={payMethod === "vbank" ? "red" : "gray"}
                    onClick={() => setPayMethod("vbank")}
                  >
                    무통장입금
                  </Button>
                </HStack>
              </FormControl>
            </Stack>

            <Stack bgColor={"white"} width={"100%"} gap={"2vh"} padding={"2vh"}>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <Text fontSize={"md"}>총 주문금액</Text>
                <Text fontSize={"md"}>
                  {formatCurrency(location.state.totalCost)}원
                </Text>
              </HStack>
              <Box style={{ borderBottom: "1px solid #d9d9d9" }} />
              <HStack justifyContent={"space-between"} width={"100%"}>
                <Text fontWeight={"bold"} fontSize={"lg"}>
                  결제예정금액
                </Text>
                <Text fontWeight={"bold"} fontSize={"lg"}>
                  {formatCurrency(location.state.totalCost)}원
                </Text>
              </HStack>
            </Stack>
            <Text
              color="#8c8c8c"
              padding={"1vh 2vh"}
              fontSize={"x-small"}
              lineHeight={"1.5"}
            >
              레드스위치는 통신판매중개자이며, 통신판매의 당사자가 아닙니다.
              따라서 레드스위치는 상품, 거래정보 및 거래에 대하여 책임을
              지지않습니다.
            </Text>
          </Stack>
          <Flex
            id="button"
            align={"center"}
            justify={"center"}
            w={"100%"}
            bgColor={"white"}
            position={"sticky"}
            bottom={"0"}
            p={"20px"}
          >
            <Button w={"80%"} color={"white"} bgColor={"#e53e3e"} type="submit">
              {formatCurrency(location.state.totalCost)}원 결제하기
            </Button>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
}

export default Payment;
