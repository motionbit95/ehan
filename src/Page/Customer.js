import {
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChosunBg, ChosunGu } from "../Component/Text";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
} from "@chakra-ui/icons";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebase_conf";

const Customer = () => {
  const [index, setIndex] = useState(0);
  const [spotList, setSpotList] = useState([]);

  // 4초마다 탭 인덱스를 증가시키는 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % spotList.length);
    }, 4000);

    // 컴포넌트가 언마운트될 때 인터벌 클리어
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (idx) => {
    setIndex(idx);
  };

  useEffect(() => {
    const getSpot = async () => {
      const q = query(collection(db, "SPOT"));

      const querySnapshot = await getDocs(q);

      const tempList = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        tempList.push({ ...doc.data(), doc_id: doc.id });
        setSpotList(tempList);
      });
    };

    getSpot();
  }, []);

  return (
    <Stack
      // id="customer"
      minHeight="100vh"
      overflow={"hidden"}
      css={{
        "@supports (-webkit-appearance:none) and (stroke-color: transparent)": {
          minHeight: "-webkit-fill-available",
        },
      }}
      justify={"center"}
      spacing={12}
    >
      <Stack px={4} spacing={0}>
        <ChosunBg fontSize={"36px"}>설치 지점</ChosunBg>
        <ChosunGu
          fontSize={{ base: "12px", md: "14px" }}
          whiteSpace={{ base: "pre-line", md: "normal" }}
        >
          {`주변 설치 지점을 검색하여 
          전국 어디서든 레드스위치를 경험할 수 있습니다.`}
        </ChosunGu>
      </Stack>
      <TabColumn
        index={index}
        handleTabClick={handleTabClick}
        setIndex={setIndex}
        TabItems={spotList}
      />
      <Stack align={"center"}>
        <ChosunGu decoration={"underline"} fontSize={"14px"} cursor={"pointer"}>
          설치지점 검색하기
        </ChosunGu>
      </Stack>
    </Stack>
  );
};

export default Customer;

const TabColumn = ({ index, handleTabClick, setIndex, TabItems }) => {
  const visibleTabs = 3; // 한 번에 보여질 Tab 수
  const visibleImages = 2; // 한 번에 보여질 이미지 수

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % TabItems.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [setIndex, TabItems.length]);

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? TabItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % TabItems.length);
  };

  // 항상 3개의 Tab을 보여주는 로직, 배열 순환 고려
  const getVisibleTabs = (index, items, count) => {
    const totalItems = items.length;
    let visibleTabs = [];

    for (let i = 0; i < count; i++) {
      visibleTabs.push(items[(index + i) % totalItems]);
    }

    return visibleTabs;
  };

  // 항상 2개의 이미지를 보여주는 로직
  const getVisibleImages = (index, items, count) => {
    const totalItems = items.length;
    let visibleImages = [];

    for (let i = 0; i < count; i++) {
      visibleImages.push(items[(index + i) % totalItems]);
    }

    return visibleImages;
  };

  // 현재 보여질 Tab과 이미지들을 가져옴
  const visibleTabItems = getVisibleTabs(index, TabItems, visibleTabs);
  const visibleImageItems = getVisibleImages(index, TabItems, visibleImages);

  return (
    <Tabs variant={"unstyled"} index={index} onChange={setIndex}>
      <TabList justifyContent={"center"}>
        <HStack align={"center"} spacing={0}>
          <IconButton
            icon={<ChevronLeftIcon />}
            borderRadius={"full"}
            size={"xs"}
            onClick={handlePrev}
          />
          {visibleTabItems.map((item, idx) => (
            <Tab
              // key={item.id}
              _selected={{ color: "blue.500" }}
              onClick={() => handleTabClick(idx)}
            >
              <Stack align={"center"}>
                <Box
                  boxSize={"72px"}
                  dir={"column"}
                  borderRadius={"full"}
                  overflow={"hidden"}
                  bgColor={"white"}
                >
                  {/* <Image src={item.spot_logo} w={"full"} h={"full"} /> */}
                </Box>
              </Stack>
            </Tab>
          ))}
          <IconButton
            icon={<ChevronRightIcon />}
            borderRadius={"full"}
            size={"xs"}
            onClick={handleNext}
          />
        </HStack>
      </TabList>

      {/* 두 개씩 이미지 출력 */}
      <HStack justify="center" spacing={4} pt={4}>
        {visibleImageItems.map((item) => (
          <Box w={"160px"} h={"160px"}>
            <Image
              // src={item.content}
              bgColor={"white"}
              w={"full"}
              h={"full"}
            />
          </Box>
        ))}
      </HStack>
    </Tabs>
  );
};
