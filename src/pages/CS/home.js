import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../../firebase/firebase_conf";
import { doc, getDoc } from "firebase/firestore";
import {
  fetchProducts,
  getMessageToken,
  handleMessage,
} from "../../firebase/firebase_func";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Skeleton,
  SkeletonText,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/RFooter";

export function formatCurrency(number, currencyCode = "KRW") {
  const formattedNumber = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currencyCode,
  }).format(number);

  return formattedNumber.substring(1);
}

function Home(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const shop_id = window.location.pathname.split("/")[2];
  const [isScrolled, setIsScrolled] = useState(false);

  // 리액트 컴포넌트 내에서 실행되는 코드
  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // shop id로 샵 정보를 가지고 오는 함수
    const handleShopInfo = async () => {
      try {
        // shop id로 샵 정보가져오기
        const docRef = doc(db, "SHOP", shop_id);
        const docSnap = await getDoc(docRef);
        setShopInfo(docSnap.data());

        // 상품 리스트 업데이트
        fetchProducts("PRODUCT", "product_category", shop_id).then((data) => {
          setProductList(data);
          setCategories(Array.from(data.categories));
        });
      } catch (error) {
        console.error("shop id로 샵 정보가져오기 오류 발생:", error);
      }
      getMessageToken();
    };

    // 익명 로그인을 처리하는 함수
    const handleAnonymousLogin = async () => {
      try {
        // 익명 로그인을 처리합니다.
        await signInAnonymously(auth)
          .then((userCredential) => {
            // Signed in..
            // 로그인 성공
            const uid = userCredential.user.uid;
            setUser(uid); // UID 설정
            console.log(uid);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
          });
      } catch (error) {
        console.error("익명 로그인 중 오류 발생:", error);
      }
    };

    // 컴포넌트가 마운트될 때 shop 정보 가지고오기 & 익명 로그인을 수행합니다.
    if (!user) {
      if (!window.location.pathname.includes("admin")) {
        handleShopInfo();
        handleAnonymousLogin();
      }
    }
  }, []); // useEffect가 최초 한 번만 실행되도록 빈 배열을 전달합니다.

  const moveToScroll = (id) => {
    console.log(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Stack
      id="container"
      position={"relative"}
      height={"auto"}
      bgColor={"white"}
    >
      <Skeleton isLoaded={shopInfo !== null}>
        <Stack
          id="banner"
          height={"40vh"}
          flexDirection={"column"}
          alignItems={"center"}
          backgroundImage={`url(${shopInfo?.shop_img})`}
          backgroundSize={"cover"}
          backgroundPosition={"center"}
          backgroundRepeat={"no-repeat"}
          opacity={"0.7"}
          padding={"2vh 3vh"}
        >
          <Flex
            id="header"
            height={"10vh"}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
          >
            <Image
              src={shopInfo?.logo_img}
              alt="logo_img"
              // w={"7vh"}
              h={"48px"}
              objectFit={"cover"}
              // bgColor={"white"}
              borderRadius={"8px"}
              onClick={() =>
                navigate(`/home/${shopInfo.doc_id}`, {
                  state: {
                    uid: auth.currentUser.uid,
                    shop_id: shopInfo.doc_id,
                  },
                })
              }
            />
            <Button
              bgColor={"white"}
              w={"5vh"}
              h={"5vh"}
              borderRadius={"100%"}
              p={"0"}
            >
              <Image
                w={"3vh"}
                h={"3vh"}
                src={require("../../image/ShoppingCart.png")}
                onClick={() =>
                  navigate(`/cart`, {
                    state: {
                      uid: auth.currentUser.uid,
                      shop_id: shop_id,
                    },
                  })
                }
              />
            </Button>
          </Flex>
          <Flex
            id="title"
            w={"100%"}
            h={"10vh"}
            justify={"space-between"}
            alignItems={"center"}
          >
            <Flex
              direction={"row"}
              align={"center"}
              backgroundColor={"white"}
              width={"100%"}
              h={"7vh"}
              opacity={"0.8"}
              borderRadius={"1vh"}
            >
              <Flex w={"7vh"} h={"7vh"} align={"center"} justify={"center"}>
                <Image
                  w={"3vh"}
                  h={"2vh"}
                  bgColor={"white"}
                  src={require("../../image/th_tag.png")}
                />
              </Flex>
              <Text color={"black"} fontSize={"medium"}>
                {shopInfo?.shop_name}
              </Text>
            </Flex>
          </Flex>
        </Stack>
      </Skeleton>
      <Stack p={"2vh"}>
        <Stack
          className="scroll_view"
          overflowX="scroll"
          hideScrollbar
          maxW={"100vw"}
          whiteSpace={"nowrap"}
          position={"sticky"}
          bgColor={"white"}
          top={"0"}
          py={"5px"}
        >
          {/* Set 객체의 각 요소를 반복하여 JSX로 표시 */}
          <Skeleton isLoaded={shopInfo !== null} minH={"35px"}>
            <Tabs variant="solid-rounded" colorScheme="red" isLazy>
              <TabList gap={"8px"} flexBasis={"content"}>
                {categories?.map((item, index) => (
                  <Tab
                    onClick={() => moveToScroll(item)}
                    w={"auto"}
                    height={"35px"}
                    key={index}
                  >
                    {item}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </Skeleton>
        </Stack>
        {shopInfo === null && (
          <Stack>
            <SkeletonText isLoaded={shopInfo !== null} />
            <SkeletonText isLoaded={shopInfo !== null} />
            <SkeletonText isLoaded={shopInfo !== null} />
          </Stack>
        )}
        <Stack id="products">
          {categories?.map((category, index) => (
            <Stack id={category} className="category-box" paddingTop={"1vh"}>
              <Text mt={"10px"} fontSize={"large"} fontWeight={"bold"}>
                {category}
              </Text>
              {/* Set 객체의 각 요소를 반복하여 JSX로 표시 */}
              {productList?.products?.map(
                (item, index) =>
                  category === item.product_category && (
                    <Flex
                      p={"10px"}
                      bgColor={"#f1f1f1"}
                      key={index}
                      borderRadius={"10px"}
                    >
                      <HStack
                        onClick={() =>
                          navigate(`/menu`, {
                            state: { data: item, shop_id: shopInfo?.doc_id },
                          })
                        }
                        width={"100%"}
                        spacing={"20px"}
                        cursor={"pointer"}
                      >
                        {item.product_images &&
                        item.product_images.length > 0 ? (
                          <Image
                            objectFit={"cover"}
                            bgColor={"#d9d9d9"}
                            width={"100px"}
                            height={"100px"}
                            marginLeft={"1vh"}
                            borderRadius={"10px"}
                            alt=""
                            src={
                              item.product_images
                                ? item.product_images[0].replaceAll(
                                    "http",
                                    "https"
                                  )
                                : ""
                            }
                          />
                        ) : (
                          <Box
                            borderRadius={"10px"}
                            bgColor={"#d9d9d9"}
                            marginLeft={"1vh"}
                            width={"100px"}
                            height={"100px"}
                          />
                        )}
                        <Stack gap={"10px"} height={"100%"} p={"10px"}>
                          <Text fontSize={"large"} fontWeight={"bold"}>
                            {item.product_name}
                          </Text>
                          <Text color="#9B2C2C" fontWeight={"bold"}>
                            {formatCurrency(item.product_price)}원
                          </Text>
                        </Stack>
                      </HStack>
                    </Flex>
                  )
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Footer
        companyName="레드스위치"
        ceoName="이한샘"
        businessNumber="208-16-70116"
        address="서울특별시 강남구 역삼로 114, 8층 82호(역삼동, 현죽빌딩)"
        commNumber="2024-서울강남-1234"
        tel="02-1234-1234"
        mail="redswitch@redswitch.kr"
      />
    </Stack>
  );
}

export default Home;
