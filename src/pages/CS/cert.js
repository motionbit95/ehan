import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useState } from "react";

function Cert(props) {
  const { isOpen, onClose } = props;
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "md" }}
      >
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader textAlign={"center"}>성인인증</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                본 상품은 청소년 유해매체물로서 ⌜정보통신망 이용촉진 및 정보보호
                등에 관한 법률⌟ 및 ⌜청소년보호법⌟에 따라 만 19세 미만의 청소년이
                이용할 수 없습니다. 이용을 원하시면 본인인증을 진행해주시기
                바랍니다.
              </Text>
              <Divider />
              <Stack w={"100%"} spacing={1}>
                <Checkbox size={"lg"} onChange={() => setToggle(!toggle)}>
                  [필수] 약관에 동의합니다.
                </Checkbox>
                <Text opacity={0.6}>
                  동의 거부 시 서비스 이용이 제한됩니다.
                </Text>
                <Button
                  justifyContent={"space-between"}
                  rightIcon={<ChevronRightIcon />}
                >
                  개인정보 수집 및 이용동의
                </Button>
              </Stack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!toggle}
              colorScheme="blue"
              onClick={onClose}
              w={"100%"}
            >
              휴대폰 본인인증
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Cert;
