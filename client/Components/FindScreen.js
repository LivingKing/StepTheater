import { StatusBar } from "expo-status-bar";
import React, { Fragment, useRef, useState } from "react";
import { Text, View, SafeAreaView, Platform, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  TextInput,
  HelperText,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { server } from "../app.json";
import styles from "../assets/styles";

export default function FindScreen({ navigation }) {
  const [nickname, setNickName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [findEmail, setfindEmail] = useState("");
  const [sucEmailDialogVisible, setSucEmailDialogVisible] = useState(false);
  const [sucPwDialogVisible, setSucPwDialogVisible] = useState(false);
  const [failDialogVisible, setFailDialogVisible] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef();
  const nameRef = useRef();
  const nickNameRef = useRef();

  const setEmailDialogVis = () => {
    Keyboard.dismiss();
    setSucEmailDialogVisible(true);
  };
  const setPwDialogVis = () => {
    Keyboard.dismiss();
    setSucPwDialogVisible(true);
  };
  const checkNickNameErrors = (val) => {
    setNickName(val);
    if (val === "") {
      setNickNameError("");
      return;
    }
    const regExp = /[0-9]|[a-z]|[A-Z]|[가-힣]{2,10}$/;
    if (!regExp.test(val))
      setNickNameError("2~10자 이내 한글,영문, 숫자를 입력해주세요.");
    else setNickNameError("");
  };
  const checkNameErrors = (val) => {
    setName(val);
    if (val === "") {
      setNameError("");
      return;
    }
    const regExp = /^[가-힣]{2,4}$/;
    if (!regExp.test(val)) setNameError("2~4자 이내 한글만 입력해주세요.");
    else setNameError("");
  };
  const checkEmailErrors = (val) => {
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    setEmail(val);
    if (val === "") {
      setEmailError("");
      return;
    }
    if (!regExp.test(val)) setEmailError("이메일 양식을 맞춰주세요!");
    else setEmailError("");
  };
  const findId = async () => {
    if (nameError === "" && nickNameError === "") {
      const response = await fetch(
        `${server.address}/api/member/findEmail?nickname=${nickname}&&name=${name}`
      );
      const result = await response.json();
      if (result.status === 500) {
        setFailDialogVisible(true);
        setFailMessage(`검색내역이 없습니다!
입력 정보를 다시 확인해주세요.`);
      } else {
        setfindEmail(result.email);
        setEmailDialogVis();
      }
    }
  };

  const findPw = async () => {
    if (nameError === "" && nickNameError === "" && emailError === "") {
      const response = await fetch(
        `${server.address}/api/member/findPw?email=${email}&&nickname=${nickname}&&name=${name}`
      );
      const result = await response.json();
      console.log(result);
      if (result.status === 500) {
        setFailDialogVisible(true);
        setFailMessage(`검색내역이 없습니다!
입력 정보를 다시 확인해주세요.`);
      } else {
        setPwDialogVis();
        await fetch(
          `${server.address}/api/email/send/findPW?email=${result.email}&&nickname=${result.nickname}&&certified=${result.certified}`
        );
      }
    }
  };
  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Ionicons
              name="ios-chevron-back"
              size={35}
              color="#262223"
              onPress={() => navigation.navigate("로그인")}
            />
          </View>
          <View style={styles.com_safeView_contents}>
            <KeyboardAwareScrollView
              style={{ width: "100%", height: "100%" }}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              resetScrollToCoords={{ x: 0, y: 0 }}
              scrollEnabled={false}
            >
              <View style={styles.find_safeView_contents_FindView}>
                <View style={styles.find_safeView_contents_FindView_IdView}>
                  <Text style={styles.find_safeView_contents_FindView_title}>
                    이메일 찾기
                  </Text>
                  <TextInput
                    label="닉네임"
                    ref={nickNameRef}
                    value={nickname}
                    textContentType="nickname"
                    style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
                    onChangeText={(val) => checkNickNameErrors(val)}
                    mode="outlined"
                  />
                  <HelperText
                    type="error"
                    visible={nickNameError !== ""}
                    style={{ fontSize: 13 }}
                  >
                    {nickNameError}
                  </HelperText>
                  <TextInput
                    label="이름"
                    ref={nameRef}
                    value={name}
                    textContentType="name"
                    style={{ width: "100%", marginBottom: 10 }}
                    onChangeText={(val) => checkNameErrors(val)}
                    mode="outlined"
                  />
                  <HelperText
                    type="error"
                    visible={nameError !== ""}
                    style={{ fontSize: 13 }}
                  >
                    {nameError}
                  </HelperText>
                  <Button
                    style={{ width: 90, marginBottom: 20 }}
                    mode="contained"
                    onPress={findId}
                  >
                    찾기
                  </Button>
                </View>
                <View style={styles.find_safeView_contents_FindView_PwView}>
                  <Text style={styles.find_safeView_contents_FindView_title}>
                    비밀번호 찾기
                  </Text>
                  <TextInput
                    label="이메일"
                    ref={emailRef}
                    value={email}
                    textContentType="emailAddress"
                    style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
                    onChangeText={(val) => {
                      checkEmailErrors(val);
                    }}
                    mode="outlined"
                  />
                  <HelperText
                    type="error"
                    visible={emailError !== ""}
                    style={{ fontSize: 13 }}
                  >
                    {emailError}
                  </HelperText>
                  <TextInput
                    label="닉네임"
                    ref={nickNameRef}
                    value={nickname}
                    textContentType="nickname"
                    style={{ width: "100%", marginBottom: 10 }}
                    onChangeText={(val) => checkNickNameErrors(val)}
                    mode="outlined"
                  />
                  <HelperText
                    type="error"
                    visible={nickNameError !== ""}
                    style={{ fontSize: 13 }}
                  >
                    {nickNameError}
                  </HelperText>
                  <TextInput
                    label="이름"
                    ref={nameRef}
                    value={name}
                    textContentType="name"
                    style={{ width: "100%", marginBottom: 10 }}
                    onChangeText={(val) => checkNameErrors(val)}
                    mode="outlined"
                  />
                  <HelperText
                    type="error"
                    visible={nameError !== ""}
                    style={{ fontSize: 13 }}
                  >
                    {nameError}
                  </HelperText>
                  <Button
                    style={{ width: 90 }}
                    mode="contained"
                    onPress={findPw}
                  >
                    찾기
                  </Button>
                </View>
              </View>
              <Portal>
                <Dialog
                  visible={sucEmailDialogVisible}
                  onDismiss={() => setSucEmailDialogVisible(false)}
                >
                  <Dialog.Title style={{ textAlign: "center" }}>
                    <Text style={styles.regi_dialog_title}>찾기 성공</Text>
                  </Dialog.Title>
                  <Dialog.Content>
                    <Paragraph style={styles.regi_dialog_contents}>
                      {`찾은 이메일 : ${findEmail}
이어서 비밀번호를 찾으실건가요?`}
                    </Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button
                      onPress={() => {
                        setSucEmailDialogVisible(false);
                        navigation.navigate("로그인");
                      }}
                    >
                      <Text style={styles.regi_dialog_btn}>아니오</Text>
                    </Button>
                    <Button
                      onPress={() => {
                        setSucEmailDialogVisible(false);
                        setEmail(findEmail);
                      }}
                    >
                      <Text style={styles.regi_dialog_btn}>네</Text>
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Portal>
                <Dialog
                  visible={sucPwDialogVisible}
                  onDismiss={() => setSucPwDialogVisible(false)}
                >
                  <Dialog.Title style={{ textAlign: "center" }}>
                    <Text style={styles.regi_dialog_title}>찾기 성공</Text>
                  </Dialog.Title>
                  <Dialog.Content>
                    <Paragraph style={styles.regi_dialog_contents}>
                      {`입력하신 이메일로
비밀번호 변경 메일을 발송하였습니다.`}
                    </Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button
                      onPress={() => {
                        setSucPwDialogVisible(false);
                        navigation.navigate("로그인");
                      }}
                    >
                      <Text style={styles.regi_dialog_btn}>확인</Text>
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Portal>
                <Dialog
                  visible={failDialogVisible}
                  onDismiss={() => setFailDialogVisible(false)}
                >
                  <Dialog.Title style={{ textAlign: "center" }}>
                    <Text style={styles.regi_dialog_title}>찾기 실패</Text>
                  </Dialog.Title>
                  <Dialog.Content>
                    <Paragraph style={styles.regi_dialog_contents}>
                      {failMessage}
                    </Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button
                      onPress={() => {
                        setFailDialogVisible(false);
                      }}
                    >
                      <Text style={styles.regi_dialog_btn}>확인</Text>
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
