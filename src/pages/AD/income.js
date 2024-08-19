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
  CardHeader,
  Button,
  Grid,
  GridItem,
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
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";
import { set } from "date-fns";
import { ChosunBg } from "../../Component/Text";

function getFirstAndLastDay(year, month) {
  // 월은 0부터 시작하므로 입력된 월에서 1을 뺍니다.
  const firstDay = new Date(year, month - 1, 1);

  // 다음 달의 첫 번째 날에서 하루를 빼면 이번 달의 마지막 날이 됩니다.
  const lastDay = new Date(year, month, 0);

  // 오늘 날짜
  const today = new Date();

  // 오늘이 이번 달인지 확인
  if (today.getFullYear() === year && today.getMonth() + 1 === month) {
    // 만약 오늘이 이번 달 마지막 날 이전이면 오늘 날짜를 마지막 날로 설정
    if (today < lastDay) {
      lastDay.setTime(today.getTime());
    }
  }

  // 저번 달의 첫째 날과 마지막 날을 계산
  const prevMonth = month - 1;
  const prevYear = prevMonth === 0 ? year - 1 : year;
  const prevMonthAdjusted = prevMonth === 0 ? 12 : prevMonth;

  const prevFirstDay = new Date(prevYear, prevMonthAdjusted - 1, 1);
  const prevLastDay = new Date(prevYear, prevMonthAdjusted, 0);

  // YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 결과를 반환합니다.
  return {
    current: {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    },
    previous: {
      firstDay: formatDate(prevFirstDay),
      lastDay: formatDate(prevLastDay),
    },
  };
}

