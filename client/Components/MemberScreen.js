import { StatusBar } from "expo-status-bar";
import React, { Fragment, useRef, useState, useCallback } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  Checkbox,
  Portal,
  Dialog,
  Paragraph,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/core";
import styles from "../assets/styles";
import { server } from "../app.json";

export default function MemberScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickName] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [image, setImage] = useState(null);
  const [thumbImage, setThumbImage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [infoDialogVisble, setInfoDialogVisible] = useState(false);
  const [sucDialogVisible, setSucDialogVisible] = useState(false);
  const [failDialogVisble, setFailDialogVisible] = useState(false);
  const nickNameRef = useRef();

  useFocusEffect(
    useCallback(() => {
      setInfomation();
    }, [])
  );
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
    setNickName(await SecureStore.getItemAsync("NickName"));
    setName(await SecureStore.getItemAsync("Name"));
    setImage(await SecureStore.getItemAsync("Image_Url"));
    const location = await SecureStore.getItemAsync("Location_Checked");
    const privacy = await SecureStore.getItemAsync("Privacy_Checked");
    setLocationChecked(location === "true" ? true : false);
    setPrivacyChecked(privacy === "true" ? true : false);
    if (location === "true" && privacy === "true") {
      setAllChecked(true);
    }
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
      form.imageUrl = image;
      form.thumbUrl = thumbImage;

      const response = await fetch(`${server.address}/api/member/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: form.nickname,
          privacy: form.privacy,
          location: form.location,
          image_url: form.imageUrl,
          thumb_url: form.thumbUrl,
        }),
      });
      if (response.ok) {
        setSucDialogVis();
        const data = await response.json();
        await SecureStore.setItemAsync("NickName", data.nickname);
        await SecureStore.setItemAsync(
          "Location_Checked",
          String(data.location)
        );
        await SecureStore.setItemAsync("Image_Url", String(data.image_url));
        await SecureStore.setItemAsync("Thumb_Url", String(data.thumb_url));
        await SecureStore.setItemAsync(
          "Location_Checked",
          String(locationChecked)
        );
        await SecureStore.setItemAsync(
          "Privacy_Checked",
          String(privacyChecked)
        );
      } else {
        setFailDialogVis();
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      setIsImageLoading(true);
      const form = new FormData();

      form.append("key", "7ea0466a1e47a7bede0c9d28bd16c4db");
      form.append("image", result.base64);
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });
      const res = await response.json();
      console.log(res.data);
      setThumbImage(res.data.thumb.url);
      setImage(res.data.medium.url);
    }
    setIsImageLoading(false);
  };

  const logout = async () => {
    await SecureStore.setItemAsync("IsLogin", "false");
    await SecureStore.deleteItemAsync("UserId");
    await SecureStore.deleteItemAsync("Email");
    await SecureStore.deleteItemAsync("NickName");
    await SecureStore.deleteItemAsync("LoginType");
    await SecureStore.deleteItemAsync("Image_Url");
    await SecureStore.deleteItemAsync("Thumb_Url");
    await SecureStore.deleteItemAsync("Location_Checked");
    await SecureStore.deleteItemAsync("Privacy_Checked");
    await SecureStore.deleteItemAsync("Name");
    navigation.reset({ index: 0, routes: [{ name: "로그인" }] });
  };
  return (
    <Fragment>
      <SafeAreaView style={styles.com_headers}>
        <StatusBar style="dark" />
      </SafeAreaView>
      <SafeAreaView style={styles.com_safeView}>
        <View style={styles.com_safeView_title}>
          <Ionicons
            name="ios-chevron-back"
            style={{ marginLeft: 10 }}
            size={35}
            color="#262223"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.com_safeView_contents}>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexGrow: 1,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "40%",
                flexGrow: 5,
                flexShrink: 1,
                flexBasis: 0,
                borderWidth: "2",
                margin: 10,
              }}
            >
              {isImageLoading && <ActivityIndicator size="large" />}
              {!isImageLoading && image !== "null" && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={pickImage}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  ></Image>
                </TouchableOpacity>
              )}
              {image === "null" && !isImageLoading && (
                <Ionicons
                  name="add"
                  size={80}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  color="black"
                  onPress={pickImage}
                />
              )}
            </View>
            <View style={styles.member_safeView_contents_memberView}>
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
                    style={{
                      textDecorationLine: "underline",
                      fontSize: 12,
                    }}
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  mode="contained"
                  style={{ width: 200, height: 50, alignItems: "center" }}
                  onPress={update}
                >
                  <Text style={styles.com_safeView_btn}>정보 수정</Text>
                </Button>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Button mode="text" onPress={logout}>
                  로그아웃
                </Button>
                <Button mode="text" color="red" onPress={() => {}}>
                  회원탈퇴
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
        <Portal>
          <Dialog
            visible={sucDialogVisible}
            onDismiss={() => setSucDialogVisible(false)}
          >
            <Dialog.Title style={{ textAlign: "center" }}>
              <Text style={styles.regi_dialog_title}>회원정보 수정 성공!</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph style={styles.regi_dialog_contents}>
                {`회원 정보가 수정되었습니다.`}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setSucDialogVisible(false);
                  navigation.goBack();
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
      </SafeAreaView>
    </Fragment>
  );
}
