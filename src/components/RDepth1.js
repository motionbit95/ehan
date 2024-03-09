import { Select } from "@chakra-ui/react";
import React from "react";
import { cities } from "../firebase/api";

function RDepth1(props) {
  return (
    <Select
      {...props}
      // defaultValue={props.defaultValue}
      _disabled={{ opacity: 1, pointerEvents: "none", bgColor: "#f5f5f5" }}
      name="shop_depth1"
      onChange={(e) => {
        if (props.onChangeDepth1) props.onChangeDepth1(e.target.value);
      }}
    >
      <option value="">전체</option>
      {cities.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </Select>
  );
}

export default RDepth1;
