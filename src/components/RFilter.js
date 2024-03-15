import { Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import RDepth1 from "./RDepth1";
import RDepth2 from "./RDepth2";
import { queryShop } from "../firebase/firebase_func";

function RFilter({ useSearch = true, ...props }) {
  const keywordRef = useRef();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [depth1, setDepth1] = useState("");
  const [depth2, setDepth2] = useState("");
  const [depth3, setDepth3] = useState("");
  const [filteredShopList, setFilteredShopList] = useState([]);

  const [viewFilter, setViewFilter] = useState(false);
  const [dateRange, setDateRange] = useState([
    new Date(
      `${new Date().getFullYear()}-${new Date().getMonth()}-${
        new Date().getDate() + 1
      }`
    ),
    new Date(),
  ]);

  const shopList = props.shopList;
  const admin = props.admin;
  const [selectedShop, setSelectedShop] = useState(null);
  const [order, setOrder] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // 관리자의 권한을 검색합니다.
    if (admin?.permission === "supervisor") {
      // 필터링 된 데이터들을 가지고 옵니다.
      getShopList(depth1 ? depth1 : "", depth2 ? depth2 : "");
    } else {
      let shop = getShopInfo(admin?.shop_id);
      setSelectedShop(shop);
      getShopList(shop?.shop_depth1, shop?.shop_depth2);
    }
  }, [admin]);

  const getShopList = async (depth1, depth2) => {
    setDepth2(depth2);
    // 필터링 된 샵 리스트만 가지고 오도록 하는 함수
    let filterShop = await queryShop(depth1, depth2);
    setFilteredShopList(filterShop);
  };

  const getShopInfo = (id) => {
    if (!shopList) return null;
    for (let item of shopList) {
      if (item.doc_id === id) {
        return item;
      }
    }
    return null;
  };

  useEffect(() => {
    console.log(depth3, dateRange, order, keyword);
    if (props.onChangeFilter)
      props.onChangeFilter({
        shop_id: depth3,
        dateRange: dateRange,
        order: order,
        keyword: keyword,
      });
  }, [depth3, dateRange, order, keyword]);

  return (
    <Flex
      w={"100%"}
      p={"10px"}
      bgColor={"white"}
      position={"sticky"}
      top={"0"}
      zIndex={"99"}
    >
      <Grid
        gap={2}
        w={"100%"}
        templateColumns={
          isDesktop ? `repeat(${useSearch ? 4 : 2}, 1fr)` : `repeat(1, 1fr)`
        }
      >
        <Select onChange={(e) => setDepth3(e.target.value)}>
          <option value="">전체</option>
          {filteredShopList.map((shop, index) => (
            <option key={index} value={shop.doc_id}>
              {shop.shop_name}
            </option>
          ))}
        </Select>
        {useSearch && (
          <Select onChange={(e) => setOrder(e.target.value)}>
            <option value="createAt">최신순</option>
            {props.orderFilter}
          </Select>
        )}
        <Calendar
          onSelectDate={(dateRange) => {
            setDateRange(dateRange);
          }}
          defaultRange={dateRange}
        />
        {useSearch && (
          <HStack>
            <Input
              ref={keywordRef}
              // onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요."
            />
            <Button
              onClick={() => setKeyword(keywordRef.current.value)}
              rightIcon={<Search2Icon />}
            >
              조회
            </Button>
          </HStack>
        )}
      </Grid>
    </Flex>
  );
}

export default RFilter;
