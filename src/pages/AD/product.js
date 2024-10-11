import {
  Button,
  ButtonGroup,
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
  useDisclosure,
  useMediaQuery,
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
import React, { useEffect, useRef, useState } from "react";
import { useGlobalState } from "../../GlobalState";
import {
  getFilteredProduct,
  getProductCount,
  postProduct,
  updateProduct,
} from "../../firebase/firebase_func";
import PopupBase from "../../modals/PopupBase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase_conf";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  CloseIcon,
  MinusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { formatCurrency } from "../CS/home";
import { debug, timestampToDate } from "../../firebase/api";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import RFilter from "../../components/RFilter";
import SearchShop from "../../components/SearchShop";

function ProductInfo({ shopList, permission, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [product, setProduct] = useState(
    props.product
      ? props.product
      : {
          product_name: "",
          product_images: [],
          product_origin_price: 0,
          product_price: 0,
          product_category: categories[0],
          illust: [],
          shop_id: props.shop_id,
        }
  );

  useEffect(() => {
    console.log("product", product);
  }, [product]);

  const handleChange = (event) => {
    if (
      event.target.name === "product_images" ||
      event.target.name === "product_detail" ||
      event.target.name === "illust"
    ) {
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

  useEffect(() => {
    const getCategoryList = async () => {
      const docRef = doc(db, "CATEGORY", "category");
      const docSnap = await getDoc(docRef);
      setCategories(docSnap.data().list);
    };
    getCategoryList();
  }, []);

  const updateCategory = () => {
    updateDoc(doc(db, "CATEGORY", "category"), {
      list: categories,
    }).then(() => {
      console.log("category updated");
      onClose();
    });
  };

  // 이미지 선택 시 아래의 함수를 사용
  const imageRef = useRef();
  const [previewImage, setPreviewImage] = useState(
    props.product?.product_images[0] ? props.product?.product_images[0] : null
  );

  const detailRef = useRef();
  const [detailImage, setDetailmage] = useState(
    props.product?.product_detail ? props.product?.product_detail : null
  );

  const illustRef = useRef();
  const [illustImage, setIllustImage] = useState(
    props.product?.illust ? props.product?.illust : null
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

  const handleDetailFileChange = (event) => {
    // 파일 정보를 product 정보에 저장합니다.
    handleChange(event);

    if (event.target.files[0]) {
      // 파일을 Blob으로 변환하여 미리보기 이미지 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileAsBlob = new Blob([reader.result], {
          type: event.target.files[0].type,
        }); // Blob로 저장
        setDetailmage(URL.createObjectURL(fileAsBlob)); // URL로 이미지 보여주기
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    } else {
      // 파일이 선택되지 않은 경우 미리보기 이미지 초기화
      setDetailmage(null);
    }
  };

  const handleIllustFileChange = (event) => {
    // 파일 정보를 product 정보에 저장합니다.
    handleChange(event);

    if (event.target.files[0]) {
      // 파일을 Blob으로 변환하여 미리보기 이미지 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileAsBlob = new Blob([reader.result], {
          type: event.target.files[0].type,
        }); // Blob로 저장
        setIllustImage(URL.createObjectURL(fileAsBlob)); // URL로 이미지 보여주기
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    } else {
      // 파일이 선택되지 않은 경우 미리보기 이미지 초기화
      setIllustImage(null);
    }
  };

  function onImageUpload(ref) {
    if (ref) {
      ref.current.click();
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

  function onDeleteDetailImage() {
    // 파일 ui 에 담긴 정보도 지워줘야한다.
    detailRef.current.value = "";
    setDetailmage(null);
    setProduct({
      ...product,
      product_detail: "",
    });
    props.onChangeProduct({
      ...product,
      product_detail: "",
    });
  }

  function onDeleteIllustImage() {
    // 파일 ui 에 담긴 정보도 지워줘야한다.
    illustRef.current.value = "";
    setIllustImage(null);
    setProduct({
      ...product,
      illust: "",
    });
    props.onChangeProduct({
      ...product,
      illust: "",
    });
  }

  return (
    <Stack w={"100%"} h={"100%"}>
      <Stack>
        <FormControl isRequired>
          <Stack>
            <HStack justifyContent={"space-between"}>
              <FormLabel>관리 지점</FormLabel>
              {/* <Button
                colorScheme={isAll ? "red" : "gray"}
                onClick={() => setIsAll(!isAll)}
              >
                전체 적용
              </Button> */}
            </HStack>
            {!isAll && (
              <SearchShop
                defaultValue={
                  props.product?.shop_id ? props.product?.shop_id : ""
                }
                onSelect={(value) => {
                  setProduct({
                    ...product,
                    shop_id: value,
                  });
                  props.onChangeProduct({
                    ...product,
                    shop_id: value,
                  });
                }}
              />
            )}
          </Stack>
          {/* <Select
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
          </Select> */}
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
                    onClick={() => onImageUpload(imageRef)}
                    src={previewImage}
                    w={"100px"}
                    h={"100px"}
                    objectFit={"cover"}
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
                  onClick={() => onImageUpload(imageRef)}
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
        <FormControl>
          <FormLabel>상품 상세 이미지 등록</FormLabel>
          <Stack direction={"column-reverse"}>
            <InputGroup w={"100px"}>
              <Input
                type="file"
                name="product_detail"
                onChange={handleDetailFileChange}
                display={"none"}
                ref={detailRef}
                accept="image/*"
              />
              {detailImage ? (
                <>
                  <Image
                    onClick={() => onImageUpload(detailRef)}
                    src={detailImage}
                    w={"100px"}
                    h={"100px"}
                    objectFit={"cover"}
                  />
                  <IconButton
                    size={"xs"}
                    position={"absolute"}
                    top={0}
                    right={0}
                    onClick={onDeleteDetailImage}
                    icon={<CloseIcon />}
                    // variant={"ghost"}
                  />
                </>
              ) : (
                <Flex
                  border={"1px solid #d9d9d9"}
                  borderRadius={"10px"}
                  onClick={() => onImageUpload(detailRef)}
                  src={detailImage}
                  w={"100px"}
                  h={"100px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <IconButton
                    onClick={onDeleteDetailImage}
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
        <FormControl>
          <FormLabel>상품 일러스트 등록</FormLabel>
          <Stack direction={"column-reverse"}>
            <InputGroup w={"100px"}>
              <Input
                type="file"
                name="illust"
                onChange={handleIllustFileChange}
                display={"none"}
                ref={illustRef}
                accept="image/*"
              />
              {illustImage ? (
                <>
                  <Image
                    onClick={() => onImageUpload(illustRef)}
                    src={illustImage}
                    w={"100px"}
                    h={"100px"}
                    objectFit={"cover"}
                  />
                  <IconButton
                    size={"xs"}
                    position={"absolute"}
                    top={0}
                    right={0}
                    onClick={onDeleteIllustImage}
                    icon={<CloseIcon />}
                    // variant={"ghost"}
                  />
                </>
              ) : (
                <Flex
                  border={"1px solid #d9d9d9"}
                  borderRadius={"10px"}
                  onClick={() => onImageUpload(illustRef)}
                  src={illustImage}
                  w={"100px"}
                  h={"100px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <IconButton
                    onClick={onDeleteIllustImage}
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
          <Stack>
            <HStack w={"100%"} justifyContent={"space-between"}>
              <FormLabel>카테고리</FormLabel>
              <Button size={"sm"} colorScheme="red" onClick={onOpen}>
                카테고리 관리
              </Button>
            </HStack>
            {/* <Input
              onChange={handleChange}
              name="product_category"
              type="text"
              placeholder="상품 카테고리를 입력하세요."
              defaultValue={props.product?.product_category}
            ></Input> */}
            <Select
              value={product?.product_category}
              onChange={(e) => {
                setProduct({
                  ...product,
                  product_category: e.target.value,
                });
                props.onChangeProduct({
                  ...product,
                  product_category: e.target.value,
                });
              }}
              name="product_category"
            >
              <option value="">카테고리 선택</option>
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Stack>
        </FormControl>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>카테고리 관리</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                {categories?.map((category, index) => (
                  <HStack>
                    <Text>{index + 1}.</Text>
                    <Input
                      defaultValue={category}
                      onChange={(e) =>
                        setCategories([
                          ...categories.slice(0, index),
                          e.target.value,
                          ...categories.slice(index + 1),
                        ])
                      }
                    />
                    <IconButton
                      onClick={() =>
                        setCategories([
                          ...categories.slice(0, index),
                          ...categories.slice(index + 1),
                        ])
                      }
                      icon={<MinusIcon />}
                    />
                  </HStack>
                ))}
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="red"
                mr={3}
                onClick={() => {
                  setCategories([...categories, ""]);
                }}
              >
                카테고리 추가
              </Button>
              <Button variant="ghost" onClick={updateCategory}>
                적용하기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
    if (!file.name) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줌
    const day = String(now.getDate()).padStart(2, "0");

    const uploaded_file = await uploadBytes(
      ref(storage, `product_image/${year + month + day}_${file.name}`),
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
        if (url) {
          productInfo.product_images = [url];
          //링크로 변환해서 리스트에 담는다
          if (await postProduct(productInfo)) {
            setProductList([
              ...productList,
              { ...productInfo, createAt: new Date() },
            ]);
          }
        }
      });
    }

    if (productInfo.product_detail) {
      const url = await uploadFile(productInfo.product_detail[0]);
      productInfo.product_detail = url;
      if (url) {
        //링크로 변환해서 리스트에 담는다
        if (await postProduct(productInfo)) {
          setProductList([
            ...productList,
            { ...productInfo, createAt: new Date() },
          ]);
        }
      }
    }

    if (productInfo.illust) {
      const url = await uploadFile(productInfo.illust[0]);
      productInfo.illust = url;
      if (url) {
        //링크로 변환해서 리스트에 담는다
        if (await postProduct(productInfo)) {
          setProductList([
            ...productList,
            { ...productInfo, createAt: new Date() },
          ]);
        }
      }
    }
  };

  const uploadImages = async () => {
    // firebase의 storage에 이미지 파일을 파이어스토어에 저장시킨다(업로드)
    if (productInfo.product_images && productInfo.product_images.length > 0) {
      productInfo.product_images.forEach(async (image) => {
        const url = await uploadFile(image);
        if (url) {
          productInfo.product_images = [url];
          //링크로 변환해서 리스트에 담는다
          if (await updateProduct(productInfo)) {
            setProductList(
              productList.map((product) =>
                product.doc_id === productInfo.doc_id ? productInfo : product
              )
            );
          }
        }
      });
    } else {
      productInfo.product_images = [];
      if (await updateProduct(productInfo)) {
        setProductList(
          productList.map((product) =>
            product.doc_id === productInfo.doc_id ? productInfo : product
          )
        );
      }
    }

    if (productInfo.product_detail) {
      uploadFile(productInfo.product_detail[0]).then(async (url) => {
        if (url) {
          productInfo.product_detail = url;
          if (await updateProduct(productInfo)) {
            setProductList(
              productList.map((product) =>
                product.doc_id === productInfo.doc_id ? productInfo : product
              )
            );
          }
        }
      });
    } else {
      productInfo.product_detail = "";
      if (await updateProduct(productInfo)) {
        setProductList(
          productList.map((product) =>
            product.doc_id === productInfo.doc_id ? productInfo : product
          )
        );
      }
    }
  };

  // U - update product
  const updateProductInfo = (productInfo) => {
    setProductInfo(productInfo);
    console.log(productInfo);
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

  const saveProduct = async (e) => {
    console.log(productInfo);

    if (await updateProduct(productInfo)) {
      window.location.reload();
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

  const totalPages = Math.ceil(productList.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = productList.slice(startIndex, endIndex);

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
                      <Th w={"60px"}>No</Th>
                      <Th w={"130px"}>등록날짜</Th>
                      <Th w={"180px"}>카테고리</Th>
                      <Th w={"400px"}>상품명</Th>
                      <Th w={"150px"}>상품가격</Th>
                      <Th w={"250px"}>관리지점</Th>
                      <Th textAlign={"center"} w={"30px"}>
                        수정
                      </Th>
                      <Th textAlign={"center"} w={"30px"}>
                        삭제
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentData?.map((item, index) => {
                      const itemNumber =
                        (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                      return (
                        <Tr
                          key={index}
                          _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}
                        >
                          <Td fontSize={"sm"}>{itemNumber}</Td>
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
                              onClose={saveProduct}
                              // {async () => {
                              //   await uploadImages();
                              // }}
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
                              src={item.product_images?.[0].replace(
                                "http://",
                                "https://"
                              )}
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
