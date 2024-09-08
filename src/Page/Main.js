import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "../Component/Text";

const Main = () => {
  return (
    <Stack
      // id="main"
      overflow={"hidden"}
      align={"center"}
      justify={"center"}
      minHeight="100vh"
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      spacing={6}
    >
      <Stack spacing={0}>
        <ChosunGu fontSize={"10px"}>숙박업소 비대면 어덜트토이 플랫폼</ChosunGu>
        <Stack
          spacing={0}
          fontSize={{ base: "54px", md: "66px" }}
          fontWeight={"900"}
          lineHeight={0.9}
        >
          <ChosunBg color={"red"}>RED</ChosunBg>
          <ChosunBg>SWITCH</ChosunBg>
        </Stack>
        <ChosunGu fontWeight={"900"}>
          가장 필요한 순간, 간편 주문, 즉시 도착.
        </ChosunGu>
      </Stack>
      <Stack>
        <Image
          display={{ base: "none", md: "block" }}
          src={require("../Asset/PC/001 1.png")}
        />
        <Image
          display={{ base: "block", md: "none" }}
          src={require("../Asset/Resize/001.png")}
        />
      </Stack>
    </Stack>
  );
};

export default Main;
