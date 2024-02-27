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
  VStack,
} from "@chakra-ui/react";
import { formatCurrency } from "./home";

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
  };

  return (
    <Stack position={"relative"} height={"auto"}>
      <Flex
        bgColor={"white"}
        align={"center"}
        w={"100%"}
        h={"40px"}
        py={"25px"}
        justify={"space-between"}
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
      <Stack width={"100%"} padding={"1vh 2vh"} bgColor={"#f1f1f1"} gap={"4vh"}>
        <Stack gap={"0"}>
          <Text fontSize={"large"} fontWeight={"bold"} color={"#e53e3e"}>
            {data.resultCode === "0000" ? "결제가 완료되었습니다." : ""}
          </Text>

          {order?.pay_product?.length > 0 && (
            <Text fontSize={"xx-large"} fontWeight={"bold"}>
              {order.pay_product[0].product_name} 외 {order.pay_product.length}
              건
            </Text>
          )}
        </Stack>
        <Stack gap={"0"}>
          <Text>주문일시 : {data.ediDate}</Text>
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
        bgColor={"#f1f1f1"}
      >
        {order?.pay_product?.length > 0 &&
          order.pay_product.map((value, index) => (
            <>
              <HStack gap={"1vh"}>
                <Text>{value.product_name}</Text>
                <Text>{value.count}개</Text>
              </HStack>
              <Text>{value.product_price}원</Text>
              <Box borderBottom={"1px solid gray"} />
            </>
          ))}
      </Stack>
      <Stack width={"100%"} gap={"1vh"} padding={"2vh"} bgColor={"#f1f1f1"}>
        <HStack
          justifyContent={"space-between"}
          width={"100%"}
          fontSize={"large"}
        >
          <Text>총 주문금액</Text>
          <Text>{formatCurrency(data.amount)}원</Text>
        </HStack>
        <Box borderBottom={"1px solid gray"} />
        <HStack
          fontSize={"x-large"}
          fontWeight={"bold"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Text>총 결제금액</Text>
          <Text>{formatCurrency(data.amount)}원</Text>
        </HStack>
        <HStack fontSize={"large"} justify={"space-between"}>
          <Text>결제방법</Text>
          <Stack textAlign={"right"}>
            {data.payMethod === "card" ? (
              <Stack>
                <Text>카드</Text>
                {/* <div>{data.vbank.vbankName}</div> */}
              </Stack>
            ) : data.payMethod === "vbank" ? (
              <Stack gap={"0"}>
                <Text>무통장입금</Text>
                <Text fontSize={"medium"} color={"gray"}>
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
  );
}

export default Result;
