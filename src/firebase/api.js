// 상수(고정적인 값)
export const BUILD_MODE = "dev"; // 배포 시 이 부분을 production으로 변경
export const SERVER_URL =
  BUILD_MODE === "dev"
    ? "https://port-0-nicepay-module-17xco2nlszge3vt.sel5.cloudtype.app"
    : "https://port-0-nicepay-test-17xco2nlszge3vt.sel5.cloudtype.app";
export const PG_CLIENT_ID = "S2_af4543a0be4d49a98122e01ec2059a56";
// const secretKey = "9eb85607103646da9f9c02b128f2e5ee";

export function debug(...args) {
  if (BUILD_MODE === "production") return;
  const stackTrace = new Error().stack;
  try {
    const caller = stackTrace?.split("\n")[2].match(/\s+at\s+(\S+)/)[1]; // 호출자 이름 추출
    console.log(
      `%c${new Date().toLocaleTimeString()} \n%c[${caller}] \n%c${args.join(
        ""
      )}`,
      "color: white; font-weight: bold",
      "color: skyblue; font-weight: bold",
      "color: white; font-weight: bold"
    );
  } catch (e) {
    return;
  }
}

export function isNumber(e) {
  if (!/[0-9,]/.test(e.key) && e.key !== "Backspace") {
    e.preventDefault();
    alert("숫자만 입력해주세요");
    return;
  }
}
export function addCommas(number) {
  // 숫자를 문자열로 변환하여 뒤집기
  let numberStr = String(number).split("").reverse().join("");
  let result = "";

  // 세 자리씩 콤마를 추가하면서 결과 문자열 생성
  for (let i = 0; i < numberStr.length; i += 3) {
    result += numberStr.slice(i, i + 3) + ",";
  }

  // 마지막에 콤마가 추가되므로 제거하고 다시 뒤집기
  result = result.split("").reverse().join("").replace(/^,/, "");

  return result;
}

export const timestampToDate = (timestamp) => {
  // Convert Firestore timestamp to milliseconds

  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

  // Convert milliseconds to a Date object
  const date = new Date(milliseconds);

  // Format the date as a string (adjust format as needed)
  const dateString = date.toLocaleDateString(); // Example format, adjust as needed

  // console.log(dateString); // Output the formatted date string

  return dateString;
};

export function getCurrentTime() {
  return new Date();
}

export function convertFirestoreTimestampToDate(timestamp) {
  if (!timestamp) return new Date();
  const milliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
  return new Date(milliseconds);
}

export function compareTimestampWithCurrentTime(firestoreTimestamp) {
  const firestoreDate = convertFirestoreTimestampToDate(firestoreTimestamp);
  const currentDate = getCurrentTime();

  // 두 날짜의 차이 계산 (밀리초 단위)
  const timeDifference = currentDate - firestoreDate;

  // 차이를 표시하는 문자열 생성
  if (timeDifference < 60 * 1000) {
    return `${Math.round(timeDifference / 1000)}초 전`;
  } else if (timeDifference < 60 * 60 * 1000) {
    return `${Math.round(timeDifference / (60 * 1000))}분 전`;
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    return `${Math.round(timeDifference / (60 * 60 * 1000))}시간 전`;
  } else {
    // 다양한 형식으로 날짜 표시 가능
    const options = { year: "numeric", month: "long", day: "numeric" };
    return firestoreDate.toLocaleDateString("ko-Kr", options);
  }
}

