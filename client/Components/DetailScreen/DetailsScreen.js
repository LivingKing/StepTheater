import React, { useCallback, useState } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { useFocusEffect } from "@react-navigation/core";
import * as SecureStore from "expo-secure-store";

import DetailScreen from "./DetailScreen";
import AllDetailScreen from "./AllDetailScreen";
import DetailMapScreen from "./DetailMapScreen"

const Stack = createStackNavigator();
const detailName = "걸음기록";
const allDetailName = "모든기록";
const detailMapName = "기록지도";

export default function SettingsScreen({ navigation }) {
  if (Platform.OS === "ios") {
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false, initScreen: DetailScreen }}
      >
        <Stack.Screen name={detailName} component={DetailScreen} />
        <Stack.Screen name={allDetailName} component={AllDetailScreen} />
        <Stack.Screen name={detailMapName} component={DetailMapScreen} />
      </Stack.Navigator>
    );
  } else {
    return null;
  }
}
