import { HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "../Component/Text";

const ContactUs = () => {
  return (
    <Stack
      // id="contactUs"
      h={"100vh"}
      justify={"center"}
      spacing={8}
    >
      <Stack px={4}>
        <ChosunBg fontSize={"36px"}>레드스위치</ChosunBg>
        <Image src={require("../Asset/Resize/009.png")} />
        <Stack spacing={3}>
          <Stack spacing={"2px"} fontSize={"14px"}>
            <HStack>
              <ChosunGu w={"75px"}>상호</ChosunGu>
              <ChosunGu>레드스위치</ChosunGu>
            </HStack>
            <HStack>
              <ChosunGu w={"75px"}>대표자명</ChosunGu>
              <ChosunGu>이한샘</ChosunGu>
            </HStack>
            <HStack>
              <ChosunGu w={"75px"}>주소</ChosunGu>
              <ChosunGu>서울특별시 강남구 역삼로 114, 8층</ChosunGu>
            </HStack>
            <HStack>
              <ChosunGu w={"75px"}>사업자번호</ChosunGu>
              <ChosunGu>208-16-70116</ChosunGu>
            </HStack>
            <HStack>
              <ChosunGu w={"75px"}>통신판매업</ChosunGu>
              <ChosunGu>2024-서울강남-02044</ChosunGu>
            </HStack>
            <HStack>
              <ChosunGu w={"75px"}>고객센터</ChosunGu>
              <ChosunGu>070-8722-5882</ChosunGu>
            </HStack>
            <HStack>
              <ChosunGu w={"75px"}>대표이메일</ChosunGu>
              <ChosunGu>redswitch.help@gmail.com</ChosunGu>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
      <HStack spacing={4} color={"#808080"} justify={"center"}>
        <ChosunGu textDecoration={"underline"} cursor={"pointer"}>
          이용약관
        </ChosunGu>
        <ChosunGu textDecoration={"underline"} cursor={"pointer"}>
          개인정보처리방침
        </ChosunGu>
      </HStack>
    </Stack>
  );
};

export default ContactUs;
