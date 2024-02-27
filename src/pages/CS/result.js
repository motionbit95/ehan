import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPayment, postPayment } from "../../firebase/firebase_func";
import { Box, Flex, HStack, Stack, VStack } from "@chakra-ui/react";
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
    console.log(order);
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
    <Stack position={"relative"} height={"100vh"}>
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
      <Stack width={"100%"} padding={"1vh 2vh"} bgColor={"#f5f5f5"} gap={"3vh"}>
        <div>{data.resultCode === "0000" ? "결제가 완료되었습니다." : ""}</div>
        <div>
          <div>주문일시 : {data.ediDate}</div>
          <div>주문번호 : {data.orderId}</div>
          <div>배송지 : {order.order_address}</div>
          <div>주문코드 : {order.order_code}</div>
          <div>배송메세지 : {order.order_message}</div>
        </div>
        <div>결제 영수증 보기</div>
      </Stack>
      <Stack width={"100%"} mt={"2vh"} gap={"1vh"} padding={"2vh"}>
        <HStack gap={"1vh"}>
          <div>상품이름</div>
          <div>상품 개수</div>
        </HStack>
        <div>상품가격</div>
      </Stack>
      <Stack
        width={"100%"}
        mt={"2vh"}
        gap={"2vh"}
        padding={"2vh"}
        bgColor={"#f5f5f5"}
      >
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 주문금액</div>
          <div>{formatCurrency(location.state)}원</div>
        </HStack>
        <Box borderBottom={"1px solid gray"} />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 결제금액</div>

          <div>{formatCurrency(data.amount)}원</div>
        </HStack>
        <HStack>
          <div>결제방법</div>
          {data.payMethod === "card" ? (
            <Stack>
              <div>카드</div>
              {/* <div>{data.vbank.vbankName}</div> */}
            </Stack>
          ) : data.payMethod === "vbank" ? (
            <Stack>
              <div>무통장입금</div>
              <div>{data.vbank.vbankName}</div>
            </Stack>
          ) : (
            <div>전체</div>
          )}
        </HStack>
      </Stack>
    </Stack>
  );
}

export default Result;
