import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, SafeAreaView, Platform } from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  Checkbox,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import styles from "../assets/styles";
import { server } from "../app.json";

export default function AdditionScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickName] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [infoDialogVisble, setInfoDialogVisible] = useState(false);
  const [sucDialogVisible, setSucDialogVisible] = useState(false);
  const [failDialogVisble, setFailDialogVisible] = useState(false);
  const nickNameRef = useRef();

  useEffect(() => {
    setInfomation();
  });

  const setSucDialogVis = () => {
    setSucDialogVisible(true);
  };
  const setFailDialogVis = () => {
    setFailDialogVisible(true);
  };
  const setInfoDialogVis = () => {
    setInfoDialogVisible(true);
  };
  const setInfomation = async () => {
    setEmail(await SecureStore.getItemAsync("Email"));
    setName(await SecureStore.getItemAsync("Name"));
  };
  const checkAll = () => {
    if (nickNameError !== "") {
      nickNameRef.current.focus();
      return false;
    }
    if (!privacyChecked) {
      setInfoDialogVis();
      return false;
    }
    return true;
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
  const update = async () => {
    if (checkAll()) {
      const form = new Object();
      const id = await SecureStore.getItemAsync("UserId");
      form.privacy = privacyChecked;
      form.location = locationChecked;
      form.nickname = nickname;

      const response = await fetch(`${server.address}/api/member/${id}/OAuth`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: form.nickname,
          privacy: form.privacy,
          location: form.location,
        }),
      });
      if (response.ok) {
        setSucDialogVis();
        const data = await response.json();
        await SecureStore.setItemAsync("IsLogin", "true");
        await SecureStore.setItemAsync("LoginType", "Apple");
        await SecureStore.setItemAsync("NickName", data.nickname);
        await SecureStore.deleteItemAsync("Name");
      } else {
        setFailDialogVis();
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
            <Text style={styles.com_safeView_title_text}>추가정보 입력</Text>
          </View>
          <View style={styles.com_safeView_contents}>
            <View style={styles.regi_safeView_contents_RegiView}>
              <TextInput
                label="이메일"
                value={email}
                textContentType="emailAddress"
                style={{ width: "100%", marginBottom: 10 }}
                mode="outlined"
                disabled={true}
              />
              <TextInput
                label="이름"
                value={name}
                textContentType="name"
                style={{ width: "100%", marginBottom: 10 }}
                disabled={true}
                mode="outlined"
              />
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
              onPress={update}
            >
              <Text style={styles.com_safeView_btn}>확인</Text>
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
                    {`걸음 한 편의 회원이 되신 것을 환영합니다.`}
                  </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setSucDialogVisible(false);
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "메인" }],
                      });
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
