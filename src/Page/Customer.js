import { Box, HStack, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ChosunBg, ChosunGu } from "../Component/Text";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Customer = () => {
  return (
    <Stack
      // id="customer"
      minHeight="100vh"
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
      spacing={12}
    >
      <Stack px={4} spacing={0}>
        <ChosunBg fontSize={"36px"}>설치 지점</ChosunBg>
        <ChosunGu fontSize={"11px"}>
          주변 설치 지점을 검색하여 전국 어디서든 레드스위치를 경험할 수
          있습니다.
        </ChosunGu>
      </Stack>
      <Stack align={"center"} spacing={8}>
        <HStack align={"center"} spacing={8}>
          <IconButton
            icon={<ChevronLeftIcon />}
            borderRadius={"full"}
            size={"sm"}
          />
          <HStack spacing={4}>
            <Box borderRadius={"full"} overflow={"hidden"}>
              <Image w={"64px"} h={"64px"} bgColor={"white"} />
            </Box>
            <Box borderRadius={"full"} overflow={"hidden"}>
              <Image w={"64px"} h={"64px"} bgColor={"white"} />
            </Box>
            <Box borderRadius={"full"} overflow={"hidden"}>
              <Image w={"64px"} h={"64px"} bgColor={"white"} />
            </Box>
          </HStack>
          <IconButton
            icon={<ChevronRightIcon />}
            borderRadius={"full"}
            size={"sm"}
          />
        </HStack>
        <HStack align={"center"} spacing={0}>
          <IconButton
            bgColor={"black"}
            icon={<ChevronLeftIcon color={"white"} boxSize={"48px"} />}
            borderRadius={"full"}
          />
          <HStack spacing={4}>
            <Box overflow={"hidden"}>
              <Image w={"150px"} h={"150px"} bgColor={"white"} />
            </Box>
            <Box overflow={"hidden"}>
              <Image w={"150px"} h={"150px"} bgColor={"white"} />
            </Box>
          </HStack>
          <IconButton
            bgColor={"black"}
            icon={<ChevronRightIcon color={"white"} boxSize={"48px"} />}
            borderRadius={"full"}
          />
        </HStack>
      </Stack>
      {/* <Box w={"100%"} h={"50vh"} bgColor={"#0F0F0F"} /> */}
      <Stack align={"center"}>
        <ChosunGu decoration={"underline"} fontSize={"14px"} cursor={"pointer"}>
          설치지점 검색하기
        </ChosunGu>
      </Stack>
    </Stack>
  );
};

export default Customer;
