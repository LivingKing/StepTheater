import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import RouteScreen from "./RouteScreen";
import DetailScreen from "./DetailScreen";
import SettingsScreen from "./SettingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const homeName = "홈";
const routeName = "동선";
const detailName = "걸음 기록";
const settingsName = "설정";

export default function SettingsStackScreen() {
  if (Platform.OS === "ios") {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === homeName) {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === routeName) {
              iconName = focused ? "ios-walk" : "ios-walk-outline";
            } else if (route.name === detailName) {
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
        <Tab.Screen name={detailName} component={DetailScreen} />
        <Tab.Screen name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    );
  } else {
    return null;
  }
}
