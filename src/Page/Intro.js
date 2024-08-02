import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunGu, Jejumyeongjo, ONEMobilePOP } from "../Component/Text";

const Intro = () => {
  return (
    <Stack id="intro" spacing={0} w={"full"}>
      <Stack
        id="intro1"
        w={"full"}
        align={"center"}
        justify={"center"}
        minH={"calc(100vh - 64px)"}
      >
        <Image src={require("../Asset/002.jpg")} />
        {/* <Image src={require("../Asset/Resize/002.png")} /> */}
      </Stack>
      <Stack
        id="intro2"
        w={"full"}
        h={"calc(100vh - 64px)"}
        spacing={0}
        justify={"center"}
      >
        <Stack spacing={0} px={4}>
          <ONEMobilePOP color={"red"} fontSize={"36px"}>
            ADULT TOY
          </ONEMobilePOP>
          <ChosunGu>성인용품 사용해보신 적이 있나요?</ChosunGu>
        </Stack>
        <Stack>
          {/* <Image src={require("../Asset/003.jpg")} /> */}
          <Image src={require("../Asset/Resize/003.png")} />
        </Stack>
        <Stack align={"center"} px={4}>
          <Jejumyeongjo>
            대답하기 부끄러운 것은 저 뿐만이 아니겠죠?
          </Jejumyeongjo>
          <Jejumyeongjo
            whiteSpace={"pre-line"}
            fontSize={"20px"}
            textAlign={"center"}
          >
            {`우리는 성적인 존재가 아닌 척 하는 데에\n너무 오랜 시간을 보냈습니다.`}
          </Jejumyeongjo>
        </Stack>
      </Stack>
      <Stack
        id="intro3"
        h={"calc(100vh - 64px)"}
        spacing={8}
        justify={"center"}
      >
        <Stack spacing={0} px={4}>
          <ONEMobilePOP color={"red"} fontSize={"36px"}>
            ADULT MARKET
          </ONEMobilePOP>
          <ChosunGu>성인용품 시장 5조원 시대</ChosunGu>
        </Stack>
        {/* <Image src={require("../Asset/004.jpg")} /> */}
        <Image src={require("../Asset/Resize/004.png")} />
        <Jejumyeongjo px={4} textAlign={"center"} whiteSpace={"pre-line"}>
          {`하지만 더 나은 섹스를 위한 어덜트토이를 갖기까지\n우리는 부끄러운 마음과 걱정이 먼저 앞서는걸요.`}
        </Jejumyeongjo>
      </Stack>
    </Stack>
  );
};

export default Intro;
