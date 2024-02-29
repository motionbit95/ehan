import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
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
import {
  changeAdminPassword,
  fetchAdminList,
  fetchShopList,
  postAdmin,
  postShop,
} from "../../firebase/firebase_func";
import PopupBase from "../../modals/PopupBase";
import RDepth1 from "../../components/RDepth1";
import RDepth2 from "../../components/RDepth2";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase_conf";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { deleteUser } from "firebase/auth";

function AccountInfo({ permission, admin, shopList, ...props }) {
  const [changePassword, setChangePassword] = useState(false);
  const [name, setName] = useState(admin.name);
  const [password, setPassword] = useState({
    origin_password: "",
    change_password: "",
    confirm_password: "",
  });

  const handleChangePermission = async (e) => {
    if (window.confirm("관리자 권한을 변경하시겠습니까?")) {
      const docRef = doc(db, "ACCOUNT", admin.doc_id);
      await updateDoc(docRef, { permission: e.target.value });
    }
  };

  const handleChangeShop = async (e) => {
    if (window.confirm("관리 지점을 변경하시겠습니까?")) {
      const docRef = doc(db, "ACCOUNT", admin.doc_id);
      await updateDoc(docRef, { shop_id: e.target.value });
    }
  };

  const handleChangeName = async () => {
    if (window.confirm("관리자 이름을 변경하시겠습니까?")) {
      const docRef = doc(db, "ACCOUNT", admin.doc_id);
      await updateDoc(docRef, { admin_name: name });
    }
  };

  const handlePasswordChange = async () => {
    if (window.confirm("관리자 비밀번호를 변경하시겠습니까?")) {
      changeAdminPassword(
        password.origin_password,
        password.change_password,
        admin.doc_id
      );
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("탈퇴하시겠습니까?")) {
      deleteUser(auth.currentUser);
    }
  };

  return (
    <>
      {props.visibleAdminInfo && (
        <Stack>
          <Stack bgColor={"white"} borderRadius={"10px"}>
            <FormControl isRequired>
              <FormLabel>관리자 이름</FormLabel>
              <HStack>
                <Input
                  defaultValue={admin.admin_name}
                  name="admin_name"
                  type="text"
                  placeholder="관리자 이름을 입력하세요."
                  onChange={(e) => setName(e.target.value)}
                ></Input>
                <Button onClick={handleChangeName}>변경</Button>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>관리자 이메일</FormLabel>
              <Input
                disabled
                defaultValue={admin.admin_email}
                name="admin_email"
                type="text"
                placeholder="관리자 이메일을 입력하세요."
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>관리 지점</FormLabel>
              <Select
                onChange={handleChangeShop}
                isDisabled={permission === "advisor"}
                name="shop_id"
                defaultValue={admin.shop_id}
              >
                {shopList?.map((shop) => (
                  <option value={shop.doc_id}>{shop.shop_name}</option>
                ))}
              </Select>
            </FormControl>
            {permission === "supervisor" && (
              <>
                <FormControl isRequired>
                  <FormLabel>권한 설정</FormLabel>
                  <Select
                    defaultValue={admin.permission}
                    name="permission"
                    onChange={handleChangePermission}
                  >
                    <option value="advisor">서브 관리자</option>
                    <option value="supervisor">메인 관리자</option>
                  </Select>
                </FormControl>
              </>
            )}
            {changePassword && (
              <>
                <FormControl isRequired>
                  <FormLabel>현재 관리자 패스워드</FormLabel>
                  <HStack>
                    <Input
                      onBlur={(e) => props.checkCurrentPassword(e.target.value)}
                      name="admin_password"
                      type="password"
                      placeholder="관리자 패스워드를 입력하세요."
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          origin_password: e.target.value,
                        })
                      }
                    ></Input>
                  </HStack>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>변경 할 관리자 패스워드</FormLabel>
                  <Input
                    onBlur={(e) => props.checkValidPassword(e.target.value)}
                    name="admin_password"
                    type="password"
                    placeholder="관리자 패스워드를 입력하세요."
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        change_password: e.target.value,
                      })
                    }
                  ></Input>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>변경 할 관리자 패스워드 확인</FormLabel>
                  <Input
                    onBlur={(e) => props.checkConfirmPassword(e.target.value)}
                    name="admin_password_confirm"
                    type="password"
                    placeholder="관리자 패스워드를 확인해주세요."
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirm_password: e.target.value,
                      })
                    }
                  ></Input>
                </FormControl>
              </>
            )}

            {admin.uid == auth.currentUser.uid && (
              <>
                <ButtonGroup>
                  <Button
                    colorScheme={changePassword ? "gray" : "red"}
                    onClick={() => setChangePassword(!changePassword)}
                  >
                    {changePassword ? "패스워드 변경 취소" : "패스워드 변경"}
                  </Button>
                  <Button
                    colorScheme="red"
                    display={changePassword ? "block" : "none"}
                    onClick={handlePasswordChange}
                  >
                    패스워드 변경
                  </Button>
                </ButtonGroup>
                <HStack w={"100%"} justifyContent={"flex-end"}>
                  <Text
                    color={"#8c8c8c"}
                    cursor={"pointer"}
                    onClick={handleDeleteUser}
                  >
                    탈퇴하기
                  </Text>
                </HStack>
              </>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
}

function Account(props) {
  const { admin } = useGlobalState();
  const [adminList, setAdminList] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [selectAdmin, setSelectAdmin] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibleAdminInfo, setVisibleAdminInfo] = useState(
    admin.permission === "advisor" ? true : false
  );

  useEffect(() => {
    if (admin.permission === "advisor") {
      setVisibleAdminInfo(true);
    } else {
      setVisibleAdminInfo(false);
    }
  }, [admin]);

  function checkCurrentPassword(password) {
    if (password && password !== admin.admin_password) {
      alert("현재 패스워드가 일치하지 않습니다.");
      return false;
    }
    return true;
  }

  function checkValidPassword(password) {
    if (!password) return;
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

  // shopList에서 shop의 이름을 가지고 오는 함수
  function searchShopName(id) {
    // 리스트를 순회하면서 타겟 값과 일치하는 항목을 찾음
    for (let item of shopList) {
      // 타겟 값과 일치하는 항목을 찾았을 때 해당 정보 반환
      if (item.doc_id === id) {
        return item.shop_name;
      }
    }
    // 타겟 값과 일치하는 항목이 없을 경우 null 반환 또는 다른 예외처리 수행
    return null;
  }

  useEffect(() => {
    // supervisor의 경우 전체 관리자 목록 조회를 진행합니다.
    if (admin.permission === "supervisor") {
      if (adminList) {
        getAdminList();
      }
    }
    if (shopList) {
      // 과금 방지를 위해 최소한으로 줄이기
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

  const deleteAdmin = async (id) => {
    // 회원 정보 삭제
    await deleteDoc(doc(db, "ACCOUNT", id));
    window.location.reload();
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
                    icon={<AddIcon />}
                    onClose={saveAdmin}
                    title={"서브 관리자"}
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
                        placeholder="관리자 이메일을 입력하세요. (변경 불가능)"
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
                        <option value="advisor">서브 관리자</option>
                        <option value="supervisor">메인 관리자</option>
                      </Select>
                    </FormControl>
                  </PopupBase>
                  <PopupBase
                    icon={<AddIcon />}
                    variant={"outline"}
                    title={"지점"}
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
                        <Th textAlign={"center"} w={"30px"}>
                          수정
                        </Th>
                        <Th textAlign={"center"} w={"30px"}>
                          삭제
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {adminList.map((item, index) => (
                        <Tr _hover={{ cursor: "pointer", bgColor: "#f0f0f0" }}>
                          <Td fontSize={"sm"}>{index + 1}</Td>
                          <Td fontSize={"sm"}>{item.admin_name}</Td>
                          <Td fontSize={"sm"}>{item.admin_email}</Td>
                          <Td fontSize={"sm"}>
                            {item.permission === "supervisor"
                              ? "전지점"
                              : searchShopName(item.shop_id)}
                          </Td>
                          <Td>
                            <PopupBase
                              colorScheme={"gray"}
                              visibleButton={true}
                              action={"수정"}
                              title={<EditIcon />}
                              onClose={(e) => window.location.reload()}
                            >
                              <AccountInfo
                                permission={admin.permission}
                                admin={item}
                                shopList={shopList}
                                visibleAdminInfo={true}
                                checkConfirmPassword={checkConfirmPassword}
                                checkValidPassword={checkValidPassword}
                                checkCurrentPassword={checkCurrentPassword}
                              />
                            </PopupBase>
                          </Td>
                          <Td>
                            <IconButton
                              onClick={() => deleteAdmin(item.doc_id)}
                              icon={<DeleteIcon />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
            <Flex p={"20px"}>
              <AccountInfo
                admin={admin}
                shopList={shopList}
                visibleAdminInfo={visibleAdminInfo}
                checkConfirmPassword={checkConfirmPassword}
                checkValidPassword={checkValidPassword}
                checkCurrentPassword={checkCurrentPassword}
              />
            </Flex>
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
