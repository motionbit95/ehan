import { Search2Icon } from "@chakra-ui/icons";
import {
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import RDepth1 from "./RDepth1";
import RDepth2 from "./RDepth2";
import { queryShop } from "../firebase/firebase_func";

function RFilter({ useSearch = true, ...props }) {
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
    console.log(
      "상점 정보를 가지고 옵니다. ",
      depth1,
      " ",
      depth2,
      "\n",
      filterShop
    );
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
    if (props.onChangeCategory)
      props.onChangeCategory([depth1, depth2, depth3]);
  }, [depth1, depth2, depth3]);

  // useEffect(() => {
  //   props.onChangeCategory([depth1, depth2, depth3]);
  // }, [depth1, depth2, depth3]);

  return (
    <Flex
      w={"100%"}
      p={"10px"}
      bgColor={"white"}
      position={"sticky"}
      top={"0"}
      zIndex={"20"}
    >
      {isDesktop ? (
        <HStack w={"100%"}>
          <IconButton
            display={useSearch ? "block" : "none"}
            onClick={() => setViewFilter(!viewFilter)}
            icon={<Search2Icon />}
          />
          <RDepth1
            defaultValue={depth1}
            value={selectedShop?.shop_depth1}
            isDisabled={admin?.permission !== "supervisor"}
            w={"20%"}
            onChangeDepth1={setDepth1}
          ></RDepth1>
          <RDepth2
            defaultValue={depth2}
            value={selectedShop?.shop_depth2}
            isDisabled={!depth1 || admin?.permission !== "supervisor"}
            w={"20%"}
            depth1={depth1}
            onChangeDepth2={(value) => getShopList(depth1, value)}
          ></RDepth2>
          <Select
            _disabled={{
              opacity: 1,
              pointerEvents: "none",
              bgColor: "#f5f5f5",
            }}
            isDisabled={!depth2 || admin?.permission !== "supervisor"}
            defaultValue={selectedShop?.doc_id}
            value={selectedShop?.doc_id}
            w={"20%"}
            onChange={(e) => {
              setDepth3(e.target.value);
            }}
          >
            <option value={""}>전체</option>
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
                props.onChangeDateRange(dateRange);
              }}
            />
          </HStack>
        </HStack>
      ) : (
        <Stack w={"100%"}>
          <HStack w={"100%"}>
            <RDepth1
              defaultValue={selectedShop?.shop_depth1}
              value={selectedShop?.shop_depth1}
              isDisabled={admin?.permission !== "supervisor"}
              w={"100%"}
              onChangeDepth1={setDepth1}
            ></RDepth1>
            <RDepth2
              defaultValue={selectedShop?.shop_dept21}
              value={selectedShop?.shop_depth2}
              isDisabled={!depth1 || admin?.permission !== "supervisor"}
              w={"100%"}
              depth1={depth1}
              onChangeDepth2={(value) => getShopList(depth1, value)}
            ></RDepth2>
          </HStack>
          <HStack w={"100%"}>
            <Select
              _disabled={{
                opacity: 1,
                pointerEvents: "none",
                bgColor: "#f5f5f5",
              }}
              defaultValue={selectedShop?.doc_id}
              value={selectedShop?.doc_id}
              isDisabled={!depth2 || admin?.permission !== "supervisor"}
              w={"100%"}
              onChange={(e) => {
                setDepth3(e.target.value);
              }}
            >
              <option value={""}>전체</option>
              {filteredShopList?.map((shop) => (
                <option key={shop.doc_id} value={shop.doc_id}>
                  {shop.shop_name}
                </option>
              ))}
            </Select>
          </HStack>
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
                props.onChangeDateRange(dateRange);
              }}
            />
          </HStack>
        </Stack>
      )}
      {viewFilter && (
        <Flex
          p={"20px"}
          bgColor={"white"}
          position={"absolute"}
          top={"56px"}
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
