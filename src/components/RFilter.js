import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Calendar from "./Calendar";

function RFilter(props) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [viewFilter, setViewFilter] = useState(false);
  const [dateRange, setDateRange] = useState([
    new Date(
      `${new Date().getFullYear()}-${new Date().getMonth()}-${
        new Date().getDate() + 1
      }`
    ),
    new Date(),
  ]);

  return (
    <Flex w={"100%"} p={"10px"} bgColor={"white"}>
      {isDesktop ? (
        <HStack w={"100%"}>
          <IconButton
            onClick={() => setViewFilter(!viewFilter)}
            icon={<Search2Icon />}
          />
          <Select w={"20%"}></Select>
          <Select w={"20%"}></Select>
          <Select w={"20%"}></Select>

          <HStack w={"40%"}>
            <Input
              w={"100%"}
              placeholder="dfasdfa"
              value={
                dateRange
                  ? dateRange[0]?.toLocaleDateString() +
                    " ~ " +
                    dateRange[1]?.toLocaleDateString()
                  : ""
              }
            />
            <Calendar
              defaultRange={dateRange}
              onSelectDate={(dateRange) => {
                setDateRange(dateRange);
              }}
            />
          </HStack>
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
