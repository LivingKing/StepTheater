import { StatusBar } from "expo-status-bar";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  Text,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  WeekCalendar,
  CalendarProvider,
  ExpandableCalendar,
  AgendaList,
} from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, IconButton, Button, List, Surface } from "react-native-paper";
import { LocaleConfig } from "react-native-calendars";
import styles from "../../assets/styles";
import styles_detail from "../../assets/styles_detail";
import Modal from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import ButtonToggleGroup from "react-native-button-toggle-group";
import RNAnimatedScrollIndicators from "react-native-animated-scroll-indicators";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/core";
import { server } from "../../app.json";

import Svg, { Polyline as Poly } from "react-native-svg";
import Items from "./Items";

export default function DetailMapScreen({ navigation, route }) {

  const polyColor = ["#B66866", "#B69366", "#446274", "#508F54"];
  const [isModalVisible3, setModalVisible3] = useState(false);

  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  const [mapviewInit, setMapviewInit] = useState();
  const getRegionForCoordinates = (points) => {
    let minX, maxX, minY, maxY;

    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
      // console.log(minX + " " + maxX);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = maxX - minX;
    const deltaY = maxY - minY;

    setMapviewInit({
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX + 0.001,
      longitudeDelta: deltaY + 0.001,
    });
    // console.log(mapviewInit);
  };
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [value, setValue] = useState("오늘");
  // const [nowItem, setNowItem] = useState();
  // const [dayItem, setDayItem] = useState();

  const [nowItem, setNowItem] = useState(route.params.nowItem);
  const dayItem = route.params.dayItem;
  const routeData = route.params.routeData;

  const [totalDistance, setTotalDistance] = useState(routeData.totalDistance);
  const [totalHours, setTotalHours] = useState(routeData.totalHours);
  const [totalMinutes, setTotalMinutes] = useState(routeData.totalMinutes);
  const [totalMarkers, setTotalMarkers] = useState(routeData.totalMarkers);
  let nowNum = -1;
  useFocusEffect(
    useCallback(() => {
      getRegionForCoordinates(nowItem.routeItems);
    }, [])
  );

  const [nowDiaryItem, setNowDiaryItem] = useState();

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>

        <SafeAreaView style={styles_detail.detail}>
          <View
            style={[
              styles_detail.detail_title2,
              { justifyContent: "space-between" },
            ]}
          >
            <IconButton
              size={windowWidth / 13}
              icon="chevron-left"
              color="#555555"
              style={{ backgroundColor: "white" }}
              onPress={() => {
                navigation.pop();
              }}
            />
            <View
              style={{
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: windowWidth / 35,
                  fontFamily: "NotoRegular",
                  color: "#777777",
                }}
              >
                {dayItem.diaryDate}
              </Text>
              <Text
                style={{
                  fontSize: windowWidth / 23,
                  fontFamily: "NotoMedium",
                  color: "#222222",
                }}
              >
                {nowItem.name}
              </Text>
            </View>
            <IconButton size={windowWidth / 13} icon="" />
          </View>

          <View style={{ flex: 0.95, backgroundColor: "white" }}>
            {nowDiaryItem != undefined ? (<Modal
              style={{
                margin: 0,
              }}
              isVisible={isModalVisible3}
              hasBackdrop={true}
              coverScreen={false}
              onBackdropPress={toggleModal3}
            >
              <View
                style={{
                  flex: 0.98,
                  backgroundColor: "white",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    flex: 0.04,
                    fontSize: 20,
                    fontWeight: "600",
                  }}
                >
                  {nowDiaryItem.title}
                </Text>
                <Image
                  resizeMode="stretch"
                  source={{ uri: nowDiaryItem.image_url }}
                  style={{
                    width: "90%",
                    flex: 0.6,
                    margin: 10,
                    borderRadius: 15,
                  }}
                />
                <Text
                  style={{
                    width: "90%",
                    flex: 0.3,
                    borderWidth: 1,
                    borderColor: "black",
                    textAlign: "center",
                    padding: 10,
                  }}
                >
                  {nowDiaryItem.description.trim()}
                </Text>

                <Button
                  style={{ margin: 10, flex: 0.065 }}
                  mode="contained"
                  onPress={toggleModal3}
                >
                  확인
                    </Button>
              </View>
            </Modal>) : (<></>)}
            <ScrollView>
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 7,
                  marginBottom: windowHeight * 0.1,
                }}
              >
                <View style={{ width: windowWidth, paddingTop: 1 }}>
                  {routeData !== undefined
                    ? routeData.data.map((route, index) => {
                      if (nowItem != undefined) {
                        if (route.id == nowItem.id)
                          return (
                            <View
                              style={{
                                width: "98%",
                                height: windowWidth / 6,

                                alignSelf: "center",
                                borderRadius: 10,

                                backgroundColor: "white",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                borderRadius: 10,
                              }}
                              key={index}
                            >
                              <View
                                style={{
                                  alignItems: "center",
                                  alignSelf: "center",
                                  height: "60%",
                                  width: "33.33%",

                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: windowWidth / 20,
                                    fontFamily: "NotoBold",
                                    color: "#3c3c3c",
                                    top: -windowHeight / 150,
                                  }}
                                >
                                  {route.distance.toFixed(2)}
                                  <Text
                                    style={{
                                      fontSize: windowWidth / 30,
                                      fontFamily: "NotoLight",
                                      color: "#3f3f3f",
                                    }}
                                  >
                                    km
                                    </Text>
                                </Text>
                                <Text
                                  style={{
                                    fontSize: windowWidth / 30,
                                    fontFamily: "NotoRegular",
                                    color: "#3f3f3f",
                                    top: -windowHeight / 150,
                                  }}
                                >
                                  거리
                                  </Text>
                              </View>
                              <View
                                style={{
                                  alignItems: "center",
                                  alignSelf: "center",
                                  height: "40%",
                                  width: "33.33%",
                                  borderLeftColor: "#eaeaea",
                                  borderLeftWidth: 1,
                                  borderRightColor: "#eaeaea",
                                  borderRightWidth: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: windowWidth / 20,
                                    fontFamily: "NotoBold",
                                    color: "#3c3c3c",
                                    top: -windowHeight / 150,
                                  }}
                                >
                                  {totalHours}:
                                    {route.minutes.toString().padStart(2, "0")}
                                  <Text
                                    style={{
                                      fontSize: windowWidth / 30,
                                      fontFamily: "NotoLight",
                                      color: "#3f3f3f",
                                    }}
                                  >
                                    분
                                    </Text>
                                </Text>
                                <Text
                                  style={{
                                    fontSize: windowWidth / 30,
                                    fontFamily: "NotoRegular",
                                    color: "#3f3f3f",
                                    top: -windowHeight / 150,
                                  }}
                                >
                                  시간
                                  </Text>
                              </View>

                              <View
                                style={{
                                  alignItems: "center",
                                  alignSelf: "center",
                                  height: "60%",
                                  width: "33.33%",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: windowWidth / 20,
                                    fontFamily: "NotoBold",
                                    color: "#3c3c3c",
                                    top: -windowHeight / 150,
                                  }}
                                >
                                  {route.markers}
                                  <Text
                                    style={{
                                      fontSize: windowWidth / 30,
                                      fontFamily: "NotoLight",
                                      color: "#3f3f3f",
                                    }}
                                  >
                                    개
                                    </Text>
                                </Text>
                                <Text
                                  style={{
                                    fontSize: windowWidth / 30,
                                    fontFamily: "NotoRegular",
                                    color: "#3f3f3f",
                                    top: -windowHeight / 150,
                                  }}
                                >
                                  마커
                                  </Text>
                              </View>
                            </View>
                          );
                      }
                    })
                    : ""}
                </View>

                <Surface
                  style={{
                    width: "95%",
                    height: (windowWidth / 3) * 2,
                    borderRadius: 15,
                    elevation: 1,
                  }}
                >
                  <MapView
                    style={{
                      width: "100%",
                      height: (windowWidth / 3) * 2,
                      borderRadius: 15,
                    }}
                    // initialRegion={mapviewInit}
                    region={mapviewInit}
                    zoomEnabled={false}
                    zoomTapEnabled={false}
                    rotateEnabled={false}
                    scrollEnabled={false}
                    pitchEnabled={false}
                  >
                    {nowItem !== undefined
                      ? nowItem.diaryItems.map((route, index) => {
                        return (
                          <Marker
                            key={index}
                            draggable
                            coordinate={{
                              latitude: route.latitude,
                              longitude: route.longitude,
                            }}
                            onPress={() => {
                              setNowDiaryItem(route);
                              toggleModal3();
                            }}
                          // centerOffset={{ x: 0, y: -22 }}
                          >
                            <Surface
                              style={styles.route_contents_map_marker_shadow}
                            >
                              <View
                                style={styles.route_contents_map_marker_wrap}
                              >
                                <Image
                                  source={{ uri: route.thumb_url }}
                                  style={
                                    styles.route_contents_map_marker_image
                                  }
                                />
                              </View>
                            </Surface>
                          </Marker>
                        );
                      })
                      : ""}
                    {nowItem != undefined ? (
                      <Polyline
                        // coordinates={smooth(smooth(nowItem.routeItems)).map(
                        //   ([latitude, longitude]) => ({
                        //     latitude,
                        //     longitude,
                        //   })
                        // )}
                        coordinates={nowItem.routeItems}
                        strokeColor="#ff0000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={8}
                      />
                    ) : (
                      <></>
                    )}
                  </MapView>
                </Surface>

                <ScrollView
                  style={{
                    width: "100%",
                    height: windowWidth / 3.7,
                    marginTop: 20,
                    marginBottom: -10,
                  }}
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {dayItem != undefined
                    ? dayItem.routes.map((route, index) => {
                      if (
                        route.routeItems.length != 0 &&
                        route.routeItems.length != 1
                      ) {
                        nowNum++;
                        let svgMinX;
                        let svgMinY;
                        let svgMidX;
                        let svgMidY;
                        let svgDeltaX;
                        let svgDeltaY;
                        let go;
                        let temp;
                        if (route.routeItems.length != 0) {
                          let minX, maxX, minY, maxY;

                          // init first point
                          ((point) => {
                            minX = point.latitude;
                            maxX = point.latitude;
                            minY = point.longitude;
                            maxY = point.longitude;
                          })(route.routeItems[0]);

                          // calculate rect
                          route.routeItems.map((point) => {
                            minX = Math.min(minX, point.latitude);
                            maxX = Math.max(maxX, point.latitude);
                            minY = Math.min(minY, point.longitude);
                            maxY = Math.max(maxY, point.longitude);
                          });

                          temp = route.routeItems.slice();
                          temp.map((point, index) => {
                            temp[index] = {
                              latitude: point.latitude - minX,
                              longitude: point.longitude - minY,
                            };
                          });

                          minX = maxX = minY = maxY = 0;
                          temp.map((point) => {
                            // console.log(point);
                            minX = Math.min(minX, point.latitude);
                            maxX = Math.max(maxX, point.latitude);
                            minY = Math.min(minY, point.longitude);
                            maxY = Math.max(maxY, point.longitude);
                          });

                          svgDeltaX = maxX - minX;
                          svgDeltaY = maxY - minY;
                          svgMidX = (maxX + minX) / 2;
                          svgMidY = (maxY + minY) / 2;
                          svgMinX = 0;
                          svgMinY = 0;

                          if (svgDeltaX != 0 || svgDeltaX != 0) {
                            const val =
                              svgDeltaY > svgDeltaX ? svgDeltaY : svgDeltaX;
                            go = `${svgMidX - val / 2 - val * 0.15} ${svgMidY - val / 2 - val * 0.15} ${val * 1.3} ${val * 1.3}`;
                          }
                        }

                        const svgPoint = temp
                          .map(
                            (p) =>
                              `${[p.latitude].join("")},${[p.longitude].join(
                                ""
                              )}`
                          )
                          .join(" ");
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setNowItem(route);
                              if (route.routeItems.length != 0) {
                                getRegionForCoordinates(route.routeItems);
                              }
                            }}
                            style={{
                              marginLeft: windowWidth / 100,
                              marginRight: windowWidth / 100,
                            }}
                          >
                            <View
                              style={{
                                width: 77,
                                height: 77,
                                backgroundColor:
                                  route.routeItems.length != 1
                                    ? "white"
                                    : "grey",
                                alignSelf: "center",
                                marginLeft: windowWidth / 50,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#e6e6e6",
                                marginTop: 5,
                                marginBottom: 5,
                              }}
                            >
                              {/* <Text>동선</Text> */}
                              <Svg
                                style={{
                                  transform: [{ rotate: "-90deg" }],
                                }}
                                // viewBox="-0.25 54.7 4.8 10"
                                // viewBox="0 55.15 4.40 300"
                                // viewBox="35.1751355963 0.02378590963 128.698668037 0.08597688504"
                                viewBox={go}
                                // viewBox={go != undefined ? svgMinX + " " + svgMinY + " " + 1 + " " + 3 : ""}
                                width="100%"
                                height="100%"
                              >
                                {/* <Svg height="100%" width="100%" viewBox="0 0 100 100"> */}
                                <Poly
                                  fill="none"
                                  stroke={polyColor[nowNum % 4]}
                                  strokeWidth={
                                    route.routeItems.length == 0
                                      ? ""
                                      : Number(svgDeltaY) > Number(svgDeltaX)
                                        ? Number(svgDeltaY) / 13
                                        : Number(svgDeltaX) / 13
                                  }
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={svgPoint}
                                // points="5.24928,8.90221 5.24930 9.5"
                                // points="0,55.15 1.10,55.43 2.20,55.98 3.30,56.01 4.40,56.09"
                                // fill="none"
                                // stroke="black"
                                // strokeWidth="1"
                                />
                              </Svg>
                            </View>
                            <Text
                              style={{
                                alignSelf: "center",
                                fontSize: windowWidth / 30,
                                fontFamily: "NotoRegular",
                                color: "#3f3f3f",
                              }}
                            >
                              {route.name.length > 6
                                ? route.name.slice(0, 6) + "..."
                                : route.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    })
                    : ""}
                </ScrollView>
                {nowItem !== undefined
                  ? nowItem.diaryItems.map((route, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          // itemPressed(content);
                          // setDayItem(item);
                          setNowDiaryItem(route);
                          toggleModal3();
                        }}
                        style={{
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <View
                          key={index}
                          style={{
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: "90%",
                              height: 1,
                              backgroundColor: "#f3f3f3",
                              marginTop: 20,
                            }}
                          ></View>
                          <View
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                              width: "95%",
                              marginTop: 20,
                              flexDirection: "row",
                              borderRadius: 10,
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <View
                              style={{
                                marginLeft: windowWidth / 30,
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                source={{ uri: route.thumb_url }}
                                style={{
                                  width: windowWidth / 6,
                                  height: windowWidth / 6,
                                  borderRadius: 5,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: "100%",
                                height: "100%",
                                paddingLeft: windowWidth / 20,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: windowHeight / 50,
                                  fontFamily: "NotoMedium",
                                  color: "#262223",
                                }}
                              >
                                {route.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: windowHeight / 70,
                                  fontFamily: "NotoRegular",
                                  color: "#262223",
                                }}
                              >
                                {route.description}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                  : ""}

                {/* <Button
                          mode="contained"
                          onPress={() => {
                            setModal(false);
                          }}
                        >
                          확인
                    </Button> */}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
