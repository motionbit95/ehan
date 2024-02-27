import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../../firebase/firebase_conf";
import { doc, getDoc } from "firebase/firestore";
import { fetchProducts, getMessageToken } from "../../firebase/firebase_func";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    // shop id로 샵 정보를 가지고 오는 함수
    const handleShopInfo = async () => {
      try {
        // shop id로 샵 정보가져오기
        const docRef = doc(db, "SHOP", shop_id);
        const docSnap = await getDoc(docRef);
        setShopInfo(docSnap.data());

        // 상품 리스트 업데이트
        fetchProducts("PRODUCT", "product_category").then((data) => {
          setProductList(data);
          setCategories(Array.from(data.categories));
        });

        getMessageToken();
      } catch (error) {
        console.error("shop id로 샵 정보가져오기 오류 발생:", error);
      }
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
      handleShopInfo();
      handleAnonymousLogin();
    }
  }, []); // useEffect가 최초 한 번만 실행되도록 빈 배열을 전달합니다.
  return (
    <Stack id="container" position={"relative"} height={"100vh"}>
      <Stack
        id="banner"
        height={"30vh"}
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
          alignItems={"center"}
        >
          <Image
            src={shopInfo?.shop_logo}
            w={"7vh"}
            h={"7vh"}
            objectFit={"cover"}
            bgColor={"white"}
            borderRadius={"8px"}
            onClick={() => navigate(`/home/${shop_id}`)}
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
            opacity={"0.7"}
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
            <Text color={"#666666"} fontSize={"medium"}>
              {shopInfo?.shop_name}
            </Text>
          </Flex>
        </Flex>
      </Stack>
      <Stack p={"2vh"}>
        <Stack id="tab">
          {/* Set 객체의 각 요소를 반복하여 JSX로 표시 */}
          <Tabs variant="solid-rounded" colorScheme="cyan">
            <TabList gap={"8px"}>
              {categories?.map((item, index) => (
                <Tab height={"35px"} key={index}>
                  {item}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Stack>
        <Stack id="products">
          {categories?.map((category, index) => (
            <Stack className="category-box" paddingTop={"1vh"}>
              <Text fontSize={"large"} fontWeight={"bold"}>
                {category}
              </Text>
              {/* Set 객체의 각 요소를 반복하여 JSX로 표시 */}
              {productList?.products?.map(
                (item, index) =>
                  category === item.product_category && (
                    <Flex
                      p={"1vh"}
                      bgColor={"white"}
                      key={index}
                      borderRadius={"1vh"}
                    >
                      <HStack
                        onClick={() =>
                          navigate(`/menu`, {
                            state: { data: item, shop_id: shopInfo?.doc_id },
                          })
                        }
                        width={"100%"}
                        justifyContent={"space-between"}
                      >
                        <Stack gap={"10px"}>
                          <Text fontSize={"large"} fontWeight={"bold"}>
                            {item.product_name}
                          </Text>
                          <Text color="#9B2C2C">
                            {formatCurrency(item.product_price)}원
                          </Text>
                        </Stack>
                        {item.product_images &&
                        item.product_images.length > 0 ? (
                          <Image
                            bgColor={"#d9d9d9"}
                            width={"100px"}
                            height={"100px"}
                            marginLeft={"1vh"}
                            borderRadius={"10px"}
                            alt=""
                            src={
                              item.product_images ? item.product_images[0] : ""
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
                      </HStack>
                    </Flex>
                  )
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <div
        id="footer"
        style={{
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <div>Footer</div>
      </div>
    </Stack>
  );
}

export default Home;
