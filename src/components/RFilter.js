import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import RDepth1 from "./RDepth1";
import RDepth2 from "./RDepth2";
import { queryShop } from "../firebase/firebase_func";

function RFilter({ useSearch = true, ...props }) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [depth1, setDepth1] = useState("서울특별시");
  const [depth2, setDepth2] = useState("강남구");
  const [depth3, setDepth3] = useState("전체");
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

  useEffect(() => {
    if (shopList && admin) {
      console.log(getShopInfo(admin.shop_id));
    }
  }, [shopList, admin]);

  const getShopList = async (depth2) => {
    setDepth2(depth2);
    // 필터링 된 샵 리스트만 가지고 오도록 하는 함수
    let filterShop = await queryShop(depth1, depth2);
    setFilteredShopList(filterShop);
  };

  const getShopInfo = (id) => {
    for (let item of shopList) {
      if (item.doc_id === id) {
        return item;
      }
    }
    return null;
  };

  return (
    <Flex w={"100%"} p={"10px"} bgColor={"white"}>
      {isDesktop ? (
        <HStack w={"100%"}>
          <IconButton
            display={useSearch ? "block" : "none"}
            onClick={() => setViewFilter(!viewFilter)}
            icon={<Search2Icon />}
          />
          <RDepth1 w={"20%"} onChangeDepth1={setDepth1}></RDepth1>
          <RDepth2
            isDisabled={!depth1}
            w={"20%"}
            depth1={depth1}
            onChangeDepth2={getShopList}
          ></RDepth2>
          <Select
            isDisabled={!depth2}
            w={"20%"}
            onChange={(e) => {
              /* 이곳에 부모에서 필터 된 상점의 id를 반환한다. */
              props.onChangeShop(e.target.value);
            }}
          >
            <option value={null}>전체</option>
            {filteredShopList?.map((shop) => (
              <option key={shop.doc_id} value={shop.doc_id}>
                {shop.shop_name}
              </option>
            ))}
          </Select>

          <HStack w={"40%"}>
            <Input
              w={"100%"}
              placeholder="dfasdfa"
              value={
                dateRange
                  ? dateRange[0]?.toLocaleDateString() +
                    " ~ " +
                    dateRange[1]?.toLocaleDateString()
                  : ""
              }
            />
            <Calendar
              defaultRange={dateRange}
              onSelectDate={(dateRange) => {
                setDateRange(dateRange);
              }}
            />
          </HStack>
        </HStack>
      ) : (
        <Stack w={"100%"}>
          <HStack w={"100%"}>
            <RDepth1 w={"100%"} onChangeDepth1={setDepth1}></RDepth1>
            <RDepth2
              isDisabled={!depth1}
              w={"100%"}
              depth1={depth1}
              onChangeDepth2={getShopList}
            ></RDepth2>
          </HStack>
          <HStack w={"100%"}>
            <Select
              isDisabled={!depth2}
              w={"100%"}
              onChange={(e) => {
                /* 이곳에 부모에서 필터 된 상점의 id를 반환한다. */
                props.onChangeShop(e.target.value);
              }}
            >
              <option value={null}>전체</option>
              {filteredShopList?.map((shop) => (
                <option key={shop.doc_id} value={shop.doc_id}>
                  {shop.shop_name}
                </option>
              ))}
            </Select>
            <HStack w={"100%"}>
              <Input
                w={"100%"}
                placeholder="dfasdfa"
                value={
                  dateRange
                    ? dateRange[0]?.toLocaleDateString() +
                      " ~ " +
                      dateRange[1]?.toLocaleDateString()
                    : ""
                }
              />
              <Calendar
                defaultRange={dateRange}
                onSelectDate={(dateRange) => {
                  setDateRange(dateRange);
                }}
              />
            </HStack>
          </HStack>
        </Stack>
      )}
      {viewFilter && (
        <Flex
          p={"20px"}
          bgColor={"white"}
          position={"absolute"}
          top={"48px"}
          boxShadow={"md"}
          borderRadius={"10px"}
        >
          <CloseButton
            onClick={() => setViewFilter(false)}
            position={"absolute"}
            zIndex={"10"}
            right={"10px"}
            top={"10px"}
          />
          {props.render}
        </Flex>
      )}
    </Flex>
  );
}

export default RFilter;
