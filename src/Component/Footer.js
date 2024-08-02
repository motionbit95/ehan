import { Container, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunGu } from "./Text";
import { HiUpload } from "react-icons/hi";

const Footer = ({ handleopenModal }) => {
  return (
    <Flex position={"fixed"} bottom={"0"} w={"100%"}>
      <HStack
        w={"100%"}
        py={3}
        bgColor={"#222222"}
        align={"center"}
        justify={"center"}
        cursor={"pointer"}
        onClick={handleopenModal}
      >
        <HiUpload />
        <ChosunGu>가맹점 신청하기</ChosunGu>
      </HStack>
    </Flex>
  );
};

export default Footer;
