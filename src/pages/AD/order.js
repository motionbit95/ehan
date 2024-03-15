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
import {
  getFilteredOrder,
  getOrder,
  getProductCount,
} from "../../firebase/firebase_func";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
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

  async function getFilteredCategory(value, range) {
    setDateRange(range);
    setShopFilter(value);
  }

  useEffect(() => {
    if (admin.doc_id) {
      setMoreButtonVisible(getProductCount(admin?.shop_id) < 10 ? false : true);
    }
  }, [admin]);

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
    addDoc(collection(db, "ALARM"), {
      type: "order",
      createAt: new Date(),
      order_id: order.doc_id,
      alarm_code: "I" + value.substring(1),
      alarm_title: `상품 배송이 ${
        value === "0001" ? "시작" : "완료"
      }되었습니다.`,
      alarm_msg: `주문번호 ${order.doc_id}의 상품 배송이 ${
        value === "0001" ? "시작" : "완료"
      }되었습니다.`,
    });

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

  // R - read order
  const getFilteredData = async (value) => {
    console.log(value);
    let newList = await getFilteredOrder(value);
    setOrderList(newList);
  };

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
            orderFilter={
              <>
                <option value="pay_price">금액순</option>
                <option value="pay_state">상태순</option>
              </>
            }
            shopList={props.shopList}
            admin={admin}
            onChangeFilter={(value) => getFilteredData(value)}
          />

          <Stack p={"20px"} w={"100%"} h={"100%"}>
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
                            <Text whiteSpace={"pre-line"}>
                              {item?.pay_date?.split("T")[0]}
                            </Text>
                          </Td>
                          <Td fontSize={"sm"}>
                            {item?.pay_product[0]?.product_name} 외{" "}
                            {item?.pay_product?.length}건
                          </Td>
                          <Td fontSize={"sm"}>
                            <HStack w={"100%"} justifyContent={"space-between"}>
                              <Text>
                                {item?.pay_price
                                  ? formatCurrency(item?.pay_price)
                                  : "0"}
                                원
                              </Text>
                              <Text>
                                {item?.pay_method === "vbank"
                                  ? "계좌이체"
                                  : item?.pay_method === "card"
                                  ? "카드"
                                  : "기타"}
                              </Text>
                            </HStack>
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
                                  <Radio
                                    isDisabled={parseInt(item?.pay_state) >= 0}
                                    size={"lg"}
                                    value="0000"
                                  >
                                    배송전
                                  </Radio>
                                  <Radio
                                    isDisabled={parseInt(item?.pay_state) >= 1}
                                    size={"lg"}
                                    value="0001"
                                  >
                                    배송시작
                                  </Radio>
                                  <Radio
                                    isDisabled={parseInt(item?.pay_state) >= 2}
                                    size={"lg"}
                                    value="0002"
                                  >
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
              </Stack>
            )}
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack w={"100%"} h={"100%"} minW={"350px"}>
            <RFilter
              orderFilter={
                <>
                  <option value="pay_price">금액순</option>
                  <option value="pay_state">상태순</option>
                </>
              }
              shopList={props.shopList}
              admin={admin}
              onChangeFilter={(value) => getFilteredData(value)}
            />
            <Stack p={"20px"} w={"100%"} h={"100%"}>
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
                          <Th>배송상태</Th>
                          <Th>결제내역/배송지</Th>
                          <Th textAlign={"center"}>결제영수증</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orderList?.map((item, index) => (
                          <Tr
                            key={index}
                            _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                          >
                            <Td>
                              {" "}
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
                                    <Radio
                                      isDisabled={
                                        parseInt(item?.pay_state) >= 0
                                      }
                                      size={"lg"}
                                      value="0000"
                                    >
                                      배송전
                                    </Radio>
                                    <Radio
                                      isDisabled={
                                        parseInt(item?.pay_state) >= 1
                                      }
                                      size={"lg"}
                                      value="0001"
                                    >
                                      배송시작
                                    </Radio>
                                    <Radio
                                      isDisabled={
                                        parseInt(item?.pay_state) >= 2
                                      }
                                      size={"lg"}
                                      value="0002"
                                    >
                                      배송완료
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </PopupBase>
                            </Td>
                            <Td fontSize={"sm"}>
                              <Stack>
                                <Text whiteSpace={"pre-line"}>
                                  {item?.pay_date?.split("T")[0]}
                                </Text>
                                <Text>
                                  {item?.pay_product[0]?.product_name} 외{" "}
                                  {item?.pay_product?.length}건
                                </Text>
                                <HStack>
                                  <Text fontSize={"md"} fontWeight={"bold"}>
                                    {item?.pay_price
                                      ? formatCurrency(item?.pay_price)
                                      : "0"}
                                    원
                                  </Text>
                                  <Text>
                                    {item?.pay_method === "vbank"
                                      ? "계좌이체"
                                      : item?.pay_method === "card"
                                      ? "카드"
                                      : "기타"}
                                  </Text>
                                </HStack>
                                <Text>
                                  {item?.order_address}{" "}
                                  {item?.user_phone
                                    ? " / " + item?.user_phone
                                    : null}
                                </Text>
                              </Stack>
                            </Td>
                            <Td textAlign={"center"}>
                              <IconButton
                                size={"sm"}
                                icon={<CopyIcon />}
                                onClick={() => window.open(item?.receipt_url)}
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
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
