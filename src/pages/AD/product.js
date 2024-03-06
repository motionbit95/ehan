import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalState } from "../../GlobalState";
import {
  getProduct,
  getProductCount,
  postProduct,
  updateProduct,
} from "../../firebase/firebase_func";
import PopupBase from "../../modals/PopupBase";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";
import { AddIcon, DeleteIcon, EditIcon, CloseIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";
import { debug } from "../../firebase/api";

function ProductInfo({ shopList, permission, ...props }) {
  const [product, setProduct] = useState(
    props.product
      ? props.product
      : {
          product_name: "",
          product_images: [],
          product_origin_price: 0,
          product_price: 0,
          product_category: "",
          shop_id: "",
        }
  );

  const [fileList, setFileList] = useState([]);

  const handleChange = (event) => {
    if (event.target.name === "product_images") {
      setFileList([...fileList, event.target.files[0]]);
      setProduct({
        ...product,
        [event.target.name]: [...fileList, event.target.files[0].name],
      });
      props.onChangeProduct({
        ...product,
        [event.target.name]: [...fileList, event.target.files[0].name],
      });
    } else {
      setProduct({
        ...product,
        [event.target.name]: event.target.value,
      });
      props.onChangeProduct({
        ...product,
        [event.target.name]: event.target.value,
      });
    }
  };

  const imageRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);

    if (event.target.files[0]) {
      // 파일을 Blob으로 변환하여 미리보기 이미지 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileAsBlob = new Blob([reader.result], {
          type: event.target.files[0].type,
        }); // Blob로 저장
        setPreviewImage(URL.createObjectURL(fileAsBlob)); // URL로 이미지 보여주기
      };
      reader.readAsArrayBuffer(event.target.files[0]);
      console.log(event.target.files[0]);
    } else {
      // 파일이 선택되지 않은 경우 미리보기 이미지 초기화
      setPreviewImage(null);
    }
  };

  function onImageUpload() {
    if (imageRef) {
      imageRef.current.click();
    }
  }

  function onDeleteImage() {
    setPreviewImage(null);
    setProduct({
      ...product,
      product_images: [],
    });
    props.onChangeProduct({
      ...product,
      product_images: [],
    });
  }

  return (
    <Stack w={"100%"} h={"100%"}>
      <Stack>
        <FormControl isRequired>
          <FormLabel>관리 지점</FormLabel>
          <Select
            onChange={handleChange}
            isDisabled={permission !== "supervisor"}
            name="shop_id"
            defaultValue={props.product?.shop_id}
          >
            <option key={"total"} value={"total"}>
              {"전체"}
            </option>
            {shopList?.map((shop) => (
              <option key={shop.doc_id} value={shop.doc_id}>
                {shop.shop_name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>상품명</FormLabel>
          <Input
            onChange={handleChange}
            minLength={0}
            name="product_name"
            type="text"
            placeholder="상품명을 입력해주세요."
            defaultValue={props.product?.product_name}
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>상품 이미지 등록</FormLabel>
          <Stack direction={"column-reverse"}>
            <InputGroup>
              <Input
                type="file"
                onChange={handleFileChange}
                display={"none"}
                ref={imageRef}
              />
              <Image
                onClick={onImageUpload}
                src={previewImage}
                w={"100px"}
                h={"100px"}
              />
              <IconButton onClick={onDeleteImage} icon={<CloseIcon />} />
            </InputGroup>
          </Stack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>상품 원가</FormLabel>
          <Input
            onChange={handleChange}
            name="product_origin_price"
            type="number"
            placeholder="상품 원가를 입력하세요."
            defaultValue={props.product?.product_origin_price}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>판매 가격</FormLabel>
          <Input
            onChange={handleChange}
            name="product_price"
            type="number"
            placeholder="상품 판매 가격을 입력하세요."
            defaultValue={props.product?.product_price}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>카테고리</FormLabel>
          <Input
            onChange={handleChange}
            name="product_category"
            type="text"
            placeholder="상품 카테고리를 입력하세요."
            defaultValue={props.product?.product_category}
          ></Input>
        </FormControl>
      </Stack>
    </Stack>
  );
}

function Product(props) {
  const { admin } = useGlobalState();
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  // list
  const [productList, setProductList] = useState([]);
  const [productInfo, setProductInfo] = useState(null);

  // list view control
  const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState(null);
  const [moreButtonVisible, setMoreButtonVisible] = useState(false);

  useEffect(() => {
    if (admin.doc_id) {
      // getProductList();
      setMoreButtonVisible(getProductCount(admin.shop_id) < 10 ? false : true);
    }
  }, [admin]);

  // shopList에서 shop의 이름을 가지고 오는 함수
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

  // C - create product
  const addProduct = async () => {
    // 여기가 firebase에 넣는건데 파일 리스트를 파이어스토어에 저장시킨다(업로드)

    //링크로 변환해서 리스트에 담는다

    if (await postProduct(productInfo)) {
      setProductList([
        ...productList,
        { ...productInfo, product_images: "새로운 배열로 바꿔쳐야겟지" },
      ]);
    }
  };

  // R - read product
  const getProductList = async () => {
    // 상품 목록을 조회합니다.
    await getProduct(lastDocumentSnapshot, admin.shop_id).then((data) => {
      if (data.products.length > 0) {
        setProductList([...productList, ...data.products]);
        setLastDocumentSnapshot(data.lastDocumentSnapshot);
        if (data.products.length < 10) {
          setMoreButtonVisible(false);
        }
      } else {
        // alert("불러올 상품 목록이 없습니다.");
        return;
      }
    });
    debug("상품 목록을 조회합니다.");
  };

  if (productList.length === 0) {
    getProductList();
  }

  // U - update product
  const updateProductInfo = (productInfo) => {
    setProductInfo(productInfo);
  };

  // D - delete product
  const deleteProduct = async (id) => {
    if (window.confirm("상품를 삭제하시겠습니까?")) {
      // 회원 정보 삭제
      await deleteDoc(doc(db, "PRODUCT", id));
      setProductList(productList.filter((product) => product.doc_id !== id));
    }

    debug("[PRODUCT] 문서가 삭제되었습니다.", id);
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
                    onClose={addProduct}
                    icon={<AddIcon />}
                    title={"상품"}
                    action={"추가"}
                  >
                    <ProductInfo
                      shopList={props.shopList}
                      permission={admin.permission}
                      onChangeProduct={updateProductInfo}
                    />
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
                      {productList?.map((item, index) => (
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
                            <PopupBase
                              colorScheme={"gray"}
                              visibleButton={true}
                              action={"수정"}
                              title={<EditIcon />}
                              onClose={async () => {
                                if (await updateProduct(productInfo)) {
                                  setProductList(
                                    productList.map((product) =>
                                      product.doc_id === productInfo.doc_id
                                        ? productInfo
                                        : product
                                    )
                                  );
                                }
                              }}
                            >
                              <ProductInfo
                                product={item}
                                shopList={props.shopList}
                                permission={admin.permission}
                                onChangeProduct={updateProductInfo}
                              />
                            </PopupBase>
                          </Td>
                          <Td>
                            <IconButton
                              onClick={() => deleteProduct(item.doc_id)}
                              icon={<DeleteIcon />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Center>
                  <Button
                    colorScheme="red"
                    mb={"20px"}
                    w={"80px"}
                    display={moreButtonVisible ? "box" : "none"}
                    onClick={() => getProductList()}
                  >
                    더보기
                  </Button>
                </Center>
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
                    onClose={addProduct}
                    icon={<AddIcon />}
                    title={"상품"}
                    action={"추가"}
                  >
                    <ProductInfo
                      shopList={props.shopList}
                      permission={admin.permission}
                      onChangeProduct={updateProductInfo}
                    />
                  </PopupBase>
                </ButtonGroup>
                <Card p={"10px 0px"}>
                  {productList?.map((item, index) => (
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
                            <PopupBase
                              colorScheme={"gray"}
                              visibleButton={true}
                              action={"수정"}
                              title={<EditIcon />}
                              onClose={async () => {
                                if (await updateProduct(productInfo)) {
                                  setProductList(
                                    productList.map((product) =>
                                      product.doc_id === productInfo.doc_id
                                        ? productInfo
                                        : product
                                    )
                                  );
                                }
                              }}
                            >
                              <ProductInfo
                                product={item}
                                shopList={props.shopList}
                                permission={admin.permission}
                                onChangeProduct={updateProductInfo}
                              />
                            </PopupBase>
                          </Stack>
                          <Stack w={"100%"}>
                            <IconButton
                              onClick={() => deleteProduct(item.doc_id)}
                              icon={<DeleteIcon />}
                            />
                          </Stack>
                        </HStack>
                      </Stack>
                    </CardBody>
                  ))}
                </Card>
                <Center>
                  <Button
                    colorScheme="red"
                    mb={"20px"}
                    w={"80px"}
                    display={moreButtonVisible ? "box" : "none"}
                    onClick={() => getProductList()}
                  >
                    더보기
                  </Button>
                </Center>
              </Stack>
            )}
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Product;
