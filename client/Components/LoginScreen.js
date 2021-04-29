import { StatusBar } from "expo-status-bar";
import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { View, SafeAreaView, Platform, Text, Image } from "react-native";
import {
  NavigationActions,
  StackActions,
  useFocusEffect,
} from "@react-navigation/native";
import { TextInput, Button, HelperText } from "react-native-paper";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { server } from "../app.json";
import styles from "../assets/styles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, SetIsLogin] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const showState = async () => {
    console.log(
      "IsLogin : " + (await SecureStore.getItemAsync("IsLogin")),
      "\nUserId : " + (await SecureStore.getItemAsync("UserId")),
      "\nEmail : " + (await SecureStore.getItemAsync("Email")),
      "\nNickname : " + (await SecureStore.getItemAsync("NickName")),
      "\nLoginType : " + (await SecureStore.getItemAsync("LoginType"))
    );
  };
  const checkState = async () => {
    if ((await SecureStore.getItemAsync("IsLogin")) === "true") {
      const data = await SecureStore.getItemAsync("UserId");
      const response = await fetch(`${server.address}/api/member?id=${data}`);
      const result = await response.json();
      if (result.id) {
        navigation.reset({ index: 0, routes: [{ name: "메인" }] });
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      showState();
      checkState();
    }, [])
  );
  const localLogin = async () => {
    const response = await fetch(`${server.address}/api/member/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password
        ),
      }),
    });
    const result = await response.json();
    if (result.status === 500) {
      setErrorMsg(result.message);
    } else {
      console.log(result);
      await SecureStore.setItemAsync("Email", result.email);
      await SecureStore.setItemAsync("UserId", String(result.id));
      await SecureStore.setItemAsync("LoginType", result.memberType);
      await SecureStore.setItemAsync("NickName", result.nickname);
      await SecureStore.setItemAsync("Name", result.name);
      await SecureStore.setItemAsync("Image_Url", String(result.image_url));
      await SecureStore.setItemAsync("Thumb_Url", String(result.thumb_url));
      await SecureStore.setItemAsync("Privacy_Checked", String(result.privacy));
      await SecureStore.setItemAsync(
        "Location_Checked",
        String(result.location)
      );
      await SecureStore.setItemAsync("IsLogin", "true");

      navigation.reset({ index: 0, routes: [{ name: "메인" }] });
      setErrorMsg("");
    }
  };
  const appleLoginProcess = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      let response;
      let data;
      if (credential.email !== null) {
        // 최초 로그인
        response = await fetch(
          `${server.address}/api/member?email=${credential.email}`
        );
        data = await response.json();
        if (data.id === 0) {
          // 회원이 없을 경우
          response = await fetch(`${server.address}/api/members`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credential.email,
              name:
                credential.fullName.familyName + credential.fullName.givenName,
              oauthuserid: credential.user,
              type: "Apple",
            }),
          });
          const result = await response.json();
          console.log(result);
          await SecureStore.setItemAsync("UserId", String(result.id));
          await SecureStore.setItemAsync("Email", result.email);
          await SecureStore.setItemAsync(
            "Name",
            credential.fullName.familyName + credential.fullName.givenName
          );
          navigation.reset({ index: 0, routes: [{ name: "추가입력" }] });
        } else {
          //회원이 있을 경우(기존 로컬 회원)
          console.log("이미 존재하는 회원");
          await SecureStore.setItemAsync("UserId", String(response.id));
          await SecureStore.setItemAsync("Email", response.email);
          await SecureStore.setItemAsync("NickName", response.nickname);
          await SecureStore.setItemAsync("IsLogin", "true");
          await SecureStore.setItemAsync("LoginType", "Local");
          navigation.reset({ index: 0, routes: [{ name: "메인" }] });
        }
      }
    } catch (e) {
      if (e.code === "ERR_CANCLED") {
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
            <Image
              style={{
                paddingTop: 50,
                width: "35%",
                height: "35%",
              }}
              source={require("../assets/login.png")}
            />
            {/* <Text style={styles.com_safeView_title_text}>로그인</Text> */}
          </View>
          <View style={styles.com_safeView_contents}>
            <View style={styles.login_safeView_contents_logoView}>
              <Text style={styles.login_safeView_contents_logoView_logoText}>
                {`걸음
한편`}
              </Text>
            </View>
            <View style={styles.login_safeView_contents_loginView}>
              <TextInput
                label="이메일"
                ref={emailRef}
                value={email}
                style={{ width: "100%", marginBottom: 10 }}
                textContentType="emailAddress"
                onChangeText={(val) => setEmail(val)}
                onSubmitEditing={() => passwordRef.current.focus()}
                mode="outlined"
              />
              <TextInput
                label="비밀번호"
                ref={passwordRef}
                secureTextEntry={true}
                value={password}
                textContentType="password"
                style={{ width: "100%", marginBottom: 10 }}
                onChangeText={(val) => setPassword(val)}
                onSubmitEditing={localLogin}
                mode="outlined"
              />
              <HelperText
                type="error"
                visible={errorMsg !== ""}
                style={{ fontSize: 13, marginBottom: 10 }}
              >
                {errorMsg}
              </HelperText>
              <View style={styles.login_safeView_contents_loginView_btnView}>
                <Button
                  style={{ marginRight: 30, width: 90 }}
                  mode="contained"
                  onPress={localLogin}
                >
                  로그인
                </Button>
                <Button
                  style={{ width: 90 }}
                  mode="outlined"
                  onPress={() => {
                    navigation.navigate("회원가입");
                  }}
                >
                  회원가입
                </Button>
              </View>
              <View>
                <Button onPress={() => navigation.navigate("찾기")}>
                  <Text style={{ textDecorationLine: "underline" }}>
                    아이디나 비밀번호를 잊어버리셨나요?
                  </Text>
                </Button>
              </View>
            </View>
            <View style={styles.login_safeView_contents_oAuthView}>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={5}
                style={{ width: 200, height: 44 }}
                onPress={appleLoginProcess}
              />
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
