import { StatusBar } from "expo-status-bar";
import React, { Fragment } from "react";
import { Text, View, SafeAreaView, Platform } from "react-native";
import styles from "../assets/styles";

export default function HomeScreen({ navigation }) {
  console.log(navigation);
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
            <Text style={styles.com_safeView_contents_text}>
              {/* {`성공하지 못할 거라는 그릇된 믿음을 버리는 것이
              성공을 향한 첫걸음이다.
              
              -앤드류 매튜스-`} */}
              {`인생은 한 편의 영화다.
              
              -전현근-
              `}
            </Text>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
