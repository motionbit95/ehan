import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import RFilter from "../../components/RFilter";
import { useGlobalState } from "../../GlobalState";
import { getAlarmList, getTotalOrder } from "../../firebase/firebase_func";
import { compareTimestampWithCurrentTime, debug } from "../../firebase/api";
import { formatCurrency } from "../CS/home";
import DonutChart from "../../components/DonutChart";

function Home(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const { admin } = useGlobalState();

  const [totalCost, setTotalCost] = useState(null);
  const [totalOrigin, setTotalOrigin] = useState(null);

  const [payMethod, setPayMethod] = useState([]);
  const [payProduct, setPayProduct] = useState([]);

  // 알람 리스트
  const [alramList, setAlarmList] = useState([]);

  useEffect(() => {
    updateAlarmList();
  }, [admin]);

  async function updateAlarmList() {
    getAlarmList(admin?.shop_id).then((list) => setAlarmList(list));
  }

  async function getFilteredData(value) {
    let payMethod = [
      { label: "CARD", name: "카드", value: 0 },
      { label: "VACNT", name: "무통장입금", value: 0 },
      // { label: "kakaopay", name: "카카오페이", value: 0 },
      // { label: "naverpayCard", name: "네이버페이", value: 0 },
    ];

    let payProduct = [];

    let totalCost = 0;
    let totalOrigin = 0;
    // 모든 거래내역 중에서 필터 된 상품의 거래내역만 가지고 옵니다.
    const orders = await getTotalOrder(value.dateRange, value.shop_id);
    totalCost += orders.totalPrice;
    totalOrigin += orders.totalOriginPrice;

    for (var j = 0; j < orders.order.length; j++) {
      for (let k = 0; k < payMethod.length; k++) {
        if (payMethod[k].label === orders.order[j].payMethod) {
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

    // if (totalCost === 0) {
    //   alert("해당기간에는 매출이 존재하지 않습니다.");
    //   return;
    // }

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
          overflow={"auto"}
          // p={"2vh"}
        >
          <Box zIndex={2} position={"sticky"} top={0} left={0} bgColor={"red"}>
            <RFilter
              useSearch={false}
              useCalendar={true}
              shopList={props.shopList}
              admin={admin}
              onChangeFilter={(value) => getFilteredData(value)}
            />
          </Box>
          {/* desktop 에서의 레이아웃 */}
          <Stack
            zIndex={1}
            p={"20px"}
            w={"100%"}
            h={"auto"}
            overflow={"auto"}
            minW={"910px"}
          >
            <HStack w={"100%"} h={"20%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
                p={"20px"}
              >
                <Stack justify={"center"}>
                  <Text>총 매출</Text>
                  <Skeleton
                    minW={"400px"}
                    w={"100%"}
                    isLoaded={totalCost !== null}
                  >
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
                  <Skeleton
                    minW={"400px"}
                    w={"100%"}
                    isLoaded={totalOrigin !== null}
                  >
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
            <HStack w={"100%"} minH={"300px"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
                p={"20px"}
              >
                <Stack w={"100%"}>
                  <Text>결제 수단별 매출</Text>
                  <Center w={"100%"} h={"100%"}>
                    {!totalCost ? (
                      <Text color={"gray.500"}>매출이 존재하지 않습니다.</Text>
                    ) : (
                      <DonutChart data={payMethod} />
                    )}
                  </Center>
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
                  <Text>상품별 매출</Text>
                  <Center w={"100%"} h={"100%"}>
                    {!totalCost ? (
                      <Text color={"gray.500"}>매출이 존재하지 않습니다.</Text>
                    ) : (
                      <DonutChart data={payProduct} />
                    )}
                  </Center>
                </Stack>
              </Flex>
            </HStack>
            <HStack w={"100%"} h={"40%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                overflow={"auto"}
                minW={"890px"}
                h={"100%"}
              >
                <Stack w={"100%"} p={"20px"} overflow={"auto"}>
                  <Text>알림</Text>
                  {alramList.map(
                    (item, index) =>
                      index < 3 && (
                        <Alert
                          key={index}
                          borderRadius={"10px"}
                          status={item.alarm_code[0] === "E" ? "error" : "info"}
                        >
                          <HStack
                            w={"100%"}
                            justifyContent={"space-between"}
                            alignItems={"flex-start"}
                          >
                            <HStack>
                              <AlertIcon />
                              <Stack spacing={"1px"}>
                                <AlertTitle>
                                  [{item.alarm_code}] {item.alarm_title}
                                </AlertTitle>
                                <AlertDescription>
                                  {item.alarm_msg}
                                </AlertDescription>
                              </Stack>
                            </HStack>
                            <Text fontSize={"sm"}>
                              {compareTimestampWithCurrentTime(item.createAt)}
                            </Text>
                          </HStack>
                        </Alert>
                      )
                  )}
                </Stack>
              </Flex>
            </HStack>
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack w={"100%"} h={"100%"} minW={"350px"}>
            <Box
              zIndex={2}
              position={"sticky"}
              top={0}
              left={0}
              bgColor={"red"}
            >
              <RFilter
                useSearch={false}
                useCalendar={true}
                shopList={props.shopList}
                admin={admin}
                onChangeFilter={(value) => getFilteredData(value)}
              />
            </Box>

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
                    <Skeleton w={"100%"} isLoaded={totalCost !== null}>
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
                    <Skeleton w={"100%"} isLoaded={totalOrigin !== null}>
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
                  <Stack w={"100%"}>
                    <Text>결제 수단별 매출</Text>
                    <Flex justify={"center"} w={"100%"} h={"100%"}>
                      {!totalCost ? (
                        <Text p={"20px"} color={"gray.500"}>
                          매출이 존재하지 않습니다.
                        </Text>
                      ) : (
                        <DonutChart data={payMethod} />
                      )}
                    </Flex>
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
                    <Text>상품별 매출</Text>
                    <Flex justify={"center"} w={"100%"} h={"100%"}>
                      {!totalCost ? (
                        <Text p={"20px"} color={"gray.500"}>
                          매출이 존재하지 않습니다.
                        </Text>
                      ) : (
                        <DonutChart data={payProduct} />
                      )}
                    </Flex>
                  </Stack>
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
              <HStack w={"100%"}>
                <Flex borderRadius={"10px"} bgColor={"white"} w={"100%"}>
                  <Stack w={"100%"} p={"20px"}>
                    <Text>알림</Text>
                    {alramList.map(
                      (item, index) =>
                        index < 3 && (
                          <Alert
                            key={index}
                            borderRadius={"10px"}
                            status={
                              item.alarm_code[0] === "E" ? "error" : "info"
                            }
                          >
                            <HStack
                              w={"100%"}
                              justifyContent={"space-between"}
                              alignItems={"flex-start"}
                            >
                              <HStack>
                                <AlertIcon />
                                <Stack spacing={"1px"}>
                                  <HStack
                                    alignItems={"flex-start"}
                                    justifyContent={"space-between"}
                                  >
                                    <AlertTitle>
                                      [{item.alarm_code}] {item.alarm_title}
                                    </AlertTitle>
                                    <Text fontSize={"sm"} whiteSpace={"nowrap"}>
                                      {compareTimestampWithCurrentTime(
                                        item.createAt
                                      )}
                                    </Text>
                                  </HStack>

                                  <AlertDescription>
                                    {item.alarm_msg}
                                  </AlertDescription>
                                </Stack>
                              </HStack>
                            </HStack>
                          </Alert>
                        )
                    )}
                  </Stack>
                </Flex>
              </HStack>
            </Stack>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Home;
