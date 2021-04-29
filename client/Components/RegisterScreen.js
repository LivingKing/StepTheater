import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import React, { Fragment, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  Checkbox,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import styles from "../assets/styles";
import * as Crypto from "expo-crypto";
import { server } from "../app.json";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pass_confirm, setPass_Confirm] = useState("");
  const [nickname, setNickName] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [infoDialogVisble, setInfoDialogVisible] = useState();
  const [sucDialogVisible, setSucDialogVisible] = useState(false);
  const [failDialogVisble, setFailDialogVisible] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const passConfirmRef = useRef();
  const nickNameRef = useRef();
  const nameRef = useRef();

  const checkAll = () => {
    if (emailError !== "") {
      emailRef.current.focus();
      return false;
    }
    if (passwordError !== "") {
      passwordRef.current.focus();
      return false;
    }
    if (passwordConfirmError !== "") {
      passConfirmRef.current.focus();
      return false;
    }
    if (nickNameError !== "") {
      nickNameRef.current.focus();
      return false;
    }
    if (nameError !== "") {
      nameRef.current.focus();
      return false;
    }
    if (!privacyChecked) {
      setInfoDialogVisible(true);
      return false;
    }
    return true;
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
  const checkPasswordErrors = (val) => {
    const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    setPassword(val);
    if (val === "") {
      setPasswordError("");
      return;
    }
    if (!regExp.test(val))
      setPasswordError(
        "비밀번호는 8자 이상, 영대소문자, 숫자, 특수문자를 포함해야합니다."
      );
    else setPasswordError("");
  };
  const checkPassword_confirmErrors = (val) => {
    setPass_Confirm(val);
    if (password !== "" && val !== "") {
      if (password !== val) {
        setPasswordConfirmError("비밀번호가 일치하지 않습니다");
      } else {
        setPasswordConfirmError("");
      }
    } else {
      setPasswordConfirmError("");
    }
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
  const checkEmail = async (email) => {
    const response = await fetch(`${server.address}/api/member?email=${email}`);
    const result = await response.json();
    console.log(result);
    if (result.email !== "none") {
      setEmailError("이미 존재하는 이메일입니다.");
      emailRef.current.focus();
    } else {
      setEmailError("");
      passwordRef.current.focus();
    }
  };
  const checkNickName = async (nickname) => {
    const response = await fetch(
      `${server.address}/api/member?nickname=${encodeURI(
        encodeURIComponent(nickname)
      )}`
    );
    const result = await response.json();
    console.log(result);
    if (result.email !== "none") {
      setNickNameError("이미 존재하는 닉네임입니다.");
      nickNameRef.current.focus();
    } else {
      setNickNameError("");
    }
  };
  const register = async () => {
    if (checkAll()) {
      const form = new Object();
      form.email = email;
      form.password = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      form.name = name;
      form.privacy = privacyChecked;
      form.location = locationChecked;
      form.nickname = nickname;

      const response = await fetch(`${server.address}/api/members`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          password: form.password,
          nickname: form.nickname,
          name: form.name,
          privacy: form.privacy,
          location: form.location,
          type: "Local",
        }),
      });
      if (response.ok) {
        setSucDialogVisible(true);
        const data = await response.json();
        console.log(data);
        await fetch(
          `${server.address}/api/email/send/certified?email=${data.email}&&nickname=${data.nickname}&&certified=${data.certified}`
        );
      } else {
        setFailDialogVisible(true);
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
            <View style={styles.regi_safeView_contents_RegiView}>
              <TextInput
                label="이메일"
                ref={emailRef}
                value={email}
                textContentType="emailAddress"
                style={{ width: "100%", marginBottom: 10 }}
                onChangeText={(val) => {
                  checkEmailErrors(val);
                }}
                onEndEditing={async () => {
                  checkEmail(email);
                }}
                onSubmitEditing={async () => {
                  checkEmail(email);
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
              <View style={styles.regi_safeView_contents_RegiView_multiView}>
                <TextInput
                  label="비밀번호"
                  ref={passwordRef}
                  value={password}
                  textContentType="newPassword"
                  passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: special;"
                  secureTextEntry={true}
                  style={{ width: "49%", marginBottom: 10 }}
                  onChangeText={(val) => checkPasswordErrors(val)}
                  onSubmitEditing={() => passConfirmRef.current.focus()}
                  mode="outlined"
                />
                <TextInput
                  label="비밀번호 재확인"
                  ref={passConfirmRef}
                  value={pass_confirm}
                  textContentType="newPassword"
                  passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: special;"
                  secureTextEntry={true}
                  style={{ width: "49%", marginBottom: 10 }}
                  onChangeText={(val) => checkPassword_confirmErrors(val)}
                  onSubmitEditing={() => nickNameRef.current.focus()}
                  mode="outlined"
                />
              </View>
              <HelperText
                type="error"
                visible={passwordError !== "" || passwordConfirmError !== ""}
                style={{ fontSize: 13 }}
              >
                {passwordError !== "" ? passwordError : passwordConfirmError}
              </HelperText>
              <TextInput
                label="닉네임"
                ref={nickNameRef}
                value={nickname}
                textContentType="nickname"
                style={{ width: "100%", marginBottom: 10 }}
                onChangeText={(val) => checkNickNameErrors(val)}
                onSubmitEditing={() => checkNickName(nickname)}
                onEndEditing={() => checkNickName(nickname)}
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
                onSubmitEditing={() => console.log(email, password, nickname)}
                mode="outlined"
              />
              <HelperText
                type="error"
                visible={nameError !== ""}
                style={{ fontSize: 13 }}
              >
                {nameError}
              </HelperText>
              <Checkbox.Item
                status={allChecked ? "checked" : "unchecked"}
                onPress={() => {
                  setAllChecked(!allChecked);
                  if (!allChecked) {
                    // 체크 할 경우
                    setPrivacyChecked(true);
                    setLocationChecked(true);
                  } else {
                    setPrivacyChecked(false);
                    setLocationChecked(false);
                  }
                }}
                label={
                  <Text
                    style={{ textDecorationLine: "underline", fontSize: 12 }}
                  >
                    모두 동의합니다.
                  </Text>
                }
              />
              <Checkbox.Item
                status={privacyChecked ? "checked" : "unchecked"}
                onPress={() => setPrivacyChecked(!privacyChecked)}
                label={
                  <Text
                    style={{ textDecorationLine: "underline", fontSize: 12 }}
                  >
                    서비스 이용을 위한 개인 정보 제공에 동의합니다.(필수)
                  </Text>
                }
              />
              <Checkbox.Item
                status={locationChecked ? "checked" : "unchecked"}
                onPress={() => setLocationChecked(!locationChecked)}
                label={
                  <Text
                    style={{ textDecorationLine: "underline", fontSize: 12 }}
                  >
                    시버스 이용을 위한 위치 정보 제공에 동의합니다.(선택)
                  </Text>
                }
              />
            </View>

            <Button
              mode="contained"
              style={{ width: 200, height: 50 }}
              onPress={register}
            >
              <Text style={styles.com_safeView_btn}>회원가입</Text>
            </Button>

            <Portal>
              <Dialog
                visible={sucDialogVisible}
                onDismiss={() => setSucDialogVisible(false)}
              >
                <Dialog.Title style={{ textAlign: "center" }}>
                  <Text style={styles.regi_dialog_title}>회원가입 성공!</Text>
                </Dialog.Title>
                <Dialog.Content>
                  <Paragraph style={styles.regi_dialog_contents}>
                    {`걸음 한 편의 회원이 되신 것을 환영합니다.
                
                인증 메일을 발송하였습니다.
                이메일 인증 후 로그인이 가능합니다.`}
                  </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setSucDialogVisible(false);
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
                visible={failDialogVisble}
                onDismiss={() => setFailDialogVisible(false)}
              >
                <Dialog.Title style={{ textAlign: "center" }}>
                  <Text style={styles.regi_dialog_title}>회원가입 실패</Text>
                </Dialog.Title>
                <Dialog.Content>
                  <Paragraph style={styles.regi_dialog_contents}>
                    {`알 수 없는 오류가 발생하였습니다.
고객센터에 문의해주시기 바랍니다.`}
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
            <Portal>
              <Dialog
                visible={infoDialogVisble}
                onDismiss={() => setInfoDialogVisible(false)}
              >
                <Dialog.Title style={{ textAlign: "center" }}>
                  <Text style={styles.regi_dialog_title}>안내</Text>
                </Dialog.Title>
                <Dialog.Content>
                  <Paragraph style={styles.regi_dialog_contents}>
                    {`필수 항목을 체크해주세요!`}
                  </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setInfoDialogVisible(false);
                    }}
                  >
                    <Text style={styles.regi_dialog_btn}>확인</Text>
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
