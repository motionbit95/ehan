import {
  Box,
  HStack,
  IconButton,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebase_conf";
import { ChosunBg, ChosunGu } from "../Component/Text";

const Customer = () => {
  const [spotList, setSpotList] = useState([]);

  useEffect(() => {
    const getSpot = async () => {
      const q = query(collection(db, "SPOT"));
      const querySnapshot = await getDocs(q);

      const tempList = [];
      querySnapshot.forEach((doc) => {
        tempList.push({ ...doc.data(), doc_id: doc.id });
      });
      setSpotList(tempList);
    };

    getSpot();
  }, []);

  return (
    <Stack
      minHeight="100vh"
      overflow={"hidden"}
      justify={"center"}
      spacing={12}
      px={4}
    >
      <Stack spacing={0}>
        <ChosunBg fontSize={"36px"}>설치 지점</ChosunBg>
        <ChosunGu
          fontSize={{ base: "12px", md: "14px" }}
          whiteSpace={{ base: "pre-line", md: "normal" }}
        >
          {`주변 설치 지점을 검색하여 
          전국 어디서든 레드스위치를 경험할 수 있습니다.`}
        </ChosunGu>
      </Stack>
      <SpotView TabItems={spotList} />
      <Stack align={"center"}>
        <ChosunGu decoration={"underline"} fontSize={"14px"} cursor={"pointer"}>
          설치지점 검색하기
        </ChosunGu>
      </Stack>
    </Stack>
  );
};

export default Customer;

const SpotView = ({ TabItems }) => {
  const [imageIndex, setImageIndex] = useState(0); // 이미지 인덱스 상태 추가
  const [logoIndex, setLogoIndex] = useState(0);

  const handleNext = () => {
    if (logoIndex < TabItems.length - 3) {
      setLogoIndex(logoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (logoIndex > 0) {
      setLogoIndex(logoIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (imageIndex < TabItems.length - 2) {
      setImageIndex(imageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  };

  // 로고 3개 표시
  const visibleLogos = TabItems.slice(logoIndex, logoIndex + 3);

  // 이미지 2개 표시
  const visibleImages = TabItems.slice(imageIndex, imageIndex + 2);

  return (
    <VStack spacing={8} align="center">
      {/* 로고 출력 */}
      <HStack spacing={4}>
        <IconButton
          icon={<ChevronLeftIcon fontSize={"lg"} />}
          borderRadius={"full"}
          size={"xs"}
          onClick={handlePrev}
          isDisabled={logoIndex === 0}
        />
        {visibleLogos.map((spot, idx) => (
          <Box
            key={idx}
            borderRadius={"full"}
            boxSize={"64px"}
            overflow={"hidden"}
          >
            <Image
              w={"full"}
              h={"full"}
              objectFit={"cover"}
              src={spot.spot_logo}
            />
          </Box>
        ))}
        <IconButton
          icon={<ChevronRightIcon fontSize={"lg"} />}
          borderRadius={"full"}
          size={"xs"}
          onClick={handleNext}
          isDisabled={logoIndex >= TabItems.length - 3}
        />
      </HStack>

      {/* 두 개씩 이미지 출력 */}
      <HStack justify="center" spacing={4}>
        <IconButton
          icon={<ChevronLeftIcon fontSize={"2xl"} />}
          borderRadius={"full"}
          size={"sm"}
          onClick={handlePrevImage}
          isDisabled={imageIndex === 0} // 첫 번째 이미지일 때 비활성화
        />
        {visibleImages.map((spot, idx) => (
          <Box key={idx} w={"120px"} h={"120px"}>
            <Image src={spot.spot_image} w="full" h="full" objectFit="cover" />
          </Box>
        ))}
        <IconButton
          icon={<ChevronRightIcon fontSize={"2xl"} />}
          borderRadius={"full"}
          size={"sm"}
          onClick={handleNextImage}
          isDisabled={imageIndex >= TabItems.length - 2} // 마지막 이미지일 때 비활성화
        />
      </HStack>
    </VStack>
  );
};
