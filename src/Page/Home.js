import {
  Box,
  Button,
  Checkbox,
  Container,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Topbar from "../Component/Topbar";
import Main from "./Main";
import Intro, { Intro1, Intro2, Intro3 } from "./Intro";
import Service, { Service1, Service2, Service3, Service4 } from "./Service";
import Customer from "./Customer";
import ContactUs from "./ContactUs";
import Footer from "../Component/Footer";
import { Section, SectionsContainer } from "react-fullpage";

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleopenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let options = {
    anchors: [
      // "main",
      // "intro1",
      // "intro2",
      // "intro3",
      // "service1",
      // "service2",
      // "service3",
      // "service4",
      // "customer",
      // "contact",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ],
    navigation: false,
    fitToSection: true,
  };

  return (
    <Stack
      position={"relative"}
      align={"center"}
      bgColor={"black"}
      color={"white"}
    >
      <Topbar />
      <Container maxW={{ base: "full", md: "xl" }}>
        <SectionsContainer {...options}>
          <Section id="main">
            <Main />
          </Section>
          {/* <Stack spacing={0} id="intro"> */}
          <Section id="intro1">
            <Intro1 />
          </Section>
          <Section id="intro2">
            <Intro2 />
          </Section>
          <Section id="intro3">
            <Intro3 />
          </Section>
          {/* </Stack> */}
          {/* <Stack spacing={0} id="service"> */}
          <Section id="service1">
            <Service1 />
          </Section>
          <Section id="service2">
            <Service2 />
          </Section>
          <Section id="service3">
            <Service3 />
          </Section>
          <Section id="service4">
            <Service4 />
          </Section>
          {/* </Stack> */}
          <Section id="customer">
            <Customer />
          </Section>
          <Section id="contact">
            <ContactUs />
          </Section>
        </SectionsContainer>
      </Container>
      <Footer handleopenModal={handleopenModal} />
      {isModalOpen && (
        <GOModal isOpen={handleopenModal} onClose={handleCloseModal} />
      )}
    </Stack>
  );
};

export default Landing;

const GOModal = ({ isOpen, onClose }) => {
  const [isAgree, setAgree] = useState(false);
  const [form, setForm] = useState({
    shop_name: "",
    user_name: "",
    user_tel: "",
    user_email: "",
    shop_address: "",
    room_cnt: "",
  });
  return (
    <Modal size={{ base: "full", md: "2xl" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size={"lg"} color={"white"} />
        <ModalBody
          alignContent={"center"}
          py={6}
          bgColor={"#0F0F0F"}
          color={"white"}
        >
          <Stack spacing={3}>
            <Stack>
              <Text fontSize={"40px"} fontWeight={"900"}>
                레드스위치 신청하기
              </Text>
              <Box w={"50%"} h={"1px"} bgColor={"white"} />
            </Stack>
            <Text whiteSpace={"pre-line"} fontSize={"10px"}>
              {`레드스위치는 건전한 성문화를 지향하는 성인 플랫폼으로써\n성문화 인식 개선과 성문화 발전을 위해 존재합니다.\n체계적이고 안정적인 서비스와 다양한 컨텐츠로 보답하겠습니다.`}
            </Text>
            <Text>※ 신청하는 가맹점 정보를 입력하세요.</Text>
            <Stack
              divider={<StackDivider borderColor={"#808080"} />}
              color={"white"}
              spacing={"1px"}
              borderBottom={"1px solid #808080"}
            >
              <Input
                border={"none"}
                placeholder="가맹점명"
                _placeholder={{ color: "#808080" }}
                color={"white"}
                px={0}
                focusBorderColor="#0F0F0F"
                onChange={(e) =>
                  setForm({ ...form, shop_name: e.target.value })
                }
              />
              <Input
                border={"none"}
                placeholder="담당자 이름"
                _placeholder={{ color: "#808080" }}
                color={"white"}
                p={0}
                focusBorderColor="#0F0F0F"
                onChange={(e) =>
                  setForm({ ...form, user_name: e.target.value })
                }
              />
              <Input
                border={"none"}
                placeholder="담당자 연락처"
                _placeholder={{ color: "#808080" }}
                color={"white"}
                p={0}
                focusBorderColor="#0F0F0F"
                onChange={(e) => setForm({ ...form, user_tel: e.target.value })}
              />
              <Input
                border={"none"}
                placeholder="담당자 이메일"
                _placeholder={{ color: "#808080" }}
                color={"white"}
                p={0}
                focusBorderColor="#0F0F0F"
                onChange={(e) =>
                  setForm({ ...form, user_email: e.target.value })
                }
              />
              <Input
                border={"none"}
                placeholder="가맹점 주소"
                _placeholder={{ color: "#808080" }}
                color={"white"}
                p={0}
                focusBorderColor="#0F0F0F"
                onChange={(e) =>
                  setForm({ ...form, shop_address: e.target.value })
                }
              />
              <Input
                border={"none"}
                placeholder="객실 수"
                _placeholder={{ color: "#808080" }}
                color={"white"}
                p={0}
                focusBorderColor="#0F0F0F"
                onChange={(e) => setForm({ ...form, room_cnt: e.target.value })}
              />
            </Stack>
            <HStack justify={"space-between"}>
              <HStack>
                <Checkbox onChange={(e) => setAgree(e.target.checked)} />
                <Text>개인 정보 및 활용에 동의합니다.</Text>
              </HStack>
              <Text
                fontSize={"12px"}
                color={"#808080"}
                textDecoration={"underline"}
                cursor={"pointer"}
              >
                개인정보취급방침
              </Text>
            </HStack>
            <Stack align={"center"} pt={8}>
              <Button
                isDisabled={!isAgree}
                color={"white"}
                bgColor={"red"}
                onClick={() => {
                  fetch(process.env.REACT_APP_SERVER_URL + "/sendEmail", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: form.user_email,
                      content: form,
                    }),
                  })
                    .then((data) => {
                      // 전송 성공!
                      console.log(data);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              >
                신청하기
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
