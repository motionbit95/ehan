import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunGu, Jejumyeongjo, ONEMobilePOP } from "../Component/Text";

export const Intro1 = () => {
  return (
    <Stack
      // id="intro1"
      overflow={"hidden"}
      w={"full"}
      h={"100vh"}
      position={"relative"}
      // minHeight="100vh"
      // css={{
      //   "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
      //     minHeight: "-webkit-fill-available",
      //   },
      // }}
      align={"center"}
      justify={"center"}
    >
      {/* <Image src={require("../Asset/002.jpg")} /> */}
      <Image src={require("../Asset/Resize/002.png")} />
      <Flex
        // display={{ base: "none", md: "flex" }}
        position={"absolute"}
        bottom={{ base: "6vh", md: "40" }}
        left={4}
        color={"rgb(255, 255, 255, 0.6)"}
      >
        <Text
          fontSize={"24px"}
          color={"white"}
          fontWeight={"extrabold"}
          position={"relative"}
          bottom={3}
        >
          1
        </Text>
        <Text>/</Text>
        <Text fontSize={"14px"} position={"relative"} top={1}>
          3
        </Text>
      </Flex>
    </Stack>
  );
};

export const Intro2 = () => {
  return (
    <Stack
      // id="intro2"
      w={"full"}
      overflow={"hidden"}
      position={"relative"}
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
        <ONEMobilePOP
          textShadow={
            "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
          }
          color={"red"}
          fontSize={"36px"}
        >
          ADULT TOY
        </ONEMobilePOP>
        <ChosunGu>성인용품 사용해보신 적이 있나요?</ChosunGu>
      </Stack>
      <Stack spacing={0}>
        <Box display={{ base: "none", md: "block" }}>
          <Image src={require("../Asset/PC/003 1.png")} />
        </Box>
        <Image
          display={{ base: "block", md: "none" }}
          src={require("../Asset/Resize/003.png")}
        />
        <Stack align={"center"} px={2} mt={-3}>
          <Jejumyeongjo fontSize={{ base: "15px", md: "lg" }}>
            대답하기 부끄러운 것은 저 뿐만이 아니겠죠?
          </Jejumyeongjo>
          <Stack spacing={0}>
            <Jejumyeongjo
              whiteSpace={"nowrap"}
              fontSize={{ base: "18px", md: "xl" }}
              textAlign={"center"}
            >
              {`우리는 성적인 존재가 아닌 척 하는 데에`}
            </Jejumyeongjo>
            <Jejumyeongjo
              whiteSpace={"nowrap"}
              fontSize={{ base: "18px", md: "xl" }}
              textAlign={"center"}
            >
              {`너무 오랜 시간을 보냈습니다.`}
            </Jejumyeongjo>
          </Stack>
        </Stack>
      </Stack>
      <Flex
        // display={{ base: "none", md: "flex" }}
        position={"absolute"}
        bottom={{ base: "6vh", md: "40" }}
        left={4}
        color={"rgb(255, 255, 255, 0.6)"}
      >
        <Text
          fontSize={"24px"}
          color={"white"}
          fontWeight={"extrabold"}
          position={"relative"}
          bottom={3}
        >
          2
        </Text>
        <Text>/</Text>
        <Text fontSize={"14px"} position={"relative"} top={1}>
          3
        </Text>
      </Flex>
    </Stack>
  );
};

export const Intro3 = () => {
  return (
    <Stack
      // id="intro3"
      spacing={8}
      overflow={"hidden"}
      position={"relative"}
      minHeight="100vh"
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
    >
      <Stack spacing={0} px={4}>
        <ONEMobilePOP
          textShadow={
            "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
          }
          color={"red"}
          fontSize={"36px"}
        >
          ADULT MARKET
        </ONEMobilePOP>
        <ChosunGu>성인용품 시장 5조원 시대</ChosunGu>
      </Stack>
      {/* <Image src={require("../Asset/004.jpg")} /> */}
      <Box px={{ base: 0, md: 6 }}>
        <Image src={require("../Asset/Resize/004.png")} />
      </Box>
      <Stack spacing={0}>
        <Jejumyeongjo
          fontSize={{ base: "15px", md: "lg" }}
          px={2}
          textAlign={"center"}
          whiteSpace={"nowrap"}
        >
          {`하지만 더 나은 섹스를 위한 어덜트토이를 갖기까지`}
        </Jejumyeongjo>
        <Jejumyeongjo
          fontSize={{ base: "15px", md: "lg" }}
          px={2}
          textAlign={"center"}
          whiteSpace={"nowrap"}
        >
          {`우리는 부끄러운 마음과 걱정이 먼저 앞서는걸요.`}
        </Jejumyeongjo>
      </Stack>
      <Flex
        // display={{ base: "none", md: "flex" }}
        position={"absolute"}
        bottom={{ base: "6vh", md: "40" }}
        left={4}
        color={"rgb(255, 255, 255, 0.6)"}
      >
        <Text
          fontSize={"24px"}
          color={"white"}
          fontWeight={"extrabold"}
          position={"relative"}
          bottom={3}
        >
          3
        </Text>
        <Text>/</Text>
        <Text fontSize={"14px"} position={"relative"} top={1}>
          3
        </Text>
      </Flex>
    </Stack>
  );
};
