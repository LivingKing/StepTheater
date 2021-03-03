import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  Text,
  NativeModules,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import ViewShot from "react-native-view-shot";
import * as Location from "expo-location";
import styles from "../assets/styles";
import { getDistance } from "geolib";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import * as ImageManipulator from "expo-image-manipulator";

export default function RouteScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [polyLine, setPolyLine] = useState([]);
  const [prevLine, setPrevLine] = useState(null);
  const [count, setCount] = useState(0);
  const [output, setOutput] = useState(null);
  const captureRef = useRef();

  const getPhotoUrl = async () => {
    const url = await captureRef.current.capture();
    const result = await ImageManipulator.manipulateAsync(url, [], {
      base64: true,
    });
    return result.base64;
  };
  var smooth = require("smooth-polyline");

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    setErrorMsg(null);
    //console.log(status);
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    //console.log(location);
    setLocation(location);
    setPrevLine({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const getDate = async () => {
    await SecureStore.getItemAsync("today")
      .then(async (date) => {
        const id = await SecureStore.getItemAsync("UserId");
        const response = await fetch(
          `http://203.241.228.112:11200/api/diary?id=${id}&&date=${date}`
        );
        const data = await response.json();
        if (data.count === 0) {
          await fetch("http://203.241.228.112:11200/api/diary", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
              date: date,
            }),
          });
        }
      })
      .catch(
        await SecureStore.setItemAsync("today", moment().format("yyyy-MM-DD"))
      );
  };

  useEffect(() => {
    getLocation();
    getDate();
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
                showsUserLocation={true}
                followsUserLocation={true}
                onRegionChangeComplete={(Region) => {}}
                onUserLocationChange={(e) => {
                  try {
                    const newLine = [
                      e.nativeEvent.coordinate.latitude,
                      e.nativeEvent.coordinate.longitude,
                    ];
                    // console.log(
                    //   "distance : " + getDistance(prevLine, { ...newLine })
                    // );

                    if (getDistance(prevLine, { ...newLine }) >= 10) {
                      // console.log("count : " + count);
                      if (count == 0) {
                        setPolyLine([
                          ...polyLine,
                          [location.coords.latitude, location.coords.longitude],
                        ]);
                      }
                      setPolyLine([...polyLine, newLine]);
                      // console.log(smooth(polyLine));

                      setOutput(
                        smooth(smooth(polyLine)).map(
                          ([latitude, longitude]) => ({
                            latitude,
                            longitude,
                          })
                        )
                      );
                      // console.log(output);

                      setPrevLine(newLine);
                      var temp = count + 1;
                      setCount(temp);
                    }
                  } catch (e) {
                    console.log("User Location Not Found");
                    const test = async () => {
                      const id = await SecureStore.getItemAsync("UserId");
                      const date = await SecureStore.getItemAsync("today");
                      const url = await getPhotoUrl();
                      let body = new FormData();
                      body.append("key", "7ea0466a1e47a7bede0c9d28bd16c4db");
                      body.append("image", url);
                      const imageUrl = await fetch(
                        "https://api.imgbb.com/1/upload",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                          body: body,
                        }
                      );
                      console.log(await imageUrl.json());
                      const response = await fetch(
                        "http://203.241.228.112:11200/api/route",
                        {
                          method: "POST",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: id,
                            date: date,
                            data: polyLine,
                          }),
                        }
                      );
                    };
                    if (polyLine.length > 1) test();
                  }
                }}
              >
                <ViewShot
                  ref={captureRef}
                  options={{ format: "png", quality: 0.9 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Polyline
                    coordinates={output}
                    strokeColor="#ff0000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={8}
                  />
                </ViewShot>
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
