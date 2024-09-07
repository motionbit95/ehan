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
import { getShop, queryShop } from "../firebase/firebase_func";
import { SearchShopButton } from "./SearchShop";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_conf";

function RFilter({ useSearch = true, ...props }) {
  const keywordRef = useRef();
  const shopList = props.shopList;
  const admin = props.admin;
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [depth1, setDepth1] = useState("");
  const [depth2, setDepth2] = useState("");
  const [depth3, setDepth3] = useState("");
  const [filteredShopList, setFilteredShopList] = useState([]);

  const [viewFilter, setViewFilter] = useState(false);
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

  const [selectedShop, setSelectedShop] = useState(null);
  const [order, setOrder] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (admin) {
      // 관리자의 권한을 검색합니다.
      if (admin?.permission === "supervisor") {
        // 필터링 된 데이터들을 가지고 옵니다.
        getShopList(depth1 ? depth1 : "", depth2 ? depth2 : "");
      } else {
        let shop = getShopInfo(admin?.shop_id);
        setSelectedShop(shop);
        getShopList(shop?.shop_depth1, shop?.shop_depth2);
      }

      if (props.onChangeFilter)
        props.onChangeFilter({
          shop_id: depth3 ? depth3 : admin?.shop_id,
          dateRange: dateRange,
          order: order,
          keyword: keyword,
        });
    }
  }, [admin]);

  const getShopList = async (depth1, depth2) => {
    console.log("====> ", depth1, depth2);
    setDepth1(depth1);
    setDepth2(depth2);
    // 필터링 된 샵 리스트만 가지고 오도록 하는 함수
    queryShop(depth1, depth2)
      .then((list) => {
        if (list.length === 0) {
          if (props.onChangeFilter)
            props.onChangeFilter({
              shop_id: "unknown",
              dateRange: dateRange,
              order: order,
              keyword: keyword,
            });
          return;
        }
        setFilteredShopList(list);
      })
      .catch((error) => console.log(error));
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
    console.log("======>", admin, depth3);
    if (props.onChangeFilter)
      props.onChangeFilter({
        shop_id: depth3 ? depth3 : admin?.shop_id,
        dateRange: dateRange,
        order: order,
        keyword: keyword,
      });
  }, [depth3, dateRange, order, keyword]);

  const handleChangeShop = async (e) => {
    getShop(e).then((data) => {
      getShopList(data.shop_depth1, data.shop_depth2);
      setDepth3(e);
    });

    setDepth3(e);
    props.onChangeFilter({
      shop_id: e,
      dateRange: dateRange,
      order: order,
      keyword: keyword,
    });
  };

  return (
    <Flex
      w={"100%"}
      p={"10px"}
      bgColor={"white"}
      position={"sticky"}
      top={"0"}
      zIndex={"99"}
      boxShadow={"md"}
    >
      <Flex mr={2}>{props.children}</Flex>
      <Grid
        gap={2}
        w={"100%"}
        templateColumns={
          isDesktop
            ? `repeat(${useSearch && props.useCalendar ? 3 : 2}, 1fr)`
            : `repeat(1, 1fr)`
        }
      >
        <HStack>
          <RDepth1
            defaultValue={depth1}
            onChangeDepth1={(value) => {
              setDepth1(value);
            }}
          />
          <RDepth2
            depth1={depth1}
            defaultValue={depth2}
            onChangeDepth2={(value) => {
              setDepth2(value);
              getShopList(depth1, value);
            }}
          />
          <Select
            isDisabled={admin?.permission !== "supervisor" || !depth2}
            defaultValue={admin?.shop_id}
            value={depth3 ? depth3 : admin?.shop_id}
            onChange={(e) => {
              setDepth3(e.target.value);
            }}
            _disabled={{
              opacity: 1,
              pointerEvents: "none",
              bgColor: "#f5f5f5",
            }}
          >
            {admin?.permission === "supervisor" && (
              <option value="">전체</option>
            )}
            {filteredShopList.map((shop, index) => (
              <option key={index} value={shop.doc_id}>
                {shop.shop_name}
              </option>
            ))}
          </Select>
          <SearchShopButton onSelect={handleChangeShop} />
        </HStack>
        {useSearch && (
          <Select onChange={(e) => setOrder(e.target.value)}>
            <option value="createAt">최신순</option>
            {props.orderFilter}
          </Select>
        )}
        {props.useCalendar && (
          <Calendar
            onSelectDate={(dateRange) => {
              setDateRange(dateRange);
            }}
            defaultRange={dateRange}
          />
        )}

        {/* {useSearch && (
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
        )} */}
      </Grid>
    </Flex>
  );
}

export default RFilter;
