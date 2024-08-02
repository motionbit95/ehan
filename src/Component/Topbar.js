import { Box, Container, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";

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
          <Box>
            <Text fontSize={{ base: "sm", md: "xl" }} fontWeight="bold">
              REDSWITCH
            </Text>
            {/* <Image /> */}
          </Box>
          <HStack
            fontSize={{ base: "10px", md: "16px" }}
            spacing={{ base: 1, md: 4 }}
          >
            <Text
              fontWeight={activeSection === "main" ? "bold" : "normal"}
              onClick={() => scrollToSection("main")}
            >
              MAIN
            </Text>
            <Text
              fontWeight={activeSection === "intro" ? "bold" : "normal"}
              onClick={() => scrollToSection("intro")}
            >
              INTRO
            </Text>
            <Text
              fontWeight={activeSection === "service" ? "bold" : "normal"}
              onClick={() => scrollToSection("service")}
            >
              SERVICE
            </Text>
            <Text
              fontWeight={activeSection === "customer" ? "bold" : "normal"}
              onClick={() => scrollToSection("customer")}
            >
              CUSTOMER
            </Text>
            <Text
              fontWeight={activeSection === "contactUs" ? "bold" : "normal"}
              onClick={() => scrollToSection("contactUs")}
            >
              CONTACT US
            </Text>
          </HStack>
        </HStack>
      </Container>
    </Flex>
  );
};

export default Topbar;
