import { StatusBar } from "expo-status-bar";
import React, { Fragment } from "react";
import { View, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../assets/styles";
export default function preferencensScreen({ navigation }) {
  return (
    <Fragment>
      <SafeAreaView style={styles.com_headers}>
        <StatusBar style="dark" />
      </SafeAreaView>
      <SafeAreaView style={styles.com_safeView}>
        <View style={styles.com_safeView_title}>
          <Ionicons
            name="ios-chevron-back"
            size={35}
            color="#262223"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.com_safeView_contents}></View>
      </SafeAreaView>
    </Fragment>
  );
}
