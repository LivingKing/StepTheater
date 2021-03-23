import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import RouteScreen from "./RouteScreen";
import DetailsScreen from "./DetailScreen/DetailsScreen";
import SettingsScreen from "./SettingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/core";
import { server } from "../app.json";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();
const homeName = "홈";
const routeName = "동선";
const detailsName = "걸음 기록";
const settingsName = "설정";

export default function SettingsStackScreen({ navigation }) {
  if (Platform.OS === "ios") {
    const checkState = async () => {
      if ((await SecureStore.getItemAsync("IsLogin")) === "true") {
        const data = await SecureStore.getItemAsync("UserId");
        const response = await fetch(`${server.address}/api/member?id=${data}`);
        const result = await response.json();
        console.log(result);
        if (result.id === 0) {
          await SecureStore.setItemAsync("IsLogin", "false");
          await SecureStore.deleteItemAsync("UserId");
          await SecureStore.deleteItemAsync("Email");
          await SecureStore.deleteItemAsync("NickName");
          await SecureStore.deleteItemAsync("LoginType");
          navigation.reset({ index: 0, routes: [{ name: "로그인" }] });
        }
      } else {
        navigation.reset({ index: 0, routes: [{ name: "로그인" }] });
      }
    };
    useFocusEffect(() => {
      checkState();
    });
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === homeName) {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === routeName) {
              iconName = focused ? "ios-walk" : "ios-walk-outline";
            } else if (route.name === detailsName) {
              iconName = focused ? "ios-calendar" : "ios-calendar-outline";
            } else if (route.name === settingsName) {
              iconName = focused ? "ios-settings" : "ios-settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#262223",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={routeName} component={RouteScreen} />
        <Tab.Screen name={detailsName} component={DetailsScreen} />
        <Tab.Screen name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    );
  } else {
    return null;
  }
}
