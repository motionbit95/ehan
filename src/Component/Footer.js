import { Container, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";

const Footer = ({ handleopenModal }) => {
  return (
    <Flex position={"fixed"} bottom={"0"} w={"100%"}>
      <HStack
        w={"100%"}
        py={2}
        bgColor={"#222222"}
        align={"center"}
        justify={"center"}
        cursor={"pointer"}
        onClick={handleopenModal}
      >
        <Text>가맹점 신청하기</Text>
      </HStack>
    </Flex>
  );
};

export default Footer;
