import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Circle,
  Text,
  Center,
  Divider,
  VStack,
  Checkbox,
  Stack,
  HStack,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  useRadioGroup,
  useRadio,
  Image,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function Cert(props) {
  const { onOpen, isOpen, onClose, onVerified } = props;
  const [toggle, setToggle] = useState(false);
  const [step, setStep] = useState(props.step ? props.step : 0);
  const [certType, setCertType] = useState("KakaocertService");

  const options = ["카카오톡", "네이버", "PASS"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "카카오톡",
    onChange: console.log,
  });

  const group = getRootProps();

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    birthday: "",
  });
  const [receiptID, setReceiptID] = useState(null);
  const callCert = async () => {
    console.log(
      process.env.REACT_APP_SERVER_URL +
        `/${certType}/RequestIdentity/` +
        userInfo.name +
        "/" +
        userInfo.phone +
        "/" +
        userInfo.birthday
    );
    // endpoint "/RequestIdentity/:name/:phone/:birthday"
    fetch(
      process.env.REACT_APP_SERVER_URL +
        `/${certType}/RequestIdentity/` +
        userInfo.name +
        "/" +
        userInfo.phone +
        "/" +
        userInfo.birthday
    )
      .then(async (res) => await res.json())
      .then(async (data) => {
        console.log(data);
        if (data.code < 0) {
          alert(`[${data.code}] ${data.message}`);
          return false;
        }
        setReceiptID(data.receiptID);
        return true;
      })
      .catch(async (error) => {
        return false;
      });
  };

  const callStatus = async () => {
    fetch(
      process.env.REACT_APP_SERVER_URL +
        `/${certType}/GetIdentityStatus/` +
        receiptID
    )
      .then(async (res) => res.json())
      .then(async (data) => {
        // console.log(data);
        if (data.state === 0) {
          // 대기
          alert("인증을 진행해주세요!");
          return false;
        }

        if (data.state === 1) {
          // 완료
          // console.log("인증이 완료되었습니다.");
          return await callVerify();
        }

        if (data.state === 2) {
          // 만료
          alert("인증이 만료되었습니다. 다시 진행해주세요.");
          setStep(1); // 인증요청 화면으로 이동
          return false;
        }
      })
      .catch(async (error) => {
        return false;
      });
  };

  useEffect(() => {
    if (receiptID) {
      moveStep();
    }
  }, [receiptID]);

  const callVerify = async () => {
    fetch(
      process.env.REACT_APP_SERVER_URL +
        `/${certType}/VerifyIdentity/` +
        receiptID
    )
      .then(async (res) => res.json())
      .then(async (data) => {
        // console.log(data);
        if (data.state === 0) {
          // 대기
          alert("인증을 진행해주세요!");
          return false;
        }

        if (data.state === 1) {
          // 완료
          console.log("인증이 완료되었습니다.");
          onVerified();
          return true;
        }

        if (data.state === 2) {
          // 만료
          alert("인증이 만료되었습니다. 다시 진행해주세요.");
          setStep(1); // 인증요청 화면으로 이동
          return false;
        }
      })
      .catch(async (error) => {
        console.log(error);
        alert(`[${error.code}] ${error.message}`);
        return false;
      });
  };

  const moveStep = () => {
    setStep(step + 1);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "md" }}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader textAlign={"center"}>성인인증</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 0 && (
              <VStack spacing={4}>
                <Circle
                  bgColor={"white"}
                  w="100px"
                  h="100px"
                  border={"2px solid red"}
                  aspectRatio={"1/1"}
                >
                  <Text fontSize={"4xl"} fontWeight={"bold"}>
                    19
                  </Text>
                </Circle>
                <Text fontSize={"lg"} fontWeight={"bold"}>
                  회원님, 본 상품은 성인인증이 필요합니다.
                </Text>
                <Divider />
                <Text opacity={0.6}>
                  본 상품은 청소년 유해매체물로서 ⌜정보통신망 이용촉진 및
                  정보보호 등에 관한 법률⌟ 및 ⌜청소년보호법⌟에 따라 만 19세
                  미만의 청소년이 이용할 수 없습니다. 이용을 원하시면 본인인증을
                  진행해주시기 바랍니다.
                </Text>
                <Divider />
                <Stack w={"100%"} spacing={1}>
                  <Checkbox size={"lg"} onChange={() => setToggle(!toggle)}>
                    [필수] 약관에 동의합니다.
                  </Checkbox>
                  <Accordion>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            개인정보 수집 및 이용동의
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Text opacity={0.6}>
                          동의 거부 시 서비스 이용이 제한됩니다.
                        </Text>
                        <Text opacity={0.6}>
                          수집된 정보는 성인인증을 위한 수단으로만 사용되며, 그
                          외 다른 목적으로 수집되지 않습니다.
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Stack>
              </VStack>
            )}
            {step === 1 && (
              <Stack w={"full"}>
                <FormControl isRequired>
                  <FormLabel>인증서 선택</FormLabel>
                  <HStack>
                    {options.map((value) => {
                      const radio = getRadioProps({ value });
                      return (
                        <RadioCard
                          key={value}
                          {...radio}
                          onChange={(e) => {
                            if (e.target.value !== "카카오톡") {
                              alert("준비중입니다.");
                            }
                          }}
                        >
                          {value}
                        </RadioCard>
                      );
                    })}
                  </HStack>
                </FormControl>
                <Stack>
                  <FormControl isRequired>
                    <FormLabel>이름</FormLabel>
                    <Input
                      placeholder="이름을 입력하세요."
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, name: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>생년월일</FormLabel>
                    <Input
                      placeholder="8자리 ex. 19930101"
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, birthday: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>휴대폰번호</FormLabel>
                    <Input
                      placeholder="- 제외하고 숫자만 입력"
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, phone: e.target.value })
                      }
                    />
                  </FormControl>
                </Stack>
              </Stack>
            )}
            {step === 2 && (
              <Stack>
                <Text>본인인증을 진행하고 인증완료 버튼을 클릭해주세요.</Text>
                <Image src={require("../../assets/kakaostep.jpg")} />
              </Stack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!toggle}
              colorScheme="blue"
              // onClick={onClose}
              w={"100%"}
              onClick={async () => {
                if (step === 0) {
                  moveStep();
                }
                if (step === 1) {
                  await callCert();
                }
                if (step === 2) {
                  await callStatus();
                }
              }}
            >
              {step === 2 ? "인증완료" : "휴대폰 본인인증"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "blue.600",
          color: "white",
          borderColor: "blue.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default Cert;
