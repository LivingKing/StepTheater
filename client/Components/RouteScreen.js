import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useState } from "react";
import { View, SafeAreaView, Platform, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import styles from "../assets/styles";
import { getDistance } from "geolib";

export default function RouteScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [polyLine, setPolyLine] = useState([]);
  const [prevLine, setPrevLine] = useState(null);
  const [count, setCount] = useState(0);
  const [output, setOutput] = useState(null);
  var smooth = require("smooth-polyline");

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  onUserLocationChange = (coordinate) => {
    console.log(coordinate);
  };

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
                followsUserLocation={false}
                onRegionChangeComplete={(Region) => {}}
                onUserLocationChange={(e) => {
                  const newLine = [
                    e.nativeEvent.coordinate.latitude,
                    e.nativeEvent.coordinate.longitude,
                  ];
                  console.log(
                    "distance : " + getDistance(prevLine, { ...newLine })
                  );

                  if (getDistance(prevLine, { ...newLine }) >= 10) {
                    console.log("count : " + count);
                    if (count == 0) {
                      setPolyLine([
                        ...polyLine,
                        [location.coords.latitude, location.coords.longitude],
                      ]);
                    }
                    setPolyLine([...polyLine, newLine]);
                    console.log(smooth(polyLine));

                    setOutput(
                      smooth(smooth(polyLine)).map(([latitude, longitude]) => ({
                        latitude,
                        longitude,
                      }))
                    );
                    console.log(output);

                    setPrevLine(newLine);
                    var temp = count + 1;
                    setCount(temp);
                  }
                }}
              >
                <Polyline
                  coordinates={output}
                  strokeColor="#ff0000" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={8}
                />
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
