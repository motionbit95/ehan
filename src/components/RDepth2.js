import { Select } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { districts } from "../firebase/api";
import { useGlobalState } from "../GlobalState";

function RDepth2({ depth1, ...props }) {
  const [depth2, setDepth2] = React.useState("");
  const { admin } = useGlobalState();

  useEffect(() => {
    console.log(admin.permission);
    if (props.defaultValue) setDepth2(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <Select
      {...props}
      disabled={admin.permission !== "supervisor"}
      value={depth2}
      _disabled={{ opacity: 1, pointerEvents: "none", bgColor: "#f5f5f5" }}
      name="shop_depth2"
      onChange={(e) => {
        if (props.onChangeDepth2) props.onChangeDepth2(e.target.value);
      }}
    >
      <option value="">전체</option>
      {districts[depth1 ? depth1 : "서울특별시"].map((district, index) => (
        <option key={index} value={district}>
          {district}
        </option>
      ))}
    </Select>
  );
}

export default RDepth2;
