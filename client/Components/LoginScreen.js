import { StatusBar } from "expo-status-bar";
import React, { Fragment } from "react";
import { View, SafeAreaView, Platform, Text } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import styles from "../assets/styles";

export default function LoginScreen({ navigation }) {
  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Text style={styles.com_safeView_title_text}>로그인</Text>
          </View>
          <View style={styles.com_safeView_contents}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{ width: 200, height: 44 }}
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });
                  await SecureStore.setItemAsync("isLogin", "true");
                  navigation.navigate("메인");
                  console.log(credential);
                } catch (e) {
                  if (e.code === "ERR_CANCLED") {
                  } else {
                  }
                }
              }}
            />
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
