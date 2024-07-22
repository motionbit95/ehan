import {
  HStack,
  Input,
  Button,
  useDisclosure,
  Select,
  Stack,
  Text,
  TableContainer,
  Table,
  Tr,
  Th,
  Tbody,
  Td,
  Thead,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import RDepth1 from "./RDepth1";
import RDepth2 from "./RDepth2";
import { queryShop } from "../firebase/firebase_func";

function SearchShop(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keyword, setKeyword] = useState("");
  const [depth1, setDepth1] = useState("");
  const [depth2, setDepth2] = useState("");
  const [filteredShopList, setFilteredShopList] = useState([]);

  const [tempSelected, setTempSelected] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);

  const getShopList = async (depth1, depth2) => {
    console.log("====> ", depth1, depth2, keyword);
    setDepth2(depth2);
    // 필터링 된 샵 리스트만 가지고 오도록 하는 함수
    let filterShop = await queryShop(depth1, depth2);

    let searchedShopList = filterShop.filter((shop) => {
      return shop.shop_name.includes(keyword);
    });
    console.log("filterShop", searchedShopList);
    setFilteredShopList(searchedShopList);
  };

  return (
    <>
      <HStack>
        <Input
          name="shop_id"
          placeholder="지점 ID를 검색해주세요."
          readOnly
          value={selectedShop?.doc_id}
          defaultValue={props.defaultValue}
        />
        <Button size={"md"} onClick={onOpen}>
          검색
        </Button>
      </HStack>

      <Modal size={"xl"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>지점 검색하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <HStack>
                <RDepth1
                  defaultValue={depth1}
                  onChangeDepth1={(value) => {
                    setDepth1(value);
                  }}
                />
                <RDepth2
                  depth1={depth1}
                  defaultValue={depth2}
                  onChangeDepth2={(value) => {
                    setDepth2(value);
                    //   getShopList(depth1, value);
                  }}
                />
              </HStack>
              <HStack>
                <Input
                  placeholder="검색할 지점명을 입력하세요."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                ></Input>
                <Button size={"md"} onClick={() => getShopList(depth1, depth2)}>
                  검색
                </Button>
              </HStack>

              <Stack>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>지점 이름</Th>
                        <Th>지점 위치</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredShopList.map((shop, index) => (
                        <Tr
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          bg={tempSelected === shop ? "red.100" : "white"}
                          key={index}
                          onClick={() => setTempSelected(shop)}
                        >
                          <Td>{shop.shop_name}</Td>
                          <Td>{shop.shop_address}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setTempSelected(null);
                onClose();
              }}
            >
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setTempSelected(null);
                setSelectedShop(tempSelected);
                props.onSelect(tempSelected.doc_id);
                onClose();
              }}
            >
              선택
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SearchShop;
