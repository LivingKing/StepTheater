import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as Font from "expo-font";
import LoginScreen from "./Components/LoginScreen";
import MainScreen from "./Components/MainScreen";
import FindScreen from "./Components/FindScreen";
import RegisterScreen from "./Components/RegisterScreen";
import AdditionScreen from "./Components/AdditionScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import theme from "./assets/theme";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const Stack = createStackNavigator();
const loginName = "로그인";
const mainName = "메인";
const findName = "찾기";
const regiName = "회원가입";
const addName = "추가입력";
export default function App() {
  const [isLogin, setIsLogin] = useState(async () => {
    return await SecureStore.getItemAsync("IsLogin");
  });
  const [stackLoading, SetStackLoading] = useState(true);
  const [loaded] = Font.useFonts({
    DoHyeon: require("./assets/fonts/DoHyeon-Regular.ttf"),
    NotoBlack: require("./assets/fonts/NotoSansKR-Black.otf"),
    NotoBold: require("./assets/fonts/NotoSansKR-Bold.otf"),
    NotoLight: require("./assets/fonts/NotoSansKR-Light.otf"),
    NotoMedium: require("./assets/fonts/NotoSansKR-Medium.otf"),
    NotoRegular: require("./assets/fonts/NotoSansKR-Regular.otf"),
    NotoThin: require("./assets/fonts/NotoSansKR-Thin.otf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={loginName} component={LoginScreen} />
          <Stack.Screen name={mainName} component={MainScreen} />
          <Stack.Screen name={findName} component={FindScreen} />
          <Stack.Screen name={regiName} component={RegisterScreen} />
          <Stack.Screen name={addName} component={AdditionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
