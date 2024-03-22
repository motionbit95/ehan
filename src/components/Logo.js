import { Box, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import logo from "../assets/logo192.png";
function Logo(props) {
  return <Image src={logo} objectFit={"cover"} width="30px" height="30px" />;
}

export default Logo;
