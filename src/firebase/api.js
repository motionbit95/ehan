// 상수(고정적인 값)
export const BUILD_MODE = "production"; // 배포 시 이 부분을 production으로 변경
export const SERVER_URL =
  BUILD_MODE === "dev"
    ? "https://port-0-nicepay-module-17xco2nlszge3vt.sel5.cloudtype.app"
    : "https://port-0-nicepay-test-17xco2nlszge3vt.sel5.cloudtype.app";
export const PG_CLIENT_ID = "S2_af4543a0be4d49a98122e01ec2059a56";
// const secretKey = "9eb85607103646da9f9c02b128f2e5ee";

export function debug(...args) {
  if (BUILD_MODE === "production") return;
  const stackTrace = new Error().stack;
  const caller = stackTrace.split("\n")[2].match(/\s+at\s+(\S+)/)[1]; // 호출자 이름 추출
  console.log(
    `%c${new Date().toLocaleTimeString()} \n%c[${caller}] \n%c${args.join("")}`,
    "color: white; font-weight: bold",
    "color: skyblue; font-weight: bold",
    "color: white; font-weight: bold"
  );
}
