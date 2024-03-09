import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder(props) {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 주문번호를 확인하였을 때
    console.log("주문번호를 확인하였습니다!!");
    setShow(false);
  };

  return (
    <Stack position={"relative"} height={"100vh"}>
      <Stack overflow={"scroll"}>
        <Flex
          bgColor={"white"}
          align={"center"}
          w={"100%"}
          h={"40px"}
          p={"25px 20px"}
          justify={"space-between"}
          position={"sticky"}
          top={"0"}
          zIndex={"20"}
          boxShadow={"lg"}
        >
          <Image
            w={"24px"}
            h={"24px"}
            onClick={() => navigate(-1)}
            src={require("../../image/CkChevronLeft.png")}
          />
          <Text fontSize={"large"} fontWeight={"bold"}>
            주문조회
          </Text>
          <Image
            src={require("../../image/Homebutton.png")}
            onClick={() => navigate(`/home/`)}
          />
        </Flex>
        {show ? (
          <form onSubmit={handleSubmit}>
            {/* 주문조회버튼 */}
            <Stack padding={"2vh"} justify={"center"} h={"90vh"} gap={"20px"}>
              <FormControl isRequired>
                <Input bgColor={"white"} placeholder="주문번호" />
              </FormControl>
              <Button
                w={"100%"}
                color={"white"}
                bgColor={"#e53e3e"}
                type="submit"
              >
                주문조회하기
              </Button>
            </Stack>
          </form>
        ) : (
          <Stack padding={"2vh"} h={"90vh"} gap={"20px"}>
            <Stack bgColor={"white"} p={"10px"} borderRadius={"10px"}>
              <HStack justify={"space-between"}>
                <HStack>
                  <Text>2024.03.03</Text>
                  <Text>배송중입니다.</Text>
                </HStack>
                <IconButton
                  size={"sm"}
                  // onClick={() => deleteProduct(item.doc_id)}
                  icon={<DeleteIcon />}
                />
              </HStack>

              <HStack gap={"10px"}>
                <Box bg={"green"} w={"100px"} h={"100px"} />
                <HStack>
                  <Stack>
                    <Text>제품명</Text>
                    <Text>결제 수량 : </Text>
                    <Text>결제금액 : </Text>
                  </Stack>
                </HStack>
              </HStack>
              <HStack justifyContent={"space-between"}>
                <Stack w={"100%"}>
                  <Button>환불</Button>
                </Stack>
                <Stack w={"100%"}>
                  <Button>재구매</Button>
                </Stack>
                <Stack w={"100%"}>
                  <Button>배송조회</Button>
                </Stack>
              </HStack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default SearchOrder;
