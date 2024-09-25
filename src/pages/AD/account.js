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
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
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
  postAdmin,
  postShop,
  queryShop,
} from "../../firebase/firebase_func";
import PopupBase from "../../modals/PopupBase";
import RDepth1 from "../../components/RDepth1";
import RDepth2 from "../../components/RDepth2";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase_conf";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { deleteUser } from "firebase/auth";
import SearchShop from "../../components/SearchShop";
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
      await updateDoc(docRef, { permission: e.target.value, shop_id: "" });
    }
  };

  const handleChangeShop = async (value) => {
    if (window.confirm("관리 지점을 변경하시겠습니까?")) {
      const docRef = doc(db, "ACCOUNT", admin.doc_id);
      // 오류 발생
      // 관리지점 데이터가 들어가지지 않음 - shop_id
      console.log("관리 지점 아이디 : ", value);
      await updateDoc(docRef, { shop_id: value });
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
      // console.log(auth.currentUser);
      deleteDoc(doc(db, "ACCOUNT", admin.doc_id));
      await deleteUser(auth.currentUser);

      window.location.replace("/admin/login");
    }
  };

  return (
    <>
      {props.visibleAdminInfo && (
        <Stack w={"100%"} h={"100%"}>
          <Stack>
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
            <FormControl>
              <FormLabel>관리 지점</FormLabel>
              {permission === "supervisor" ? (
                <SearchShop
                  onSelect={(shop) => handleChangeShop(shop)}
                ></SearchShop>
              ) : (
                // <Select
                //   onChange={handleChangeShop}
                //   defaultValue={admin?.shop_id ? admin?.shop_id : ""}
                //   isDisabled={permission !== "supervisor"}
                //   name="shop_id"
                // >
                //   <option value="">관리 지점을 선택하세요.</option>
                //   {shopList?.map((shop) => (
                //     <option key={shop.doc_id} value={shop.doc_id}>
                //       {shop.shop_name}
                //     </option>
                //   ))}
                // </Select>
                <Input
                  disabled
                  defaultValue={
                    shopList?.find((shop) => shop.doc_id === admin?.shop_id)
                      ?.shop_name
                  }
                  name="shop_id"
                  type="text"
                  placeholder="관리 지점을 선택하세요."
                ></Input>
              )}
            </FormControl>
            {permission === "supervisor" && (
              <>
                <FormControl isRequired>
                  <FormLabel>권한 설정</FormLabel>
                  <Select
                    defaultValue={admin?.permission}
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

function ShopInfo({
  depth1,
  depth2,
  setDepth1,
  setDepth2,
  shopInfoData,
  ...props
}) {
  const [shopData, setShopData] = React.useState({
    shop_name: shopInfoData?.shop_name,
    shop_address: shopInfoData?.shop_address,
    doc_id: shopInfoData?.doc_id,
    shop_depth1: shopInfoData?.shop_depth1,
    shop_depth2: shopInfoData?.shop_depth2,
  });

  return (
    <>
      <Stack w={"100%"} h={"100%"}>
        <Stack>
          <FormControl>
            <FormLabel>가맹점 id</FormLabel>
            <Input
              name="doc_id"
              type="text"
              disabled
              defaultValue={shopData?.doc_id}
              // placeholder="가맹점 id를 입력하세요."
              onChange={(e) =>
                setShopData({ ...shopData, doc_id: e.target.value })
              }
            ></Input>
          </FormControl>
          <FormControl>
            <FormLabel>가맹점 이름</FormLabel>
            <Input
              name="shop_name"
              type="text"
              defaultValue={shopData?.shop_name}
              // placeholder="가맹점 이름을 입력하세요."
            />
          </FormControl>

          <FormControl>
            <FormLabel>시/도</FormLabel>
            <RDepth1
              defaultValue={shopData?.shop_depth1}
              onChangeDepth1={(depth1) => {
                setShopData({ ...shopData, shop_depth1: depth1 });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>구/군</FormLabel>
            <RDepth2
              depth1={shopData?.shop_depth1}
              defaultValue={shopData?.shop_depth2}
              onChangeDepth2={(depth2) => {
                setShopData({ ...shopData, shop_depth2: depth2 });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>가맹점 주소</FormLabel>
            <Input
              name="shop_address"
              type="text"
              // placeholder="가맹점 주소를 입력하세요."
              defaultValue={shopData?.shop_address}
              onChange={(e) =>
                setShopData({ ...shopData, shop_address: e.target.value })
              }
            />
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
}

function Account(props) {
  const { admin } = useGlobalState();
  const [adminList, setAdminList] = useState([]);
  const [isDesktop] = useMediaQuery("(min-width: 768px)");
  const [selectAdmin, setSelectAdmin] = useState(null);
  const [shopId, setShopId] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibleAdminInfo, setVisibleAdminInfo] = useState(
    admin?.permission === "advisor" ? true : false
  );

  useEffect(() => {
    if (admin?.permission === "advisor") {
      setVisibleAdminInfo(true);
    } else {
      setVisibleAdminInfo(false);
    }
  }, [admin]);

  function checkCurrentPassword(password) {
    if (password && password !== admin.admin_password) {
      alert("현재 패스워드가 일치하지 않습니다. 다시 시도하세요.");
      window.location.reload();
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
    for (let item of props.shopList) {
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
    if (admin?.permission === "supervisor") {
      if (adminList) {
        getAdminList();
        getShopList();
      }
    }
  }, [admin]);

  const getAdminList = async () => {
    const adminList = await fetchAdminList();
    setAdminList(adminList);
  };

  const [shopList, setShopList] = useState([]);
  const getShopList = async () => {
    const shopList = await queryShop("", "");
    setShopList(shopList);
    console.log(shopList);
  };

  const saveShop = async (e) => {
    if (await postShop(e)) {
      window.location.reload();
    }
  };

  const saveAdmin = async (e) => {
    console.log(e);
    if (await postAdmin(e)) {
      window.location.reload();
    }
  };

  const deleteAdmin = async (id) => {
    // 회원 정보 삭제
    await deleteDoc(doc(db, "ACCOUNT", id));
    window.location.reload();
  };

  const deleteShop = async (id) => {
    // 지점 정보 삭제
    await deleteDoc(doc(db, "SHOP", id));
    window.location.reload();
  };

  const [depth1, setDepth1] = useState("");
  const [depth2, setDepth2] = useState("");

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
            {admin?.permission === "supervisor" && (
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
                    <FormControl>
                      <FormLabel>관리 지점</FormLabel>
                      {/* <Input name="shop_id" type="text" value={shopId}></Input> */}
                      <SearchShop
                        onSelect={(value) => setShopId(value.toLowerCase())}
                      ></SearchShop>
                      {/* <Select
                        name="shop_id"
                        defaultValue={admin.shop_id ? admin.shop_id : ""}
                      >
                        <option value="">관리 지점을 선택하세요.</option>
                        {props.shopList?.map((shop) => (
                          <option key={shop.doc_id} value={shop.doc_id}>
                            {shop.shop_name}
                          </option>
                        ))}
                      </Select> */}
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>권한 설정</FormLabel>
                      <Select name="permission" defaultValue={admin.permission}>
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
                      <Stack spacing={0}>
                        <Input
                          name="doc_id"
                          type="text"
                          placeholder="가맹점 id를 입력하세요."
                        ></Input>
                        <Text color={"red.500"} pl={1} fontSize={"10px"}>
                          * 특수문자, 대문자, 기호 등 사용하지 않는 것을
                          추천드립니다. (도메인 명으로 지정됩니다.)
                        </Text>
                      </Stack>
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
                      <FormLabel>시/도</FormLabel>
                      <RDepth1
                        defaultValue={depth1}
                        onChangeDepth1={(value) => {
                          setDepth1(value);
                        }}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>구/군</FormLabel>
                      <RDepth2
                        depth1={depth1}
                        defaultValue={depth2}
                        onChangeDepth2={(value) => {
                          setDepth2(value);
                        }}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>가맹점 주소</FormLabel>
                      <Input
                        name="shop_address"
                        type="text"
                        placeholder="가맹점 주소를 입력하세요."
                      ></Input>
                    </FormControl>
                  </PopupBase>
                </ButtonGroup>
                <Tabs
                  border={"1px solid #d9d9d9"}
                  bgColor={"white"}
                  borderRadius={"10px"}
                  p={"10px"}
                  variant={"soft-rounded"}
                >
                  <TabList>
                    <Tab>관리자</Tab>
                    <Tab>지점</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      {/* 관리자 */}
                      <TableContainer
                      // border={"1px solid #d9d9d9"}
                      // bgColor={"white"}
                      // borderRadius={"10px"}
                      // p={"10px"}
                      >
                        <Table variant="simple" size={"sm"}>
                          <Thead h={"40px"}>
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
                              <Tr
                                key={index}
                                _hover={{
                                  cursor: "pointer",
                                  bgColor: "#f0f0f0",
                                }}
                              >
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
                                    size={"sm"}
                                    colorScheme={"gray"}
                                    visibleButton={true}
                                    action={"수정"}
                                    title={<EditIcon />}
                                    onClose={saveAdmin}
                                  >
                                    <AccountInfo
                                      permission={admin?.permission}
                                      admin={item}
                                      shopList={props.shopList}
                                      visibleAdminInfo={true}
                                      checkConfirmPassword={
                                        checkConfirmPassword
                                      }
                                      checkValidPassword={checkValidPassword}
                                      checkCurrentPassword={
                                        checkCurrentPassword
                                      }
                                    />
                                  </PopupBase>
                                </Td>
                                <Td>
                                  <IconButton
                                    size={"sm"}
                                    onClick={() => deleteAdmin(item.doc_id)}
                                    icon={<DeleteIcon />}
                                  />
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel>
                      {/* 지점 */}
                      <TableContainer
                      // border={"1px solid #d9d9d9"}
                      // bgColor={"white"}
                      // borderRadius={"10px"}
                      // p={"10px"}
                      >
                        <Table variant="simple" size={"sm"}>
                          <Thead h={"40px"}>
                            <Tr>
                              <Th>No</Th>
                              <Th>지점명</Th>
                              <Th>주소</Th>
                              <Th textAlign={"center"} w={"30px"}>
                                수정
                              </Th>
                              <Th textAlign={"center"} w={"30px"}>
                                삭제
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {shopList.map((item, index) => (
                              <Tr
                                key={index}
                                _hover={{
                                  cursor: "pointer",
                                  bgColor: "#f0f0f0",
                                }}
                              >
                                <Td fontSize={"sm"}>{index + 1}</Td>
                                <Td fontSize={"sm"}>{item.shop_name}</Td>
                                <Td fontSize={"sm"}>{item.shop_address}</Td>
                                <Td>
                                  <PopupBase
                                    size={"sm"}
                                    colorScheme={"gray"}
                                    visibleButton={true}
                                    action={"수정"}
                                    title={<EditIcon />}
                                    onClose={saveShop}
                                  >
                                    <ShopInfo shopInfoData={item} />
                                  </PopupBase>
                                </Td>
                                <Td>
                                  <IconButton
                                    size={"sm"}
                                    onClick={() => deleteShop(item.doc_id)}
                                    icon={<DeleteIcon />}
                                  />
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
            )}
            {visibleAdminInfo && (
              <Flex bgColor={"white"} borderRadius={"10px"} p={"20px"}>
                <AccountInfo
                  admin={admin}
                  shopList={props.shopList}
                  visibleAdminInfo={visibleAdminInfo}
                  checkConfirmPassword={checkConfirmPassword}
                  checkValidPassword={checkValidPassword}
                  checkCurrentPassword={checkCurrentPassword}
                />
              </Flex>
            )}
          </Stack>
        </Stack>
      ) : (
        <Flex w={"100%"} h={"100%"} minW={"350px"}>
          {/* mobile 에서의 레이아웃 */}
          <Stack w={"100%"} h={"100%"}>
            <Stack p={"20px"} w={"100%"} h={"100%"}>
              {/* <Text>관리자 설정</Text> */}
              {admin?.permission === "supervisor" && (
                <Stack>
                  <ButtonGroup size={"sm"}>
                    <PopupBase
                      icon={<AddIcon />}
                      onClose={saveAdmin}
                      title={"서브 관리자"}
                      action={"추가"}
                      size={["sm", "md"]}
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
                        <Select
                          name="shop_id"
                          defaultValue={admin?.shop_id ? admin?.shop_id : ""}
                        >
                          {props.shopList?.map((shop) => (
                            <option key={shop.doc_id} value={shop.doc_id}>
                              {shop.shop_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>권한 설정</FormLabel>
                        <Select
                          name="permission"
                          defaultValue={admin?.permission}
                        >
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
                      size={["sm", "md"]}
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
                        <FormLabel>시/도</FormLabel>
                        <RDepth1
                          defaultValue={depth1}
                          onChangeDepth1={(value) => {
                            setDepth1(value);
                          }}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>구/군</FormLabel>
                        <RDepth2
                          depth1={depth1}
                          defaultValue={depth2}
                          onChangeDepth2={(value) => {
                            setDepth2(value);
                          }}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>가맹점 주소</FormLabel>
                        <Input
                          name="shop_address"
                          type="text"
                          placeholder="가맹점 주소를 입력하세요."
                        ></Input>
                      </FormControl>
                    </PopupBase>
                  </ButtonGroup>

                  <Box bgColor={"white"} borderRadius={"10px"} px={"20px"}>
                    <Tabs variant={"soft-rounded"}>
                      <TabList pt={4}>
                        <Tab>관리자</Tab>
                        <Tab>지점</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          <Table>
                            <Thead>
                              <Tr>
                                <Th px={0} fontSize={"sm"}>
                                  이름
                                </Th>
                                <Th px={0} fontSize={"sm"}>
                                  ID / 관리 지점
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {adminList.map((item, index) => (
                                <Tr key={index}>
                                  <Td px={0} fontSize={"sm"}>
                                    {item.admin_name}
                                  </Td>
                                  <Td px={0} fontSize={"sm"}>
                                    <Text>{item.admin_email}</Text>
                                    <Text>
                                      {item.permission === "supervisor"
                                        ? "전지점"
                                        : searchShopName(item.shop_id)}
                                    </Text>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TabPanel>
                        <TabPanel>{/* <Text>준비 예정</Text> */}</TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </Stack>
              )}
              <Flex p={"20px"}>
                <AccountInfo
                  admin={admin}
                  shopList={props.shopList}
                  visibleAdminInfo={visibleAdminInfo}
                  checkConfirmPassword={checkConfirmPassword}
                  checkValidPassword={checkValidPassword}
                  checkCurrentPassword={checkCurrentPassword}
                />
              </Flex>
            </Stack>
          </Stack>
        </Flex>
      )}
    </Flex>
  );
}

export default Account;
