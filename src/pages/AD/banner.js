import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { ChosunBg } from "../../Component/Text";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import PopupBase from "../../modals/PopupBase";

const Banner = () => {
  return (
    <Stack w={"100%"} h={"100%"}>
      <Stack
        position={"absolute"}
        w={"calc(100% - 200px)"}
        h={"calc(100% - 48px)"}
        top={"48px"}
        left={"200px"}
        overflow={"scroll"}
        p={{ base: 4, md: 8 }}
      >
        {/* <ChosunBg fontSize={{ base: "16px", md: "24px" }}>
          광고 배너 설정
        </ChosunBg> */}
        <Card>
          <CardHeader>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>상단 배너</Text>
              <ButtonGroup size={"md"} justifyContent={"flex-end"}>
                <PopupBase icon={<AddIcon />} title={"배너"} action={"등록"}>
                  <Stack>
                    <FormControl isRequired>
                      <FormLabel>제목</FormLabel>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>광고사</FormLabel>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>기간</FormLabel>
                    </FormControl>
                  </Stack>
                </PopupBase>
                <Button
                  colorScheme="red"
                  variant={"outline"}
                  leftIcon={<EditIcon />}
                >
                  저장
                </Button>
              </ButtonGroup>
            </HStack>
          </CardHeader>
          <CardBody>
            <TableContainer
              border={"1px solid #d9d9d9"}
              bgColor={"white"}
              borderRadius={"10px"}
              p={"10px"}
              mb={"20px"}
            >
              <Table variant="simple" size={"sm"}>
                <Thead h={"40px"}>
                  <Tr>
                    <Th>No</Th>
                    <Th>제목</Th>
                    <Th>작성자</Th>
                    <Th>광고사</Th>
                    <Th>기간</Th>
                    {/* {admin?.permission === "supervisor" &&  */}
                    <Th>삭제</Th>
                    {/* } */}
                  </Tr>
                </Thead>
                <Tbody>
                  {[1, 2, 3]?.map((item, index) => (
                    <Tr key={index}>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      {/* {admin?.permission === "supervisor" && ( */}
                      <Td w={"30px"}>
                        <Button
                          size={"sm"}
                          colorScheme="red"
                          variant={"outline"}
                          leftIcon={<DeleteIcon />}
                        >
                          삭제
                        </Button>
                      </Td>
                      {/* )} */}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>하단 배너</Text>
              <ButtonGroup size={"md"} justifyContent={"flex-end"}>
                <PopupBase icon={<AddIcon />} title={"배너"} action={"등록"}>
                  <Stack>
                    <FormControl isRequired>
                      <FormLabel>제목</FormLabel>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>광고사</FormLabel>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>기간</FormLabel>
                    </FormControl>
                  </Stack>
                </PopupBase>
                <Button
                  colorScheme="red"
                  variant={"outline"}
                  leftIcon={<EditIcon />}
                >
                  저장
                </Button>
              </ButtonGroup>
            </HStack>
          </CardHeader>
          <CardBody>
            <TableContainer
              border={"1px solid #d9d9d9"}
              bgColor={"white"}
              borderRadius={"10px"}
              p={"10px"}
              mb={"20px"}
            >
              <Table variant="simple" size={"sm"}>
                <Thead h={"40px"}>
                  <Tr>
                    <Th>No</Th>
                    <Th>제목</Th>
                    <Th>작성자</Th>
                    <Th>광고사</Th>
                    <Th>기간</Th>
                    {/* {admin?.permission === "supervisor" &&  */}
                    <Th>삭제</Th>
                    {/* } */}
                  </Tr>
                </Thead>
                <Tbody>
                  {[1, 2, 3]?.map((item, index) => (
                    <Tr key={index}>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      {/* {admin?.permission === "supervisor" && ( */}
                      <Td w={"30px"}>
                        <Button
                          size={"sm"}
                          colorScheme="red"
                          variant={"outline"}
                          leftIcon={<DeleteIcon />}
                        >
                          삭제
                        </Button>
                      </Td>
                      {/* )} */}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
};

export default Banner;
