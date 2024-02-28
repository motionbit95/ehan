import {
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../GlobalState";
import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  adminSignUp,
  fetchAdminList,
  fetchShopList,
  postAdmin,
  postShop,
} from "../../firebase/firebase_func";
import PopupBase from "../../modals/PopupBase";
import RDepth1 from "../../components/RDepth1";
import RDepth2 from "../../components/RDepth2";
function Account(props) {
  const { admin } = useGlobalState();
  const [adminList, setAdminList] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function checkValidPassword(password) {
    if (password.length < 8) {
      alert("8자 이상의 비밀번호로 입력해주세요.");
      return false;
    }
    if (!/[a-z]/.test(password) && !/[A-Z]/.test(password)) {
      alert("영문 대/소문자를 포함하여 입력해주세요.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      alert("숫자를 포함하여 입력해주세요.");
      return false;
    }

    setPassword(password);
    return true;
  }

  function checkConfirmPassword(confirmPassword) {
    console.log(password, confirmPassword);
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    return true;
  }

  useEffect(() => {
    // supervisor의 경우 전체 관리자 목록 조회를 진행합니다.
    if (admin.permission === "supervisor") {
      getAdminList();
      getShopList();
    }
  }, [admin]);

  const getAdminList = async () => {
    const adminList = await fetchAdminList();
    setAdminList(adminList);
  };

  const getShopList = async () => {
    console.log("가맹점 리스트를 가지고 옵니다.");
    const shopList = await fetchShopList();
    setShopList(shopList);
  };

  const saveShop = async (e) => {
    if (await postShop(e)) {
      window.location.reload();
    }
  };

  const saveAdmin = async (e) => {
    if (await postAdmin(e)) {
      window.location.reload();
    }
  };

  return (
    <Flex w={"100%"} h={"calc(100% - 48px)"}>
      {isDesktop ? (
        <Stack
          position={"absolute"}
          w={"calc(100% - 200px)"}
          h={"calc(100% - 48px)"}
          top={"48px"}
          left={"200px"}
          // p={"2vh"}
        >
          {/* desktop 에서의 레이아웃 */}

          <Stack p={"20px"} w={"100%"} h={"100%"}>
            {/* <Text>관리자 설정</Text> */}
            {admin.permission === "supervisor" && (
              <Stack>
                <ButtonGroup size={"sm"}>
                  <PopupBase
                    onClose={saveAdmin}
                    title={"서브 관리자 추가"}
                    action={"추가"}
                  >
                    <FormControl isRequired>
                      <FormLabel>관리자 이름</FormLabel>
                      <Input
                        name="admin_name"
                        type="text"
                        placeholder="관리자 이름을 입력하세요."
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>관리자 이메일</FormLabel>
                      <Input
                        name="admin_email"
                        type="text"
                        placeholder="관리자 이메일을 입력하세요."
                        onChange={(e) => setEmail(e.target.value)}
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>관리자 패스워드</FormLabel>
                      <Input
                        onBlur={(e) => checkValidPassword(e.target.value)}
                        name="admin_password"
                        type="password"
                        placeholder="관리자 패스워드를 입력하세요."
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>관리자 패스워드</FormLabel>
                      <Input
                        onBlur={(e) => checkConfirmPassword(e.target.value)}
                        name="admin_password_confirm"
                        type="password"
                        placeholder="관리자 패스워드를 확인해주세요."
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>관리 지점</FormLabel>
                      <Select name="shop_id">
                        {shopList?.map((shop) => (
                          <option value={shop.doc_id}>{shop.shop_name}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>권한 설정</FormLabel>
                      <Select name="permission">
                        <option value="advisior">서브 관리자</option>
                        <option value="supervisor">메인 관리자</option>
                      </Select>
                    </FormControl>
                  </PopupBase>
                  <PopupBase
                    variant={"outline"}
                    title={"지점 추가"}
                    action={"추가"}
                    onClose={saveShop}
                  >
                    <FormControl isRequired>
                      <FormLabel>가맹점 id</FormLabel>
                      <Input
                        name="doc_id"
                        type="text"
                        placeholder="가맹점 id를 입력하세요."
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>가맹점 이름</FormLabel>
                      <Input
                        name="shop_name"
                        type="text"
                        placeholder="가맹점 이름을 입력하세요."
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>가맹점 주소</FormLabel>
                      <Input
                        name="shop_address"
                        type="text"
                        placeholder="가맹점 주소를 입력하세요."
                      ></Input>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>1차 카테고리</FormLabel>
                      <RDepth1 />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>2차 카테고리</FormLabel>
                      <RDepth2 />
                    </FormControl>
                    <FormControl>
                      <FormLabel>배너 이미지</FormLabel>
                      <Input name="shop_img" p={"4px"} type="file" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>로고 이미지</FormLabel>
                      <Input name="logo_img" p={"4px"} type="file" />
                    </FormControl>
                  </PopupBase>
                </ButtonGroup>
                <TableContainer
                  border={"1px solid #d9d9d9"}
                  bgColor={"white"}
                  borderRadius={"10px"}
                  p={"10px"}
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>No</Th>
                        <Th>이름</Th>
                        <Th>ID</Th>
                        <Th>관리 지점</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {adminList.map((admin, index) => (
                        <Tr>
                          <Td fontSize={"sm"}>{index + 1}</Td>
                          <Td fontSize={"sm"}>{admin.admin_name}</Td>
                          <Td fontSize={"sm"}>{admin.admin_email}</Td>
                          <Td fontSize={"sm"}>
                            {admin.permission === "supervisor"
                              ? "전지점"
                              : admin.shop_id}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack>
            <Text>관리자 설정</Text>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Account;
