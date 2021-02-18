import { StatusBar } from "expo-status-bar";
import React, { Fragment } from "react";
import { Text, View, SafeAreaView, Platform, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import styles from "../assets/styles";

const SettingsStack = createStackNavigator();
export default function SettingsScreen({ navigation }) {
  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Text style={styles.com_safeView_title_text}>설정</Text>
          </View>
          <View style={styles.com_safeView_contents}></View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
