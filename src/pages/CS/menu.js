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
    <Stack gap={"2vh"} id="container" position={"relative"} height={"100vh"}>
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
            onClick={() => navigate(`/cart`, { state: auth.currentUser.uid })}
          />
        </Flex>
      </Stack>

      <Stack id="item" gap={"2vh"} p={"3vh"} bgColor={"white"}>
        <div>{menu?.product_name}</div>
        <hr />
        <Flex display={"flex"} justify={"space-between"}>
          <div>가격</div>
          <div>{formatCurrency(menu?.product_price)}원</div>
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
        >
          <Text onClick={() => setCount(count - 1)}>-</Text>
          <Text>{count}</Text>
          <Text onClick={() => setCount(count + 1)}>+</Text>
        </Flex>
      </Flex>

      <Flex
        id="button"
        align={"center"}
        justify={"center"}
        position={"absolute"}
        bottom={"2vh"}
        w={"100%"}
      >
        <Button w={"80%"} onClick={addCart}>
          {formatCurrency(menu?.product_price * count)}원 담기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Menu;
