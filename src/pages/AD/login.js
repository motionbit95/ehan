import React from "react";
import {
  Stack,
  Text,
  Input,
  Button,
  Center,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { adminSignIn } from "../../firebase/firebase_func";
import Logo from "../../components/Logo";

const Login = () => {
  return (
    <Flex
      bgColor={"white"}
      minH={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        direction="row"
        justify="center"
        align="center"
        spacing="10px"
        overflow="hidden"
        maxWidth="100%"
        // background="#FFFFFF"
      >
        <Stack
          paddingX="50px"
          direction="row"
          justify="flex-start"
          align="flex-start"
          spacing="10px"
          overflow="hidden"
          background="white"
        >
          <Stack
            paddingY="200px"
            justify="flex-end"
            align="center"
            spacing="100px"
            width="300px"
            maxWidth="100%"
          >
            <HStack>
              <Logo />
              <Text fontSize={"2xl"} fontWeight="bold">
                Redswitch
              </Text>
            </HStack>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
              }}
              onSubmit={adminSignIn}
            >
              <Stack spacing="100px" w={"100%"}>
                <Stack
                  justify="flex-start"
                  align="flex-start"
                  spacing="20px"
                  alignSelf="stretch"
                >
                  <Input
                    focusBorderColor="red.500"
                    type="text"
                    background="white"
                    placeholder="아이디"
                    defaultValue={localStorage.getItem("admin_id") || ""}
                  />
                  <Input
                    focusBorderColor="red.500"
                    type="password"
                    background="white"
                    placeholder="패스워드"
                  />
                </Stack>
                <Button type="submit" w="100%" colorScheme="red">
                  관리자 로그인
                </Button>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
};
export default Login;
