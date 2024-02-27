import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPayment } from "../../firebase/firebase_func";

function Result(props) {
  const location = useLocation();
  const payresult = decodeURIComponent(location.search);
  const data = JSON.parse(payresult.substring(1).replace("data=", ""));

  useEffect(() => {
    console.log(data);
    // 주문번호로 문서를 찾은 다음 결제 정보 업데이트
    getOrder();
  }, []);

  const getOrder = async () => {
    const order = await getPayment(data.orderId);
    console.log(order);
  };

  return (
    <div>
      {" "}
      <div
        style={{
          backgroundColor: "white",
          alignItems: "center",
          height: "5vh",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>뒤로가기</div>
        <div>주문내역</div>
        <div>홈으로</div>
      </div>
      <div>{data.resultCode === "0000" ? "결제가 완료되었습니다." : ""}</div>
      <div>주문일시 : {data.ediDate}</div>
      <div>주문번호 : {data.orderId}</div>
    </div>
  );
}

export default Result;
