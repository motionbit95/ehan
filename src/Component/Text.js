import { Text } from "@chakra-ui/react";
import React from "react";

export function ChosunGu(props) {
  return (
    <Text {...props} fontFamily={"ChosunGu"}>
      {props.children}
    </Text>
  );
}

export function ChosunBg(props) {
  return (
    <Text {...props} fontFamily={"ChosunBg"}>
      {props.children}
    </Text>
  );
}

export function ONEMobilePOP(props) {
  return (
    <Text
      {...props}
      fontFamily={"ONE-Mobile-POP"}
      textShadow={
        "1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff"
      }
    >
      {props.children}
    </Text>
  );
}

export function Jejumyeongjo(props) {
  return (
    <Text {...props} fontFamily={"JejuMyeongjo"}>
      {props.children}
    </Text>
  );
}
