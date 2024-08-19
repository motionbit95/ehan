import { Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { cities } from "../firebase/api";
import { useGlobalState } from "../GlobalState";

function RDepth1(props) {
  const [depth1, setDepth1] = useState("");
  const { admin } = useGlobalState();

  useEffect(() => {
    console.log(admin.permission);
    if (props.defaultValue) setDepth1(props.defaultValue);
  }, [props.defaultValue]);
  return (
    <Select
      {...props}
      // defaultValue={props.defaultValue}
      isDisabled={admin.permission !== "supervisor"}
      _disabled={{ opacity: 1, pointerEvents: "none", bgColor: "#f5f5f5" }}
      name="shop_depth1"
      onChange={(e) => {
        if (props.onChangeDepth1) props.onChangeDepth1(e.target.value);
      }}
      value={depth1}
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
