import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Heading,
  IconButton,
  Image,
  Select,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { ChevronRightIcon, LinkIcon } from "@chakra-ui/icons";
import { BsShare } from "react-icons/bs";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { data } from "../../bdms";
import { doc, getDoc } from "firebase/firestore";
import { fetchProducts } from "../../firebase/firebase_func";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function BDSM(props) {
  const navigate = useNavigate();
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
  const [yourBDSM, setYourBDSM] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [products, setProducts] = useState([]);

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
    // console.log("calculate", item, index);
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

      setScore(temp);
    } else {
      if (idx === 12) {
        // 12번 문항에만 예외 적용
        temp.바닐라 += 50;
        setScore(temp);
      }
    }
    setIndex(idx + 1);

    if (idx + 1 >= data.length) {
      console.log("마지막 문항입니다.");
      console.log(temp);

      let maxKey = "";
      let maxValue = -Infinity;

      for (const [key, value] of Object.entries(temp)) {
        if (value > maxValue) {
          maxValue = value;
          maxKey = key;
        }
      }

      console.log(`가장 높은 항목의 이름은 ${maxKey}입니다.`);
      setYourBDSM(maxKey);

      setStep(2);
    } else {
      setIndex(idx + 1);
    }
  }

  useEffect(() => {
    // shop id로 샵 정보를 가지고 오는 함수
    const handleShopInfo = async () => {
      try {
        // 상품 리스트 업데이트
        fetchProducts("PRODUCT", "product_category", "test-shop").then(
          (data) => {
            console.log("상품리스트", data);
            setProducts(data.products);
          }
        );
      } catch (error) {
        console.error("shop id로 샵 정보가져오기 오류 발생:", error);
        // 샵을 못찾았으면 테스트샵으로 이동
        window.location.replace(`/home/test-shop`);
      }
    };

    //컴포넌트가 마운트될 때 shop 정보 가지고오기
    handleShopInfo();
  }, []); // useEffect가 최초 한 번만 실행되도록 빈 배열을 전달합니다.

  const [ogTitle, setOgTitle] = useState("나의 성적 취향은? BDSM 테스트");
  const [ogDescription, setOgDescription] = useState("BDSM 테스트 바로가기");
  const [ogImage, setOgImage] = useState(`%PUBLIC_URL%/type/bdsm.jpg`);

  const handleShareClick = () => {
    setOgTitle("나의 성적 취향은? BDSM 테스트");
    setOgDescription(yourBDSM);
    setOgImage(`%PUBLIC_URL%/type/${yourBDSM}.jpg`);

    const urlToShare = window.location.href;
    navigator.clipboard
      .writeText(urlToShare)
      .then(() => {
        alert("URL has been copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the URL: ", err);
      });
  };

  return (
    <Stack justifyContent={"space-between"} minH={window.innerHeight}>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:url" content="https://redswitch.kr/bdsm" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
      </Helmet>
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
                <Accordion w={"100%"} allowToggle>
                  <AccordionItem w={"100%"} _focus={{ boxShadow: "none" }}>
                    <h2>
                      <AccordionButton>
                        <HStack w={"100%"} justifyContent={"space-between"}>
                          <Checkbox
                            name="permission"
                            colorScheme="red"
                            onChange={(e) => setIsAgree(e.target.checked)}
                          >
                            [필수] 이용약관을 다 읽었습니다.
                          </Checkbox>
                          <AccordionIcon />
                        </HStack>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Text whiteSpace={"pre-line"}>
                        {`- 이 테스트는 성적 행위를 노골적으로 묘사하는문항을 포함하고 있습니다. 이러한 표현에 모멸감이나 혐오감을 느끼는 분들의 이용은 권장하지 않습니다.
   
- 이 테스트의 모든 질문은 당사자간의 완벽한 합의를 바탕으로, 절대적으로 안전하다는 가정 하에 작성 되었습니다.

- 이 테스트의 결과는 개발자의 주관적인 의견이 반영되어 있습니다.

- 테스트 결과에 대해서는 어떠한 의미 부여도 하지 마시고, 반드시 개인적인 참고 용도로만 사용하시기 바랍니다.
   
- 이 테스트를 참고하거나 활용하여 발생한 문제의 관한 책임은 모두 테스트를 이용한 당사자에게 있습니다.`}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <Button
                  isDisabled={!isAgree}
                  colorScheme="red"
                  w={"100%"}
                  size={"lg"}
                  type="submit"
                  rightIcon={<ChevronRightIcon boxSize={"32px"} />}
                >
                  시작하기
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  w={"100%"}
                  onClick={() => navigate("/bdsm/view")}
                >
                  BDSM 성향모두보기
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

      {step === 2 && (
        <Container>
          <Stack spacing={{ base: "10px", md: "20px" }}>
            <Stack>
              <Text>[BDSM 진단] 당신의 BDSM을 진단해드립니다!</Text>
              {/* <Heading>{yourBDSM}</Heading> */}
              <Image src={require(`../../assets/type/${yourBDSM}.jpg`)} />
              <HStack justifyContent={"flex-end"}>
                <IconButton
                  onClick={() => handleShareClick()}
                  icon={<BsShare size={"24px"} />}
                />
              </HStack>
              <Button colorScheme="gray" onClick={() => setStep(0)}>
                다시하기
              </Button>
            </Stack>
            <Stack spacing={{ base: "10px", md: "20px" }}>
              <Heading size={"md"}>내 성향에 맞는 성인용품은?</Heading>
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {products.map((item, index) => (
                  <Image
                    onClick={() => navigate(`/home/test-shop`)}
                    cursor={"pointer"}
                    src={item.product_images[0]}
                    key={index}
                  />
                ))}
              </Grid>
            </Stack>
          </Stack>
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
