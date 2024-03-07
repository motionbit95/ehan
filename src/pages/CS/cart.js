import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart, updateCart } from "../../firebase/firebase_func";
import {
  Flex,
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  Center,
  CloseButton,
  Checkbox,
} from "@chakra-ui/react";
import { formatCurrency } from "./home";
import { deleteDoc, doc } from "firebase/firestore";
import { debug } from "../../firebase/api";
import { db } from "../../firebase/firebase_conf";
function Cart(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectList, setSelectList] = useState();
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

  const changeCartState = async (index, checked) => {
    console.log(index, checked);

    let modifiedArray = [];
    if (checked) {
      modifiedArray = [...selectList, cartList[index]];
      setSelectList(modifiedArray);
    } else {
      modifiedArray = cartList.filter((_, idx) => idx !== index);
      setSelectList(modifiedArray);
    }

    let totalCost = 0;
    for (var i = 0; i < modifiedArray.length; i++) {
      totalCost += modifiedArray[i].count * modifiedArray[i].product_price;
    }

    setTotalCost(totalCost);
  };

  const changeCartCount = async (index, count) => {
    const tempCart = [...cartList];
    tempCart[index].count = count;

    // console.log(tempCart);

    // 렌더링을 위한 장바구니 리스트 정보(UI DATA)를 저장
    setCartList(tempCart);

    // db의 장바구니 데이터를 수정합니다.
    await updateCart(tempCart[index]);

    // 총 금액을 업데이트 합니다.
    const cartlist = await getCart(location.state.uid);
    setTotalCost(cartlist.totalCost);
  };

  const deleteCart = async (doc_id) => {
    if (window.confirm("장바구니에서 해당 상품을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "CART", doc_id));
      debug("장바구니에서 상품을 삭제하였습니다.\ndoc_id :", doc_id);
      window.location.reload();
    }
  };

  return (
    <Stack gap={"1vh"} position={"relative"} height={"100vh"}>
      <Stack overflow={"scroll"}>
        <Flex
          bgColor={"white"}
          align={"center"}
          h={"40px"}
          p={"25px 20px"}
          justify={"space-between"}
          zIndex={"20"}
          boxShadow={"lg"}
          top={0}
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
          {cartList?.map((item, index) => (
            <Stack
              w={"100%"}
              bgColor={"#f1f1f1"}
              borderRadius={"10px"}
              key={item.doc_id}
            >
              <Flex width={"100%"} padding={"10px"}>
                <HStack w={"100%"} spacing={"20px"} align={"flex-start"}>
                  <Checkbox
                    onChange={(e) => changeCartState(index, e.target.checked)}
                    defaultChecked={true}
                    size={"lg"}
                    colorScheme="red"
                  />
                  {item.product_images && item.product_images.length > 0 ? (
                    <Image
                      bgColor={"#d9d9d9"}
                      width={"100px"}
                      height={"100px"}
                      borderRadius={"10px"}
                      alt=""
                      src={
                        item.product_images
                          ? item.product_images[0].replace("http", "https")
                          : ""
                      }
                    />
                  ) : (
                    <Box
                      borderRadius={"10px"}
                      bgColor={"#d9d9d9"}
                      width={"100px"}
                      height={"100px"}
                    />
                  )}
                  <Stack height={"100%"}>
                    <Text fontWeight={"bold"}>{item.product_name}</Text>
                    <Text color="#9B2C2C">
                      {formatCurrency(item.product_price)}원
                    </Text>
                  </Stack>
                </HStack>
                <CloseButton onClick={() => deleteCart(item.doc_id)} />
              </Flex>

              <Flex justifyContent={"flex-end"} margin={"0 2vh 2vh 0"}>
                <Flex
                  gap={"5vh"}
                  border={"1px solid #d9d9d9"}
                  p={"1vh"}
                  borderRadius={"1vh"}
                  align={"center"}
                  bgColor={"white"}
                >
                  <Image
                    w={"20px"}
                    h={"20px"}
                    src={require("../../image/HiMinus.png")}
                    onClick={() => {
                      if (item.count > 0) {
                        changeCartCount(index, item.count - 1);
                      }
                    }}
                  />
                  <Text>{item.count}</Text>
                  <Image
                    w={"20px"}
                    h={"20px"}
                    src={require("../../image/HiPlus.png")}
                    onClick={() => {
                      if (item.count < 100) {
                        changeCartCount(index, item.count + 1);
                      }
                    }}
                  />
                </Flex>
              </Flex>
            </Stack>
          ))}
          {cartList?.length === 0 && (
            <Center minH={"40vh"}>
              <Text color={"#8c8c8c"}>장바구니에 담긴 상품이 없습니다.</Text>
            </Center>
          )}
          <Stack></Stack>
        </Stack>
        <Stack width={"100%"} gap={"2vh"} p={"2vh"} bgColor={"white"}>
          <HStack justifyContent={"space-between"} width={"100%"}>
            <Text>총 주문금액</Text>
            <Text>{formatCurrency(totalCost)}원</Text>
          </HStack>
          <Box borderBottom={"1px solid #d9d9d9"} />
          <HStack justifyContent={"space-between"} width={"100%"}>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              결제예정금액
            </Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {formatCurrency(totalCost)}원
            </Text>
          </HStack>
        </Stack>
        <Text
          color="#8c8c8c"
          padding={"1vh 2vh"}
          fontSize={"small"}
          lineHeight={"1.5"}
        >
          레드스위치는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 따라서
          레드스위치는 상품, 거래정보 및 거래에 대하여 책임을 지지않습니다.
        </Text>
      </Stack>

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
        p={"2vh"}
      >
        <Button
          isDisabled={cartList?.length === 0 || totalCost === 0}
          w={"100%"}
          color={"white"}
          bgColor={"#e53e3e"}
          onClick={() =>
            navigate("/payment", {
              state: {
                totalCost: totalCost,
                productList: selectList ? selectList : cartList,
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
