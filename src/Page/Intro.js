import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

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
      <Stack id="intro2" w={"full"} h={"calc(100vh - 64px)"} spacing={0} px={4}>
        <Stack>
          <Text>ADULT TOY</Text>
          <Text>성인용품 사용해보신 적이 있나요?</Text>
        </Stack>
        <Stack>
          {/* <Image src={require("../Asset/003.jpg")} /> */}
          <Image src={require("../Asset/Resize/003.png")} />
        </Stack>
        <Stack>
          <Text>대답하기 부끄러운 것은 저 뿐만이 아니겠죠?</Text>
          <Text>
            우리는 성적인 존재가 아닌 척 하는 데에 너무 오랜 시간을 보냈습니다.
          </Text>
        </Stack>
      </Stack>
      <Stack id="intro3" px={4} h={"calc(100vh - 64px)"} spacing={0}>
        <Stack>
          <Text>ADULT MARKET</Text>
          <Text>성인용품 시장 5조원 시대</Text>
        </Stack>
        {/* <Image src={require("../Asset/004.jpg")} /> */}
        <Image src={require("../Asset/Resize/004.png")} />
        <Box>
          <Text>
            성인용품에 대한 관심과 수요가 늘어나면서 성인용품 시장은 동네의 작은
            매장형태 에서 트랜디한 비대면 상점과 온라인샵들로 발전했죠.
          </Text>
        </Box>
        <Text>
          하지만 더 나은 섹스를 위한 어덜트토이를 갖기까지 우리는 부끄러운
          마음과 걱정이 먼저 앞서는걸요.
        </Text>
      </Stack>
    </Stack>
  );
};

export default Intro;
