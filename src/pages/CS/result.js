import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPayment } from "../../firebase/firebase_func";
import { Box, Button, HStack, Stack, VStack } from "@chakra-ui/react";

function Result(props) {
  const location = useLocation();
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
  };

  return (
    <div>
      {" "}
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
        <div>주문내역</div>
        <div>홈으로</div>
      </div>
      <div>
        <div>{data.resultCode === "0000" ? "결제가 완료되었습니다." : ""}</div>
        <div>주문일시 : {data.ediDate}</div>
        <div>주문번호 : {data.orderId}</div>
        <div>배송지 : {order.order_address}</div>
        <div>주문코드 : {order.order_code}</div>
        <div>배송메세지 : {order.order_message}</div>
        <Button onClick={() => window.open(data.receiptUrl)}>
          결제영수증보기
        </Button>
      </div>
      <div>
        {order.pay_product?.map((value, index) => (
          <div key={index}>
            <div>
              {value.product_name} {value.count}개
            </div>
            <div>{value.product_price}원</div>
          </div>
        ))}
      </div>
      <Stack width={"100%"} mt={"2vh"} gap={"2vh"} padding={"2vh"}>
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 주문금액</div>
          <div>{data.amount}원</div>
        </HStack>
        <Box style={{ borderBottom: "1px solid black" }} />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 결제금액</div>
          <div>{data.amount}원</div>
        </HStack>
        <HStack>
          <div>결제방법</div>
          {data.payMethod === "card" ? (
            <div>카드</div>
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
    </div>
  );
}

export default Result;
