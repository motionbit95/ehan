import { Stack, Text } from "@chakra-ui/react";
import React from "react";

const Customer = () => {
  return (
    <Stack id="customer" minH="calc(100vh - 64px)">
      <Stack px={4}>
        <Text>설치 지점</Text>
        <Text>
          주변 설치 지점을 검색하여 전국 어디서든 레드스위치를 경험할 수
          있습니다.
        </Text>
      </Stack>
    </Stack>
  );
};

export default Customer;
