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

function PopupBase({ visibleButton = true, ...props }) {
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
        size={props.size ? props.size : "md"}
        leftIcon={props.icon ? props.icon : null}
        colorScheme={props.colorScheme ? props.colorScheme : "red"}
        variant={props.variant ? props.variant : "solid"}
        onClick={onOpen}
      >
        {props.text ? props.text : props.title}
      </Button>
      <Modal
        {...props}
        isCentered
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.title} {props.action}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleClick}>
              <Stack>{props.children}</Stack>

              {visibleButton && (
                <ModalFooter p={"20px 0px"}>
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
              )}
            </form>
          </ModalBody>
          {!visibleButton && <ModalFooter />}
        </ModalContent>
      </Modal>
    </>
  );
}
export default PopupBase;
