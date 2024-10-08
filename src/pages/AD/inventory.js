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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Checkbox,
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
import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";
import RFilter from "../../components/RFilter";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
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
import {
  compareTimestampWithCurrentTime,
  timestampToDate,
  timestampToTime,
} from "../../firebase/api";
import SearchShop from "../../components/SearchShop";
import { event } from "jquery";
import { set } from "date-fns";

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
  const [inventoryAlarm, setInventoryAlarm] = useState([]);

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

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handlePostClick = () => {
    setIsPostModalOpen(true);
  };

  const updateAlarm = () => {
    const q = query(
      collection(db, "INVENTORY_ALARM"),
      orderBy("created_at", "desc")
    );
    getDocs(q).then((querySnapshot) => {
      const list = [];
      setInventoryAlarm([]);
      querySnapshot.forEach((doc) => {
        if (shopFilter) {
          console.log(
            "1 : ",
            doc.data().created_by.shop_id,
            "2 : ",
            shopFilter.shop_id
          );
          if (
            doc.data().created_by.shop_id === shopFilter.shop_id ||
            doc.data().created_by.shop_id === ""
          ) {
            list.push({ ...doc.data(), doc_id: doc.id });
            setInventoryAlarm(list);
          }
        }
      });
    });
  };

  useEffect(() => {
    updateAlarm();
  }, []);

  useEffect(() => {
    getDocs(collection(db, "POST")).then((querySnapshot) => {
      const list = [];
      if (shopFilter) {
        querySnapshot.forEach((doc) => {
          console.log(doc.data().shopId);

          // 수퍼바이저의 경우는 전체리스트를 보여준다
          if (admin?.permission === "supervisor") {
            list.push({ ...doc.data(), doc_id: doc.id });
          } else {
            // 전체에게 보낸건 보이게 한다.
            if (doc.data().shopId === "#checkAllShop") {
              console.log("전체에게 보낸거임 > ", doc.data());
              list.push({ ...doc.data(), doc_id: doc.id });
            }

            // 발신자가 나(내가 보낸거) 인 경우 보이게 한다
            if (doc.data().created_by.shop_id === admin?.shop_id) {
              console.log("내가 보낸거임! > ", doc.data());
              list.push({ ...doc.data(), doc_id: doc.id });
            }

            // 수신자가 나(내가 받은거) 인 경우 보이게 한다
            if (doc.data().shopId === admin?.uid) {
              console.log("내가 받은거임! > ", doc.data());
              list.push({ ...doc.data(), doc_id: doc.id });
            }
          }

          setPostList(list);
        });
      } else {
        setPostList([]);
      }
    });

    updateAlarm();
  }, [shopFilter]);

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

    // 재고 변동 내역 저장
    await addDoc(collection(db, "INVENTORY_ALARM"), {
      created_at: serverTimestamp(),
      created_by: admin,
      updated_at: serverTimestamp(),
      updated_by: admin,
      shop_id: admin?.shop_id,
      content:
        admin?.permission === "supervisor"
          ? "관리자가 재고를 변경하였습니다."
          : (await getShopName(admin?.shop_id)) + "의 재고가 변경되었습니다.",
    }).then(() => {
      console.log("success");
      updateAlarm();
    });
  };

  const deleteInventory = async (id) => {
    if (window.confirm("재고를 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "INVENTORY", id));
    }
    readInventory();
  };

  /******  20b2b696-13f0-49f7-909b-be7885abc03c  *******/
  const changeInventoryUse = (index, use) => {
    const tempInventoryList = [...inventoryList];
    tempInventoryList[index].inventory_use = use;

    setInventoryList(tempInventoryList);
    // console.log(
    //   tempInventoryList[index],
    //   tempInventoryList[index].inventory_count
    // );
  };

  async function getFilteredData(value) {
    if (admin?.permission === "supervisor") {
      // 수퍼바이저는 전체 리스트를 받아도 무방(shopid에 구애받지 않음)
      setShopFilter(value);
      let newList = await getFilteredInventory(value);
      console.log(newList);
      setInventoryList(newList);
    } else {
      // 일반 관리자는 관리 지점데이터만 긁어와야하므로 shopId가 있어야 함
      if (value.shop_id) {
        console.log("filter ====> ", value);
        setShopFilter(value);
        let newList = await getFilteredInventory(value);
        console.log(newList);
        setInventoryList(newList);
      }
    }
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

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(inventoryList.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = inventoryList.slice(startIndex, endIndex);

  const changeInventoryCount = (index, count) => {
    //0으로 오면 안되고 페이지 인덱스(2) * 한페이지 항목개수(10) + 이 페이지에서의 index(index)
    console.log(startIndex + index);
    const tempInventoryList = [...inventoryList];
    tempInventoryList[20].inventory_count = count;

    setInventoryList(tempInventoryList);
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
            // children={
            //   <ButtonGroup
            //     size={"md"}
            //     w={"100%"}
            //     justifyContent={"space-between"}
            //   >
            //     <PopupBase
            //       onClose={addInventory}
            //       icon={<AddIcon />}
            //       title={"재고"}
            //       action={"추가"}
            //     >
            //       <Stack>
            //         <FormControl isRequired>
            //           <FormLabel>관리 지점</FormLabel>
            //           <Select
            //             isDisabled={admin?.permission !== "supervisor"}
            //             defaultValue={admin?.shop_id}
            //             name="shop_id"
            //             onChange={(e) => setSelectedShop(e.target.value)}
            //           >
            //             <option value="">선택</option>
            //             {props.shopList?.map((shop) => (
            //               <option key={shop.doc_id} value={shop.doc_id}>
            //                 {shop.shop_name}
            //               </option>
            //             ))}
            //           </Select>
            //         </FormControl>
            //         <FormControl isRequired>
            //           <FormLabel>상품 선택</FormLabel>
            //           <Select name="product_id">
            //             <option value="">선택</option>
            //             {totalProducts?.map((product) => (
            //               <option key={product.doc_id} value={product.doc_id}>
            //                 {product.product_name}
            //               </option>
            //             ))}
            //           </Select>
            //         </FormControl>
            //       </Stack>
            //     </PopupBase>
            //     <Button
            //       onClick={updateInventory}
            //       colorScheme="red"
            //       variant={"outline"}
            //       leftIcon={<EditIcon />}
            //     >
            //       저장
            //     </Button>
            //   </ButtonGroup>
            // }
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
                          <Th>발신자</Th>
                          <Th>수신자</Th>
                          {/* <Th>관리지점</Th> */}
                          <Th>답변</Th>
                          {admin?.permission === "supervisor" && <Th>삭제</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {postList?.map((item, index) => (
                          <>
                            <Tr key={index} onClick={handlePostClick}>
                              <Td>{index + 1}</Td>
                              <Td>{item.title}</Td>
                              <Td>{item.created_by.admin_name}</Td>
                              <Td>{item.shopName}</Td>
                              {/* <Td>
                              {item.created_by.shop_id === ""
                                ? "관리자"
                                : item.created_by.shop_id}
                            </Td> */}
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
                            <PostModal
                              post={item}
                              isOpen={isPostModalOpen}
                              onClose={() => setIsPostModalOpen(false)}
                            />
                          </>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  {/* <Stack align={"flex-end"}>
                    <Text>재고 저장버튼</Text>
                  </Stack> */}
                </CardBody>
              </Card>
              <Card>
                <CardHeader fontWeight={"bold"}>재고 타임라인</CardHeader>
                <CardBody>
                  <Stack w={"100%"} overflow={"auto"}>
                    {inventoryAlarm.map(
                      (item, index) =>
                        index < 5 && (
                          <Alert key={index} borderRadius={"10px"}>
                            <HStack
                              w={"100%"}
                              justifyContent={"space-between"}
                              alignItems={"flex-start"}
                            >
                              <HStack>
                                <AlertIcon />
                                <Stack spacing={"1px"}>
                                  <AlertTitle>{item.content}</AlertTitle>
                                  <AlertDescription></AlertDescription>
                                </Stack>
                              </HStack>
                              <Text fontSize={"sm"}>
                                {compareTimestampWithCurrentTime(
                                  item.created_at
                                )}
                              </Text>
                            </HStack>
                          </Alert>
                        )
                    )}
                  </Stack>
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
                minH={"709px"}
              >
                {admin?.permission === "supervisor" && (
                  <ButtonGroup
                    size={"md"}
                    w={"100%"}
                    justifyContent={"flex-end"}
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
                  </ButtonGroup>
                )}
                <Table variant="simple" size={"sm"}>
                  <Thead h={"40px"}>
                    <Tr>
                      <Th w={"60px"}>No</Th>
                      <Th w={"180px"}>카테고리</Th>
                      <Th w={"300px"}>상품명</Th>
                      <Th w={"160px"}>상품가격</Th>
                      <Th w={"230px"}>관리지점</Th>
                      <Th w={"150px"}>재고수량</Th>
                      <Th textAlign={"center"}>재고사용여부</Th>
                      <Th w={"30px"}>삭제</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {totalProducts &&
                      currentData?.map((item, index) => {
                        const itemNumber =
                          (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                        return (
                          <Tr
                            key={index}
                            _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                          >
                            <Td fontSize={"sm"}>{itemNumber}</Td>
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
                        );
                      })}
                  </Tbody>
                </Table>
                <Flex mt={4} justifyContent="center" alignItems="center">
                  <IconButton
                    icon={<ChevronLeftIcon fontSize={"24px"} />}
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1}
                    // variant={"outline"}
                    // color={popmint}
                    // borderColor={popmint}
                  />
                  <ButtonGroup ml={4} mr={4}>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <Button
                        key={index + 1}
                        onClick={() => handlePageClick(index + 1)}
                        color={"black"}
                        bg={currentPage === index + 1 ? "#EDF2F7" : "white"}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <IconButton
                    icon={<ChevronRightIcon fontSize={"24px"} />}
                    isDisabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    // color={popmint}
                    // variant={"outline"}
                    // borderColor={popmint}
                  />
                </Flex>
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
  const [shopId, setShopId] = useState(" ");

  const [sendAll, setSendAll] = useState(false); // 전체 발송 플래그

  const addPost = async () => {
    console.log(admin);
    console.log(content);

    let tempShopId;
    let tempShopName;

    if (sendAll) {
      tempShopId = "#checkAllShop";
      tempShopName = "전체";
    } else {
      tempShopId = shopId;
      tempShopName = await getShopName(shopId);
    }

    addDoc(collection(db, "POST"), {
      content: content,
      created_at: serverTimestamp(),
      created_by: admin,
      updated_at: serverTimestamp(),
      updated_by: admin,
      title: title,
      shopId: tempShopId,
      shopName: tempShopName,
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
              <Stack>
                <HStack justifyContent={"space-between"}>
                  <Text>지점 선택</Text>
                  {admin?.permission === "supervisor" && (
                    <Checkbox onChange={() => setSendAll(!sendAll)}>
                      전체발송
                    </Checkbox>
                  )}
                </HStack>
                {!sendAll && (
                  <SearchShop
                    onSelect={(shop) => {
                      console.log(shop);
                      setShopId(shop);
                    }}
                  ></SearchShop>
                )}
              </Stack>
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
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    console.log(post.shopId);
    if (post.shopId) {
      getShopName(post.shopId).then((name) => {
        setShopName(name);
      });
    }
  }, []);

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
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
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

const PostModal = ({ post, isOpen, onClose }) => {
  return (
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
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
