import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunGu, Jejumyeongjo, ONEMobilePOP } from "../Component/Text";

export const Intro1 = () => {
  return (
    <Stack
      // id="intro1"
      w={"full"}
      h={"100vh"}
      // minHeight="100vh"
      // css={{
      //   "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
      //     minHeight: "-webkit-fill-available",
      //   },
      // }}
      align={"center"}
      justify={"center"}
    >
      <Image src={require("../Asset/002.jpg")} />
      {/* <Image src={require("../Asset/Resize/002.png")} /> */}
    </Stack>
  );
};

export const Intro2 = () => {
  return (
    <Stack
      // id="intro2"
      w={"full"}
      minHeight="100vh"
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      spacing={8}
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
      <Stack align={"center"} px={2}>
        <Jejumyeongjo fontSize={"15px"}>
          대답하기 부끄러운 것은 저 뿐만이 아니겠죠?
        </Jejumyeongjo>
        <Stack>
          <Jejumyeongjo
            whiteSpace={"nowrap"}
            fontSize={"18px"}
            textAlign={"center"}
          >
            {`우리는 성적인 존재가 아닌 척 하는 데에`}
          </Jejumyeongjo>
          <Jejumyeongjo
            whiteSpace={"nowrap"}
            fontSize={"18px"}
            textAlign={"center"}
          >
            {`너무 오랜 시간을 보냈습니다.`}
          </Jejumyeongjo>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const Intro3 = () => {
  return (
    <Stack
      // id="intro3"
      spacing={8}
      minHeight="100vh"
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
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
      <Stack>
        <Jejumyeongjo
          fontSize={"15px"}
          px={2}
          textAlign={"center"}
          whiteSpace={"nowrap"}
        >
          {`하지만 더 나은 섹스를 위한 어덜트토이를 갖기까지`}
        </Jejumyeongjo>
        <Jejumyeongjo
          fontSize={"15px"}
          px={2}
          textAlign={"center"}
          whiteSpace={"nowrap"}
        >
          {`우리는 부끄러운 마음과 걱정이 먼저 앞서는걸요.`}
        </Jejumyeongjo>
      </Stack>
    </Stack>
  );
};
