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
import { getPayment } from "../../firebase/firebase_func";

function SearchOrder(props) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 주문번호를 확인하였을 때
    let orderResult = await getPayment(event.target[0].value);

    if (!orderResult) {
      // 주문 내역이 없을 때
      alert(
        "해당 주문번호의 내역이 존재하지 않습니다. 주문번호를 확인해주세요."
      );
      return;
    }

    let jsonOrder = JSON.stringify(orderResult);
    var encodedData = encodeURIComponent(jsonOrder);
    console.log(encodedData);

    var decodedData = decodeURIComponent(encodedData);
    var recievedData = JSON.parse(decodedData);

    console.log(decodedData);

    // console.log("주문번호를 확인하였습니다!! 결제창으로 돌아가자");
    navigate(`/result?data=${decodedData}`);
  };

  return (
    <Stack position={"relative"} height={"100vh"}>
      <Stack overflow={"auto"}>
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
