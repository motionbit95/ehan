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
import React from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder(props) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // 주문번호를 확인하였을 때
    console.log("주문번호를 확인하였습니다!! 결제창으로 돌아가자");
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
      </Stack>
    </Stack>
  );
}

export default SearchOrder;
