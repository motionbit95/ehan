import { Select } from "@chakra-ui/react";
import React from "react";
import { districts } from "../firebase/api";

function RDepth2({ depth1, ...props }) {
  return (
    <Select
      {...props}
      _disabled={{ opacity: 1, pointerEvents: "none", bgColor: "#f5f5f5" }}
      name="shop_depth2"
      onChange={(e) => props.onChangeDepth2(e.target.value)}
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
