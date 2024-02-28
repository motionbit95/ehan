import React from "react";
import { Stack, Text, Input, Button, Center, Flex } from "@chakra-ui/react";
import { adminSignIn } from "../../firebase/firebase_func";

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
            <Text
              fontFamily="Inter"
              lineHeight="1.21"
              fontWeight="bold"
              fontSize="34px"
              letterSpacing="0.37px"
              color="Label Color.Light/Primary"
            >
              LOGO
            </Text>
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
