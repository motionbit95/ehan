import {
  Flex,
  Stack,
  Table,
  TableContainer,
  Text,
  Td,
  Thead,
  Tr,
  Th,
  Tbody,
  useMediaQuery,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  IconButton,
  Card,
  CardBody,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../GlobalState";
import RFilter from "../../components/RFilter";
import PopupBase from "../../modals/PopupBase";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Calendar from "../../components/Calendar";
import {
  getFilteredIncome,
  getTotalOrder,
  postIncome,
} from "../../firebase/firebase_func";
import { formatCurrency } from "../CS/home";
import { isNumber, timestampToDate } from "../../firebase/api";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";

function Income({ ...props }) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [shop_id, setShopId] = useState("");
  const [salesPrice, setSales] = useState("");
  const [originPrice, setOriginPrice] = useState("");

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

  const [incomeData, setIncomeData] = useState({
    date: "",
    dues: 0,
    end_date: "",
    etc: 0,
    hire: 0,
    personnel: 0,
    purchase: 0,
    sales: 0,
    shop_id: "",
    start_date: "",
  });

  const [incomeList, setIncomeList] = useState([]);

  useEffect(() => {
    setShopId(admin?.shop_id);
    getSales(dateRange, admin?.shop_id);
  }, []);

  const addIncome = async (e) => {
    let tempIncome = {};

    for (let i = 0; i < e.target.length; i++) {
      // form data를 파싱합니다.
      if (!e.target[i].name) continue;
      tempIncome = {
        ...tempIncome,
        [e.target[i].name]: e.target[i].value.replaceAll(",", ""),
      };
    }

    // 기타 지출에 대한 금액을 합합니다.
    let totalEtcPrice =
      parseFloat(incomeData.hire) +
      parseFloat(incomeData.personnel) +
      parseFloat(incomeData.dues) +
      parseFloat(incomeData.etc);

    const ratio = salesPrice / (salesPrice - (originPrice + totalEtcPrice));
    if (salesPrice - (originPrice + totalEtcPrice) === 0) {
      // 계산오류
      alert(
        "순이익(총매출-(총매입+판관비))은 0이 될 수 없습니다. 값을 확인해주세요."
      );
      return;
    }

    tempIncome = {
      ...tempIncome,
      start_date: dateRange[0],
      end_date: dateRange[1],
      ratio: ratio,
    };

    await postIncome(tempIncome);
    // getFilteredCategory(shopFilter, dateRange);
    window.location.reload();
  };

  const deleteIncome = async (doc_id) => {
    if (window.confirm("손익분석을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "INCOME", doc_id));
      // getFilteredCategory(shopFilter, dateRange);
      window.location.reload();
    }
  };

  const getSales = async (dateRange, shop_id) => {
    const orders = await getTotalOrder(dateRange, shop_id);
    setSales(orders.totalPrice);
    setOriginPrice(orders.totalOriginPrice);
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

  async function getFilteredData(value) {
    let newList = await getFilteredIncome(value);
    console.log(newList);
    setIncomeList(newList);
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
            admin={admin}
            shopList={props.shopList}
            onChangeFilter={(value) => getFilteredData(value)}
            orderFilter={
              <>
                <option value="ratio">손익순</option>
              </>
            }
            children={
              <PopupBase
                icon={<AddIcon />}
                title="분석"
                action="추가"
                text="분석"
                onClose={addIncome}
              >
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  기본정보
                </Text>
                <FormControl isRequired>
                  <FormLabel>관리 지점</FormLabel>
                  <Select
                    isDisabled={admin?.permission !== "supervisor"}
                    defaultValue={admin?.shop_id}
                    name="shop_id"
                    onChange={(e) => {
                      setIncomeData({
                        ...incomeData,
                        shop_id: e.target.value,
                      });
                      setShopId(e.target.value);
                      getSales(dateRange, e.target.value);
                    }}
                  >
                    <option value="">전체</option>
                    {props.shopList?.map((shop, index) => (
                      <option key={index} value={shop.doc_id}>
                        {shop.shop_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>분석기간</FormLabel>
                  <HStack w={"100%"}>
                    {/* <Input
                      name="date"
                      w={"100%"}
                      value={
                        dateRange
                          ? dateRange[0]?.toLocaleDateString() +
                            " ~ " +
                            dateRange[1]?.toLocaleDateString()
                          : ""
                      }
                      onChange={(e) => {
                        setIncomeData({
                          ...incomeData,
                          start_date: dateRange[0] ? dateRange[0] : "",
                          end_date: dateRange[1] ? dateRange[1] : "",
                        });
                      }}
                    /> */}
                    <Calendar
                      defaultRange={dateRange}
                      onSelectDate={(dateRange) => {
                        setDateRange(dateRange);
                        setIncomeData({
                          ...incomeData,
                          start_date: dateRange[0] ? dateRange[0] : "",
                          end_date: dateRange[1] ? dateRange[1] : "",
                        });
                        // 기간 내 매출 계산
                        getSales(dateRange, shop_id);
                      }}
                    />
                  </HStack>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>매출금액</FormLabel>
                  <Input
                    isDisabled
                    name="sales"
                    defaultValue={formatCurrency(incomeData.sales)}
                    value={formatCurrency(salesPrice)}
                    bgColor={"gray.200"}
                    color={"gray.600"}
                    onChange={(e) => {
                      setIncomeData({
                        ...incomeData,
                        sales: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>매입금액</FormLabel>
                  <Input
                    name="purchase"
                    defaultValue={formatCurrency(incomeData.purchase)}
                    value={formatCurrency(originPrice)}
                    onKeyDown={(e) => isNumber(e)}
                    onChange={(e) => {
                      setIncomeData({
                        ...incomeData,
                        purchase: e.target.value,
                      });
                      setOriginPrice(e.target.value.replaceAll(",", ""));
                    }}
                  />
                </FormControl>
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  추가정보
                </Text>
                <FormControl>
                  <FormLabel>임차료</FormLabel>
                  <Input
                    name="hire"
                    value={formatCurrency(incomeData.hire)}
                    defaultValue={formatCurrency(incomeData.hire)}
                    onKeyDown={(e) => isNumber(e)}
                    onChange={(e) =>
                      setIncomeData({
                        ...incomeData,
                        hire: e.target.value.replaceAll(",", ""),
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>인건비</FormLabel>
                  <Input
                    name="personnel"
                    defaultValue={formatCurrency(incomeData.personnel)}
                    value={formatCurrency(incomeData.personnel)}
                    onKeyDown={(e) => isNumber(e)}
                    onChange={(e) =>
                      setIncomeData({
                        ...incomeData,
                        personnel: e.target.value.replaceAll(",", ""),
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>공과금</FormLabel>
                  <Input
                    name="dues"
                    defaultValue={formatCurrency(incomeData.dues)}
                    value={formatCurrency(incomeData.dues)}
                    onKeyDown={(e) => isNumber(e)}
                    onChange={(e) =>
                      setIncomeData({
                        ...incomeData,
                        dues: e.target.value.replaceAll(",", ""),
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>기타비용</FormLabel>
                  <Input
                    name="etc"
                    value={formatCurrency(incomeData.etc)}
                    defaultValue={formatCurrency(incomeData.etc)}
                    onKeyDown={(e) => isNumber(e)}
                    onChange={(e) =>
                      setIncomeData({
                        ...incomeData,
                        etc: e.target.value.replaceAll(",", ""),
                      })
                    }
                  />
                </FormControl>
              </PopupBase>
            }
          />
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/*표*/}
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
                    <Th>No</Th>
                    <Th>분석날짜</Th>
                    <Th>지점명</Th>
                    <Th>조회기간</Th>
                    <Th>예상손익</Th>
                    <Th>예상손익률</Th>
                    {/* <Th textAlign={"center"} w={"30px"}>
                      수정
                    </Th> */}
                    <Th textAlign={"center"} w={"30px"}>
                      삭제
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {incomeList?.map((item, index) => (
                    <Tr
                      key={index}
                      _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                    >
                      <Td>{index + 1}</Td>
                      <Td>
                        <Text>{`${timestampToDate(item.createAt)}`}</Text>
                      </Td>
                      <Td>{searchShopName(item.shop_id)}</Td>
                      <Td>
                        {" "}
                        <Text>{`${timestampToDate(
                          item.start_date
                        )} ~ ${timestampToDate(item.end_date)}`}</Text>
                      </Td>
                      <Td>
                        {item.sales -
                          item.purchase -
                          item.etc -
                          item.dues -
                          item.hire -
                          item.personnel <
                        0
                          ? "-"
                          : "+"}
                        {formatCurrency(
                          item.sales -
                            item.purchase -
                            item.etc -
                            item.dues -
                            item.hire -
                            item.personnel
                        )}
                      </Td>
                      <Td
                        color={
                          Math.round(item.ratio * 100) < 0
                            ? "#E53E3E"
                            : "#34C759"
                        }
                      >
                        {Math.round(item.ratio * 100) < 0 ? "" : "+"}
                        {Math.round(item.ratio * 100)}%
                      </Td>
                      {/* <Td textAlign={"center"}>
                        <IconButton icon={<EditIcon />} />
                      </Td> */}
                      <Td textAlign={"center"}>
                        <IconButton
                          onClick={() => deleteIncome(item.doc_id)}
                          icon={<DeleteIcon />}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack w={"100%"} h={"100%"} minW={"350px"}>
            <RFilter
              admin={admin}
              shopList={props.shopList}
              onChangeFilter={(value) => getFilteredData(value)}
              orderFilter={
                <>
                  <option value="ratio">손익순</option>
                </>
              }
              children={
                <PopupBase
                  icon={<AddIcon />}
                  title="분석"
                  action="추가"
                  text="분석"
                  onClose={addIncome}
                >
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    기본정보
                  </Text>
                  <FormControl isRequired>
                    <FormLabel>관리 지점</FormLabel>
                    <Select
                      isDisabled={admin?.permission !== "supervisor"}
                      defaultValue={admin?.shop_id}
                      name="shop_id"
                      onChange={(e) => {
                        setIncomeData({
                          ...incomeData,
                          shop_id: e.target.value,
                        });
                        setShopId(e.target.value);
                        getSales(dateRange, e.target.value);
                      }}
                    >
                      <option value="">전체</option>
                      {props.shopList?.map((shop, index) => (
                        <option key={index} value={shop.doc_id}>
                          {shop.shop_name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>분석기간</FormLabel>
                    <HStack w={"100%"}>
                      {/* <Input
                        name="date"
                        w={"100%"}
                        value={
                          dateRange
                            ? dateRange[0]?.toLocaleDateString() +
                              " ~ " +
                              dateRange[1]?.toLocaleDateString()
                            : ""
                        }
                        onChange={(e) => {
                          setIncomeData({
                            ...incomeData,
                            start_date: dateRange[0] ? dateRange[0] : "",
                            end_date: dateRange[1] ? dateRange[1] : "",
                          });
                        }}
                      /> */}
                      <Calendar
                        defaultRange={dateRange}
                        onSelectDate={(dateRange) => {
                          setDateRange(dateRange);
                          setIncomeData({
                            ...incomeData,
                            start_date: dateRange[0] ? dateRange[0] : "",
                            end_date: dateRange[1] ? dateRange[1] : "",
                          });
                          // 기간 내 매출 계산
                          getSales(dateRange, shop_id);
                        }}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>매출금액</FormLabel>
                    <Input
                      isDisabled
                      name="sales"
                      defaultValue={formatCurrency(incomeData.sales)}
                      value={formatCurrency(salesPrice)}
                      bgColor={"gray.200"}
                      color={"gray.600"}
                      onChange={(e) => {
                        setIncomeData({
                          ...incomeData,
                          sales: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>매입금액</FormLabel>
                    <Input
                      name="purchase"
                      defaultValue={formatCurrency(incomeData.purchase)}
                      value={formatCurrency(originPrice)}
                      onKeyDown={(e) => isNumber(e)}
                      onChange={(e) => {
                        setIncomeData({
                          ...incomeData,
                          purchase: e.target.value,
                        });
                        setOriginPrice(e.target.value.replaceAll(",", ""));
                      }}
                    />
                  </FormControl>
                  <Text fontSize={"lg"} fontWeight={"bold"}>
                    추가정보
                  </Text>
                  <FormControl>
                    <FormLabel>임차료</FormLabel>
                    <Input
                      name="hire"
                      value={formatCurrency(incomeData.hire)}
                      defaultValue={formatCurrency(incomeData.hire)}
                      onKeyDown={(e) => isNumber(e)}
                      onChange={(e) =>
                        setIncomeData({
                          ...incomeData,
                          hire: e.target.value.replaceAll(",", ""),
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>인건비</FormLabel>
                    <Input
                      name="personnel"
                      defaultValue={formatCurrency(incomeData.personnel)}
                      value={formatCurrency(incomeData.personnel)}
                      onKeyDown={(e) => isNumber(e)}
                      onChange={(e) =>
                        setIncomeData({
                          ...incomeData,
                          personnel: e.target.value.replaceAll(",", ""),
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>공과금</FormLabel>
                    <Input
                      name="dues"
                      defaultValue={formatCurrency(incomeData.dues)}
                      value={formatCurrency(incomeData.dues)}
                      onKeyDown={(e) => isNumber(e)}
                      onChange={(e) =>
                        setIncomeData({
                          ...incomeData,
                          dues: e.target.value.replaceAll(",", ""),
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>기타비용</FormLabel>
                    <Input
                      name="etc"
                      value={formatCurrency(incomeData.etc)}
                      defaultValue={formatCurrency(incomeData.etc)}
                      onKeyDown={(e) => isNumber(e)}
                      onChange={(e) =>
                        setIncomeData({
                          ...incomeData,
                          etc: e.target.value.replaceAll(",", ""),
                        })
                      }
                    />
                  </FormControl>
                </PopupBase>
              }
            />
            <Stack p={"20px"} w={"100%"} h={"100%"}>
              {/* <Text>관리자 설정</Text> */}

              <Stack w={"100%"} h={"100%"}>
                {/*표*/}
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
                        <Th>분석날짜/지점명</Th>
                        <Th>조회기간</Th>
                        <Th>예상손익률</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {incomeList?.map((item, index) => (
                        <Tr
                          key={index}
                          _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                        >
                          <Td>
                            <Stack>
                              <Text>{`${timestampToDate(item.createAt)}`}</Text>
                              <Text>{searchShopName(item.shop_id)}</Text>
                            </Stack>
                          </Td>
                          <Td>
                            <Text whiteSpace={"pre-line"}>
                              {item.date.split("~")[0]}
                              {`\n~`}
                              {item.date.split("~")[1]}
                            </Text>
                          </Td>
                          <Td>
                            <Text>
                              {item.sales -
                                item.purchase -
                                item.etc -
                                item.dues -
                                item.hire -
                                item.personnel <
                              0
                                ? "-"
                                : "+"}
                              {formatCurrency(
                                item.sales -
                                  item.purchase -
                                  item.etc -
                                  item.dues -
                                  item.hire -
                                  item.personnel
                              )}
                            </Text>
                            <Text
                              color={
                                Math.round(item.ratio * 100) < 0
                                  ? "#E53E3E"
                                  : "#34C759"
                              }
                            >
                              ({Math.round(item.ratio * 100) < 0 ? "" : "+"}
                              {Math.round(item.ratio * 100)}%)
                            </Text>
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

export default Income;
