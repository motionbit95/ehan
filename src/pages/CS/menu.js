import { Button, Flex, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase_conf";
import { postCart } from "../../firebase/firebase_func";

function Menu(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setMenu(location.state);
  }, []);

  const addCart = () => {
    // navigate(`/cart/${auth.currentUser.uid}`);
    if (window.confirm("장바구니에 추가하시겠습니까?")) {
      postCart({ ...location.state, uid: auth.currentUser.uid, count: count });
    }
  };
  return (
    <Stack
      gap={"2vh"}
      w={"100%"}
      id="container"
      position={"relative"}
      height={"100vh"}
    >
      <Stack
        id="banner"
        h={"30vh"}
        display={"flex"}
        justify={"flex-start"}
        bgColor={"#8c8c8c"}
      >
        <Flex
          display={"flex"}
          h={"5vh"}
          margin={"3vh"}
          align={"center"}
          justify={"space-between"}
          bgColor={"white"}
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
          <Flex
            w={"5vh"}
            h={"5vh"}
            onClick={() => navigate(`/cart`, { state: auth.currentUser.uid })}
          >
            장바구니
          </Flex>
        </Flex>
      </Stack>

      <Stack id="item" gap={"2vh"} p={"3vh"} bgColor={"white"}>
        <div>{menu?.product_name}</div>
        <hr />
        <Flex display={"flex"} justify={"space-between"}>
          <div>가격</div>
          <div>{menu?.product_price}원</div>
        </Flex>
      </Stack>
      <Flex id="count" bgColor={"white"} justify={"space-between"} p={"3vh"}>
        <div>수량</div>
        <div style={{ display: "flex", gap: "1vh" }}>
          <div onClick={() => setCount(count - 1)}>-</div>
          <div>{count}</div>
          <div onClick={() => setCount(count + 1)}>+</div>
        </div>
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
          {menu?.product_price * count}원 담기
        </Button>
      </Flex>
    </Stack>
  );
}

export default Menu;
