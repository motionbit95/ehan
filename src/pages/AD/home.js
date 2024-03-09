import React, { useEffect, useState } from "react";
import {
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import RFilter from "../../components/RFilter";
import { useGlobalState } from "../../GlobalState";
import {
  getFilteredShop,
  getPayment,
  getTotalOrder,
} from "../../firebase/firebase_func";
import { debug } from "../../firebase/api";
import { formatCurrency } from "../CS/home";

function Home(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const { admin } = useGlobalState();

  const [dateRange, setDateRange] = useState([
    new Date(
      `${new Date().getFullYear()}-${new Date().getMonth()}-${
        new Date().getDate() + 1
      }`
    ),
    new Date(),
  ]);
  const [shopList, setShopList] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalOrigin, setTotalOrigin] = useState(0);

  async function getFilteredCategory(value) {
    // 카테고리로 분류된 상점 리스트를 반환받습니다.
    let filteredShop = await getFilteredShop(value);
    setShopList(filteredShop);

    let totalCost = 0;
    let totalOrigin = 0;
    // 모든 거래내역 중에서 필터 된 상품의 거래내역만 가지고 옵니다.
    for (var i = 0; i < filteredShop.length; i++) {
      const orders = await getTotalOrder(dateRange, filteredShop[i].doc_id);
      totalCost += orders.totalPrice;
      totalOrigin += orders.totalOriginPrice;
    }

    setTotalCost(totalCost);
    setTotalOrigin(totalOrigin);

    debug("총 매출 :", totalCost, "\n실 매출 : ", totalCost - totalOrigin);
  }

  return (
    <Flex w={"100%"} h={"calc(100% - 48px)"}>
      {isDesktop ? (
        <Stack
          position={"absolute"}
          w={"calc(100% - 200px)"}
          h={"calc(100% - 48px)"}
          top={"48px"}
          left={"200px"}
          // p={"2vh"}
        >
          <RFilter
            useSearch={false}
            shopList={props.shopList}
            admin={admin}
            onChangeCategory={(value) => getFilteredCategory(value)}
            onChangeDateRange={(value) => setDateRange(value)}
          />
          {/* desktop 에서의 레이아웃 */}
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            <HStack w={"100%"} h={"20%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
                p={"20px"}
              >
                <Stack w={"100%"}>
                  <Text>총 매출</Text>
                  <Skeleton w={"100%"} isLoaded={totalCost}>
                    <HStack>
                      <Text fontSize={"3xl"} fontWeight={"bold"}>
                        {formatCurrency(totalCost)}
                      </Text>
                      <Text>원</Text>
                    </HStack>
                  </Skeleton>
                </Stack>
              </Flex>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
                p={"20px"}
              >
                <Stack w={"100%"}>
                  <Text>실 매출</Text>
                  <Skeleton w={"100%"} isLoaded={totalOrigin}>
                    <HStack>
                      <Text fontSize={"3xl"} fontWeight={"bold"}>
                        {formatCurrency(totalCost - totalOrigin)}
                      </Text>
                      <Text>원</Text>
                    </HStack>
                  </Skeleton>
                </Stack>
              </Flex>
            </HStack>
            <HStack w={"100%"} h={"40%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
            </HStack>
            <HStack w={"100%"} h={"40%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
            </HStack>
          </Stack>
        </Stack>
      ) : (
        <Flex bgColor={"green"} w={"100%"} h={"100%"}>
          <RFilter
            shopList={props.shopList}
            admin={admin}
            onChangeCategory={(value) => getFilteredCategory(value)}
            onChangeDateRange={(value) => setDateRange(value)}
          />
        </Flex>
      )}
    </Flex>
  );
}

export default Home;
