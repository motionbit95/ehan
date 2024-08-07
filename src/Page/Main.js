import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "../Component/Text";

const Main = () => {
  return (
    <Stack
      // id="main"
      align={"center"}
      justify={"center"}
      h={"100vh"}
      spacing={6}
    >
      <Stack>
        <ChosunGu fontSize={"10px"}>숙박업소 비대면 어덜트토이 플랫폼</ChosunGu>
        <Stack spacing={0} fontSize={"54px"} fontWeight={"900"} lineHeight={1}>
          <ChosunBg color={"red"}>RED</ChosunBg>
          <ChosunBg>SWITCH</ChosunBg>
        </Stack>
        <ChosunGu>가장 필요한 순간, 간편 주문, 즉시 도착</ChosunGu>
      </Stack>
      <Stack>
        <Image src={require("../Asset/Resize/001.png")} />
      </Stack>
    </Stack>
  );
};

export default Main;
