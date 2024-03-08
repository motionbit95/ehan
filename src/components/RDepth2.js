import { Select } from "@chakra-ui/react";
import React from "react";
import { districts } from "../firebase/api";

function RDepth2({ depth1, ...props }) {
  return (
    <Select
      {...props}
      name="shop_depth2"
      placeholder="전체"
      onChange={(e) => props.onChangeDepth2(e.target.value)}
    >
      {districts[depth1 ? depth1 : "서울특별시"].map((district) => (
        <option value={district}>{district}</option>
      ))}
    </Select>
  );
}

export default RDepth2;
