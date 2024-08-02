import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "../Component/Text";

const Customer = () => {
  return (
    <Stack
      id="customer"
      minH="calc(100vh - 64px)"
      justify={"center"}
      spacing={8}
    >
      <Stack px={4} spacing={0}>
        <ChosunBg fontSize={"36px"}>설치 지점</ChosunBg>
        <ChosunGu fontSize={"11px"}>
          주변 설치 지점을 검색하여 전국 어디서든 레드스위치를 경험할 수
          있습니다.
        </ChosunGu>
      </Stack>
      <Box w={"100%"} h={"50vh"} bgColor={"#0F0F0F"} />
      <Stack align={"center"}>
        <ChosunGu decoration={"underline"}>설치지점 검색하기</ChosunGu>
      </Stack>
    </Stack>
  );
};

export default Customer;
