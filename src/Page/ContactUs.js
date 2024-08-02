import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

const ContactUs = () => {
  return (
    <Stack id="contactUs" minH="calc(100vh - 64px)">
      <Stack px={4}>
        <Text>레드스위치</Text>
        <Image src={require("../Asset/Resize/009.png")} />
        <Stack spacing={3}>
          <Stack>
            <HStack>
              <Text>상호</Text>
              <Text>레드스위치</Text>
            </HStack>
            <HStack>
              <Text>대표자명</Text>
              <Text>이한샘</Text>
            </HStack>
            <HStack>
              <Text>주소</Text>
              <Text>서울특별시 강남구 역삼로 114, 8층</Text>
            </HStack>
            <HStack>
              <Text>사업자번호</Text>
              <Text>208-16-70116</Text>
            </HStack>
            <HStack>
              <Text>통신판매업</Text>
              <Text>2024-서울강남-02044</Text>
            </HStack>
            <HStack>
              <Text>고객센터</Text>
              <Text>070-8722-5882</Text>
            </HStack>
            <HStack>
              <Text>대표이메일</Text>
              <Text>redswitch.help@gmail.com</Text>
            </HStack>
          </Stack>
          <HStack color={"#808080"}>
            <Text>이용약관</Text>
            <Text>개인정보처리방침</Text>
          </HStack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContactUs;
