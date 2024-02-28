import React from "react";
import { Flex, HStack, Stack, useMediaQuery } from "@chakra-ui/react";
import RFilter from "../../components/RFilter";

function Home(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  return (
    <Flex w={"100%"} h={"calc(100% - 48px)"}>
      {isDesktop ? (
        <Stack
          position={"absolute"}
          w={"calc(100% - 200px)"}
          h={"calc(100% - 48px)"}
          top={"48px"}
          left={"200px"}
          // p={"2vh"}
        >
          <RFilter />
          {/* desktop 에서의 레이아웃 */}
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            <HStack w={"100%"} h={"20%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
            </HStack>
            <HStack w={"100%"} h={"40%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
            </HStack>
            <HStack w={"100%"} h={"40%"}>
              <Flex
                borderRadius={"10px"}
                bgColor={"white"}
                w={"100%"}
                h={"100%"}
              ></Flex>
            </HStack>
          </Stack>
        </Stack>
      ) : (
        <Flex bgColor={"green"} w={"100%"} h={"100%"}>
          <RFilter />
        </Flex>
      )}
    </Flex>
  );
}

export default Home;