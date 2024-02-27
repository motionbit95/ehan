import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../../firebase/firebase_func";
import { auth } from "../../firebase/firebase_conf";
import { Flex, Box, Button, HStack, Image, Stack } from "@chakra-ui/react";
function Cart(props) {
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

  useEffect(() => {
    // 현재 유저 세션에 담긴 장바구니 정보를 가지고 옵니다.
    getCartList();
  }, []);
  return (
    <Stack gap={"1vh"}>
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
        <div>장바구니</div>
        <div>홈</div>
      </Flex>
      <Stack p={"2vh"}>
        {cartList?.map((item) => (
          <Stack
            w={"100%"}
            bgColor={"white"}
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
                  <div>{item.product_name}</div>
                  <div>{item.product_price}원</div>
                </Stack>
              </HStack>
              <Stack
                display={"flex"}
                direction={"row"}
                align={"center"}
                justify={"center"}
                bgColor={"#d9d9d9"}
                color={"white"}
                g={"3vh"}
                h={"5vh"}
                p={"1vh 3vh"}
                borderRadius={"15px"}
              >
                <div>-</div>
                <div>{item.count}</div>
                <div>+</div>
              </Stack>
            </Flex>
          </Stack>
        ))}
      </Stack>
      <Stack width={"100%"} mt={"2vh"} gap={"2vh"} p={"2vh"}>
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>총 주문금액</div>
          <div>{totalCost}원</div>
        </HStack>
        <Box style={{ borderBottom: "1px solid black" }} />
        <HStack justifyContent={"space-between"} width={"100%"}>
          <div>결제예정금액</div>
          <div>{totalCost}원</div>
        </HStack>
      </Stack>
      <Flex id="button" display={"flex"} align={"center"} justify={"center"}>
        <Button
          w={"80%"}
          mt={"2vh"}
          onClick={() => navigate("/payment", { state: totalCost })}
        >
          결제하기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Cart;
