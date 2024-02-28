import { Select } from "@chakra-ui/react";
import React from "react";

function RDepth2(props) {
  return (
    <Select name="shop_depth2" placeholder="중분류를 선택해주세요.">
      <option value="중분류 1">중분류 1</option>
      <option value="중분류 2">중분류 2</option>
      <option value="중분류 3">중분류 3</option>
    </Select>
  );
}

export default RDepth2;
