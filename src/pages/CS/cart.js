import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../../firebase/firebase_func";
import {
  Flex,
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatCurrency } from "./home";
function Cart(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartList, setCartList] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  const getCartList = async () => {
    if (location.state) {
      console.log(location.state.uid);
      const cartlist = await getCart(location.state.uid);
      console.log(cartlist);
      setCartList(cartlist.cart);
      setTotalCost(cartlist.totalCost);
    }
  };

  useEffect(() => {
    // 현재 유저 세션에 담긴 장바구니 정보를 가지고 옵니다.
    getCartList();
  }, []);

  return (
    <Stack gap={"1vh"} position={"relative"}>
      <Flex
        bgColor={"white"}
        align={"center"}
        h={"40px"}
        py={"25px"}
        justify={"space-between"}
      >
        <Image
          w={"3vh"}
          h={"3vh"}
          onClick={() => navigate(-1)}
          src={require("../../image/CkChevronLeft.png")}
        />
        <Text fontSize={"large"} fontWeight={"bold"}>
          장바구니
        </Text>
        <Image
          src={require("../../image/Homebutton.png")}
          onClick={() => navigate(`/home/${location.state.shop_id}`)}
        />
      </Flex>
      <Stack p={"1vh"} bgColor={"white"}>
        {cartList?.map((item) => (
          <Stack
            w={"100%"}
            bgColor={"#f1f1f1"}
            borderRadius={"10px"}
            key={item.doc_id}
          >
            <Flex width={"100%"} padding={"1vh"}>
              <HStack w={"100%"}>
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
                  <Text fontWeight={"bold"}>{item.product_name}</Text>
                  <Text color="#9B2C2C">
                    {formatCurrency(item.product_price)}원
                  </Text>
                </Stack>
              </HStack>
            </Flex>
            <Flex justifyContent={"flex-end"} margin={"0 2vh 2vh 0"}>
              <Flex
                gap={"5vh"}
                border={"1px solid #d9d9d9"}
                p={"1vh"}
                borderRadius={"1vh"}
                align={"center"}
              >
                <Image
                  w={"20px"}
                  h={"20px"}
                  src={require("../../image/HiMinus.png")}
                />
                <Text>{item.count}</Text>
                <Image
                  w={"20px"}
                  h={"20px"}
                  src={require("../../image/HiPlus.png")}
                />
              </Flex>
            </Flex>
          </Stack>
        ))}
      </Stack>
      <Stack width={"100%"} gap={"2vh"} p={"2vh"} bgColor={"white"}>
        <HStack justifyContent={"space-between"} width={"100%"}>
          <Text>총 주문금액</Text>
          <Text>{formatCurrency(totalCost)}원</Text>
        </HStack>
        <Box borderBottom={"1px solid gray"} />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <Text>결제예정금액</Text>
          <Text>{formatCurrency(totalCost)}원</Text>
        </HStack>
      </Stack>
      <Text
        color="#8c8c8c"
        padding={"1vh 2vh"}
        fontSize={"x-small"}
        lineHeight={"1.5"}
      >
        레드스위치는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 따라서
        레드스위치는 상품, 거래정보 및 거래에 대하여 책임을 지지않습니다.
      </Text>

      <Box h={"15vh"} />
      <Flex
        id="button"
        align={"center"}
        justify={"center"}
        w={"100%"}
        h={"10vh"}
        bgColor={"white"}
        position={"absolute"}
        bottom={"0"}
      >
        <Button
          w={"80%"}
          color={"white"}
          bgColor={"#e53e3e"}
          onClick={() =>
            navigate("/payment", {
              state: {
                totalCost: totalCost,
                productList: cartList,
                shop_id: location.state.shop_id,
              },
            })
          }
        >
          결제하기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Cart;
