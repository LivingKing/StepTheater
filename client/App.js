import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Components/HomeScreen";
import RouteScreen from "./Components/RouteScreen";
import DetailScreen from "./Components/DetailScreen";
import SettingsScreen from "./Components/SettingsScreen";

const Tab = createBottomTabNavigator();
const homeName = "홈";
const routeName = "동선";
const detailName = "걸음 기록";
const settingsName = "설정";

export default function App() {
  const [loaded] = Font.useFonts({
    DoHyeon: require("./assets/fonts/DoHyeon-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
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
    </NavigationContainer>
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
