import { Box, Container, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChosunBg, ChosunGu } from "./Text";

const Topbar = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    // 해시 변경을 감지하는 이벤트 리스너 등록
    window.addEventListener("hashchange", handleHashChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return (
    <Flex position={"fixed"} bgColor={"black"} w={"100%"} zIndex={111}>
      <Container px={0} maxW={{ base: "100%", md: "xl" }}>
        <HStack
          w={"100%"}
          h={{ base: "64px", md: "64px" }}
          align={"center"}
          justify={"space-between"}
          p={{ base: 4, md: 8 }}
        >
          <HStack>
            <Box w={{ base: "20px", md: "28px" }}>
              <Image src={require("../Asset/redswitchLogo.png")} />
            </Box>
            <ChosunBg fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
              REDSWITCH
            </ChosunBg>
          </HStack>
          <HStack
            fontSize={{ base: "10px", md: "sm" }}
            spacing={{ base: 1, md: 2 }}
          >
            <ChosunGu
              as={"a"}
              href={"#1"}
              cursor={"pointer"}
              fontWeight={currentHash === "#1" ? "bold" : "normal"}
            >
              MAIN
            </ChosunGu>
            <ChosunGu
              as={"a"}
              href={"#2"}
              cursor={"pointer"}
              fontWeight={
                currentHash === "#2" ||
                currentHash === "#3" ||
                currentHash === "#4"
                  ? "bold"
                  : "normal"
              }
            >
              INTRO
            </ChosunGu>
            <ChosunGu
              as={"a"}
              href={"#5"}
              cursor={"pointer"}
              fontWeight={
                currentHash === "#5" ||
                currentHash === "#6" ||
                currentHash === "#7" ||
                currentHash === "#8"
                  ? "bold"
                  : "normal"
              }
            >
              SERVICE
            </ChosunGu>
            <ChosunGu
              as={"a"}
              href={"#9"}
              cursor={"pointer"}
              fontWeight={currentHash === "#9" ? "bold" : "normal"}
            >
              CUSTOMER
            </ChosunGu>
            <ChosunGu
              as={"a"}
              href={"#10"}
              cursor={"pointer"}
              whiteSpace={"nowrap"}
              fontWeight={currentHash === "#10" ? "bold" : "normal"}
            >
              CONTACT US
            </ChosunGu>
          </HStack>
        </HStack>
      </Container>
    </Flex>
  );
};

export default Topbar;
