import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunGu, Jejumyeongjo, ONEMobilePOP } from "../Component/Text";

export const Service1 = () => {
  return (
    <Stack
      minHeight="100vh"
      overflow={"hidden"}
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
      spacing={8}
      position={"relative"}
    >
      <Stack spacing={0} px={4}>
        <ONEMobilePOP
          textShadow={
            "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
          }
          color={"red"}
          fontSize={"36px"}
        >
          SWITCH ON!
        </ONEMobilePOP>
        <ChosunGu>가장 필요한 순간. 간편 주문, 즉시 도착!</ChosunGu>
      </Stack>
      <Box pl={{ base: 0, md: 20 }}>
        {/* <Image src={require("../Asset/006.jpg")} /> */}
        <Image src={require("../Asset/Resize/006.png")} />
      </Box>
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
          4
        </Text>
      </Flex>
    </Stack>
  );
};
export const Service2 = () => {
  return (
    <Stack
      minHeight="100vh"
      overflow={"hidden"}
      position={"relative"}
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
      spacing={2}
    >
      <Stack px={4} spacing={0}>
        <ONEMobilePOP
          textShadow={
            "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
          }
          color={"red"}
          fontSize={"36px"}
        >
          SEX MBTI
        </ONEMobilePOP>
        <ChosunGu>너 섹비티아이 뭐야?</ChosunGu>
      </Stack>
      <Box w={"full"} pl={{ base: 0, md: 20 }}>
        {/* <Image src={require("../Asset/005.jpg")} /> */}
        <Image src={require("../Asset/Resize/005.png")} />
      </Box>
      <Stack align={"center"} fontSize={"14px"} pl={{ base: 0, md: 20 }}>
        <Jejumyeongjo>
          MBTI는 알지만, 섹스 퍼스널리티는 모른다구요?
        </Jejumyeongjo>
        <Jejumyeongjo fontSize={"17px"} whiteSpace={"pre-line"}>
          {`MBTI처럼 섹스 퍼스널리티에도 
          22가지의 다양한 성향이 있어요.`}
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
          2
        </Text>
        <Text>/</Text>
        <Text fontSize={"14px"} position={"relative"} top={1}>
          4
        </Text>
      </Flex>
    </Stack>
  );
};
export const Service3 = () => {
  return (
    <Stack
      position={"relative"}
      minHeight="100vh"
      overflow={"hidden"}
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
      spacing={8}
    >
      <Stack spacing={0} px={4}>
        <ONEMobilePOP
          textShadow={
            "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
          }
          color={"red"}
          fontSize={"36px"}
        >
          BDSM TEST
        </ONEMobilePOP>
        <ChosunGu>무료 SEX MBTI 테스트</ChosunGu>
      </Stack>
      <Box w={"full"} pl={{ base: 0, md: 20 }}>
        {/* <Image src={require("../Asset/007.jpg")} /> */}
        <Image src={require("../Asset/Resize/007.png")} />
      </Box>
      <Stack pl={{ base: 0, md: 20 }} align={"center"} pt={4} spacing={0}>
        <Jejumyeongjo fontSize={{ base: "18px", md: "24px" }}>
          간단한 테스트로 성향을 공유해보세요.
        </Jejumyeongjo>
        <Jejumyeongjo
          fontSize={{ base: "12px", md: "14px" }}
          whiteSpace={"pre-line"}
          textAlign={"center"}
        >{`상대의 성향과 서로에게 필요한 제품을 알 수 있어요.`}</Jejumyeongjo>
        <Jejumyeongjo
          fontSize={{ base: "12px", md: "14px" }}
          whiteSpace={"pre-line"}
          textAlign={"center"}
        >
          지피지기백전백승! 오늘 사랑이 더 깊어지지 않을까요?
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
          4
        </Text>
      </Flex>
    </Stack>
  );
};
export const Service4 = () => {
  return (
    <Stack
      minHeight="100vh"
      overflow={"hidden"}
      position={"relative"}
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
      spacing={2}
    >
      <Stack px={4} spacing={0} pb={6}>
        <ONEMobilePOP
          textShadow={
            "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
          }
          color={"red"}
          fontSize={"36px"}
        >
          PARTNER SHIP
        </ONEMobilePOP>
        <ChosunGu fontSize={{ base: "14px", md: "16px" }}>
          성인용품이 가장 필요한 순간은 언제일까요?
        </ChosunGu>
      </Stack>
      <Box w={"full"} pl={{ base: 0, md: 20 }}>
        {/* <Image src={require("../Asset/008.jpg")} /> */}
        <Image src={require("../Asset/Resize/008.png")} />
      </Box>
      <Jejumyeongjo
        fontSize={{ base: "16px", md: "20px" }}
        whiteSpace={"pre-line"}
        pl={{ base: 0, md: 20 }}
        textAlign={"center"}
      >{`주문부터 재고관리까지 저희가 합니다!\n사장님은 문고리에 걸어만 주세요.`}</Jejumyeongjo>
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
          4
        </Text>
        <Text>/</Text>
        <Text fontSize={"14px"} position={"relative"} top={1}>
          4
        </Text>
      </Flex>
    </Stack>
  );
};
