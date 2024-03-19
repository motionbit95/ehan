import {
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
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
  getFilteredProduct,
  getProductCount,
  postProduct,
  updateProduct,
} from "../../firebase/firebase_func";
import PopupBase from "../../modals/PopupBase";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase_conf";
import { AddIcon, DeleteIcon, EditIcon, CloseIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";
import { debug, timestampToDate } from "../../firebase/api";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import RFilter from "../../components/RFilter";

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
          shop_id: props.shop_id,
        }
  );

  const handleChange = (event) => {
    if (event.target.name === "product_images") {
      debug("파일을 선택했습니다. ", event.target.files[0].name);
      // 03.06 - 이미지는 하나만 선택하도록 변경
      // setFileList([...fileList, event.target.files[0]]);
      setProduct({
        ...product,
        // [event.target.name]: [...fileList, event.target.files[0]],
        [event.target.name]: [event.target.files[0]],
      });
      props.onChangeProduct({
        ...product,
        // [event.target.name]: [...fileList, event.target.files[0]],
        [event.target.name]: [event.target.files[0]],
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

  // 이미지 선택 시 아래의 함수를 사용
  const imageRef = useRef();
  const [previewImage, setPreviewImage] = useState(
    props.product?.product_images[0] ? props.product?.product_images[0] : null
  );
  const handleFileChange = (event) => {
    // 파일 정보를 product 정보에 저장합니다.
    handleChange(event);

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
    // 파일 ui 에 담긴 정보도 지워줘야한다.
    imageRef.current.value = "";
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
            defaultValue={props.shop_id ? props.shop_id : ""}
          >
            {permission === "supervisor" && (
              <option key={""} value={""}>
                {"전체"}
              </option>
            )}
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
            <InputGroup w={"100px"}>
              <Input
                type="file"
                name="product_images"
                onChange={handleFileChange}
                display={"none"}
                ref={imageRef}
                accept="image/*"
              />
              {previewImage ? (
                <>
                  <Image
                    onClick={onImageUpload}
                    src={previewImage}
                    w={"100px"}
                    h={"100px"}
                  />
                  <IconButton
                    size={"xs"}
                    position={"absolute"}
                    top={0}
                    right={0}
                    onClick={onDeleteImage}
                    icon={<CloseIcon />}
                    // variant={"ghost"}
                  />
                </>
              ) : (
                <Flex
                  border={"1px solid #d9d9d9"}
                  borderRadius={"10px"}
                  onClick={onImageUpload}
                  src={previewImage}
                  w={"100px"}
                  h={"100px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <IconButton
                    onClick={onDeleteImage}
                    icon={<AddIcon />}
                    variant={"ghost"}
                    size={"lg"}
                    _hover={{ bg: "none" }}
                  />
                </Flex>
              )}
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
      setMoreButtonVisible(getProductCount(admin?.shop_id) < 10 ? false : true);
    }
  }, [admin, productList]);

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

  // 파일 업로드 부분
  const uploadFile = async (file) => {
    // uid 부여를 위해 현재 시각을 파일명에 적어줌
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줌
    const day = String(now.getDate()).padStart(2, "0");

    const uploaded_file = await uploadBytes(
      ref(storage, `product_image/${file.name}-${year + month + day}`),
      file
    );

    const file_url = await getDownloadURL(uploaded_file.ref);
    return file_url;
  };

  // C - create product
  const addProduct = async () => {
    // firebase의 storage에 이미지 파일을 파이어스토어에 저장시킨다(업로드)
    if (productInfo.product_images && productInfo.product_images.length > 0) {
      productInfo.product_images.forEach(async (image) => {
        const url = await uploadFile(image);
        productInfo.product_images = [url];
      });
    }

    //링크로 변환해서 리스트에 담는다
    if (await postProduct(productInfo)) {
      setProductList([
        ...productList,
        { ...productInfo, createAt: new Date() },
      ]);
    }
  };

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

  // R - read product
  const getFilteredData = async (value) => {
    if (value.shop_id || admin?.permission === "supervisor") {
      let newList = await getFilteredProduct(value);
      setProductList(newList);
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
          {/* desktop 에서의 레이아웃 */}
          <RFilter
            children={
              <ButtonGroup size={"sm"}>
                <PopupBase
                  onClose={addProduct}
                  icon={<AddIcon />}
                  title={"상품"}
                  action={"추가"}
                >
                  <ProductInfo
                    shop_id={admin?.shop_id}
                    shopList={props.shopList}
                    permission={admin?.permission}
                    onChangeProduct={updateProductInfo}
                  />
                </PopupBase>
              </ButtonGroup>
            }
            shopList={props.shopList}
            admin={admin}
            onChangeFilter={(value) => getFilteredData(value)}
            orderFilter={
              <>
                <option value={"product_category"}>카테고리순</option>
                <option value={"product_name"}>상품명순</option>
                <option value={"product_price"}>가격순</option>
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
                      <Th>No</Th>
                      <Th>등록날짜</Th>
                      <Th>카테고리</Th>
                      <Th>상품명</Th>
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
                        <Td fontSize={"sm"}>
                          {timestampToDate(item.createAt)}
                        </Td>
                        <Td fontSize={"sm"}>{item.product_category}</Td>
                        <Td fontSize={"sm"}>{item.product_name}</Td>

                        <Td fontSize={"sm"}>
                          {formatCurrency(item.product_price)}원
                        </Td>
                        <Td>{searchShopName(item.shop_id)}</Td>
                        <Td>
                          <PopupBase
                            colorScheme={"gray"}
                            visibleButton={true}
                            action={"수정"}
                            size={"sm"}
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
                              shop_id={admin?.shop_id}
                              shopList={props.shopList}
                              permission={admin?.permission}
                              onChangeProduct={updateProductInfo}
                            />
                          </PopupBase>
                        </Td>
                        <Td>
                          <IconButton
                            size={"sm"}
                            onClick={() => deleteProduct(item.doc_id)}
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
              children={
                <ButtonGroup size={"sm"}>
                  <PopupBase
                    onClose={addProduct}
                    icon={<AddIcon />}
                    title={"상품"}
                    action={"추가"}
                  >
                    <ProductInfo
                      shop_id={admin?.shop_id}
                      shopList={props.shopList}
                      permission={admin?.permission}
                      onChangeProduct={updateProductInfo}
                    />
                  </PopupBase>
                </ButtonGroup>
              }
              shopList={props.shopList}
              admin={admin}
              onChangeFilter={(value) => getFilteredData(value)}
              orderFilter={
                <>
                  <option value={"product_category"}>카테고리순</option>
                  <option value={"product_name"}>상품명순</option>
                  <option value={"product_price"}>가격순</option>
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
                    <Tbody>
                      {productList?.map((item, index) => (
                        <Tr
                          key={index}
                          _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                        >
                          {/* <Td fontSize={"sm"}>{index + 1}</Td> */}
                          <Td fontSize={"sm"}>
                            <Image
                              src={item.product_images?.[0]}
                              w={"100px"}
                              h={"100px"}
                              objectFit={"contain"}
                            />
                          </Td>
                          <Td fontSize={"sm"}></Td>
                          <Td fontSize={"sm"}>
                            <Stack>
                              <Text>{timestampToDate(item.createAt)}</Text>
                              <Text>{searchShopName(item.shop_id)}</Text>
                              <Text>
                                [{item.product_category}] {item.product_name}
                              </Text>
                              <Text>
                                {" "}
                                {formatCurrency(item.product_price)}원
                              </Text>
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

export default Product;
