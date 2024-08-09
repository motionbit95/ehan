import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ChosunGu } from "./Text";
import { HiUpload } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";

const Footer = ({ handleopenModal }) => {
  return (
    <Flex position={"fixed"} bottom={"0"} w={"100%"} zIndex={111}>
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
      <Box
        position="fixed"
        right={4}
        bottom={16}
        borderRadius="full"
        bgGradient="linear(to-r, #833ab4, #fd1d1d, #fcb045)"
        p={1}
        cursor={"pointer"}
      >
        <IconButton
          icon={<FaInstagram size="24px" color="white" />}
          variant="ghost"
          borderRadius="full"
          _hover={{ bg: "none" }}
          aria-label="Instagram"
        />
      </Box>
      {/* <IconButton
        position={"fixed"}
        right={4}
        bottom={16}
        variant={"ghost"}
        borderRadius={"full"}
        bgColor="linear(to-r, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)"
        icon={<FaInstagram size={"24px"} color="white" />}
      /> */}
    </Flex>
  );
};

export default Footer;
