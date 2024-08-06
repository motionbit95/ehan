import { Box, Container, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "./Text";
import Logo from "../components/Logo";

const Topbar = ({ scrollToSection, activeSection }) => {
  return (
    <Flex position={"fixed"} bgColor={"black"} w={"100%"}>
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
              fontWeight={activeSection === "main" ? "bold" : "normal"}
              onClick={() => scrollToSection("main")}
            >
              MAIN
            </ChosunGu>
            <ChosunGu
              fontWeight={activeSection === "intro" ? "bold" : "normal"}
              onClick={() => scrollToSection("intro")}
            >
              INTRO
            </ChosunGu>
            <ChosunGu
              fontWeight={activeSection === "service" ? "bold" : "normal"}
              onClick={() => scrollToSection("service")}
            >
              SERVICE
            </ChosunGu>
            <ChosunGu
              fontWeight={activeSection === "customer" ? "bold" : "normal"}
              onClick={() => scrollToSection("customer")}
            >
              CUSTOMER
            </ChosunGu>
            <ChosunGu
              fontWeight={activeSection === "contactUs" ? "bold" : "normal"}
              onClick={() => scrollToSection("contactUs")}
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
