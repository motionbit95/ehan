import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase_conf";
import { postCart } from "../../firebase/firebase_func";
import { formatCurrency } from "./home";

function Menu(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setMenu(location.state.data);
  }, []);

  const addCart = () => {
    // navigate(`/cart/${auth.currentUser.uid}`);
    if (window.confirm("장바구니에 추가하시겠습니까?")) {
      postCart({
        ...location.state.data,
        uid: auth.currentUser.uid,
        count: count,
      });
    }
  };
  return (
    <Stack gap={"1vh"} id="container" position={"relative"} height={"100vh"}>
      <Stack id="banner" h={"30vh"} bgColor={"#8c8c8c"}>
        <Flex
          h={"5vh"}
          margin={"3vh"}
          align={"center"}
          justify={"space-between"}
        >
          <Image
            w={"3vh"}
            h={"3vh"}
            onClick={() => navigate(-1)}
            src={require("../../image/CkChevronLeft.png")}
          />
          <Image
            w={"3vh"}
            h={"3vh"}
            src={require("../../image/ShoppingCart.png")}
            onClick={() =>
              navigate(`/cart`, {
                state: {
                  uid: auth.currentUser.uid,
                  shop_id: location.state.shop_id,
                },
              })
            }
          />
        </Flex>
      </Stack>

      <Stack id="item" gap={"2vh"} p={"3vh"} bgColor={"white"}>
        <Text fontSize={"medium"} fontWeight={"bold"}>
          {menu?.product_name}
        </Text>
        <Flex
          display={"flex"}
          justify={"space-between"}
          fontSize={"medium"}
          fontWeight={"bold"}
        >
          <Text>가격</Text>
          <Text>{formatCurrency(menu?.product_price)}원</Text>
        </Flex>
      </Stack>
      <Flex
        id="count"
        bgColor={"white"}
        justify={"space-between"}
        p={"3vh"}
        align={"center"}
        fontSize={"medium"}
        fontWeight={"bold"}
      >
        <Text>수량</Text>
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
            onClick={() => setCount(count > 1 && count - 1)}
          />
          <Text>{count}</Text>
          <Image
            w={"20px"}
            h={"20px"}
            src={require("../../image/HiPlus.png")}
            onClick={() => setCount(count < 100 && count + 1)}
          />
        </Flex>
      </Flex>

      <Box h={"10vh"}>
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
            onClick={addCart}
          >
            {formatCurrency(menu?.product_price * count)}원 담기
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
}

export default Menu;
