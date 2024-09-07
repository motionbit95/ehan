import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChosunBg, ChosunGu } from "../../Component/Text";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase_conf";
import BarChart from "../../components/BarChart";

function BDSM(props) {
  const [gender, setGender] = useState("남자");
  const [age, setAge] = useState("19");
  const [type, setType] = useState("이성애자");
  const [genderResult, setGenderResult] = useState({});
  const [ageResult, setAgeResult] = useState({});
  const [typeResult, setTypeResult] = useState({});
  const [totalResult, setTotalResult] = useState({});

  useEffect(() => {
    const sumResult = {
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
    };
    getDocs(query(collection(db, "BDSM"), where("gender", "==", gender))).then(
      (querySnapshot) => {
        if (querySnapshot.size === 0) {
          setGenderResult(sumResult);
          // alert("해당 데이터가 존재하지 않습니다.");
          return;
        }
        querySnapshot.forEach((doc) => {
          // 점수를 더합니다.
          sumResult.마스터 += doc.data().마스터 > 0 ? doc.data().마스터 : 0;
          sumResult.슬레이브 +=
            doc.data().슬레이브 > 0 ? doc.data().슬레이브 : 0;
          sumResult.헌터 += doc.data().헌터 > 0 ? doc.data().헌터 : 0;
          sumResult.프레이 += doc.data().프레이 > 0 ? doc.data().프레이 : 0;
          sumResult.브랫테이머 +=
            doc.data().브랫테이머 > 0 ? doc.data().브랫테이머 : 0;
          sumResult.브랫 += doc.data().브랫 > 0 ? doc.data().브랫 : 0;
          sumResult.오너 += doc.data().오너 > 0 ? doc.data().오너 : 0;
          sumResult.펫 += doc.data().펫 > 0 ? doc.data().펫 : 0;
          sumResult.대디 += doc.data().대디 > 0 ? doc.data().대디 : 0;
          sumResult.리틀 += doc.data().리틀 > 0 ? doc.data().리틀 : 0;
          sumResult.사디스트 +=
            doc.data().사디스트 > 0 ? doc.data().사디스트 : 0;
          sumResult.마조히스트 +=
            doc.data().마조히스트 > 0 ? doc.data().마조히스트 : 0;
          sumResult.스팽커 += doc.data().스팽커 > 0 ? doc.data().스팽커 : 0;
          sumResult.스팽키 += doc.data().스팽키 > 0 ? doc.data().스팽키 : 0;
          sumResult.디그레이디 +=
            doc.data().디그레이디 > 0 ? doc.data().디그레이디 : 0;
          sumResult.디그레이더 +=
            doc.data().디그레이더 > 0 ? doc.data().디그레이디 : 0;
          sumResult.리거 += doc.data().리거 > 0 ? doc.data().리거 : 0;
          sumResult.로프버니 +=
            doc.data().로프버니 > 0 ? doc.data().로프버니 : 0;
          sumResult.도미넌트 +=
            doc.data().도미넌트 > 0 ? doc.data().도미넌트 : 0;
          sumResult.서브미시브 +=
            doc.data().서브미시브 > 0 ? doc.data().서브미시브 : 0;
          sumResult.스위치 += doc.data().스위치 > 0 ? doc.data().스위치 : 0;
          sumResult.바닐라 += doc.data().바닐라 > 0 ? doc.data().바닐라 : 0;

          console.log(sumResult);
          setGenderResult(sumResult);
        });
      }
    );
  }, [gender]);

  useEffect(() => {
    const sumResult = {
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
    };
    getDocs(query(collection(db, "BDSM"), where("age", "==", age))).then(
      (querySnapshot) => {
        if (querySnapshot.size === 0) {
          setAgeResult(sumResult);
          // alert("해당 데이터가 존재하지 않습니다.");
          return;
        }
        querySnapshot.forEach((doc) => {
          // 점수를 더합니다.
          sumResult.마스터 += doc.data().마스터 > 0 ? doc.data().마스터 : 0;
          sumResult.슬레이브 +=
            doc.data().슬레이브 > 0 ? doc.data().슬레이브 : 0;
          sumResult.헌터 += doc.data().헌터 > 0 ? doc.data().헌터 : 0;
          sumResult.프레이 += doc.data().프레이 > 0 ? doc.data().프레이 : 0;
          sumResult.브랫테이머 +=
            doc.data().브랫테이머 > 0 ? doc.data().브랫테이머 : 0;
          sumResult.브랫 += doc.data().브랫 > 0 ? doc.data().브랫 : 0;
          sumResult.오너 += doc.data().오너 > 0 ? doc.data().오너 : 0;
          sumResult.펫 += doc.data().펫 > 0 ? doc.data().펫 : 0;
          sumResult.대디 += doc.data().대디 > 0 ? doc.data().대디 : 0;
          sumResult.리틀 += doc.data().리틀 > 0 ? doc.data().리틀 : 0;
          sumResult.사디스트 +=
            doc.data().사디스트 > 0 ? doc.data().사디스트 : 0;
          sumResult.마조히스트 +=
            doc.data().마조히스트 > 0 ? doc.data().마조히스트 : 0;
          sumResult.스팽커 += doc.data().스팽커 > 0 ? doc.data().스팽커 : 0;
          sumResult.스팽키 += doc.data().스팽키 > 0 ? doc.data().스팽키 : 0;
          sumResult.디그레이디 +=
            doc.data().디그레이디 > 0 ? doc.data().디그레이디 : 0;
          sumResult.디그레이더 +=
            doc.data().디그레이더 > 0 ? doc.data().디그레이디 : 0;
          sumResult.리거 += doc.data().리거 > 0 ? doc.data().리거 : 0;
          sumResult.로프버니 +=
            doc.data().로프버니 > 0 ? doc.data().로프버니 : 0;
          sumResult.도미넌트 +=
            doc.data().도미넌트 > 0 ? doc.data().도미넌트 : 0;
          sumResult.서브미시브 +=
            doc.data().서브미시브 > 0 ? doc.data().서브미시브 : 0;
          sumResult.스위치 += doc.data().스위치 > 0 ? doc.data().스위치 : 0;
          sumResult.바닐라 += doc.data().바닐라 > 0 ? doc.data().바닐라 : 0;

          console.log(sumResult);
          setAgeResult(sumResult);
        });
      }
    );
  }, [age]);

  useEffect(() => {
    const sumResult = {
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
    };
    getDocs(query(collection(db, "BDSM"), where("type", "==", type))).then(
      (querySnapshot) => {
        if (querySnapshot.size === 0) {
          setTypeResult(sumResult);
          // alert("해당 데이터가 존재하지 않습니다.");
          return;
        }
        querySnapshot.forEach((doc) => {
          // 점수를 더합니다.
          sumResult.마스터 += doc.data().마스터 > 0 ? doc.data().마스터 : 0;
          sumResult.슬레이브 +=
            doc.data().슬레이브 > 0 ? doc.data().슬레이브 : 0;
          sumResult.헌터 += doc.data().헌터 > 0 ? doc.data().헌터 : 0;
          sumResult.프레이 += doc.data().프레이 > 0 ? doc.data().프레이 : 0;
          sumResult.브랫테이머 +=
            doc.data().브랫테이머 > 0 ? doc.data().브랫테이머 : 0;
          sumResult.브랫 += doc.data().브랫 > 0 ? doc.data().브랫 : 0;
          sumResult.오너 += doc.data().오너 > 0 ? doc.data().오너 : 0;
          sumResult.펫 += doc.data().펫 > 0 ? doc.data().펫 : 0;
          sumResult.대디 += doc.data().대디 > 0 ? doc.data().대디 : 0;
          sumResult.리틀 += doc.data().리틀 > 0 ? doc.data().리틀 : 0;
          sumResult.사디스트 +=
            doc.data().사디스트 > 0 ? doc.data().사디스트 : 0;
          sumResult.마조히스트 +=
            doc.data().마조히스트 > 0 ? doc.data().마조히스트 : 0;
          sumResult.스팽커 += doc.data().스팽커 > 0 ? doc.data().스팽커 : 0;
          sumResult.스팽키 += doc.data().스팽키 > 0 ? doc.data().스팽키 : 0;
          sumResult.디그레이디 +=
            doc.data().디그레이디 > 0 ? doc.data().디그레이디 : 0;
          sumResult.디그레이더 +=
            doc.data().디그레이더 > 0 ? doc.data().디그레이디 : 0;
          sumResult.리거 += doc.data().리거 > 0 ? doc.data().리거 : 0;
          sumResult.로프버니 +=
            doc.data().로프버니 > 0 ? doc.data().로프버니 : 0;
          sumResult.도미넌트 +=
            doc.data().도미넌트 > 0 ? doc.data().도미넌트 : 0;
          sumResult.서브미시브 +=
            doc.data().서브미시브 > 0 ? doc.data().서브미시브 : 0;
          sumResult.스위치 += doc.data().스위치 > 0 ? doc.data().스위치 : 0;
          sumResult.바닐라 += doc.data().바닐라 > 0 ? doc.data().바닐라 : 0;

          console.log(sumResult);
          setTypeResult(sumResult);
        });
      }
    );
  }, [type]);

  useEffect(() => {
    const sumResult = {
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
    };
    getDocs(query(collection(db, "BDSM"))).then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        // alert("해당 데이터가 존재하지 않습니다.");
        setTotalResult(sumResult);
        return;
      }
      querySnapshot.forEach((doc) => {
        // 점수를 더합니다.
        sumResult.마스터 += doc.data().마스터 > 0 ? doc.data().마스터 : 0;
        sumResult.슬레이브 += doc.data().슬레이브 > 0 ? doc.data().슬레이브 : 0;
        sumResult.헌터 += doc.data().헌터 > 0 ? doc.data().헌터 : 0;
        sumResult.프레이 += doc.data().프레이 > 0 ? doc.data().프레이 : 0;
        sumResult.브랫테이머 +=
          doc.data().브랫테이머 > 0 ? doc.data().브랫테이머 : 0;
        sumResult.브랫 += doc.data().브랫 > 0 ? doc.data().브랫 : 0;
        sumResult.오너 += doc.data().오너 > 0 ? doc.data().오너 : 0;
        sumResult.펫 += doc.data().펫 > 0 ? doc.data().펫 : 0;
        sumResult.대디 += doc.data().대디 > 0 ? doc.data().대디 : 0;
        sumResult.리틀 += doc.data().리틀 > 0 ? doc.data().리틀 : 0;
        sumResult.사디스트 += doc.data().사디스트 > 0 ? doc.data().사디스트 : 0;
        sumResult.마조히스트 +=
          doc.data().마조히스트 > 0 ? doc.data().마조히스트 : 0;
        sumResult.스팽커 += doc.data().스팽커 > 0 ? doc.data().스팽커 : 0;
        sumResult.스팽키 += doc.data().스팽키 > 0 ? doc.data().스팽키 : 0;
        sumResult.디그레이디 +=
          doc.data().디그레이디 > 0 ? doc.data().디그레이디 : 0;
        sumResult.디그레이더 +=
          doc.data().디그레이더 > 0 ? doc.data().디그레이디 : 0;
        sumResult.리거 += doc.data().리거 > 0 ? doc.data().리거 : 0;
        sumResult.로프버니 += doc.data().로프버니 > 0 ? doc.data().로프버니 : 0;
        sumResult.도미넌트 += doc.data().도미넌트 > 0 ? doc.data().도미넌트 : 0;
        sumResult.서브미시브 +=
          doc.data().서브미시브 > 0 ? doc.data().서브미시브 : 0;
        sumResult.스위치 += doc.data().스위치 > 0 ? doc.data().스위치 : 0;
        sumResult.바닐라 += doc.data().바닐라 > 0 ? doc.data().바닐라 : 0;

        console.log(sumResult);
        setTotalResult(sumResult);
      });
    });
  }, []);

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
        <ChosunBg fontSize={{ base: "16px", md: "24px" }}>BDSM 결과</ChosunBg>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          <Card>
            <CardHeader>
              <HStack justify={"space-between"}>
                <ChosunGu>성별별 통계</ChosunGu>
                <Select
                  fontFamily={"ChosunGu"}
                  maxW={"200px"}
                  defaultValue="남자"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                  <option value="트렌스젠더(MTF)">트렌스젠더(MTF)</option>
                  <option value="트렌스젠더(FTM)">트렌스젠더(FTM)</option>
                  <option value="기타">기타</option>
                </Select>
              </HStack>
            </CardHeader>
            <CardBody>
              <BarChart color={"#FFCC00"} dataset={genderResult} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <HStack justify={"space-between"}>
                <ChosunGu>연령별 통계</ChosunGu>
                <Select
                  fontFamily={"ChosunGu"}
                  maxW={"200px"}
                  defaultValue="19세 이하"
                  onChange={(e) => setAge(e.target.value)}
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
            </CardHeader>
            <CardBody>
              <BarChart color={"#00B2FF"} dataset={ageResult} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <HStack justify={"space-between"}>
                <ChosunGu>취향별 통계</ChosunGu>
                <Select
                  fontFamily={"ChosunGu"}
                  maxW={"200px"}
                  defaultValue="이성애자"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value={"이성애자"}>이성애자</option>
                  <option value={"동성애자"}>동성애자</option>
                  <option value={"양성애자"}>양성애자</option>
                  <option value={"기타"}>기타</option>
                </Select>
              </HStack>
            </CardHeader>
            <CardBody>
              <BarChart color={"#00C3BA"} dataset={typeResult} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <HStack justify={"space-between"}>
                <ChosunGu>전체 통계</ChosunGu>
              </HStack>
            </CardHeader>
            <CardBody>
              <BarChart color={"#FF3CA2"} dataset={totalResult} />
            </CardBody>
          </Card>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}

export default BDSM;
