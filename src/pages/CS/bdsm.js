import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Select,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Logo from "../../components/Logo";
import { ChevronRightIcon, LinkIcon } from "@chakra-ui/icons";
import { BsShare } from "react-icons/bs";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { data } from "../../bdms";

function BDSM(props) {
  const [score, setScore] = useState({
    마스터: 0,
    슬레이브: 0,
    헌터: 0,
    프레이: 0,
    브랫테이머: 0,
    브랫: 0,
    오너: 0,
    펫: 0,
    대디: 0,
    리틀: 0,
    사디스트: 0,
    마조히스트: 0,
    스팽커: 0,
    스팽키: 0,
    디그레이더: 0,
    디그레이디: 0,
    리거: 0,
    로프버니: 0,
    도미넌트: 0,
    서브미시브: 0,
    스위치: 0,
    바닐라: 0,
  });
  const [step, setStep] = useState(0);
  const [idx, setIndex] = useState(0);
  const submitInfo = (e) => {
    e.preventDefault();
    console.log({
      [e.target[0].name]: e.target[0].value,
      [e.target[1].name]: e.target[1].value,
      [e.target[2].name]: e.target[2].value,
    });
    setStep(1);
  };

  function clip() {
    var url = "";
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    url = window.location.href;
    textarea.value = url;
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("링크가 복사되었습니다.");
  }

  function calculate(item, index) {
    console.log("calculate", item, index);
    let temp = score;
    if (!(index < 0)) {
      if (item.score[index].마스터) {
        console.log("마스터", item.score[index].마스터);
        temp.마스터 += item.score[index].마스터;
      }

      if (item.score[index].슬레이브) {
        console.log("슬레이브", item.score[index].슬레이브);
        temp.슬레이브 += item.score[index].슬레이브;
      }

      if (item.score[index].헌터) {
        console.log("헌터", item.score[index].헌터);
        temp.헌터 += item.score[index].헌터;
      }

      if (item.score[index].프레이) {
        console.log("프레이", item.score[index].프레이);
        temp.프레이 += item.score[index].프레이;
      }

      if (item.score[index].브랫테이머) {
        console.log("브랫테이머", item.score[index].브랫테이머);
        temp.브랫테이머 += item.score[index].브랫테이머;
      }

      if (item.score[index].브랫) {
        console.log("브랫", item.score[index].브랫);
        temp.브랫 += item.score[index].브랫;
      }

      if (item.score[index].오너) {
        console.log("오너", item.score[index].오너);
        temp.오너 += item.score[index].오너;
      }

      if (item.score[index].펫) {
        console.log("펫", item.score[index].펫);
        temp.펫 += item.score[index].펫;
      }

      if (item.score[index].대디) {
        console.log("대디", item.score[index].대디);
        temp.대디 += item.score[index].대디;
      }

      if (item.score[index].리틀) {
        console.log("리틀", item.score[index].리틀);
        temp.리틀 += item.score[index].리틀;
      }

      if (item.score[index].사디스트) {
        console.log("사디스트", item.score[index].사디스트);
        temp.사디스트 += item.score[index].사디스트;
      }

      if (item.score[index].마조히스트) {
        console.log("마조히스트", item.score[index].마조히스트);
        temp.마조히스트 += item.score[index].마조히스트;
      }

      if (item.score[index].스팽커) {
        console.log("스팽커", item.score[index].스팽커);
        temp.스팽커 += item.score[index].스팽커;
      }

      if (item.score[index].스팽키) {
        console.log("스팽키", item.score[index].스팽키);
        temp.스팽키 += item.score[index].스팽키;
      }

      if (item.score[index].디그레이더) {
        console.log("디그레이더", item.score[index].디그레이더);
        temp.디그레이더 += item.score[index].디그레이더;
      }

      if (item.score[index].디그레이디) {
        console.log("디그레이디", item.score[index].디그레이디);
        temp.디그레이디 += item.score[index].디그레이디;
      }

      if (item.score[index].리거) {
        console.log("리거", item.score[index].리거);
        temp.리거 += item.score[index].리거;
      }

      if (item.score[index].로프버니) {
        console.log("로프버니", item.score[index].로프버니);
        temp.로프버니 += item.score[index].로프버니;
      }

      if (item.score[index].도미넌트) {
        console.log("도미넌트", item.score[index].도미넌트);
        temp.도미넌트 += item.score[index].도미넌트;
      }

      if (item.score[index].서브미시브) {
        console.log("서브미시브", item.score[index].서브미시브);
        temp.서브미시브 += item.score[index].서브미시브;
      }

      if (item.score[index].스위치) {
        console.log("스위치", item.score[index].스위치);
        temp.스위치 += item.score[index].스위치;
      }

      if (item.score[index].바닐라) {
        console.log("바닐라", item.score[index].바닐라);
        temp.바닐라 += item.score[index].바닐라;
      }

      console.log(temp);
      setScore(temp);
    }
    setIndex(idx + 1);
  }

  return (
    <Stack justifyContent={"space-between"} minH={window.innerHeight}>
      <HStack p={{ base: "1vh", md: "2vh" }} id="header">
        <Logo />
        <Text fontFamily={"seolleimcool-SemiBold"}>레드스위치</Text>
      </HStack>
      {step === 0 && (
        <Container maxW="container.sm">
          <Stack>
            <Image src={require("../../assets/bdsm.png")} />
            <form onSubmit={submitInfo}>
              <VStack>
                <FormControl>
                  <HStack>
                    <FormLabel whiteSpace={"nowrap"} w={"100px"}>
                      성별
                    </FormLabel>
                    <Select
                      name="gender"
                      colorScheme="red"
                      bgColor={"white"}
                      onChange={(e) => console.log(e.target.value)}
                      _focus={{
                        boxShadow: "none",
                        borderColor: "red.400",
                        borderWidth: "2px",
                        bg: "white",
                        outline: "none",
                      }}
                    >
                      <option value={"남자"}>남자</option>
                      <option value={"여자"}>여자</option>
                      <option value={"트렌스젠더(MTF)"}>트렌스젠더(MTF)</option>
                      <option value={"트렌스젠더(FTM)"}>트렌스젠더(FTM)</option>
                      <option value={"기타"}>기타</option>
                    </Select>
                  </HStack>
                </FormControl>
                <FormControl>
                  <HStack>
                    <FormLabel whiteSpace={"nowrap"} w={"100px"}>
                      연령
                    </FormLabel>
                    <Select
                      name="age"
                      colorScheme="red"
                      bgColor={"white"}
                      onChange={(e) => console.log(e.target.value)}
                      _focus={{
                        boxShadow: "none",
                        borderColor: "red.400",
                        borderWidth: "2px",
                        bg: "white",
                        outline: "none",
                      }}
                    >
                      <option value={"19세 이하"}>19세 이하</option>
                      <option value={"20세~22세"}>20세~22세</option>
                      <option value={"23세~26세"}>23세~26세</option>
                      <option value={"27세~29세"}>27세~29세</option>
                      <option value={"30세~32세"}>30세~32세</option>
                      <option value={"33세~36세"}>33세~36세</option>
                      <option value={"37세~39세"}>37세~39세</option>
                      <option value={"40세~45세"}>40세~45세</option>
                      <option value={"46세~49세"}>46세~49세</option>
                      <option value={"50세 이상"}>50세 이상</option>
                    </Select>
                  </HStack>
                </FormControl>
                <FormControl>
                  <HStack>
                    <FormLabel whiteSpace={"nowrap"} w={"100px"}>
                      성적취향
                    </FormLabel>
                    <Select
                      name="type"
                      colorScheme="red"
                      bgColor={"white"}
                      onChange={(e) => console.log(e.target.value)}
                      _focus={{
                        boxShadow: "none",
                        borderColor: "red.400",
                        borderWidth: "2px",
                        bg: "white",
                        outline: "none",
                      }}
                    >
                      <option value={"이성애자"}>이성애자</option>
                      <option value={"동성애자"}>동성애자</option>
                      <option value={"양성애자"}>양성애자</option>
                      <option value={"기타"}>기타</option>
                    </Select>
                  </HStack>
                </FormControl>
                <Button
                  colorScheme="red"
                  w={"100%"}
                  size={"lg"}
                  type="submit"
                  rightIcon={<ChevronRightIcon boxSize={"32px"} />}
                >
                  시작하기
                </Button>
              </VStack>
            </form>
            <HStack justifyContent={"flex-end"}>
              <IconButton
                onClick={() => clip()}
                icon={<BsShare size={"24px"} />}
              />
            </HStack>
          </Stack>
        </Container>
      )}

      {step === 1 && (
        <Container>
          <Carousel
            showArrows={false}
            // centerMode={true}
            // centerSlidePercentage={100}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            selectedItem={idx}
            onChange={(i) => setIndex(i)}
            swipeable={false}
          >
            {data.map((item, index) => (
              <Stack key={index} p={{ base: "10px", md: "20px" }}>
                <Text fontSize={"xl"}>
                  <strong style={{ color: "red" }}>{index + 1}</strong> /{" "}
                  {data.length}
                </Text>
                <FormControl>
                  <FormLabel fontSize={"lg"} fontWeight={"bold"}>
                    {item.question}
                  </FormLabel>
                </FormControl>
                <Stack>
                  <Button
                    onClick={() => calculate(item, 0)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    동의
                  </Button>
                  <Button
                    onClick={() => calculate(item, 1)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    대체적으로 동의
                  </Button>
                  <Button
                    onClick={() => calculate(item, 2)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    약간 동의
                  </Button>
                  <Button
                    onClick={() => calculate(item, -1)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    모르겠음
                  </Button>
                  <Button
                    onClick={() => calculate(item, 3)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    약간 비동의
                  </Button>
                  <Button
                    onClick={() => calculate(item, 4)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    대체적으로 비동의
                  </Button>
                  <Button
                    onClick={() => calculate(item, 5)}
                    colorScheme="red"
                    variant={"outline"}
                  >
                    비동의
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Carousel>
        </Container>
      )}

      <Flex
        alignItems={"flex-start"}
        justifyContent={"flex-end"}
        w={"100%"}
        h={{ base: "24vw", md: "16vw" }}
        bgColor={"#d9d9d9"}
        p={{ base: "10px", md: "20px" }}
      >
        {/* <Tag colorScheme="red">AD</Tag> */}
      </Flex>
    </Stack>
  );
}

export default BDSM;