function Income({ ...props }) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [shop_id, setShopId] = useState("");
  const [salesPrice, setSales] = useState("");
  const [originPrice, setOriginPrice] = useState("");

  // 정산
  const [isCurrent, setIsCurrent] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prevStartDate, setPrevStartDate] = useState("");
  const [prevEndDate, setPrevEndDate] = useState("");

  // filter
  const [shopFilter, setShopFilter] = useState(null);
  const [dateRange, setDateRange] = useState([
    new Date(
      `${new Date().getFullYear()}-${new Date()
        .getMonth()
        .toString()
        .padStart(2, "0")}-${(new Date().getDate() + 1)
        .toString()
        .padStart(2, "0")}`
    ),
    new Date(),
  ]);

  const [firstSection, setFirstSection] = useState(0);
  const [secondSection, setSecondSection] = useState(0);
  const [thirdSection, setThirdSection] = useState(0);

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

    let result = getFirstAndLastDay(
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );
    setStartDate(result.current.firstDay);
    setEndDate(result.current.lastDay);
    setPrevStartDate(result.previous.firstDay);
    setPrevEndDate(result.previous.lastDay);
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
    // console.log(newList);
    setIncomeList(newList);
  }

  useEffect(() => {
    console.log(
      startDate.replaceAll("-", ""),
      endDate.replaceAll("-", ""),
      prevStartDate.replaceAll("-", ""),
      prevEndDate.replaceAll("-", "")
    );
    const q = query(collection(db, "PAYMENT"));

    setFirstSection(0);
    setSecondSection(0);
    setThirdSection(0);

    // let list = [];
    let firstAmount = 0;
    let secondAmount = 0;
    let thirdAmount = 0;
    getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        if (
          (admin?.permission == !"supervisor" &&
            doc.data().shop_id === admin?.shop_id) ||
          admin?.permission == "supervisor"
        ) {
          if (
            doc.data().ediDate &&
            doc.data().ediDate.slice(0, 8) >= startDate.replaceAll("-", "") &&
            doc.data().ediDate.slice(0, 8) <= endDate.replaceAll("-", "")
            // &&
            // doc.data().ediDate >= startDate.replaceAll("-", "") &&
            // doc.data().ediDate <= endDate.replaceAll("-", "")
          ) {
            // list.push({ ...doc.data(), doc_id: doc.id });
            firstAmount += parseInt(doc.data().goodsAmt);
            setFirstSection(firstAmount);
          }

          if (
            doc.data().ediDate &&
            doc.data().ediDate.slice(0, 8) >=
              prevStartDate.replaceAll("-", "") &&
            doc.data().ediDate.slice(0, 8) <= prevEndDate.replaceAll("-", "")
            // &&
            // doc.data().ediDate >= startDate.replaceAll("-", "") &&
            // doc.data().ediDate <= endDate.replaceAll("-", "")
          ) {
            // list.push({ ...doc.data(), doc_id: doc.id });
            secondAmount += parseInt(doc.data().goodsAmt);
            setSecondSection(secondAmount);
          }

          let yesterday =
            new Date().getFullYear().toString() +
            (new Date().getMonth() + 1).toString().padStart(2, "0") +
            (new Date().getDate() - 1).toString().padStart(2, "0");

          if (
            doc.data().ediDate &&
            doc.data().ediDate.slice(0, 8) === yesterday
          ) {
            thirdAmount += parseInt(doc.data().goodsAmt);
            setThirdSection(thirdAmount);
          }
        }
      });
    });
  }, [admin, startDate, endDate, prevStartDate, prevEndDate]);

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
            useSearch={false}
          />
          <Stack p={4}>
            <Text fontWeight={"bold"}>매출분석</Text>
            <DateSelector
              onChange={(year, month) => {
                let result = getFirstAndLastDay(year, month);
                setStartDate(result.current.firstDay);
                setEndDate(result.current.lastDay);
                setPrevStartDate(result.previous.firstDay);
                setPrevEndDate(result.previous.lastDay);
              }}
            />
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <GridItem>
                <Card>
                  <CardHeader fontSize={"lg"} fontWeight={"bold"}>
                    {"금월누적매출 (" + startDate + " ~ " + endDate + ")"}
                  </CardHeader>
                  <CardBody>
                    <ChosunBg fontWeight={"bold"} fontSize={"3xl"}>
                      {firstSection.toLocaleString("ko-KR")}원
                    </ChosunBg>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardHeader fontSize={"lg"} fontWeight={"bold"}>
                    {"전월매출 (" + prevStartDate + " ~ " + prevEndDate + ")"}
                  </CardHeader>
                  <CardBody>
                    <ChosunBg fontWeight={"bold"} fontSize={"3xl"}>
                      {secondSection.toLocaleString("ko-KR")}원
                    </ChosunBg>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardHeader fontSize={"lg"} fontWeight={"bold"}>
                    {"전일매출 (" +
                      new Date().getFullYear() +
                      "-" +
                      (new Date().getMonth() + 1).toString().padStart(2, "0") +
                      "-" +
                      (new Date().getDate() - 1).toString().padStart(2, "0") +
                      ")"}
                  </CardHeader>
                  <CardBody>
                    <ChosunBg fontWeight={"bold"} fontSize={"3xl"}>
                      {thirdSection.toLocaleString("ko-KR")}원
                    </ChosunBg>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardHeader fontSize={"lg"} fontWeight={"bold"}>
                    금월 정산 예정금액 (전월매출 x 16.5%)
                  </CardHeader>
                  <CardBody>
                    <ChosunBg fontWeight={"bold"} fontSize={"3xl"}>
                      {(secondSection * 0.165).toLocaleString("ko-KR")}원
                    </ChosunBg>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
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
              useSearch={false}
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
                            <Text>{`${timestampToDate(
                              item.start_date
                            )} ~ ${timestampToDate(item.end_date)}`}</Text>
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

// 날짜 선택 UI
function DateSelector({ onChange }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
  }, []);

  return (
    <HStack justifyContent={"flex-end"}>
      <Select
        bgColor={"white"}
        w={"100px"}
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
          (item) => (
            <option key={item} value={item}>
              {item}
            </option>
          )
        )}
      </Select>
      <Select
        bgColor={"white"}
        w={"100px"}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Button
        colorScheme="red"
        onClick={() => {
          onChange(year, month);
        }}
      >
        분석
      </Button>
    </HStack>
  );
}

export default Income;
