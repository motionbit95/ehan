import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

const Main = () => {
  return (
    <Stack
      id="main"
      minH="calc(100vh - 64px)"
      align={"center"}
      py={6}
      mb={8}
      backgroundImage={require("../Asset/001.jpg")}
      backgroundSize={"cover"}
      backgroundPosition={"center"}
    >
      <Stack>
        <Text>숙박업소 비대면 어덜트토이 플랫폼</Text>
        <Stack spacing={0} fontSize={"36px"} fontWeight={"900"} lineHeight={1}>
          <Text color={"red"}>RED</Text>
          <Text>SWITCH</Text>
        </Stack>
        <Text>가장 필요한 순간, 간편 주문, 즉시 도착</Text>
      </Stack>
    </Stack>
  );
};

export default Main;
