import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunGu, Jejumyeongjo, ONEMobilePOP } from "../Component/Text";

const Service = () => {
  return (
    <Stack id="service">
      <Stack id="service1" minH="calc(100vh - 64px)" px={4} justify={"center"}>
        <Stack spacing={0}>
          <ONEMobilePOP color={"red"} fontSize={"36px"}>
            SWITCH ON!
          </ONEMobilePOP>
          <ChosunGu>가장 필요한 순간. 간편 주문, 즉시 도착!</ChosunGu>
        </Stack>
        <Box w={"full"}>
          {/* <Image src={require("../Asset/006.jpg")} /> */}
          <Image src={require("../Asset/Resize/006.png")} />
        </Box>
      </Stack>
      <Stack id="service2" minH="calc(100vh - 64px)" justify={"center"}>
        <Stack px={4} spacing={0}>
          <ONEMobilePOP color={"red"} fontSize={"36px"}>
            SEX MBTI
          </ONEMobilePOP>
          <ChosunGu>너 섹비티아이 뭐야?</ChosunGu>
        </Stack>
        <Box w={"full"}>
          {/* <Image src={require("../Asset/005.jpg")} /> */}
          <Image src={require("../Asset/Resize/005.png")} />
        </Box>
        <Stack px={4} align={"center"} fontSize={"17px"}>
          <Jejumyeongjo>
            MBTI는 알지만, 섹스 퍼스널리티는 모른다구요?
          </Jejumyeongjo>
          <Jejumyeongjo fontSize={"12px"}>
            MBTI처럼 섹스 퍼스널리티에도 22가지의 다양한 성향이 있어요.
          </Jejumyeongjo>
        </Stack>
      </Stack>
      <Stack id="service3" minH="calc(100vh - 64px)" justify={"center"}>
        <Stack spacing={0} px={4}>
          <ONEMobilePOP color={"red"} fontSize={"36px"}>
            BDSM TEST
          </ONEMobilePOP>
          <ChosunGu>무료 SEX MBTI 테스트</ChosunGu>
        </Stack>
        <Box w={"full"}>
          {/* <Image src={require("../Asset/007.jpg")} /> */}
          <Image src={require("../Asset/Resize/007.png")} />
        </Box>
        <Stack px={4} align={"center"} pt={4}>
          <Jejumyeongjo fontSize="22px">
            간단한 테스트로 성향을 공유해보세요.
          </Jejumyeongjo>
          <Jejumyeongjo
            fontSize="14px"
            whiteSpace={"pre-line"}
            textAlign={"center"}
          >{`상대의 성향과 서로에게 필요한 제품을 알 수 있어요.\n지피지기백전백승! 오늘 사랑이 더 깊어지지 않을까요?`}</Jejumyeongjo>
        </Stack>
      </Stack>
      <Stack
        id="service4"
        minH="calc(100vh - 64px)"
        justify={"center"}
        spacing={6}
      >
        <Stack px={4} spacing={0}>
          <ONEMobilePOP color={"red"} fontSize={"36px"}>
            PARTNER SHIP
          </ONEMobilePOP>
          <ChosunGu>성인용품이 가장 필요한 순간은 언제일까요?</ChosunGu>
        </Stack>
        <Box w={"full"}>
          {/* <Image src={require("../Asset/008.jpg")} /> */}
          <Image src={require("../Asset/Resize/008.png")} />
        </Box>
        <Jejumyeongjo
          fontSize="18px"
          whiteSpace={"pre-line"}
          px={4}
          textAlign={"center"}
        >{`주문부터 재고관리까지 저희가 합니다!\n사장님은 문고리에 걸어만 주세요.`}</Jejumyeongjo>
      </Stack>
    </Stack>
  );
};

export default Service;
