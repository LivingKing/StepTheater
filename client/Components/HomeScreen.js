import { StatusBar } from "expo-status-bar";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import styles from "../assets/styles";

import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/core";
import moment from "moment";
import { server } from "../app.json";

export default function HomeScreen({ navigation }) {
  const [wDays, setWDays] = useState(0);
  const showState = async () => {
    console.log(
      "IsLogin : " + (await SecureStore.getItemAsync("IsLogin")),
      "\nUserId : " + (await SecureStore.getItemAsync("UserId")),
      "\nEmail : " + (await SecureStore.getItemAsync("Email")),
      "\nNickname : " + (await SecureStore.getItemAsync("NickName")),
      "\nLoginType : " + (await SecureStore.getItemAsync("LoginType"))
    );
  };
  const getMemberData = async () => {
    const id = await SecureStore.getItemAsync("UserId");
    const response = await fetch(`${server.address}/api/member?id=${id}`);
    const result = await response.json();
    await SecureStore.setItemAsync("registerDate", result.registerDate);
  };

  const setWDaysData = async () => {
    console.log(await SecureStore.getItemAsync("registerDate"));
    setWDays(
      moment().diff(
        moment(await SecureStore.getItemAsync("registerDate")),
        "days"
      )
    );
    console.log(wDays);
  };
  useFocusEffect(
    useCallback(() => {
      getMemberData();
      setWDaysData();
    }, [])
  );
  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Image
              style={{
                width: "35%",
                height: "100%",
              }}
              source={require("../assets/main.png")}
            />
            {/* <Text style={styles.com_safeView_title_text}>걸음 한 편</Text> */}
          </View>
          <View style={styles.com_safeView_contents}>
            <ImageBackground
              source={require("../assets/bg11.png")}
              resizeMode="stretch"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 35,
                  fontFamily: "MapoFlower",
                  fontWeight: "800",
                  marginTop: 20,
                }}
              >
                발자국을{"\n"}기록한 지{"\n"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 50,
                    fontFamily: "MapoFlower",
                    fontWeight: "600",
                  }}
                >
                  {wDays}
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 35,
                    fontFamily: "MapoFlower",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  걸음째
                </Text>
              </View>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