export function getRandomColor() {
  // 16진수 색상 코드 생성
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 지역명 데이터
export const cities = [
  "강원도",
  "경기도",
  "경상남도",
  "경상북도",
  "광주광역시",
  "대구광역시",
  "대전광역시",
  "부산광역시",
  "서울특별시",
  "세종특별자치시",
  "울산광역시",
  "인천광역시",
  "전라남도",
  "전라북도",
  "제주특별자치도",
  "충청남도",
  "충청북도",
];
export const districts = {
  강원도: [
    "강릉시",
    "고성군",
    "동해시",
    "삼척시",
    "속초시",
    "양구군",
    "양양군",
    "영월군",
    "원주시",
    "인제군",
    "정선군",
    "철원군",
    "춘천시",
    "태백시",
    "평창군",
    "홍천군",
    "화천군",
    "횡성군",
  ],
  경기도: [
    "가평군",
    "고양시 덕양구",
    "고양시 일산동구",
    "고양시 일산서구",
    "과천시",
    "광명시",
    "광주시",
    "구리시",
    "군포시",
    "김포시",
    "남양주시",
    "동두천시",
    "부천시",
    "성남시 분당구",
    "성남시 수정구",
    "성남시 중원구",
    "수원시 권선구",
    "수원시 영통구",
    "수원시 장안구",
    "수원시 팔달구",
    "시흥시",
    "안산시 단원구",
    "안산시 상록구",
    "안성시",
    "안양시 동안구",
    "안양시 만안구",
    "양주시",
    "양평군",
    "여주시",
    "연천군",
    "오산시",
    "용인시 기흥구",
    "용인시 수지구",
    "용인시 처인구",
    "의왕시",
    "의정부시",
    "이천시",
    "파주시",
    "평택시",
    "포천시",
    "하남시",
    "화성시",
  ],
  경상남도: [
    "거제시",
    "거창군",
    "고성군",
    "김해시",
    "남해군",
    "밀양시",
    "사천시",
    "산청군",
    "양산시",
    "의령군",
    "진주시",
    "창녕군",
    "창원시 마산합포구",
    "창원시 마산회원구",
    "창원시 성산구",
    "창원시 의창구",
    "창원시 진해구",
    "통영시",
    "하동군",
    "함안군",
    "함양군",
    "합천군",
  ],
  경상북도: [
    "경산시",
    "경주시",
    "고령군",
    "구미시",
    "군위군",
    "김천시",
    "문경시",
    "봉화군",
    "상주시",
    "성주군",
    "안동시",
    "영덕군",
    "영양군",
    "영주시",
    "영천시",
    "예천군",
    "울릉군",
    "울진군",
    "의성군",
    "청도군",
    "청송군",
    "칠곡군",
    "포항시 남구",
    "포항시 북구",
  ],
  광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
  대구광역시: [
    "남구",
    "달서구",
    "달성군",
    "동구",
    "북구",
    "서구",
    "수성구",
    "중구",
  ],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  부산광역시: [
    "강서구",
    "금정구",
    "기장군",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
  ],
  서울특별시: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  세종특별자치시: [],
  울산광역시: ["남구", "동구", "북구", "울주군", "중구"],
  인천광역시: [
    "강화군",
    "계양구",
    "남동구",
    "동구",
    "미추홀구",
    "부평구",
    "서구",
    "연수구",
    "옹진군",
    "중구",
  ],
  전라남도: [
    "강진군",
    "고흥군",
    "곡성군",
    "광양시",
    "구례군",
    "나주시",
    "담양군",
    "목포시",
    "무안군",
    "보성군",
    "순천시",
    "신안군",
    "여수시",
    "영광군",
    "영암군",
    "완도군",
    "장성군",
    "장흥군",
    "진도군",
    "함평군",
    "해남군",
    "화순군",
  ],
  전라북도: [
    "고창군",
    "군산시",
    "김제시",
    "남원시",
    "무주군",
    "부안군",
    "순창군",
    "완주군",
    "익산시",
    "임실군",
    "장수군",
    "전주시 덕진구",
    "전주시 완산구",
    "정읍시",
    "진안군",
  ],
  제주특별자치도: ["서귀포시", "제주시"],
  충청남도: [
    "계룡시",
    "공주시",
    "금산군",
    "논산시",
    "당진시",
    "보령시",
    "부여군",
    "서산시",
    "서천군",
    "아산시",
    "예산군",
    "천안시 동남구",
    "천안시 서북구",
    "청양군",
    "태안군",
    "홍성군",
  ],
  충청북도: [
    "괴산군",
    "단양군",
    "보은군",
    "영동군",
    "옥천군",
    "음성군",
    "제천시",
    "증평군",
    "진천군",
    "청주시 상당구",
    "청주시 서원구",
    "청주시 청원구",
    "청주시 흥덕구",
    "충주시",
  ],
};
