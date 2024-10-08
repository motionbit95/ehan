import {
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
  Stack,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "recharts";
import PopupBase from "../../modals/PopupBase";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase_conf";
import { collection, getDocs, query } from "firebase/firestore";
import { postSpot } from "../../firebase/firebase_func";

function SpotInfo({ ...props }) {
  const [spot, setSpot] = useState(
    props.spot
      ? props.spot
      : {
          spot_title: "",
          spot_image: [],
          spot_logo: [],
        }
  );

  useEffect(() => {
    console.log("spot", spot);
  }, [spot]);

  const handleChange = (event) => {
    if (
      event.target.name === "spot_image" ||
      event.target.name === "spot_logo"
    ) {
      // debug("파일을 선택했습니다. ", event.target.files[0].name);
      setSpot({
        ...spot,
        [event.target.name]: [event.target.files[0]],
      });
      props.onChangeSpot({
        ...spot,
        [event.target.name]: [event.target.files[0]],
      });
    } else {
      setSpot({ ...spot, [event.target.name]: event.target.value });
    }
  };

  const imageRef = useRef();
  const [previewImage, setPreviewImage] = useState(
    props.spot?.spot_image[0] ? props.spot?.spot_image[0] : null
  );

  const logoRef = useRef();
  const [logoImage, setlogoImage] = useState(
    props.spot?.spot_logo[0] ? props.spot?.spot_logo[0] : null
  );

  const handleFileChange = (event) => {
    // 파일 정보를 product 정보에 저장합니다.
    handleChange(event);

    if (event.target.files[0]) {
      props.setSpotFile(event.target.files[0]);
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
  const handleLogoFileChange = (event) => {
    // 파일 정보를 product 정보에 저장합니다.
    handleChange(event);

    if (event.target.files[0]) {
      // 파일을 Blob으로 변환하여 미리보기 이미지 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileAsBlob = new Blob([reader.result], {
          type: event.target.files[0].type,
        }); // Blob로 저장
        setlogoImage(URL.createObjectURL(fileAsBlob)); // URL로 이미지 보여주기
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    } else {
      // 파일이 선택되지 않은 경우 미리보기 이미지 초기화
      setlogoImage(null);
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
    setSpot({
      ...spot,
      spot_image: [],
    });
    props.onChangeSpot({
      ...props.spot,
      spot_image: [],
    });
  }

  function onDeleteLogoImage() {
    // 파일 ui 에 담긴 정보도 지워줘야한다.
    imageRef.current.value = "";
    setlogoImage(null);
    setSpot({
      ...spot,
      spot_logo: [],
    });
    props.onChangeSpot({
      ...props.spot,
      spot_logo: [],
    });
  }

  return (
    <Stack>
      <FormControl isRequired>
        <FormLabel>지점명</FormLabel>
        <Input onChange={handleChange} name="spot_title" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>설치지점 로고 등록</FormLabel>
        <InputGroup w={"100px"}>
          <Input
            type="file"
            name="spot_logo"
            onChange={handleLogoFileChange}
            display={"none"}
            ref={logoRef}
            accept="image/*"
          />
          {logoImage ? (
            <>
              <Image
                onClick={() => onImageUpload(logoRef)}
                src={logoImage}
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
              onClick={() => onImageUpload(logoRef)}
              src={logoImage}
              w={"100px"}
              h={"100px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <IconButton
                onClick={onDeleteLogoImage}
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
        <FormLabel>설치지점 이미지 등록</FormLabel>
        <InputGroup w={"100px"}>
          <Input
            type="file"
            name="spot_image"
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
    </Stack>
  );
}

const Spot = () => {
  const [spotFile, setSpotFile] = useState(null);
  const [spotInfo, setSpotInfo] = useState(null);
  const [spotList, setSpotList] = useState([]);

  useEffect(() => {
    getSpot();
  }, []);

  const getSpot = async () => {
    const tempList = [];
    const q = query(collection(db, "SPOT"));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      tempList.push({ ...doc.data(), doc_id: doc.id });
      setSpotList(tempList);
    });
  };

  const updateSpotInfo = (spotInfo) => {
    setSpotInfo(spotInfo);
    console.log(spotInfo);
  };

  const uploadFile = async (file) => {
    // uid 부여를 위해 현재 시각을 파일명에 적어줌
    if (!file.name) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줌
    const day = String(now.getDate()).padStart(2, "0");

    const uploaded_file = await uploadBytes(
      ref(storage, `spot_image/${year + month + day}_${file.name}`),
      file
    );

    const file_url = await getDownloadURL(uploaded_file.ref);
    return file_url;
  };

  const saveSpot = async (e) => {
    e.preventDefault();

    // 이미지를 업로드하고 해당 url을 전달한다.
    uploadFile(spotFile).then(async (url) => {
      const addData = {
        [e.target[0].name]: e.target[0].value, // banner_title
        [e.target[1].name]: e.target[1].value, // advertiser
        spot_image: url,
        createAt: new Date(),
      };

      console.log(addData);

      if (await postSpot(addData)) {
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
        <Card>
          <CardHeader>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>설치 지점</Text>
              <ButtonGroup size={"md"} justifyContent={"flex-end"}>
                <PopupBase
                  icon={<AddIcon />}
                  title={"설치지점"}
                  action={"등록"}
                  onClick={(e) => saveSpot(e)}
                >
                  <SpotInfo
                    onChangeSpot={updateSpotInfo}
                    setSpotFile={setSpotFile}
                  />
                </PopupBase>
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
                    <Th w={"70px"}>No</Th>
                    <Th>등록일</Th>
                    <Th>지점명</Th>
                    <Th>아이콘</Th>
                    <Th>이미지</Th>
                    <Th>삭제</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {spotList.map((spot, index) => (
                    <Tr key={spot.doc_id}>
                      <Td>{index + 1}</Td>
                      <Td>{spot.createAt}</Td>
                      <Td>{spot.spot_title}</Td>
                      <Td>{spot.spot_logo}</Td>
                      <Td>{spot.spot_image}</Td>
                      <Td></Td>
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

export default Spot;
