import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase_conf";
import { getCart, postCart, updateCart } from "../../firebase/firebase_func";
import { formatCurrency } from "./home";
import { debug } from "../../firebase/api";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Menu(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setMenu(location.state.data);
  }, []);

  const addCart = async () => {
    if (location.state.inventory_count < count) {
      alert(
        `해당 상품의 재고 수량이 ${location.state.inventory_count}개 입니다.\n${location.state.inventory_count}개 이하로 구매 가능합니다.`
      );
      return;
    }
    // navigate(`/cart/${auth.currentUser.uid}`);
    if (window.confirm("장바구니에 추가하시겠습니까?")) {
      // 기존에 해당 id의 상품이 담겨있는 경우, 수량만 변경합니다.'
      const cartlist = await getCart(auth.currentUser.uid);
      const existCart = cartlist.cart.filter((item) => {
        console.log(item.product_id, menu.doc_id);
        if (item.product_id === menu.doc_id) {
          debug(
            "이미 장바구니에 해당 상품이 존재합니다.\n",
            item.product_id,
            "\n기존 수량 : ",
            item.count,
            "\n변경 된 수량 : ",
            item.count + count
          );

          // 상품 수량 업로드
          updateDoc(doc(db, "CART", item.doc_id), {
            count: item.count + count,
          });

          return item.doc_id;
        }
      });

      if (!existCart || existCart.length === 0) {
        // 장바구니 새로 추가
        postCart({
          ...location.state.data,
          uid: auth.currentUser.uid,
          count: count,
        });
      }
    }
  };

  return (
    <Stack
      position={"relative"}
      height={window.innerHeight}
      gap={"1vh"}
      alignItems={"space-between"}
    >
      <Stack overflow={"auto"}>
        <Stack id="banner">
          <Center pt={"64px"}>
            <Image
              objectFit={"cover"}
              height={"100%"}
              src={menu?.product_images?.[0].replace("http://", "https://")}
            ></Image>
          </Center>
        </Stack>
        <Flex
          h={"64px"}
          w={"100%"}
          position={"absolute"}
          top={0}
          left={0}
          p={"20px"}
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

        <Stack id="item" gap={"2vh"} p={"3vh"} bgColor={"white"}>
          <Text fontSize={"large"} fontWeight={"bold"}>
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
              onClick={() => {
                if (count > 1) {
                  setCount(count - 1);
                }
              }}
            />
            <Text>{count}</Text>
            <Image
              w={"20px"}
              h={"20px"}
              src={require("../../image/HiPlus.png")}
              onClick={() => {
                if (count < 100) {
                  setCount(count + 1);
                }
              }}
            />
          </Flex>
        </Flex>
      </Stack>

      <Box h={"10vh"}>
        <Flex
          id="button"
          align={"center"}
          justify={"center"}
          w={"100%"}
          bgColor={"white"}
          position={"absolute"}
          bottom={"0"}
          p={"20px"}
        >
          <Button
            w={"100%"}
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
