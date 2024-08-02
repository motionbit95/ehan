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
import Intro from "./Intro";
import Service from "./Service";
import Customer from "./Customer";
import ContactUs from "./ContactUs";
import Footer from "../Component/Footer";

const Landing = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleopenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 64; // 탑바의 높이

    if (sectionElement) {
      const elementPosition = sectionElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  const handleScroll = () => {
    const sections = ["main", "intro", "service", "customer", "contactUs"];
    const offset = 64; // 탑바의 높이
    const scrollPosition = window.pageYOffset + offset;

    for (const section of sections) {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Stack
      position={"relative"}
      align={"center"}
      bgColor={"black"}
      color={"white"}
    >
      <Topbar scrollToSection={scrollToSection} activeSection={activeSection} />
      <Container px={0}>
        <Stack spacing={0} pt={"64px"}>
          <Main />
          <Intro />
          <Service />
          <Customer />
          <ContactUs />
        </Stack>
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
  return (
    <Modal size={{ base: "full", md: "2xl" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size={"lg"} color={"white"} />
        <ModalBody alignContent={"center"} bgColor={"#0F0F0F"} color={"white"}>
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
              color={"#808080"}
              spacing={0}
              borderBottom={"1px solid #808080"}
            >
              <Input
                border={"none"}
                placeholder="가맹점명"
                _placeholder={{ color: "#808080" }}
                color={"#808080"}
                p={0}
                focusBorderColor="#0F0F0F"
              />
              <Input
                border={"none"}
                placeholder="담당자 이름"
                _placeholder={{ color: "#808080" }}
                color={"#808080"}
                p={0}
                focusBorderColor="#0F0F0F"
              />
              <Input
                border={"none"}
                placeholder="담당자 연락처"
                _placeholder={{ color: "#808080" }}
                color={"#808080"}
                p={0}
                focusBorderColor="#0F0F0F"
              />
              <Input
                border={"none"}
                placeholder="담당자 이메일"
                _placeholder={{ color: "#808080" }}
                color={"#808080"}
                p={0}
                focusBorderColor="#0F0F0F"
              />
              <Input
                border={"none"}
                placeholder="가맹점 주소"
                _placeholder={{ color: "#808080" }}
                color={"#808080"}
                p={0}
                focusBorderColor="#0F0F0F"
              />
              <Input
                border={"none"}
                placeholder="객실 수"
                _placeholder={{ color: "#808080" }}
                color={"#808080"}
                p={0}
                focusBorderColor="#0F0F0F"
              />
            </Stack>
            <HStack justify={"space-between"}>
              <HStack>
                <Checkbox />
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
              <Button color={"white"} bgColor={"red"}>
                신청하기
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
