import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import * as SecureStore from "expo-secure-store";
import * as Font from "expo-font";
import LoginScreen from "./Components/LoginScreen";
import MainScreen from "./Components/MainScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const loginName = "로그인";
const mainName = "메인";
export default function App() {
  const [isLogin, setIsLogin] = useState();
  const [loaded] = Font.useFonts({
    DoHyeon: require("./assets/fonts/DoHyeon-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  const getState = async () => {
    const state = await SecureStore.getItemAsync("isLogin").catch(async () => {
      return await SecureStore.setItemAsync("isLogin", "true");
    });
    setIsLogin(state);
  };
  const setInitScreen = () => {
    if (isLogin) return mainName;
    else return loginName;
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={setInitScreen}
      >
        <Stack.Screen name={loginName} component={LoginScreen} />
        <Stack.Screen name={mainName} component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  // return <NavigationContainer>{switchNav()}</NavigationContainer>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
