import { Select } from "@chakra-ui/react";
import React from "react";

function RDepth1(props) {
  return (
    <Select name="shop_depth1" placeholder="대분류를 선택해주세요.">
      <option value="대분류 1">대분류 1</option>
      <option value="대분류 2">대분류 2</option>
      <option value="대분류 3">대분류 3</option>
    </Select>
  );
}

export default RDepth1;
