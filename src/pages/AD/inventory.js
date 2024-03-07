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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  createInventoryData,
  getTotalProducts,
  readInventoryData,
} from "../../firebase/firebase_func";
import { useGlobalState } from "../../GlobalState";
import PopupBase from "../../modals/PopupBase";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";

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
    // console.log("재고추가");
    // console.log(e.target[0].name, e.target[0].value);
    // console.log(e.target[1].name, e.target[1].value);

    createInventoryData(e.target[0].value, e.target[1].value);
  };

  const readInventory = async () => {
    const inventoryList = await readInventoryData(
      admin.shop_id ? admin.shop_id : "test-shop"
    );
    setInventoryList(inventoryList);
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
                <ButtonGroup size={"sm"}>
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
                        <Th textAlign={"center"} w={"30px"}>
                          수정
                        </Th>
                        <Th textAlign={"center"} w={"30px"}>
                          삭제
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {inventoryList?.map((item, index) => (
                        <Tr
                          key={index}
                          _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                        >
                          <Td fontSize={"sm"}>{index + 1}</Td>
                          <Td fontSize={"sm"}>{item.product_name}</Td>
                          <Td fontSize={"sm"}>{item.product_category}</Td>
                          <Td fontSize={"sm"}>
                            {formatCurrency(item.product_price)}원
                          </Td>
                          <Td>{searchShopName(item.shop_id)}</Td>

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
                <ButtonGroup size={"sm"}>
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
                </ButtonGroup>
                <Card p={"10px 0px"}>
                  {inventoryList?.map((item, index) => (
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
                          </Flex>
                          <Flex direction={"column"}>
                            <Text>{index + 1}</Text>
                            <Text>{item.product_name}</Text>
                            <Text>{item.product_category}</Text>
                            <Text>{formatCurrency(item.product_price)}원</Text>
                            <Text>{searchShopName(item.shop_id)}</Text>
                          </Flex>
                        </HStack>

                        <HStack justifyContent={"space-between"}>
                          <Stack w={"100%"}>
                            <IconButton
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
