import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useState } from "react";
import { View, SafeAreaView, Platform, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "../assets/styles";

export default function RouteScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      setErrorMsg(null);
      console.log(status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Text style={styles.com_safeView_title_text}>동선</Text>
          </View>
          <View style={styles.com_safeView_contents}>
            <Text style={{ flex: 1 }}>location : {text}</Text>
            {location !== null && (
              <MapView
                style={styles.route_safeView_contents_map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                rotateEnabled={false}
                onRegionChangeComplete={(Region) => {
                  console.log(Region);
                }}
              >
                <Marker
                  draggable
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                />
              </MapView>
            )}
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
