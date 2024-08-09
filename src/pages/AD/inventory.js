import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Table,
  TableContainer,
  Text,
  Td,
  Thead,
  Tr,
  Th,
  Tbody,
  useMediaQuery,
  IconButton,
  HStack,
  Switch,
  Image,
  Card,
  CardHeader,
  useDisclosure,
  CardBody,
  Input,
  Box,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  createInventoryData,
  getFilteredInventory,
  getShopName,
  getTotalProducts,
  readInventoryData,
} from "../../firebase/firebase_func";
import { useGlobalState } from "../../GlobalState";
import PopupBase from "../../modals/PopupBase";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";
import RFilter from "../../components/RFilter";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";
import { ChosunBg } from "../../Component/Text";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ToastEditor from "../../components/ToastEditor";
import { timestampToDate, timestampToTime } from "../../firebase/api";

function ProductColumn({ productList, product_id }) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    searchProduct();
  }, [product_id]);

  function searchProduct() {
    // 리스트를 순회하면서 타겟 값과 일치하는 항목을 찾음
    for (let item of productList) {
      // 타겟 값과 일치하는 항목을 찾았을 때 해당 정보 반환
      if (item.doc_id === product_id) {
        setProduct(item);
      }
    }
    // 타겟 값과 일치하는 항목이 없을 경우 null 반환 또는 다른 예외처리 수행
    return null;
  }

  return (
    <>
      {isDesktop ? (
        <>
          <Td>
            <Text>{product?.product_category}</Text>
          </Td>
          <Td>
            <Text>{product?.product_name}</Text>
          </Td>
          <Td>
            <Text>{formatCurrency(product?.product_price)}원</Text>
          </Td>
        </>
      ) : (
        <>
          <Td>
            <Stack>
              <HStack>
                <Text>[{product?.product_category}]</Text>
                <Text>{product?.product_name}</Text>
              </HStack>
              <Text fontSize={"md"} fontWeight={"bold"}>
                {formatCurrency(product?.product_price)}원
              </Text>
            </Stack>
          </Td>
        </>
      )}
    </>
  );
}

