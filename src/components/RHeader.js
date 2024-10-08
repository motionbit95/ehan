import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
  VStack,
  useDisclosure,
  Button,
  Stack,
  HStack,
} from "@chakra-ui/react";
import {
  AttachmentIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  DragHandleIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  ReactIcon,
  SearchIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { auth } from "../firebase/firebase_conf";
import { useGlobalState } from "../GlobalState";
import Logo from "./Logo";
import { ChosunBg } from "../Component/Text";

const RHeader = (props) => {
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768); // 기본적으로 데스크탑 뷰
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentMenu, setCurrentMenu] = useState(
    localStorage.getItem("menu") ? localStorage.getItem("menu") : "home"
  );
  const { admin } = useGlobalState();

  const handleResize = () => {
    setIsDesktopView(window.innerWidth > 768);
  };

  const handleClick = (menu) => {
    setCurrentMenu(menu);
    localStorage.setItem("menu", menu);
    props.onChangeMenu(menu);
    onClose();
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      height={"48px"}
      width={"100%"}
      border={"1px solid #d9d9d9"}
      as="header"
      bgColor={"white"}
      display={"flex"}
      alignItems="center"
      justifyContent={"space-between"}
    >
      <Flex px={4} width={"100%"} justify="space-between" align="center">
        {/* 로고와 텍스트 */}
        <Flex align="center" width={"100%"} justify="space-between">
          <HStack>
            <Logo />
            <ChosunBg fontWeight="bold">REDSWITCH</ChosunBg>
          </HStack>
          <Text display={{ base: "none", md: "block" }} mr={4}>
            {admin?.admin_name}
          </Text>
        </Flex>

        <HStack>
          <Button size={"sm"} onClick={() => auth.signOut()}>
            {admin?.admin_name ? "로그아웃" : "로그인"}
          </Button>
          {/* 햄버거 아이콘 (모바일 화면에서만 보임) */}
          <IconButton
            icon={<HamburgerIcon />}
            display={{ base: "block", md: "none" }}
            aria-label="메뉴 열기"
            onClick={onOpen}
          />
        </HStack>
      </Flex>

      {/* Navigate (모바일에서는 드로어, 데스크탑에서는 고정 위치) */}
      {isDesktopView ? (
        <Box
          p={4}
          height={"94vh"}
          bgColor={"white"}
          //   mt={4}
          position="absolute"
          left={0}
          top={"48px"}
          w={"200px"}
          borderRight={"1px solid #d9d9d9"}
        >
          <Stack h={"100%"} justifyContent={"space-between"}>
            {/* 네비게이션 아이템 추가 */}
            <Stack>
              <Button
                leftIcon={<DragHandleIcon />}
                onClick={() => handleClick("home")}
                variant={currentMenu === "home" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                홈
              </Button>
              <Button
                leftIcon={<EditIcon />}
                onClick={() => handleClick("order")}
                variant={currentMenu === "order" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                주문관리
              </Button>
              <Button
                leftIcon={<AttachmentIcon />}
                onClick={() => handleClick("product")}
                variant={currentMenu === "product" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                상품관리
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                onClick={() => handleClick("inventory")}
                variant={currentMenu === "inventory" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                지점관리
              </Button>
              <Button
                leftIcon={<SearchIcon />}
                onClick={() => handleClick("income")}
                variant={currentMenu === "income" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                매출분석
              </Button>
            </Stack>
            <Stack>
              {admin.permission === "supervisor" && (
                <Button
                  leftIcon={<ExternalLinkIcon />}
                  onClick={() => handleClick("banner")}
                  variant={currentMenu === "banner" ? "solid" : "ghost"}
                  justifyContent={"flex-start"}
                  w={"100%"}
                >
                  광고배너 설정
                </Button>
              )}
              {admin.permission === "supervisor" && (
                <Button
                  leftIcon={<ViewIcon />}
                  onClick={() => handleClick("spot")}
                  variant={currentMenu === "spot" ? "solid" : "ghost"}
                  justifyContent={"flex-start"}
                  w={"100%"}
                >
                  설치지점(스팟)
                </Button>
              )}
              <Button
                leftIcon={<CopyIcon />}
                onClick={() => handleClick("bdsm")}
                variant={currentMenu === "bdsm" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                BDSM 결과
              </Button>
              <Button
                leftIcon={<CheckCircleIcon />}
                onClick={() => handleClick("account")}
                variant={currentMenu === "account" ? "solid" : "ghost"}
                justifyContent={"flex-start"}
                w={"100%"}
              >
                관리자 설정
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                <HStack>
                  <Logo />
                  <Text fontWeight="bold">REDSWITCH</Text>
                </HStack>
              </DrawerHeader>
              <DrawerBody>
                <VStack w={"100%"} spacing={4} align="start">
                  {/* 네비게이션 아이템 추가 */}
                  <Stack w={"100%"} h={"100%"} justifyContent={"space-between"}>
                    {/* 네비게이션 아이템 추가 */}
                    <Stack w={"100%"}>
                      <Button
                        onClick={() => handleClick("home")}
                        variant={currentMenu === "home" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        홈
                      </Button>
                      <Button
                        onClick={() => handleClick("order")}
                        variant={currentMenu === "order" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        주문관리
                      </Button>
                      <Button
                        onClick={() => handleClick("product")}
                        variant={currentMenu === "product" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        상품관리
                      </Button>
                      <Button
                        onClick={() => handleClick("inventory")}
                        variant={
                          currentMenu === "inventory" ? "solid" : "ghost"
                        }
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        지점관리
                      </Button>
                      <Button
                        onClick={() => handleClick("income")}
                        variant={currentMenu === "income" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        매출분석
                      </Button>
                    </Stack>
                    <Stack>
                      <Button
                        onClick={() => handleClick("banner")}
                        variant={currentMenu === "banner" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        광고배너 설정
                      </Button>
                      <Button
                        onClick={() => handleClick("spot")}
                        variant={currentMenu === "banner" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        설치지점(스팟)
                      </Button>
                      <Button
                        onClick={() => handleClick("bdsm")}
                        variant={currentMenu === "bdsm" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        BDSM 결과
                      </Button>
                      <Button
                        onClick={() => handleClick("account")}
                        variant={currentMenu === "account" ? "solid" : "ghost"}
                        justifyContent={"flex-start"}
                        w={"100%"}
                      >
                        관리자 설정
                      </Button>
                    </Stack>
                  </Stack>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </Box>
  );
};

export default RHeader;
