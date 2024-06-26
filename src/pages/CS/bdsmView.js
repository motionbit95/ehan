import { Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router-dom";

function BdsmView(props) {
  const navigate = useNavigate();
  const type = [
    "마스터",
    "슬레이브",
    "헌터",
    "프레이",
    "브랫테이머",
    "브랫",
    "오너",
    "펫",
    "대디",
    "리틀",
    "사디스트",
    "마조히스트",
    "스팽커",
    "스팽키",
    "디그레이더",
    "디그레이디",
    "리거",
    "로프버니",
    "도미넌트",
    "서브미시브",
    "스위치",
    "바닐라",
  ];
  return (
    <Stack p={{ base: "1vh", md: "2vh" }}>
      <HStack p={{ base: "1vh", md: "2vh" }} id="header">
        <Logo />
        <Text fontFamily={"seolleimcool-SemiBold"}>레드스위치</Text>
      </HStack>
      <Button colorScheme="red" onClick={() => navigate("/bdsm")}>
        테스트하러가기
      </Button>
      {type.map((t) => (
        <Image
          src={require(`../../assets/type/${t}.jpg`)}
          //   onClick={() => {
          //     props.setYourBDSM(t);
          //   }}
        />
      ))}
      <Button colorScheme="red" onClick={() => navigate("/bdsm")}>
        테스트하러가기
      </Button>
    </Stack>
  );
}

export default BdsmView;
