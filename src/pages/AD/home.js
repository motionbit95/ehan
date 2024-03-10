import React, { PureComponent, useEffect, useState } from "react";
import {
  Center,
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
import DonutChart from "../../components/DonutChart";

function Home(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const { admin } = useGlobalState();

  const [shopFilter, setShopFilter] = useState(null);
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

  const [payMethod, setPayMethod] = useState([]);
  const [payProduct, setPayProduct] = useState([]);

  async function getFilteredCategory(value, range) {
    // 상태변수에 파라미터를 저장합니다.
    setShopFilter(value);
    setDateRange(range);

    // 카테고리로 분류된 상점 리스트를 반환받습니다.
    let filteredShop = await getFilteredShop(value);
    setShopList(filteredShop);

    let payMethod = [
      { label: "card", name: "카드", value: 0 },
      { label: "vbank", name: "무통장입금", value: 0 },
      { label: "kakaopay", name: "카카오페이", value: 0 },
      { label: "naverpayCard", name: "네이버페이", value: 0 },
    ];

    let payProduct = [];

    let totalCost = 0;
    let totalOrigin = 0;
    // 모든 거래내역 중에서 필터 된 상품의 거래내역만 가지고 옵니다.
    for (var i = 0; i < filteredShop.length; i++) {
      const orders = await getTotalOrder(range, filteredShop[i].doc_id);
      totalCost += orders.totalPrice;
      totalOrigin += orders.totalOriginPrice;

      for (var j = 0; j < orders.order.length; j++) {
        for (let k = 0; k < payMethod.length; k++) {
          if (payMethod[k].label === orders.order[j].pay_method) {
            // 해당 객체의 value 수정
            payMethod[k].value += 1; // newValue에 새로운 값을 할당
            break; // 값을 찾았으므로 루프 중단
          }
        }
        orders.order[j].pay_product.forEach((product) => {
          let found = payProduct.find(
            (item) => item.name === product.product_name
          );

          // 만약 해당 상품이 이미 payProduct 배열에 존재하는 경우
          if (found) {
            // 카운트 증가
            found.value += product.count;
          } else {
            // payProduct 배열에 새로운 객체 추가
            payProduct.push({
              name: product.product_name,
              value: product.count,
            });
          }
        });
      }
    }

    if (totalCost === 0) {
      alert("해당기간에는 매출이 존재하지 않습니다.");
      return;
    }

    // 차트데이터를 입력합니다.
    setPayProduct(payProduct);
    setPayMethod(payMethod);

    // 매출 매입 데이터를 입력합니다.
    setTotalCost(totalCost);
    setTotalOrigin(totalOrigin);
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
            onChangeCategory={(value) => getFilteredCategory(value, dateRange)}
            onChangeDateRange={(value) =>
              getFilteredCategory(shopFilter, value)
            }
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
                <Stack w={"100%"} justify={"center"}>
                  <Text>총 매출</Text>
                  <Skeleton w={"100%"} isLoaded={totalCost}>
                    <HStack>
                      <Text fontSize={"4xl"} fontWeight={"bold"}>
                        {formatCurrency(totalCost)}
                      </Text>
                      <Text fontSize={"xl"}>원</Text>
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
                <Stack w={"100%"} justify={"center"}>
                  <Text>실 매출</Text>
                  <Skeleton w={"100%"} isLoaded={totalOrigin}>
                    <HStack>
                      <Text fontSize={"4xl"} fontWeight={"bold"}>
                        {formatCurrency(totalCost - totalOrigin)}
                      </Text>
                      <Text fontSize={"xl"}>원</Text>
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
                p={"20px"}
              >
                <Text position={"absolute"} mt={0} ml={0}>
                  결제 수단별 매출
                </Text>
                <Center w={"100%"} h={"100%"}>
                  <DonutChart data={payMethod} />
                </Center>
              </Flex>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
                p={"20px"}
              >
                <Text position={"absolute"} mt={0} ml={0}>
                  상품별 매출
                </Text>
                <Center w={"100%"}>
                  <DonutChart data={payProduct} />
                </Center>
              </Flex>
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
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack w={"100%"} h={"100%"} minW={"350px"}>
            <RFilter
              shopList={props.shopList}
              admin={admin}
              onChangeCategory={(value) =>
                getFilteredCategory(value, dateRange)
              }
              onChangeDateRange={(value) =>
                getFilteredCategory(shopFilter, value)
              }
            />

            <Stack p={"20px"} w={"100%"} h={"100%"}>
              <Stack>
                <Flex
                  borderRadius={"10px"}
                  bgColor={"white"}
                  w={"100%"}
                  h={"100%"}
                  p={"30px"}
                >
                  <Stack w={"100%"}>
                    <Text>총 매출</Text>
                    <Skeleton w={"100%"} isLoaded={totalCost}>
                      <HStack>
                        <Text fontSize={"4xl"} fontWeight={"bold"}>
                          {formatCurrency(totalCost)}
                        </Text>
                        <Text fontSize={"xl"}>원</Text>
                      </HStack>
                    </Skeleton>
                  </Stack>
                </Flex>
                <Flex
                  borderRadius={"10px"}
                  bgColor={"white"}
                  w={"100%"}
                  h={"100%"}
                  p={"30px"}
                >
                  <Stack w={"100%"}>
                    <Text>실 매출</Text>
                    <Skeleton w={"100%"} isLoaded={totalOrigin}>
                      <HStack>
                        <Text fontSize={"4xl"} fontWeight={"bold"}>
                          {formatCurrency(totalCost - totalOrigin)}
                        </Text>
                        <Text fontSize={"xl"}>원</Text>
                      </HStack>
                    </Skeleton>
                  </Stack>
                </Flex>
              </Stack>
              <Stack>
                <Flex
                  borderRadius={"10px"}
                  bgColor={"white"}
                  w={"100%"}
                  h={"100%"}
                  p={"30px"}
                >
                  <Text position={"absolute"} mt={0} ml={0}>
                    결제 수단별 매출
                  </Text>
                  <Flex justify={"center"} w={"100%"} h={"100%"}>
                    <DonutChart data={payMethod} />
                  </Flex>
                </Flex>
                <Flex
                  borderRadius={"10px"}
                  bgColor={"white"}
                  w={"100%"}
                  h={"100%"}
                  p={"30px"}
                >
                  <Text position={"absolute"} mt={0} ml={0}>
                    상품별 매출
                  </Text>
                  <Flex justify={"center"} w={"100%"} h={"100%"}>
                    <DonutChart data={payProduct} />
                  </Flex>
                </Flex>
              </Stack>
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
        </Flex>
      )}
    </Flex>
  );
}

export default Home;
