import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../../firebase/firebase_conf";
import { doc, getDoc } from "firebase/firestore";
import { fetchProducts } from "../../firebase/firebase_func";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
    <Stack
      id="container"
      style={{
        // gap: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        id="banner"
        height={"30vh"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        backgroundColor={"#d9d9d9"}
        backgroundImage={`url(${shopInfo?.shop_img})`}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        backgroundRepeat={"no-repeat"}
        opacity={"0.7"}
        padding={"2vh 3vh"}
        gap={"2vh"}
      >
        <Flex
          id="header"
          height={"10vh"}
          maxWidth={"700px"}
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Image
            src={shopInfo?.shop_logo}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          />
          <Button
            style={{
              backgroundColor: "white",
              width: "40px",
              height: "40px",
              borderRadius: "100%",
            }}
          >
            <Image
              bgColor={"#d9d9d9"}
              width={"24px"}
              height={"24px"}
              borderRadius={"10px"}
              objectFit={"cover"}
            />
          </Button>
        </Flex>
        <Flex
          id="title"
          width={"100%"}
          maxWidth={"700px"}
          height={"10vh"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            backgroundColor={"white"}
            width={"100%"}
            height={"60px"}
            opacity={"0.7"}
            borderRadius={"8px"}
          >
            <Flex
              width={"50px"}
              height={"50px"}
              bgColor={"white"}
              borderRadius={"8px"}
            >
              가상 이미지
            </Flex>
            <Flex>{shopInfo?.shop_name}</Flex>
          </Stack>
        </Flex>
      </Stack>
      <Stack p={"2vh"}>
        <Stack id="tab">
          {/* Set 객체의 각 요소를 반복하여 JSX로 표시 */}
          <Tabs
            variant="solid-rounded"
            colorScheme="orange"
            overflowX={"auto"}
            maxW={"100vw"}
          >
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
            <Stack className="category-box" paddingY={"1vh"}>
              <div>{category}</div>
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
                        onClick={() => navigate(`/menu`, { state: item })}
                        width={"100%"}
                        justifyContent={"space-between"}
                      >
                        <Stack gap={"10px"}>
                          <div>{item.product_name}</div>
                          <div>{item.product_price}원</div>
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
