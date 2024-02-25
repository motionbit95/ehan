import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase_conf";
import { postCart } from "../../firebase/firebase_func";

function Menu(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setMenu(location.state);
  }, []);

  const addCart = () => {
    // navigate(`/cart/${auth.currentUser.uid}`);
    if (window.confirm("장바구니에 추가하시겠습니까?")) {
      postCart({ ...location.state, uid: auth.currentUser.uid, count: count });
    }
  };
  return (
    <div
      id="container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1vh",
      }}
    >
      <div
        id="banner"
        style={{
          height: "30vh",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#8c8c8c",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "5vh",
            margin: "1vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <div onClick={() => navigate(-1)}>뒤로가기</div>
          <div
            onClick={() => navigate(`/cart`, { state: auth.currentUser.uid })}
          >
            장바구니
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          gap: "1vh",
        }}
      >
        <div>{menu?.product_name}</div>
        <div>{menu?.product_price}원</div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "1vh",
        }}
      >
        <div>수량</div>
        <div style={{ display: "flex", gap: "1vh" }}>
          <div onClick={() => setCount(count - 1)}>-</div>
          <div>{count}</div>
          <div onClick={() => setCount(count + 1)}>+</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "2vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button style={{ width: "90%" }} onClick={addCart}>
          {menu?.product_price * count}원 담기
        </Button>
      </div>
    </div>
  );
}

export default Menu;
