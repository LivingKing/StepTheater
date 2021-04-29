import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet, Text } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as Font from "expo-font";
import LoginScreen from "./Components/LoginScreen";
import MainScreen from "./Components/MainScreen";
import FindScreen from "./Components/FindScreen";
import RegisterScreen from "./Components/RegisterScreen";
import AdditionScreen from "./Components/AdditionScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
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
  LogBox.ignoreLogs(["__expo", "useEffect"]);
  const [stackLoading, setStackLoading] = useState(false);
  const [initScreen, setInitScreen] = useState("");
  const [fontsLoad, setFontsLoad] = useState(false);
  const loadFonts = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {}
    await Font.loadAsync({
      DoHyeon: require("./assets/fonts/DoHyeon-Regular.ttf"),
      NotoBlack: require("./assets/fonts/NotoSansKR-Black.otf"),
      NotoBold: require("./assets/fonts/NotoSansKR-Bold.otf"),
      NotoLight: require("./assets/fonts/NotoSansKR-Light.otf"),
      NotoMedium: require("./assets/fonts/NotoSansKR-Medium.otf"),
      NotoRegular: require("./assets/fonts/NotoSansKR-Regular.otf"),
      NotoThin: require("./assets/fonts/NotoSansKR-Thin.otf"),
      MapoFlower: require("./assets/fonts/MapoFlowerIsland.ttf"),
      DokLip: require("./assets/fonts/DokLip.ttf"),
    });
    setFontsLoad(true);
  };
  const getState = async () => {
    const isLogin = await SecureStore.getItemAsync("IsLogin");
    if (isLogin === "true") setInitScreen(mainName);
    else setInitScreen(loginName);
    await SplashScreen.hideAsync();
  };
  useEffect(() => {
    if (!fontsLoad) loadFonts();
    if (initScreen === "") getState();

    if (fontsLoad && initScreen !== "") {
      setStackLoading(true);
    } else {
      setStackLoading(false);
    }
  });
  return (
    stackLoading && (
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false, initScreen: initScreen }}
          >
            <Stack.Screen name={loginName} component={LoginScreen} />
            <Stack.Screen name={mainName} component={MainScreen} />
            <Stack.Screen name={findName} component={FindScreen} />
            <Stack.Screen name={regiName} component={RegisterScreen} />
            <Stack.Screen name={addName} component={AdditionScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    )
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
