import {
  Button,
  ButtonGroup,
  Flex,
  FormErrorIcon,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
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
import { getFilteredOrder } from "../../firebase/firebase_func";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";
import { formatCurrency } from "../CS/home";
import { SERVER_URL, debug } from "../../firebase/api";
import RFilter from "../../components/RFilter";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import PopupBase from "../../modals/PopupBase";
import axios from "axios";
import $ from "jquery";

function Order(props) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  // list
  const [orderList, setOrderList] = useState([]);
  const [state, setState] = useState(null);

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
      shop_id: order.shop_id,
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
    if (value.shop_id || admin?.permission === "supervisor") {
      let newList = await getFilteredOrder(value);
      console.log(newList);
      setOrderList(newList);
    }
  };

  const cancelOrder = async (order) => {
    if (window.confirm("결제를 취소하시겠습니까?")) {
      // jQuery를 사용하여 POST 요청을 보냅니다.
      $.ajax({
        url: SERVER_URL + "/cancel", // 요청을 보낼 엔드포인트 URL
        method: "POST",
        contentType: "application/json", // 요청 본문의 데이터 형식
        data: JSON.stringify({
          order_id: order.order_id,
          reason: "관리자 취소",
          tid: order.pay_id,
          amount: order.pay_price,
        }), // POST할 데이터를 JSON 문자열로 변환하여 전송
        success: async function (response) {
          // 성공적으로 요청이 완료되었을 때 처리할 작업
          console.log("POST 요청 성공:", response);

          if (response.resultCode === "0000") {
            await updateDoc(doc(db, "PAYMENT", order.doc_id), {
              // 1000 : 취소 성공
              pay_state: "1000",
              pay_result: response.resultMsg,
              cancel_date: response.cancelledAt,
            });
            window.location.reload();
          } else {
            alert(response.resultMsg);
          }
        },
        error: function (xhr, status, error) {
          // 요청이 실패했을 때 처리할 작업
          console.error("POST 요청 실패:", error);
        },
      });
    }
  };

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
                      <Th>지점</Th>
                      <Th>주문상태</Th>
                      <Th>결제취소</Th>
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
                          <Text
                            color={item?.cancel_date ? "gray" : "black"}
                            textDecoration={
                              item?.cancel_date ? "line-through" : "none"
                            }
                            whiteSpace={"pre-line"}
                          >
                            {item?.ediDate.slice(0, 4) +
                              "." +
                              item?.ediDate.slice(4, 6) +
                              "." +
                              item?.ediDate.slice(6, 8)}
                          </Text>
                          {/* {item?.cancel_date && (
                            <Text> {item?.cancel_date?.split("T")[0]}</Text>
                          )} */}
                        </Td>
                        <Td fontSize={"sm"} whiteSpace={"pre-line"}>
                          <Text>
                            [{item?.order_id}]{"\n"}
                          </Text>

                          <Text>
                            {item?.pay_product[0]?.product_name}
                            {item?.pay_product?.length > 1
                              ? ` 외 ${item?.pay_product?.length}건`
                              : ""}
                          </Text>
                        </Td>
                        <Td fontSize={"sm"}>
                          <HStack w={"100%"} justifyContent={"flex-start"}>
                            <Text>
                              {item?.goodsAmt
                                ? formatCurrency(item?.goodsAmt)
                                : "0"}
                              원
                            </Text>
                            <Text>
                              {item?.payMethod === "VACNT"
                                ? "계좌이체"
                                : item?.payMethod === "CARD"
                                ? "카드"
                                : "기타"}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>{searchShopName(item?.shop_id)}</Td>
                        <Td>
                          <PopupBase
                            isDisabled={item?.pay_state > "0010"}
                            size={"xs"}
                            colorScheme={
                              item?.pay_state === "0000"
                                ? "gray"
                                : item?.pay_state === "0001"
                                ? "orange"
                                : item?.pay_state === "0002"
                                ? "green"
                                : "gray"
                            }
                            title={"배송상태"}
                            text={
                              item?.pay_state === "0000"
                                ? "배송전"
                                : item?.pay_state === "0001"
                                ? "배송시작"
                                : item?.pay_state === "0002"
                                ? "배송완료"
                                : "결제취소"
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
                            icon={<CloseIcon />}
                            onClick={() => cancelOrder(item)}
                          />
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
                <Flex mt={4} justifyContent="center" alignItems="center">
                  <IconButton
                    icon={<ChevronLeftIcon fontSize={"24px"} />}
                    // onClick={handlePrevPage}
                    // isDisabled={currentPage === 1}
                    // variant={"outline"}
                    // color={popmint}
                    // borderColor={popmint}
                  />
                  <ButtonGroup ml={4} mr={4}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Button
                        key={index + 1}
                        // onClick={() => handlePageClick(index + 1)}
                        color={"black"}
                        // bg={currentPage === index + 1 ? popmint : "#E1E4E4"}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <IconButton
                    icon={<ChevronRightIcon fontSize={"24px"} />}
                    // isDisabled={currentPage === totalPages}
                    // onClick={handleNextPage}
                    // color={popmint}
                    // variant={"outline"}
                    // borderColor={popmint}
                  />
                </Flex>
              </TableContainer>
            </Stack>
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
                        <Th>주문상태</Th>
                        <Th>결제내역/지점</Th>
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
                              isDisabled={item?.pay_state > "0010"}
                              size={"xs"}
                              colorScheme={
                                item?.pay_state === "0000"
                                  ? "gray"
                                  : item?.pay_state === "0001"
                                  ? "orange"
                                  : item?.pay_state === "0002"
                                  ? "green"
                                  : "gray"
                              }
                              title={"배송상태"}
                              text={
                                item?.pay_state === "0000"
                                  ? "배송전"
                                  : item?.pay_state === "0001"
                                  ? "배송시작"
                                  : item?.pay_state === "0002"
                                  ? "배송완료"
                                  : "결제취소"
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
                          <Td fontSize={"sm"}>
                            <Stack>
                              <Text whiteSpace={"pre-line"}>
                                {item?.ediDate.slice(0, 4) +
                                  "." +
                                  item?.ediDate.slice(4, 6) +
                                  "." +
                                  item?.ediDate.slice(6, 8)}
                              </Text>
                              <Text>
                                {item?.pay_product[0]?.product_name}
                                {item?.pay_product?.length > 1
                                  ? ` 외 ${item?.pay_product?.length}건`
                                  : ""}
                              </Text>
                              <HStack w={"100%"} justifyContent={"flex-start"}>
                                <Text>
                                  {item?.goodsAmt
                                    ? formatCurrency(item?.goodsAmt)
                                    : "0"}
                                  원
                                </Text>
                                <Text>
                                  {item?.payMethod === "VACNT"
                                    ? "계좌이체"
                                    : item?.payMethod === "CARD"
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
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Order;
