import { StatusBar } from "expo-status-bar";
import React, { Fragment, useCallback, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import styles from "../assets/styles";
import { Divider, List } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/core";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { expo } from "../app.json";

export default function SettingScreen({ navigation }) {
  const [nickname, setNickname] = useState("");

  const getNickname = async () => {
    setNickname(await SecureStore.getItemAsync("NickName"));
  };
  useFocusEffect(
    useCallback(() => {
      getNickname();
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
                marginLeft: -10,
              }}
              source={require("../assets/settings.png")}
            />
            {/* <Text style={styles.com_safeView_title_text}>설정</Text> */}
          </View>
          <View style={styles.com_safeView_contents}>
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{ flex: 1 }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  marginBottom: 20,
                  flex: 1,
                }}
              >
                <List.Item
                  title={
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "baseline" }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            fontWeight: "700",
                            fontFamily: "DoHyeon",
                            color: "#262223",
                          }}
                        >
                          {nickname}
                        </Text>
                        <Text>님!</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "baseline" }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            fontFamily: "DoHyeon",
                            color: "#262223",
                          }}
                        >
                          걸음 한 편
                        </Text>
                        <Text> 어떠신가요?</Text>
                      </View>
                    </View>
                  }
                  right={() => (
                    <View style={{ justifyContent: "center" }}>
                      <Ionicons
                        name="ios-chevron-forward"
                        size={20}
                        color="#262223"
                      />
                    </View>
                  )}
                  style={{ flex: 0.2, justifyContent: "center" }}
                  onPress={() => {
                    navigation.push("회원정보");
                  }}
                />
                <Divider />
                <List.Item
                  title="고객센터"
                  right={() => (
                    <View style={{ justifyContent: "center" }}>
                      <Ionicons
                        name="ios-chevron-forward"
                        size={20}
                        color="#262223"
                      />
                    </View>
                  )}
                  onPress={() => {
                    navigation.push("고객센터");
                  }}
                />
                <Divider />
                <List.Item
                  title="환경설정"
                  right={() => (
                    <View style={{ justifyContent: "center" }}>
                      <Ionicons
                        name="ios-chevron-forward"
                        size={20}
                        color="#262223"
                      />
                    </View>
                  )}
                  onPress={() => {
                    navigation.push("환경설정");
                  }}
                />
                <Divider />
                <List.Item
                  title="약관 및 정책"
                  right={() => (
                    <View style={{ justifyContent: "center" }}>
                      <Ionicons
                        name="ios-chevron-forward"
                        size={20}
                        color="#262223"
                      />
                    </View>
                  )}
                  onPress={() => {}}
                />
                <Divider />
                <List.Item
                  title={`현재 버전 ${expo.version}`}
                  onPress={() => {}}
                />
                <Divider />
              </View>
              <Text
                style={{
                  textAlign: "center",
                  color: "gray",
                  fontSize: 11,
                  marginBottom: 20,
                }}
              >
                {" "}
                Copyright Livingin, All Rights Reserved.
              </Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
