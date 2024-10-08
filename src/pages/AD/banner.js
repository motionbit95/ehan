import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
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
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { ChosunBg } from "../../Component/Text";
import { AddIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import PopupBase from "../../modals/PopupBase";
import { useGlobalState } from "../../GlobalState";
import { debug } from "../../firebase/api";
import { postBanner } from "../../firebase/firebase_func";
import { db, storage } from "../../firebase/firebase_conf";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function BannerInfo({ ...props }) {
  const [banner, setBanner] = useState(
    props.banner
      ? props.banner
      : {
          banner_title: "",
          banner_image: [],
          advertiser: "",
          position: "",
        }
  );

  useEffect(() => {
    console.log("banner", banner);
  }, [banner]);

  const handleChange = (event) => {
    if (event.target.name === "banner_image") {
      // debug("파일을 선택했습니다. ", event.target.files[0].name);
      setBanner({
        ...banner,
        [event.target.name]: [event.target.files[0]],
      });
      props.onChangeBanner({
        ...banner,
        [event.target.name]: [event.target.files[0]],
      });
    } else {
      setBanner({ ...banner, [event.target.name]: event.target.value });
    }
  };

  const imageRef = useRef();
  const [previewImage, setPreviewImage] = useState(
    props.banner?.banner_image[0] ? props.banner?.banner_image[0] : null
  );

  const handleFileChange = (event) => {
    // 파일 정보를 product 정보에 저장합니다.
    handleChange(event);

    if (event.target.files[0]) {
      props.setBannerFile(event.target.files[0]);
    }

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

  function onImageUpload(ref) {
    if (ref) {
      ref.current.click();
    }
  }

  function onDeleteImage() {
    // 파일 ui 에 담긴 정보도 지워줘야한다.
    imageRef.current.value = "";
    setPreviewImage(null);
    setBanner({
      ...banner,
      banner_image: [],
    });
    props.onChangeBanner({
      ...props.banner,
      banner_image: [],
    });
  }

  return (
    <Stack>
      <FormControl isRequired>
        <FormLabel>제목</FormLabel>
        <Input onChange={handleChange} name="banner_title" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>광고사 링크</FormLabel>
        <Input onChange={handleChange} name="advertiser" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>배너 이미지 등록</FormLabel>
        <InputGroup w={"100px"}>
          <Input
            type="file"
            name="banner_image"
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
      </FormControl>
      <FormControl isRequired>
        <FormLabel>위치</FormLabel>
        <Select onChange={handleChange} name="position" defaultValue={""}>
          <option value="">선택</option>
          <option value="Top">Top</option>
          <option value="Bottom">Bottom</option>
        </Select>
      </FormControl>
    </Stack>
  );
}

const Banner = () => {
  const { admin } = useGlobalState();
  const [bannerList, setBannerList] = useState([]);
  const [bannerInfo, setBannerInfo] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const getBanner = async () => {
    const tempList = [];
    const q = query(collection(db, "BANNER"));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      tempList.push({ ...doc.data(), doc_id: doc.id });
      setBannerList(tempList);
    });
  };

  // 파일 업로드 부분
  const uploadFile = async (file) => {
    // uid 부여를 위해 현재 시각을 파일명에 적어줌
    if (!file.name) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줌
    const day = String(now.getDate()).padStart(2, "0");

    const uploaded_file = await uploadBytes(
      ref(storage, `banner_image/${year + month + day}_${file.name}`),
      file
    );

    const file_url = await getDownloadURL(uploaded_file.ref);
    return file_url;
  };

  useEffect(() => {
    getBanner();
  }, []);

  const handleChange = (event) => {
    // setBannerList({ ...bannerList, [event.target.name]: event.target.value });
    console.log(event.target.name, event.target.value);
  };

  const updateBannerInfo = (bannerInfo) => {
    setBannerInfo(bannerInfo);
    console.log(bannerInfo);
  };

  const saveBanner = async (e) => {
    e.preventDefault();

    // 이미지를 업로드하고 해당 url을 전달한다.
    uploadFile(bannerFile).then(async (url) => {
      const addData = {
        [e.target[0].name]: e.target[0].value, // banner_title
        [e.target[1].name]: e.target[1].value, // advertiser
        banner_image: url,
        // [e.target[2].name]: e.target[2].value, // banner_image
        // [e.target[3].name]: e.target[3].value, // ????
        [e.target[4].name]: e.target[4].value, // position
        createAt: new Date(),
      };

      console.log(addData);

      if (await postBanner(addData)) {
        window.location.reload();
      }
    });
  };
  return (
    <Stack w={"100%"} h={"100%"}>
      <Stack
        position={"absolute"}
        w={"calc(100% - 200px)"}
        h={"calc(100% - 48px)"}
        top={"48px"}
        left={"200px"}
        overflow={"scroll"}
        p={{ base: 4, md: 8 }}
      >
        {/* <ChosunBg fontSize={{ base: "16px", md: "24px" }}>
          광고 배너 설정
        </ChosunBg> */}
        <Card>
          <CardHeader>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>광고 배너</Text>
              <ButtonGroup size={"md"} justifyContent={"flex-end"}>
                <PopupBase
                  icon={<AddIcon />}
                  title={"배너"}
                  action={"등록"}
                  onClose={(e) => saveBanner(e)}
                >
                  <BannerInfo
                    shop_id={admin?.shop_id}
                    onChangeBanner={updateBannerInfo}
                    setBannerFile={setBannerFile}
                  />
                </PopupBase>
                {/* <Button
                  colorScheme="red"
                  variant={"outline"}
                  leftIcon={<EditIcon />}
                >
                  저장
                </Button> */}
              </ButtonGroup>
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
                    <Th>광고사 링크</Th>
                    <Th>위치</Th>
                    {/* {admin?.permission === "supervisor" &&  */}
                    <Th>미리보기</Th>
                    <Th>삭제</Th>
                    {/* } */}
                  </Tr>
                </Thead>
                <Tbody>
                  {bannerList?.map((item, index) => (
                    <Tr>
                      <Td>{index + 1}</Td>
                      <Td>{item.banner_title}</Td>
                      <Td>{item.advertiser}</Td>
                      <Td>{item.position}</Td>
                      <Td>
                        <Image
                          src={item.banner_image}
                          height={"100px"}
                          aspectRatio={"16/9"}
                        />
                      </Td>
                      <Td>
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => {
                            if (window.confirm("광고를 삭제하시겠습니까?")) {
                              console.log(item.doc_id);
                              deleteDoc(doc(db, "BANNER", item.doc_id)).then(
                                () => {
                                  console.log("Document deleted! ");
                                  window.location.reload();
                                }
                              );
                            }
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
};

export default Banner;
