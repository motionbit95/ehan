import { Select } from "@chakra-ui/react";
import React from "react";
import { cities } from "../firebase/api";

function RDepth1(props) {
  return (
    <Select
      {...props}
      defaultValue={"서울특별시"}
      name="shop_depth1"
      placeholder="시/도"
      onChange={(e) => props.onChangeDepth1(e.target.value)}
    >
      {cities.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </Select>
  );
}

export default RDepth1;
