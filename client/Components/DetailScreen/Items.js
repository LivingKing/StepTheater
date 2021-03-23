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

export default function Items(props) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  let nowNum = -1;
  let temp = 0;

  const polyColor = ["#B66866", "#B69366", "#446274", "#508F54"];

  if (Platform.OS === "ios") {
    console.log(props.route);

    return (
      <View style={{ width: "100%", height: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
            // refreshing={refreshing}
            // onRefresh={onRefresh}
            />
          }
        >
          <View
            style={{
              alignItems: "center",
              marginBottom: windowHeight * 0.15,
            }}
          >
            {props.route != undefined ? (
              props.route.data.map((item, index) => {
                temp = 0;
                let isEmpty = false;
                item.routes.map((content, index) => {
                  if (content.routeItems.length != 0) {
                    isEmpty = true;
                  }
                });

                if (isEmpty) {
                  return (
                    <Surface
                      key={index}
                      style={{
                        elevation: 1,
                        width: "95%",
                        alignSelf: "center",
                        justifyContent: "center",
                        paddingBottom: 20,
                        paddingTop: 17,
                        marginBottom: 15,
                        marginTop: 10,
                        backgroundColor: "white",
                        borderRadius: 10,
                      }}
                    >
                      <View
                        key={index}
                        style={{
                          width: "100%",
                          justifyContent: "center",

                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: windowHeight / 50,
                            fontFamily: "NotoRegular",
                            color: "#262223",
                            marginLeft: 20,
                            marginBottom: windowWidth / 40,
                          }}
                        >
                          {item.diaryDate.substring(0, 4) +
                            "년 " +
                            item.diaryDate.substring(6, 7) +
                            "월 " +
                            item.diaryDate.substring(8, 10) +
                            "일"}
                        </Text>
                        {item.routes.map((content, index) => {
                          if (
                            content.routeItems.length != 0 &&
                            content.routeItems.length != 1
                          ) {
                            nowNum++;
                            temp++;
                            let svgMinX;
                            let svgMinY;
                            let svgMaxX;
                            let svgMaxY;
                            let svgMidX;
                            let svgMidY;
                            let svgDeltaX;
                            let svgDeltaY;
                            let go;
                            if (content.routeItems.length != 0) {
                              let minX, maxX, minY, maxY;

                              // init first point
                              ((point) => {
                                minX = point.latitude;
                                maxX = point.latitude;
                                minY = point.longitude;
                                maxY = point.longitude;
                              })(content.routeItems[0]);

                              // calculate rect
                              content.routeItems.map((point) => {
                                minX = Math.min(minX, point.latitude);
                                maxX = Math.max(maxX, point.latitude);
                                minY = Math.min(minY, point.longitude);
                                maxY = Math.max(maxY, point.longitude);
                              });
                              // const midX = (minX + maxX) / 2;
                              // const midY = (minY + maxY) / 2;
                              // const deltaX = maxX - minX;
                              // const deltaY = maxY - minY;

                              svgMinX = [
                                minX.toString().substring(3, 5),
                                ".",
                                minX.toString().substring(5, 8),
                              ].join("");
                              svgMinY = [
                                minY.toString().substring(4, 6),
                                ".",
                                minY.toString().substring(6, 9),
                              ].join("");
                              svgMaxX = [
                                maxX.toString().substring(3, 5),
                                ".",
                                maxX.toString().substring(5, 8),
                              ].join("");
                              svgMaxY = [
                                maxY.toString().substring(4, 6),
                                ".",
                                maxY.toString().substring(6, 9),
                              ].join("");

                              svgDeltaX = (Number(svgMaxX) - Number(svgMinX))
                                .toString()
                                .substring(0, 5);
                              svgDeltaY = (Number(svgMaxY) - Number(svgMinY))
                                .toString()
                                .substring(0, 5);
                              svgMidX = (
                                (Number(svgMaxX) + Number(svgMinX)) /
                                2
                              )
                                .toString()
                                .substring(0, 6);
                              svgMidY = (
                                (Number(svgMaxY) + Number(svgMinY)) /
                                2
                              )
                                .toString()
                                .substring(0, 6);

                              // console.log(content.name);
                              // console.log(svgMinX);
                              // console.log(svgMinY);
                              // console.log(svgMidX);
                              // console.log(svgMidY);
                              // console.log(svgDeltaX);
                              // console.log(svgDeltaY);

                              if (svgDeltaX != 0) {
                                Number(svgDeltaY) > Number(svgDeltaX)
                                  ? (go =
                                      Number(
                                        svgMidX -
                                          svgDeltaY / 2 -
                                          svgDeltaY * 0.15
                                      ) +
                                      " " +
                                      Number(svgMinY - svgDeltaY * 0.15) +
                                      " " +
                                      svgDeltaY * 1.3 +
                                      " " +
                                      svgDeltaY * 1.3)
                                  : (go =
                                      Number(svgMinX - svgDeltaX * 0.15) +
                                      " " +
                                      Number(
                                        svgMidY -
                                          svgDeltaX / 2 -
                                          svgDeltaX * 0.15
                                      ) +
                                      " " +
                                      svgDeltaX * 1.3 +
                                      " " +
                                      svgDeltaX * 1.3);
                              }

                              // console.log(go);
                              // console.log("\n");
                            }
                            const svgPoint = content.routeItems
                              .map(
                                (p) =>
                                  `${[
                                    p.latitude.toString().substring(3, 5),
                                    ".",
                                    p.latitude.toString().substring(5, 8),
                                  ].join("")},${[
                                    p.longitude.toString().substring(4, 6),
                                    ".",
                                    p.longitude.toString().substring(6, 9),
                                  ].join("")}`
                              )
                              .join(" ");
                            // console.log(svgPoint);
                            // console.log(content.routeItems);
                            return (
                              // <Surface key={index} style={{ width: "95%", height: windowHeight / 7, alignSelf: "center", marginTop: 10, borderRadius: 7 }}>

                              //   <View style={{ width: "95%", height: windowHeight / 7, alignSelf: "center", marginTop: 10, borderRadius: 7 }}>
                              //     <Text>{content.name}</Text>
                              //   </View>

                              // </Surface>
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  // itemPressed(content);
                                  // setDayItem(item);
                                  console.log(props);
                                  props.navigation.push("기록지도", {
                                    nowItem: content,
                                    dayItem: item,
                                    routeData: props.routeInfo,
                                  });
                                }}
                              >
                                <View
                                  key={index}
                                  style={{
                                    width: "88%",
                                    alignSelf: "center",

                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View
                                    style={{
                                      width: 62,
                                      height: 62,
                                      backgroundColor:
                                        content.routeItems.length != 0
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
                                          content.routeItems.length == 0
                                            ? ""
                                            : Number(svgDeltaY) >
                                              Number(svgDeltaX)
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
                                  <View
                                    style={{
                                      width: "73%",
                                      height: "100%",
                                      borderTopWidth: temp == 1 ? 0 : 1,
                                      borderColor: "#e6e6e6",
                                    }}
                                  >
                                    {props.routeInfo !== undefined ? (
                                      props.routeInfo.data.map(
                                        (route, index) => {
                                          if (
                                            route.id == content.id &&
                                            route.distance != 0
                                          )
                                            return (
                                              <View
                                                style={{
                                                  width: "100%",
                                                  flexDirection: "row",
                                                  marginTop: windowWidth / 50,
                                                }}
                                                key={index}
                                              >
                                                <View
                                                  style={{
                                                    backgroundColor: "white",
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                  key={index}
                                                >
                                                  {temp == 1 ? (
                                                    <View
                                                      style={{
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "center",
                                                        height:
                                                          windowWidth / 20,
                                                        width: windowWidth / 11,
                                                        flexDirection: "row",
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: "#c6c6c6",
                                                        marginRight:
                                                          windowWidth / 80,
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize:
                                                            windowWidth / 33,
                                                          fontFamily:
                                                            "NotoBold",
                                                          color: "#c6c6c6",
                                                          marginTop:
                                                            -windowWidth / 90,
                                                        }}
                                                      >
                                                        First
                                                      </Text>
                                                    </View>
                                                  ) : (
                                                    <></>
                                                  )}

                                                  {route.distance >= 1 ? (
                                                    <View
                                                      style={{
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "center",
                                                        height:
                                                          windowWidth / 20,
                                                        width: windowWidth / 11,
                                                        flexDirection: "row",
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: "#C58B41",
                                                        marginRight:
                                                          windowWidth / 80,
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize:
                                                            windowWidth / 33,
                                                          fontFamily:
                                                            "NotoBold",
                                                          color: "#C58B41",
                                                          marginTop:
                                                            -windowWidth / 90,
                                                        }}
                                                      >
                                                        1km
                                                      </Text>
                                                    </View>
                                                  ) : route.distance >= 0.1 ? (
                                                    <View
                                                      style={{
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "center",
                                                        height:
                                                          windowWidth / 20,
                                                        width: windowWidth / 11,
                                                        flexDirection: "row",
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: "#C54441",
                                                        marginRight:
                                                          windowWidth / 80,
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize:
                                                            windowWidth / 33,
                                                          fontFamily:
                                                            "NotoBold",
                                                          color: "#C54441",
                                                          marginTop:
                                                            -windowWidth / 90,
                                                        }}
                                                      >
                                                        100m
                                                      </Text>
                                                    </View>
                                                  ) : (
                                                    <></>
                                                  )}

                                                  {route.minutes >= 5 ? (
                                                    <View
                                                      style={{
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "center",
                                                        height:
                                                          windowWidth / 20,
                                                        width: windowWidth / 11,
                                                        flexDirection: "row",
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: "#33AB3A",
                                                        marginRight:
                                                          windowWidth / 80,
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize:
                                                            windowWidth / 33,
                                                          fontFamily:
                                                            "NotoBold",
                                                          color: "#33AB3A",
                                                          marginTop:
                                                            -windowWidth / 90,
                                                        }}
                                                      >
                                                        5hr
                                                      </Text>
                                                    </View>
                                                  ) : route.minutes >= 1 ? (
                                                    <View
                                                      style={{
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "center",
                                                        height:
                                                          windowWidth / 20,
                                                        width: windowWidth / 11,
                                                        flexDirection: "row",
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: "#4aa2ad",
                                                        marginRight:
                                                          windowWidth / 80,
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize:
                                                            windowWidth / 33,
                                                          fontFamily:
                                                            "NotoBold",
                                                          color: "#4aa2ad",
                                                          marginTop:
                                                            -windowWidth / 90,
                                                        }}
                                                      >
                                                        1hr
                                                      </Text>
                                                    </View>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </View>
                                              </View>
                                            );
                                        }
                                      )
                                    ) : (
                                      <></>
                                    )}

                                    <Text
                                      style={{
                                        fontSize: windowWidth / 30,
                                        fontFamily: "NotoMedium",
                                        color: "#3f3f3f",
                                      }}
                                    >
                                      {content.name}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          }
                        })}
                      </View>
                    </Surface>
                  );
                }
              })
            ) : (
              <View>
                <Text>Loading...</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return null;
  }
}
