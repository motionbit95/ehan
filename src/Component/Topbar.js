import { Box, Container, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "./Text";

const Topbar = ({ handleNavClick }) => {
  return (
    <Flex position={"fixed"} bgColor={"black"} w={"100%"} zIndex={111}>
      <Container px={0}>
        <HStack
          w={"100%"}
          h={{ base: "64px", md: "64px" }}
          align={"center"}
          justify={"space-between"}
          p={{ base: 4, md: 8 }}
        >
          <HStack>
            <Box w={{ base: "24px", md: "36px" }}>
              <Image src={require("../Asset/redswitchLogo.png")} />
            </Box>
            <ChosunBg fontSize={{ base: "sm", md: "xl" }} fontWeight="bold">
              REDSWITCH
            </ChosunBg>
          </HStack>
          <HStack
            fontSize={{ base: "10px", md: "16px" }}
            spacing={{ base: 2, md: 4 }}
          >
            <ChosunGu
              fontSize="xs"
              onClick={() => handleNavClick("main")}
              cursor={"pointer"}
            >
              MAIN
            </ChosunGu>
            <ChosunGu
              onClick={() => handleNavClick("intro1")}
              cursor={"pointer"}
              fontSize="xs"
            >
              INTRO
            </ChosunGu>
            <ChosunGu
              onClick={() => handleNavClick("service1")}
              cursor={"pointer"}
              fontSize="xs"
            >
              SERVICE
            </ChosunGu>
            <ChosunGu
              onClick={() => handleNavClick("customer")}
              cursor={"pointer"}
              fontSize="xs"
            >
              CUSTOMER
            </ChosunGu>
            <ChosunGu
              onClick={() => handleNavClick("contact")}
              cursor={"pointer"}
              fontSize="xs"
              whiteSpace={"nowrap"}
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
