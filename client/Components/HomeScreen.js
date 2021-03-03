import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect } from "react";
import { Text, View, SafeAreaView, Platform } from "react-native";
import styles from "../assets/styles";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) {
  const showState = async () => {
    console.log(
      "IsLogin : " + (await SecureStore.getItemAsync("IsLogin")),
      "\nUserId : " + (await SecureStore.getItemAsync("userId")),
      "\nEmail : " + (await SecureStore.getItemAsync("Email")),
      "\nNickname : " + (await SecureStore.getItemAsync("NickName")),
      "\nLoginType : " + (await SecureStore.getItemAsync("LoginType"))
    );
  };
  useEffect(() => {
    // showState();
  });
  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Text style={styles.com_safeView_title_text}>걸음 한 편</Text>
          </View>
          <View style={styles.com_safeView_contents}>
            <MapView>
              <Polyline
                coordinates={[
                  { latitude: 37.8025259, longitude: -122.4351431 },
                  { latitude: 37.7896386, longitude: -122.421646 },
                  { latitude: 37.7665248, longitude: -122.4161628 },
                  { latitude: 37.7734153, longitude: -122.4577787 },
                  { latitude: 37.7948605, longitude: -122.4596065 },
                  { latitude: 37.8025259, longitude: -122.4351431 },
                ]}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeColors={[
                  "#7F0000",
                  "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
                  "#B24112",
                  "#E5845C",
                  "#238C23",
                  "#7F0000",
                ]}
                strokeWidth={6}
              />
            </MapView>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
