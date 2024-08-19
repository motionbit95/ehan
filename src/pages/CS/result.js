import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPayment,
  getShopName,
  postPayment,
  readInventoryData,
  updateInventoryData,
} from "../../firebase/firebase_func";
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
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";

function Result(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const payresult = decodeURIComponent(location.search);
  const data = JSON.parse(payresult.substring(1).replace("data=", ""));
  const [order, setOrder] = useState({});
  const [inventoryList, setInventoryList] = useState([]);
  const [shopName, setShopName] = useState("");
  useEffect(() => {
    console.log(data);
    // 주문번호로 문서를 찾은 다음 결제 정보 업데이트
    getOrder();
  }, []);

  useEffect(() => {
    const products = order.pay_product;
    for (let i = 0; i < products?.length; i++) {
      console.log(
        "재고수량을 업데이트 합니다.",
        products[i].product_id,
        products[i].count
      );
      updateInventoryData(
        products[i].shop_id,
        products[i].product_id,
        products[i].product_name,
        products[i].count
      );
    }
  }, [inventoryList]);

  const getOrder = async () => {
    let orderId = data.orderId ? data.orderId : data.order_id;
    const order = await getPayment(orderId);
    // console.log(order.pay_product);
    setOrder(order);

    console.log(orderId);

    setShopName(await getShopName(order.shop_id));

    // 이미 order 정보가 들어있는 경우 아래의 과정을 생략합니다. (새로고침등의 이벤트에서 Data가 저장되는 것을 방지)
    if (order.pay_state) return;

    const inventoryList = await readInventoryData(order.shop_id);
    setInventoryList(inventoryList);

    // 받은 결제 정보 업데이트 하는 부분
    postPayment({
      ...order,
      pay_date: data.paidAt,
      vbank: data.vbank ? data.vbank : "",
      pay_state: data.resultCode,
      createAt: new Date(), // 현재 시간
    })
      .then(async (res) => {
        // 알림을 발생시킵니다.
        addDoc(collection(db, "ALARM"), {
          type: "order",
          shop_id: order.shop_id,
          createAt: new Date(),
          order_id: order.doc_id,
          alarm_code: "I001",
          alarm_title: `${order.doc_id} 주문이 접수되었습니다.`,
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Stack position={"relative"} height={window.innerHeight}>
      <Stack overflow={"auto"}>
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
            onClick={() => navigate(`/home/${order?.shop_id}`)}
          />
        </Flex>
        <Stack width={"100%"} padding={"1vh 2vh"} bgColor={"white"} gap={"4vh"}>
          <Stack gap={"0"}>
            <Text fontSize={"md"} fontWeight={"bold"} color={"#e53e3e"}>
              {data?.resultCode === "0000"
                ? "결제가 완료되었습니다."
                : data?.resultCode === "1000"
                ? "주문이 환불 처리되었습니다."
                : ""}
            </Text>

            {order?.pay_product?.length > 0 && (
              <Text fontSize={"x-large"} fontWeight={"bold"}>
                {order?.pay_product[0].product_name} 외{" "}
                {order?.pay_product.length}건
              </Text>
            )}
          </Stack>
          <Stack fontSize={"md"} gap={"0"}>
            <Text>
              주문일시 : {data?.paidAt.slice(0, 4)}.{data?.paidAt.slice(4, 6)}.
              {data?.paidAt.slice(6, 8)} {data?.paidAt.slice(8, 10)}:
              {data?.paidAt.slice(10, 12)}
            </Text>
            <Text>주문번호 : {order?.order_id}</Text>
            <Text>지점 : {shopName}</Text>
            <Text>호실 : {order?.order_code}</Text>
            <Text>배송메세지 : {order?.order_message}</Text>
            <Text>연락처 : {order?.user_phone}</Text>
          </Stack>
          {/* <Box>
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
          </Box> */}
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
            order?.pay_product.map((value, index) => (
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
            <Text>{formatCurrency(order?.amount)}원</Text>
          </HStack>
          <Box borderBottom={"1px solid gray"} />
          <HStack
            fontSize={"larger"}
            fontWeight={"bold"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Text>총 결제금액</Text>
            <Text>{formatCurrency(order?.amount)}원</Text>
          </HStack>
          <HStack justify={"space-between"}>
            <Text fontSize={"md"}>결제방법</Text>
            <Stack textAlign={"right"}>
              <Text>신용카드</Text>
            </Stack>
          </HStack>
        </Stack>
        <Box h={"15vh"} />
      </Stack>
    </Stack>
  );
}

export default Result;
