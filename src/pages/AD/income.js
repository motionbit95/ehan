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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../GlobalState";
import RFilter from "../../components/RFilter";
import PopupBase from "../../modals/PopupBase";
import { AddIcon } from "@chakra-ui/icons";

function Income({ ...props }) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  useEffect(() => {}, []);

  const addIncome = (e) => {
    let incomeData = {
      createAt: new Date(),
    };
    for (let i = 0; i < e.target.length; i++) {
      incomeData = { ...incomeData, [e.target[i].name]: e.target[i].value };
    }

    console.log(incomeData);
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
          <RFilter />
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            <HStack>
              <PopupBase
                icon={<AddIcon />}
                title="분석"
                action="추가"
                text="분석 추가"
                onClose={addIncome}
              >
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  기본정보
                </Text>
                <FormControl isRequired>
                  <FormLabel>매장명</FormLabel>
                  <Select name="shop_id">
                    <option value="">선택</option>
                    {props.shopList?.map((shop, index) => (
                      <option key={index} value={shop.doc_id}>
                        {shop.shop_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>분석기간</FormLabel>
                  <Input name="date" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>매출금액</FormLabel>
                  <Input name="sales" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>매입금액</FormLabel>
                  <Input name="purchase" />
                </FormControl>
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  추가정보
                </Text>
                <FormControl>
                  <FormLabel>임차료</FormLabel>
                  <Input name="hire" />
                </FormControl>
                <FormControl>
                  <FormLabel>인건비</FormLabel>
                  <Input name="personnel" />
                </FormControl>
                <FormControl>
                  <FormLabel>공과금</FormLabel>
                  <Input name="dues" />
                </FormControl>
                <FormControl>
                  <FormLabel>기타비용</FormLabel>
                  <Input name="etc" />
                </FormControl>
              </PopupBase>
            </HStack>
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            <Text>모바일 뷰 손익관리</Text>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Income;
