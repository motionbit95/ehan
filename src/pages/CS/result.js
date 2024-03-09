import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPayment, postPayment } from "../../firebase/firebase_func";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatCurrency } from "./home";
import { debug } from "../../firebase/api";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";

function Result(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const payresult = decodeURIComponent(location.search);
  const data = JSON.parse(payresult.substring(1).replace("data=", ""));
  const [order, setOrder] = useState({});
  useEffect(() => {
    console.log(data);
    // 주문번호로 문서를 찾은 다음 결제 정보 업데이트
    getOrder();
  }, []);

  const getOrder = async () => {
    const order = await getPayment(data.orderId);
    console.log(order.pay_product);
    setOrder(order);

    // 받은 결제 정보 업데이트 하는 부분
    await postPayment({
      ...order,
      pay_date: data.paidAt,
      pay_price: data.amount,
      pay_id: data.tid,
      pay_method: data.payMethod,
      pay_state: data.resultCode,
      pay_result: data.resultMsg,
      receipt_url: data.receiptUrl,
      createAt: new Date(), // 현재 시간
    });

    if (data.resultCode === "0000") {
      // 결제에 성공했다면
      // 장바구니의 상품을 삭제합니다.

      const products = order.pay_product;
      for (let i = 0; i < products.length; i++) {
        debug("장바구니 id의 상품을 삭제합니다. ", products[i].doc_id);
        await deleteDoc(doc(db, "CART", products[i].doc_id));
      }
    }
  };

  return (
    <Stack position={"relative"} height={"100vh"}>
      <Stack overflow={"scroll"}>
        <Flex
          bgColor={"white"}
          align={"center"}
          w={"100%"}
          h={"40px"}
          p={"25px 20px"}
          justify={"space-between"}
          position={"sticky"}
          top={"0"}
          zIndex={"20"}
          boxShadow={"lg"}
        >
          <Image
            w={"24px"}
            h={"24px"}
            onClick={() => navigate(-1)}
            src={require("../../image/CkChevronLeft.png")}
          />
          <Text fontSize={"large"} fontWeight={"bold"}>
            주문내역
          </Text>
          <Image
            src={require("../../image/Homebutton.png")}
            onClick={() => navigate(`/home/${order.shop_id}`)}
          />
        </Flex>
        <Stack width={"100%"} padding={"1vh 2vh"} bgColor={"white"} gap={"4vh"}>
          <Stack gap={"0"}>
            <Text fontSize={"md"} fontWeight={"bold"} color={"#e53e3e"}>
              {data.resultCode === "0000" ? "결제가 완료되었습니다." : ""}
            </Text>

            {order?.pay_product?.length > 0 && (
              <Text fontSize={"x-large"} fontWeight={"bold"}>
                {order.pay_product[0].product_name} 외{" "}
                {order.pay_product.length}건
              </Text>
            )}
          </Stack>
          <Stack fontSize={"md"} gap={"0"}>
            <Text>주문일시 : {data.ediDate.split("T")[0]}</Text>
            <Text>주문번호 : {data.orderId}</Text>
            <Text>배송지 : {order.order_address}</Text>
            <Text>주문코드 : {order.order_code}</Text>
            <Text>배송메세지 : {order.order_message}</Text>
            <Text>연락처 : {order.user_phone}</Text>
          </Stack>
          <Box>
            <Button
              border={"1px solid #e53e3e"}
              bgColor={"white"}
              color={"#e53e3e"}
              size={"xs"}
              onClick={() => {
                navigate(`/search/`);
              }}
            >
              결제 영수증 보기
            </Button>
          </Box>
        </Stack>
        <Stack
          width={"100%"}
          gap={"1vh"}
          padding={"2vh"}
          fontSize={"large"}
          fontWeight={"bold"}
          bgColor={"white"}
        >
          {order?.pay_product?.length > 0 &&
            order.pay_product.map((value, index) => (
              <Box key={index}>
                <HStack gap={"1vh"}>
                  <Text>{value.product_name}</Text>
                  <Text>{value.count}개</Text>
                </HStack>
                <Text>{formatCurrency(value.product_price)}원</Text>
                {index !== order?.pay_product?.length - 1 && (
                  <Box borderBottom={"1px solid #d9d9d9"} />
                )}
              </Box>
            ))}
        </Stack>
        <Stack width={"100%"} gap={"1vh"} padding={"2vh"} bgColor={"white"}>
          <HStack
            justifyContent={"space-between"}
            width={"100%"}
            fontSize={"md"}
          >
            <Text>총 주문금액</Text>
            <Text>{formatCurrency(data.amount)}원</Text>
          </HStack>
          <Box borderBottom={"1px solid gray"} />
          <HStack
            fontSize={"larger"}
            fontWeight={"bold"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Text>총 결제금액</Text>
            <Text>{formatCurrency(data.amount)}원</Text>
          </HStack>
          <HStack justify={"space-between"}>
            <Text fontSize={"md"}>결제방법</Text>
            <Stack textAlign={"right"}>
              {data.payMethod === "card" ? (
                <Stack>
                  <Text fontSize={"large"}>카드</Text>
                  {/* <div>{data.vbank.vbankName}</div> */}
                </Stack>
              ) : data.payMethod === "vbank" ? (
                <Stack gap={"0"}>
                  <Text fontSize={"md"}>무통장입금</Text>
                  <Text fontSize={"sm"} color={"gray"}>
                    {data.vbank.vbankName}
                  </Text>
                </Stack>
              ) : (
                <Text>전체</Text>
              )}
            </Stack>
          </HStack>
        </Stack>
        <Box h={"15vh"} />
      </Stack>
    </Stack>
  );
}

export default Result;