function Inventory({ ...props }) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  // 상품리스트
  const [selectedShop, setSelectedShop] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);

  // 재고리스트
  const [inventoryList, setInventoryList] = useState([]);

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "POST")).then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), doc_id: doc.id });
        setPostList(list);
      });
    });
  }, []);

  useEffect(() => {
    readInventory();
    setTotalProduct();
  }, [selectedShop]);

  useEffect(() => {
    if (admin?.shop_id) {
      console.log(admin?.shop_id);
      readInventory();
    }
  }, [admin?.shop_id]);

  function searchShopName(id) {
    // 리스트를 순회하면서 타겟 값과 일치하는 항목을 찾음
    for (let item of props.shopList) {
      // 타겟 값과 일치하는 항목을 찾았을 때 해당 정보 반환
      if (item.doc_id === id) {
        return item.shop_name;
      }
    }
    // 타겟 값과 일치하는 항목이 없을 경우 null 반환 또는 다른 예외처리 수행
    return null;
  }

  const setTotalProduct = async () => {
    // 현재 지점의 상품 리스트를 받아온다.(supervisor의 경우 전체)
    const totalProducts = await getTotalProducts(
      selectedShop ? selectedShop : admin?.shop_id
    );
    setTotalProducts(totalProducts);
  };

  const addInventory = (e) => {
    // 이미 등록되어 있는 상품은 등록하지 못합니다.
    let check = inventoryList.filter((item) => {
      if (item.product_id === e.target[1].value) {
        return item;
      }
    });

    if (check.length === 0) {
      createInventoryData({
        createAt: new Date(),
        shop_id: e.target[0].value,
        product_id: e.target[1].value,
        inventory_use: true,
        inventory_count: 0,
      });
      readInventory();
    } else {
      alert("이미 재고가 등록되어있는 상품입니다.");
      return;
    }
  };

  const readInventory = async () => {
    const inventoryList = await readInventoryData(admin?.shop_id);
    setInventoryList(inventoryList);
  };

  const updateInventory = async () => {
    if (window.confirm("재고 정보를 변경하시겠습니까?")) {
      inventoryList.forEach(async (element) => {
        await updateDoc(doc(db, "INVENTORY", element.doc_id), element);
      });
    }
  };

  const deleteInventory = async (id) => {
    if (window.confirm("재고를 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "INVENTORY", id));
    }
    readInventory();
  };

  const changeInventoryCount = (index, count) => {
    const tempInventoryList = [...inventoryList];
    tempInventoryList[index].inventory_count = count;

    setInventoryList(tempInventoryList);
    // console.log(
    //   tempInventoryList[index],
    //   tempInventoryList[index].inventory_count
    // );
  };

  const changeInventoryUse = (index, use) => {
    const tempInventoryList = [...inventoryList];
    tempInventoryList[index].inventory_use = use;

    setInventoryList(tempInventoryList);
    // console.log(
    //   tempInventoryList[index],
    //   tempInventoryList[index].inventory_count
    // );
  };

  // filter
  const [shopFilter, setShopFilter] = useState(null);
  const [dateRange, setDateRange] = useState([
    new Date(
      `${new Date().getFullYear()}-${new Date()
        .getMonth()
        .toString()
        .padStart(2, "0")}-${(new Date().getDate() + 1)
        .toString()
        .padStart(2, "0")}`
    ),
    new Date(),
  ]);

  async function getFilteredData(value) {
    console.log(value);
    let newList = await getFilteredInventory(value);
    console.log(newList);
    setInventoryList(newList);
  }

  useEffect(() => {
    console.log(totalProducts);
  }, [totalProducts]);

  const deletePost = async (id) => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "POST", id)).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <Flex w={"100%"} h={"calc(100% - 48px)"}>
      {isDesktop ? (
        <Stack
          position={"absolute"}
          w={"calc(100% - 200px)"}
          h={"calc(100% - 48px)"}
          top={"48px"}
          left={"200px"}
          overflow={"scroll"}
        >
          {/* desktop 에서의 레이아웃 */}{" "}
          <RFilter
            useCalendar={false}
            children={
              <ButtonGroup
                size={"md"}
                w={"100%"}
                justifyContent={"space-between"}
              >
                <PopupBase
                  onClose={addInventory}
                  icon={<AddIcon />}
                  title={"재고"}
                  action={"추가"}
                >
                  <Stack>
                    <FormControl isRequired>
                      <FormLabel>관리 지점</FormLabel>
                      <Select
                        isDisabled={admin?.permission !== "supervisor"}
                        defaultValue={admin?.shop_id}
                        name="shop_id"
                        onChange={(e) => setSelectedShop(e.target.value)}
                      >
                        <option value="">선택</option>
                        {props.shopList?.map((shop) => (
                          <option key={shop.doc_id} value={shop.doc_id}>
                            {shop.shop_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>상품 선택</FormLabel>
                      <Select name="product_id">
                        <option value="">선택</option>
                        {totalProducts?.map((product) => (
                          <option key={product.doc_id} value={product.doc_id}>
                            {product.product_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </PopupBase>
                <Button
                  onClick={updateInventory}
                  colorScheme="red"
                  variant={"outline"}
                  leftIcon={<EditIcon />}
                >
                  저장
                </Button>
              </ButtonGroup>
            }
            admin={admin}
            shopList={props.shopList}
            onChangeFilter={(value) => getFilteredData(value)}
            orderFilter={
              <>
                <option value="inventory_count">재고순</option>
              </>
            }
          />
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            <Stack>
              <Card>
                <CardHeader>
                  <HStack justifyContent={"space-between"}>
                    <Text fontWeight={"bold"}>게시판</Text>
                    <BasicUsage />
                  </HStack>
                </CardHeader>
                <CardBody>
                  <TableContainer
                    border={"1px solid #d9d9d9"}
                    bgColor={"white"}
                    borderRadius={"10px"}
                    p={"10px"}
                    mb={"20px"}
                  >
                    <Table variant="simple" size={"sm"}>
                      <Thead h={"40px"}>
                        <Tr>
                          <Th>No</Th>
                          <Th>제목</Th>
                          <Th>작성자</Th>
                          <Th>관리지점</Th>
                          <Th>답변</Th>
                          {admin?.permission === "supervisor" && <Th>삭제</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {postList?.map((item, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{item.title}</Td>
                            <Td>{item.created_by.admin_name}</Td>
                            <Td>{item.created_by.shop_id}</Td>
                            <Td>
                              <AnswerUsage post={item} />
                            </Td>
                            {admin?.permission === "supervisor" && (
                              <Td w={"30px"}>
                                <Button
                                  size={"sm"}
                                  onClick={() => {
                                    deletePost(item.doc_id);
                                  }}
                                  colorScheme="red"
                                  variant={"outline"}
                                  leftIcon={<DeleteIcon />}
                                >
                                  삭제
                                </Button>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </Stack>
            <Stack>
              <TableContainer
                border={"1px solid #d9d9d9"}
                bgColor={"white"}
                borderRadius={"10px"}
                p={"10px"}
                mb={"20px"}
              >
                <Table variant="simple" size={"sm"}>
                  <Thead h={"40px"}>
                    <Tr>
                      <Th>No</Th>
                      <Th>카테고리</Th>
                      <Th>상품명</Th>
                      <Th>상품가격</Th>
                      <Th>관리지점</Th>
                      <Th>재고수량</Th>
                      <Th textAlign={"center"}>재고사용여부</Th>
                      <Th w={"30px"}>삭제</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {totalProducts &&
                      inventoryList?.map((item, index) => (
                        <Tr
                          key={index}
                          _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                        >
                          <Td fontSize={"sm"}>{index + 1}</Td>
                          <ProductColumn
                            productList={totalProducts}
                            product_id={item.product_id}
                          />
                          <Td>{searchShopName(item.shop_id)}</Td>
                          <Td>
                            <HStack
                              visibility={
                                item.inventory_use ? "visible" : "hidden"
                              }
                              w={"100px"}
                              spacing={"10px"}
                              border={"1px solid #d9d9d9"}
                              p={"10px 7px"}
                              borderRadius={"10px"}
                              justifyContent={"space-between"}
                            >
                              <Image
                                w={"16px"}
                                h={"16px"}
                                src={require("../../image/HiMinus.png")}
                                onClick={() => {
                                  if (item.inventory_count > 0) {
                                    changeInventoryCount(
                                      index,
                                      item.inventory_count - 1
                                    );
                                  }
                                }}
                              />
                              <Text
                                color={
                                  item.inventory_count <= 3 ? "red" : "black"
                                }
                              >
                                {item.inventory_count}
                              </Text>
                              <Image
                                w={"16px"}
                                h={"16px"}
                                src={require("../../image/HiPlus.png")}
                                onClick={() => {
                                  changeInventoryCount(
                                    index,
                                    item.inventory_count + 1
                                  );
                                }}
                              />
                            </HStack>
                          </Td>
                          <Td textAlign={"center"}>
                            <Switch
                              onChange={() =>
                                changeInventoryUse(index, !item.inventory_use)
                              }
                              defaultChecked={item.inventory_use}
                            />
                          </Td>
                          <Td>
                            <IconButton
                              size={"sm"}
                              onClick={() => deleteInventory(item.doc_id)}
                              icon={<DeleteIcon />}
                            />
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack w={"100%"} h={"100%"} minW={"350px"}>
            <RFilter
              useCalendar={false}
              children={
                <ButtonGroup
                  alignItems={"center"}
                  size={"md"}
                  w={"100%"}
                  justifyContent={"space-between"}
                >
                  <Stack>
                    <PopupBase
                      onClose={addInventory}
                      icon={<AddIcon />}
                      title={"재고"}
                      action={"추가"}
                    >
                      <Stack>
                        <FormControl isRequired>
                          <FormLabel>관리 지점</FormLabel>
                          <Select
                            isDisabled={admin?.permission !== "supervisor"}
                            defaultValue={admin?.shop_id}
                            name="shop_id"
                            onChange={(e) => setSelectedShop(e.target.value)}
                          >
                            <option value="">선택</option>
                            {props.shopList?.map((shop) => (
                              <option key={shop.doc_id} value={shop.doc_id}>
                                {shop.shop_name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>상품 선택</FormLabel>
                          <Select name="product_id">
                            <option value="">선택</option>
                            {totalProducts?.map((product) => (
                              <option
                                key={product.doc_id}
                                value={product.doc_id}
                              >
                                {product.product_name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </PopupBase>

                    <Button
                      onClick={updateInventory}
                      colorScheme="red"
                      variant={"outline"}
                      leftIcon={<EditIcon />}
                    >
                      저장
                    </Button>
                  </Stack>
                </ButtonGroup>
              }
              admin={admin}
              shopList={props.shopList}
              onChangeFilter={(value) => getFilteredData(value)}
              orderFilter={
                <>
                  <option value="inventory_count">재고순</option>
                </>
              }
            />
            <Stack p={"20px"} w={"100%"} h={"100%"}>
              <Stack>
                <TableContainer
                  border={"1px solid #d9d9d9"}
                  bgColor={"white"}
                  borderRadius={"10px"}
                  p={"10px"}
                  mb={"20px"}
                >
                  <Table variant="simple" size={"sm"}>
                    <Thead h={"40px"}>
                      <Tr>
                        <Th>[카테고리]상품명/상품가격</Th>
                        <Th>재고수량/사용여부</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {totalProducts &&
                        inventoryList?.map((item, index) => (
                          <Tr
                            key={index}
                            _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                          >
                            <ProductColumn
                              productList={totalProducts}
                              product_id={item.product_id}
                            />
                            <Td>
                              <Stack alignItems={"flex-end"}>
                                <Switch
                                  onChange={() =>
                                    changeInventoryUse(
                                      index,
                                      !item.inventory_use
                                    )
                                  }
                                  defaultChecked={item.inventory_use}
                                />
                                <HStack
                                  visibility={
                                    item.inventory_use ? "visible" : "hidden"
                                  }
                                  w={"100px"}
                                  spacing={"10px"}
                                  border={"1px solid #d9d9d9"}
                                  p={"10px 7px"}
                                  borderRadius={"10px"}
                                  justifyContent={"space-between"}
                                >
                                  <Image
                                    w={"16px"}
                                    h={"16px"}
                                    src={require("../../image/HiMinus.png")}
                                    onClick={() => {
                                      if (item.inventory_count > 0) {
                                        changeInventoryCount(
                                          index,
                                          item.inventory_count - 1
                                        );
                                      }
                                    }}
                                  />
                                  <Text
                                    color={
                                      item.inventory_count <= 3
                                        ? "red"
                                        : "black"
                                    }
                                  >
                                    {item.inventory_count}
                                  </Text>
                                  <Image
                                    w={"16px"}
                                    h={"16px"}
                                    src={require("../../image/HiPlus.png")}
                                    onClick={() => {
                                      changeInventoryCount(
                                        index,
                                        item.inventory_count + 1
                                      );
                                    }}
                                  />
                                </HStack>
                              </Stack>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Inventory;

function BasicUsage() {
  const { admin } = useGlobalState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState(" ");
  const [title, setTitle] = useState(" ");

  const addPost = () => {
    console.log(admin);
    console.log(content);

    addDoc(collection(db, "POST"), {
      content: content,
      created_at: serverTimestamp(),
      created_by: admin,
      updated_at: serverTimestamp(),
      updated_by: admin,
      title: title,
    }).then(() => {
      console.log("added");
      setContent(" ");
      window.location.reload();
      onClose();
    });
  };
  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        글작성
      </Button>

      <Modal size={"2xl"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시판 글작성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요."
              ></Input>
              <ToastEditor
                onChange={(html) => {
                  setContent(html);
                }}
                initialValue=" "
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              닫기
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                addPost();
              }}
            >
              등록
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function AnswerUsage({ post }) {
  const { admin } = useGlobalState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reply, setReply] = useState(" ");

  const updateReply = () => {
    updateDoc(doc(db, "POST", post.doc_id), {
      reply: reply,
      updated_at: serverTimestamp(),
      updated_by: admin,
    }).then(() => {
      console.log("updated");
      setReply(" ");
      window.location.reload();
      onClose();
    });
  };

  return (
    <>
      <Button
        size={"sm"}
        onClick={onOpen}
        colorScheme={post.reply ? "green" : "gray"}
      >
        {post.reply ? "답변완료" : "답변작성"}
      </Button>

      <Modal size={"2xl"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {post.reply ? "답변이 완료된 게시글입니다." : "게시판 답변 작성"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                {post.title}
              </Text>
              <Text>
                {timestampToDate(post.created_at)}{" "}
                {timestampToTime(post.created_at)}
              </Text>
              <Box p={4} borderRadius={"lg"}>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </Box>
              <Divider />
              {post.reply ? (
                <Box p={4} borderRadius={"lg"} bg={"gray.100"}>
                  <Stack>
                    <Text fontWeight={"bold"} fontSize={"lg"}>
                      답변
                    </Text>
                    <div dangerouslySetInnerHTML={{ __html: post.reply }} />
                  </Stack>
                </Box>
              ) : (
                <ToastEditor
                  onChange={(html) => {
                    setReply(html);
                  }}
                  initialValue=" "
                />
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              닫기
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                updateReply();
              }}
            >
              등록
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
