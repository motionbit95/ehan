import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

function PopupBase(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const handleClick = async (e) => {
    e.preventDefault();
    if (window.confirm("양식을 제출 하시겠습니까?")) {
      props.onClose(e);
      onClose();
    } else {
      return;
    }
  };

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="red"
        bgColor={props.variant === "outline" ? "white" : "red.500"}
        variant={props.variant}
        onClick={onOpen}
      >
        {props.title}
      </Button>
      <Modal
        isCentered
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleClick}>
              <Stack>{props.children}</Stack>

              <ModalFooter p={"20px 0 0 0 "}>
                <Button
                  variant={"outline"}
                  colorScheme="red"
                  mr={3}
                  onClick={onClose}
                >
                  취소
                </Button>
                <Button colorScheme="red" variant="solid" type="submit">
                  {props.action}
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default PopupBase;
