import { StatusBar } from "expo-status-bar";
import React, { Fragment } from "react";
import { View, SafeAreaView, Platform } from "react-native";
import styles from "../assets/styles";

export default function RouteScreen() {
  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_contents}></View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
