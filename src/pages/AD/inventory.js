import {
  Button,
  ButtonGroup,
  Center,
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
  Card,
  CardBody,
  HStack,
  Switch,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  createInventoryData,
  getTotalProducts,
  readInventoryData,
} from "../../firebase/firebase_func";
import { useGlobalState } from "../../GlobalState";
import PopupBase from "../../modals/PopupBase";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";

function ProductColumn({ productList, product_id }) {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    searchProduct();
  }, []);
  function searchProduct() {
    // 리스트를 순회하면서 타겟 값과 일치하는 항목을 찾음
    for (let item of productList) {
      console.log(item.doc_id, product_id);
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
            <Text>{product?.product_name}</Text>
          </Td>
          <Td>
            <Text>{product?.product_category}</Text>
          </Td>
          <Td>
            <Text>{product?.product_price}</Text>
          </Td>
        </>
      ) : (
        <>
          <Stack gap={"0"}>
            <Text>{product?.product_name}</Text>
            <Text>{product?.product_category}</Text>
            <Text>{product?.product_price}</Text>
          </Stack>
        </>
      )}
    </>
  );
}

function Inventory({ ...props }) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  // 상품리스트
  const [totalProducts, setTotalProducts] = useState(null);

  // 재고리스트
  const [inventoryList, setInventoryList] = useState([]);

  useEffect(() => {
    readInventory();
    setTotalProduct();
  }, []);

  if (!inventoryList) {
    readInventory();
  }

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
      admin.shop_id ? admin.shop_id : ""
    );
    setTotalProducts(totalProducts);
  };

  const addInventory = (e) => {
    createInventoryData({
      createAt: new Date(),
      shop_id: e.target[0].value,
      product_id: e.target[1].value,
      inventory_use: true,
      inventory_count: 0,
    });
  };

  const readInventory = async () => {
    const inventoryList = await readInventoryData(
      admin.shop_id ? admin.shop_id : "test-shop"
    );
    setInventoryList(inventoryList);
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
          {/* desktop 에서의 레이아웃 */}

          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            {admin.permission === "supervisor" && (
              <Stack>
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
                      <FormControl>
                        <FormLabel>관리 지점</FormLabel>
                        <Select name="shop_id">
                          {props.shopList?.map((shop) => (
                            <option value={shop.doc_id}>
                              {shop.shop_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>상품 선택</FormLabel>
                        <Select name="product_id">
                          {totalProducts?.map((product) => (
                            <option value={product.doc_id}>
                              {product.product_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </PopupBase>
                  <Button colorScheme="red" leftIcon={<EditIcon />}>
                    저장
                  </Button>
                </ButtonGroup>
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
                        <Th>상품명</Th>
                        <Th>카테고리</Th>
                        <Th>상품가격</Th>
                        <Th>관리지점</Th>
                        <Th textAlign={"center"}>재고수량</Th>
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
                                    if (item.inventory_count > 1) {
                                      changeInventoryCount(
                                        index,
                                        item.inventory_count - 1
                                      );
                                    }
                                  }}
                                />
                                <Text>{item.inventory_count}</Text>
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
                              <Switch defaultChecked={item.inventory_use} />
                            </Td>
                            <Td>
                              <IconButton
                                size={"sm"}
                                // onClick={() => deleteProduct(item.doc_id)}
                                icon={<DeleteIcon />}
                              />
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            {admin.permission === "supervisor" && (
              <Stack>
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
                      <FormControl>
                        <FormLabel>관리 지점</FormLabel>
                        <Select name="shop_id">
                          {props.shopList?.map((shop) => (
                            <option value={shop.doc_id}>
                              {shop.shop_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>상품 선택</FormLabel>
                        <Select name="product_id">
                          {totalProducts?.map((product) => (
                            <option value={product.doc_id}>
                              {product.product_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </PopupBase>
                  <Button colorScheme="red" leftIcon={<EditIcon />}>
                    저장
                  </Button>
                </ButtonGroup>
                {/* <TableContainer
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
                        <Th>상품명</Th>
                        <Th>카테고리</Th>
                        <Th>상품가격</Th>
                        <Th>관리지점</Th>
                        <Th textAlign={"center"}>재고수량</Th>
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
                                    if (item.inventory_count > 1) {
                                      changeInventoryCount(
                                        index,
                                        item.inventory_count - 1
                                      );
                                    }
                                  }}
                                />
                                <Text>{item.inventory_count}</Text>
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
                              <Switch defaultChecked={item.inventory_use} />
                            </Td>
                            <Td>
                              <IconButton
                                size={"sm"}
                                // onClick={() => deleteProduct(item.doc_id)}
                                icon={<DeleteIcon />}
                              />
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer> */}
                <Card p={"10px 0px"}>
                  {totalProducts &&
                    inventoryList?.map((item, index) => (
                      <CardBody p={"10px 20px"}>
                        <Stack
                          border={"1px solid #d9d9d9"}
                          borderRadius={"10px"}
                          p={"10px"}
                          w={"100%"}
                        >
                          <HStack>
                            <Flex direction={"column"}>
                              <Text>No.</Text>
                              <Text>상품명</Text>
                              <Text>카테고리</Text>
                              <Text>상품가격</Text>
                              <Text>관리 지점</Text>
                              <Text>재고사용여부</Text>
                            </Flex>
                            <Flex direction={"column"}>
                              <Text>{index + 1}</Text>
                              <ProductColumn
                                productList={totalProducts}
                                product_id={item.product_id}
                              />
                              <Text>{searchShopName(item.shop_id)}</Text>
                              <Flex textAlign={"center"}>
                                <Switch defaultChecked={item.inventory_use} />
                              </Flex>
                            </Flex>
                          </HStack>
                          <Stack>
                            <HStack
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
                                  if (item.inventory_count > 1) {
                                    changeInventoryCount(
                                      index,
                                      item.inventory_count - 1
                                    );
                                  }
                                }}
                              />
                              <Text>{item.inventory_count}</Text>
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
                          <HStack justifyContent={"space-between"}>
                            <Stack w={"10x0%"}>
                              <IconButton
                                size={"sm"}
                                // onClick={() => deleteProduct(item.doc_id)}
                                icon={<DeleteIcon />}
                              />
                            </Stack>
                          </HStack>
                        </Stack>
                      </CardBody>
                    ))}
                </Card>
              </Stack>
            )}
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Inventory;
