import React, { useCallback, useState } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { useFocusEffect } from "@react-navigation/core";
import * as SecureStore from "expo-secure-store";

import memberScreen from "./MemberScreen";
import settingScreen from "./SettingScreen";
import serviceScreen from "./ServiceScreen";
import preferencensScreen from "./PreferencesScreen";
const Stack = createStackNavigator();
const memberName = "회원정보";
const settingName = "상세설정";
const serviceName = "고객센터";
const preferencesName = "환경설정";

export default function SettingsScreen({ navigation }) {
  const [nickname, setNickname] = useState("");

  const getNickname = async () => {
    setNickname(await SecureStore.getItemAsync("NickName"));
  };
  useFocusEffect(
    useCallback(() => {
      getNickname();
    }, [])
  );
  if (Platform.OS === "ios") {
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false, initScreen: settingScreen }}
      >
        <Stack.Screen name={settingName} component={settingScreen} />
        <Stack.Screen name={memberName} component={memberScreen} />
        <Stack.Screen name={serviceName} component={serviceScreen} />
        <Stack.Screen name={preferencesName} component={preferencensScreen} />
      </Stack.Navigator>
    );
  } else {
    return null;
  }
}
