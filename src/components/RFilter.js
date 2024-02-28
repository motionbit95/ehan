import {
  Flex,
  HStack,
  Input,
  Select,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";

function RFilter(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex w={"100%"} p={"10px"} bgColor={"white"}>
      {isDesktop ? (
        <HStack w={"100%"}>
          <Select></Select>
          <Select></Select>
          <Select></Select>
          <Input type="date"></Input>
        </HStack>
      ) : (
        <Stack w={"100%"}>
          <HStack w={"100%"}>
            <Select></Select>
            <Select></Select>
          </HStack>
          <HStack>
            <Select></Select>
            <Input type="date"></Input>
          </HStack>
        </Stack>
      )}
    </Flex>
  );
}

export default RFilter;
