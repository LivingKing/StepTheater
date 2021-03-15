import { StatusBar } from "expo-status-bar";
import React, { Fragment } from "react";
import { View, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import styles from "../assets/styles";
export default function MemberScreen({ navigation }) {
  const logout = async () => {
    await SecureStore.setItemAsync("IsLogin", "false");
    await SecureStore.deleteItemAsync("UserId");
    await SecureStore.deleteItemAsync("Email");
    await SecureStore.deleteItemAsync("NickName");
    await SecureStore.deleteItemAsync("LoginType");
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
            size={35}
            color="#262223"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.com_safeView_contents}>
          <View style={{ flexDirection: "row" }}>
            <Button mode="text" onPress={logout}>
              로그아웃
            </Button>
            <Button mode="text" color="red" onPress={() => {}}>
              회원탈퇴
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}
