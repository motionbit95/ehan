import { Search2Icon } from "@chakra-ui/icons";
import {
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";

function RFilter(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [viewFilter, setViewFilter] = useState(false);

  return (
    <Flex w={"100%"} p={"10px"} bgColor={"white"}>
      {isDesktop ? (
        <HStack w={"100%"}>
          <IconButton
            onClick={() => setViewFilter(!viewFilter)}
            icon={<Search2Icon />}
          />
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
      {viewFilter && (
        <Flex
          p={"20px"}
          bgColor={"white"}
          position={"absolute"}
          top={"48px"}
          boxShadow={"md"}
          borderRadius={"10px"}
        >
          <CloseButton
            onClick={() => setViewFilter(false)}
            position={"absolute"}
            zIndex={"10"}
            right={"10px"}
            top={"10px"}
          />
          {props.render}
        </Flex>
      )}
    </Flex>
  );
}

export default RFilter;
