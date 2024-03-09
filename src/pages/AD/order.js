import {
  Badge,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../GlobalState";
import { getOrder, getProductCount } from "../../firebase/firebase_func";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";
import { formatCurrency } from "../CS/home";
import { debug } from "../../firebase/api";
import RFilter from "../../components/RFilter";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import PopupBase from "../../modals/PopupBase";

function Order(props) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  // list
  const [orderList, setOrderList] = useState([]);
  const [state, setState] = useState(null);

  // list view control
  const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState(null);
  const [moreButtonVisible, setMoreButtonVisible] = useState(false);

  // filter
  const [shopFilter, setShopFilter] = useState(null);
  const [dateRange, setDateRange] = useState([
    new Date(
      `${new Date().getFullYear()}-${new Date().getMonth()}-${
        new Date().getDate() + 1
      }`
    ),
    new Date(),
  ]);

  useEffect(() => {
    if (admin.doc_id) {
      setMoreButtonVisible(getProductCount(admin?.shop_id) < 10 ? false : true);
    }
  }, [admin]);

  const getFilteredCategory = (value, range) => {
    setState(value, range);
  };

  // shopList에서 shop의 이름을 가지고 오는 함수
  function searchShopName(id) {
    // 리스트를 순회하면서 타겟 값과 일치하는 항목을 찾음
    for (let item of props.shopList) {
      // 타겟 값과 일치하는 항목을 찾았을 때 해당 정보 반환
      if (item.doc_id === id) {
        return item.shop_name;
      }
    }
    // 타겟 값과 일치하는 항목이 없을 경우 null 반환 또는 다른 예외처리 수행
    return null;
  }

  // R - read order
  const getOrderList = async () => {
    // 상품 목록을 조회합니다.
    await getOrder(lastDocumentSnapshot, admin?.shop_id).then((data) => {
      if (data.products && data.products.length > 0) {
        setOrderList([...orderList, ...data.products]);
        setLastDocumentSnapshot(data.lastDocumentSnapshot);
        if (data.products.length < 10) {
          setMoreButtonVisible(false);
        }
      } else {
        // alert("불러올 상품 목록이 없습니다.");
        return;
      }
    });
    debug("주문 목록을 조회합니다.");
  };

  // U - update order
  const handleChangeState = async (value, order) => {
    console.log(value);
    await updateDoc(doc(db, "PAYMENT", order.doc_id), {
      pay_state: value,
    });

    orderList.forEach((item) => {
      if (item.doc_id == order.doc_id) {
        item.pay_state = value;
      }
    });

    // 알림을 발생시킵니다.

    window.location.reload();
  };

  // D - delete order
  const deleteOrder = async (id) => {
    if (window.confirm("주문을 삭제하시겠습니까?")) {
      // 읽기
      await deleteDoc(doc(db, "PAYMENT", id));
      setOrderList(orderList.filter((order) => order.doc_id !== id));
    }
    debug("[ORDER] 주문이 삭제되었습니다.", id);
  };

  if (orderList.length === 0) {
    getOrderList();
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
          overflow={"scroll"}
        >
          {/* desktop 에서의 레이아웃 */}
          <RFilter
            shopList={props.shopList}
            admin={admin}
            onChangeCategory={(value) => getFilteredCategory(value, dateRange)}
            onChangeDateRange={(value) =>
              getFilteredCategory(shopFilter, value)
            }
            render={
              <>
                <Stack spacing={"20px"}>
                  <FormControl>
                    <FormLabel>정렬</FormLabel>
                    <RadioGroup>
                      <HStack>
                        <Radio>결제일순</Radio>
                        <Radio>금액순</Radio>
                        <Radio>배송상태순</Radio>
                      </HStack>
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel>검색</FormLabel>
                    <HStack>
                      <Select>
                        <option>상품명</option>
                        <option>결제금액</option>
                        <option>배송지</option>
                        <option>배송상태</option>
                      </Select>
                      <Input />
                    </HStack>
                  </FormControl>
                  <HStack justifyContent={"flex-end"}>
                    <Button>적용</Button>
                  </HStack>
                </Stack>
              </>
            }
          />
          <Stack p={"20px"} pt={"0px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            {admin?.permission === "supervisor" && (
              <Stack>
                <TableContainer
                  border={"1px solid #d9d9d9"}
                  bgColor={"white"}
                  borderRadius={"10px"}
                  p={"10px"}
                  mb={"20px"}
                >
                  <Table variant="simple" size={"sm"}>
                    <Thead h={"40px"}>
                      <Tr>
                        <Th>No.</Th>
                        <Th>결제(환불)일</Th>
                        <Th>결제내역</Th>
                        <Th>결제(환불)금액</Th>
                        <Th>결제영수증</Th>
                        {/* <Th>지점</Th> */}
                        <Th>배송지</Th>
                        <Th>배송상태</Th>
                        <Th>삭제</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orderList?.map((item, index) => (
                        <Tr
                          key={index}
                          _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                        >
                          <Td fontSize={"sm"}>{index + 1}</Td>
                          <Td fontSize={"sm"}>
                            <Text whiteSpace={"pre-line"} textAlign={"center"}>
                              {item?.pay_date?.split("T")[0]}
                              {/* {"\n"}
                              {item?.pay_date?.split("T")[1].substring(0, 8)} */}
                            </Text>
                          </Td>
                          <Td fontSize={"sm"}>
                            {" "}
                            {item?.pay_product[0]?.product_name} 외{" "}
                            {item?.pay_product?.length}건
                          </Td>
                          <Td fontSize={"sm"}>
                            {item?.pay_price
                              ? formatCurrency(item?.pay_price)
                              : "0"}
                            원
                          </Td>
                          <Td>
                            <IconButton
                              size={"sm"}
                              icon={<CopyIcon />}
                              onClick={() => window.open(item?.receipt_url)}
                            />
                          </Td>
                          {/* <Td>
                            {searchShopName(item.shop_id ? item.shop_id : "")}
                          </Td> */}
                          <Td>{item?.order_address}</Td>
                          <Td>
                            <PopupBase
                              size={"xs"}
                              colorScheme={
                                item?.pay_state === "0000"
                                  ? "gray"
                                  : item?.pay_state === "0001"
                                  ? "orange"
                                  : "green"
                              }
                              title={"배송상태"}
                              text={
                                item?.pay_state === "0000"
                                  ? "배송전"
                                  : item?.pay_state === "0001"
                                  ? "배송시작"
                                  : "배송완료"
                              }
                              action={"변경"}
                              onClose={(e) => {
                                handleChangeState(state, item);
                              }}
                            >
                              <RadioGroup
                                id="pay_state"
                                colorScheme="red"
                                defaultValue={item?.pay_state}
                                onChange={(e) => {
                                  setState(e);
                                }}
                              >
                                <Stack>
                                  <Radio size={"lg"} value="0000">
                                    배송전
                                  </Radio>
                                  <Radio size={"lg"} value="0001">
                                    배송시작
                                  </Radio>
                                  <Radio size={"lg"} value="0002">
                                    배송완료
                                  </Radio>
                                </Stack>
                              </RadioGroup>
                            </PopupBase>
                          </Td>
                          <Td>
                            <IconButton
                              size={"sm"}
                              icon={<DeleteIcon />}
                              onClick={() => deleteOrder(item?.doc_id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Center>
                  <Button
                    colorScheme="red"
                    mb={"20px"}
                    w={"80px"}
                    display={moreButtonVisible ? "box" : "none"}
                    onClick={() => getOrderList()}
                  >
                    더보기
                  </Button>
                </Center>
              </Stack>
            )}
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
              render={
                <>
                  <Stack spacing={"20px"}>
                    <FormControl>
                      <FormLabel>정렬</FormLabel>
                      <RadioGroup>
                        <HStack>
                          <Radio>결제일순</Radio>
                          <Radio>금액순</Radio>
                          <Radio>배송상태순</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>검색</FormLabel>
                      <HStack>
                        <Select>
                          <option>상품명</option>
                          <option>결제금액</option>
                          <option>배송지</option>
                          <option>배송상태</option>
                        </Select>
                        <Input />
                      </HStack>
                    </FormControl>
                    <HStack justifyContent={"flex-end"}>
                      <Button>적용</Button>
                    </HStack>
                  </Stack>
                </>
              }
            />
            <Stack p={"20px"} w={"100%"} h={"100%"}>
              {/* <Text>관리자 설정</Text> */}
              {admin?.permission === "supervisor" && (
                <Stack>
                  <Card p={"10px 0px"}>
                    {orderList?.map((item, index) => (
                      <CardBody key={index} p={"10px 20px"}>
                        <Stack
                          border={"1px solid #d9d9d9"}
                          borderRadius={"10px"}
                          p={"10px"}
                          w={"100%"}
                        >
                          <Flex>
                            <Stack>
                              <PopupBase
                                size={"xs"}
                                colorScheme={
                                  item?.pay_state === "0000"
                                    ? "gray"
                                    : item?.pay_state === "0001"
                                    ? "orange"
                                    : "green"
                                }
                                title={"배송상태"}
                                text={
                                  item?.pay_state === "0000"
                                    ? "배송전"
                                    : item?.pay_state === "0001"
                                    ? "배송시작"
                                    : "배송완료"
                                }
                                action={"변경"}
                                onClose={(e) => {
                                  handleChangeState(state, item);
                                }}
                              >
                                <RadioGroup
                                  id="pay_state"
                                  colorScheme="red"
                                  defaultValue={item?.pay_state}
                                  onChange={(e) => {
                                    setState(e);
                                  }}
                                >
                                  <Stack>
                                    <Radio size={"lg"} value="0000">
                                      배송전
                                    </Radio>
                                    <Radio size={"lg"} value="0001">
                                      배송시작
                                    </Radio>
                                    <Radio size={"lg"} value="0002">
                                      배송완료
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </PopupBase>
                            </Stack>
                          </Flex>
                          <HStack>
                            <Flex direction={"column"}>
                              <Text>No.</Text>
                              <Text>결제(환불)일</Text>
                              <Text>결제내역</Text>
                              <Text>결제(환불)금액</Text>
                              <Text>배송지</Text>
                            </Flex>
                            <Flex direction={"column"}>
                              <Text>{index + 1}</Text>
                              <Text>{item?.pay_date?.split("T")[0]}</Text>
                              <Text>
                                {item?.pay_product[0]?.product_name} 외{" "}
                                {item?.pay_product?.length}건
                              </Text>
                              <Text>
                                {item?.pay_price
                                  ? formatCurrency(item?.pay_price)
                                  : "0"}
                              </Text>
                              <Text>{item?.order_address}</Text>
                            </Flex>
                          </HStack>

                          <HStack justifyContent={"space-between"}>
                            <Stack w={"100%"}>
                              <IconButton
                                size={"sm"}
                                icon={<CopyIcon />}
                                onClick={() => window.open(item?.receipt_url)}
                              />
                            </Stack>
                            <Stack w={"100%"}>
                              <IconButton
                                size={"sm"}
                                icon={<DeleteIcon />}
                                onClick={() => deleteOrder(item?.doc_id)}
                              />
                            </Stack>
                          </HStack>
                        </Stack>
                      </CardBody>
                    ))}
                  </Card>
                  <Center>
                    <Button
                      colorScheme="red"
                      mb={"20px"}
                      w={"80px"}
                      display={moreButtonVisible ? "box" : "none"}
                      onClick={() => getOrderList()}
                    >
                      더보기
                    </Button>
                  </Center>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Order;
