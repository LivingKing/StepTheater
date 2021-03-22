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
import { Avatar, IconButton, Button, List, Surface } from "react-native-paper";
import { LocaleConfig } from "react-native-calendars";
import styles from "../assets/styles";
import styles_detail from "../assets/styles_detail";
import Modal from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import ButtonToggleGroup from "react-native-button-toggle-group";
import RNAnimatedScrollIndicators from "react-native-animated-scroll-indicators";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/core";
import { server } from "../app.json";

import Svg, { Polyline as Poly } from 'react-native-svg';

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};

LocaleConfig.defaultLocale = "ko";
export default function DetailScreen() {
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalMarkers, setTotalMarkers] = useState(0);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [markedDates, setMarkedDates] = React.useState({});
  const [modal, setModal] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [isList, setIsList] = useState(false);
  const toggleList = () => {
    setIsList(!isList);
  };
  const scrollX = new Animated.Value(0);

  let nowNum = -1;
  let temp = 0;

  const [data, setData] = useState();
  const [todayDate, setTodayDate] = useState();

  const [dayItem, setDayItem] = useState();

  const getMonth = async () => {
    if (data == undefined) {
      const id = await SecureStore.getItemAsync("UserId");
      const today = await SecureStore.getItemAsync("today");
      const response = await fetch(
        `${server.address}/api/diary/date?id=${id}&date=${today}&type=month`
        // `${server.address}/api/diary/date?id=1&&date=2021-03-17&&type=month`
      );
      const result = await response.json();
      setData(result);
      setRefreshing(false);
    }
  };

  const [mapviewInit, setMapviewInit] = useState();
  const getRegionForCoordinates = (points) => {
    // console.log(points);
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
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


  const polyColor = [
    "#B66866",
    "#B69366",
    "#446274",
    "#508F54",
  ];

  const getDate = async () => {
    if (data == undefined) {
      await SecureStore.getItemAsync("todayDate")
        .then(async (date) => {
          setTodayDate(date);
        })
        .catch(
          await SecureStore.setItemAsync(
            "todayDate",
            moment().format("yyyy-MM-DD")
          )
        );
    }
  };
  const [routeData, setRouteData] = useState();
  const getRouteData = async () => {
    const id = await SecureStore.getItemAsync("UserId");
    const today = await SecureStore.getItemAsync("today");

    const response = await fetch(
      `${server.address}/api/routes?id=${id}&date=${today}&type=month`
    );
    const result = await response.json();
    setRouteData(result);
    setTotalDistance(result.totalDistance);
    setTotalHours(result.totalHours);
    setTotalMinutes(result.totalMinutes);
    setTotalMarkers(result.totalMarkers);
  };
  const getSettings = async () => {
    setNickname(await SecureStore.getItemAsync("NickName"));
  };

  useFocusEffect(
    useCallback(() => {
      getMonth();
      getDate();
      getRouteData();
      getSettings();
      //console.log(data.data);
    }, [])
  );

  const setNewDaySelected = (date) => {
    const markedDate = Object.assign({});
    markedDate[date] = {
      selected: true,
      selectedColor: "#522486",
    };
    //console.log(markedDate);
    setSelectedDate(date);
    setMarkedDates(markedDate);
  };


  const getTheme = () => {
    return {
      textMonthFontFamily: "NotoLight",
      textMonthFontSize: 16,

      selectedDayBackgroundColor: "red",
      selectedDayTextColor: "white",

      todayTextColor: "red",
      dayTextColor: "#2d4150",
      textDisabledColor: "#d9e1e8",

      dotColor: "#e6e6e6",
      selectedDotColor: "#ffffff",

      monthTextColor: "black",
    };
  };
  function getFutureDates(days) {
    const array = [];
    for (let index = 1; index <= days; index++) {
      const date = new Date(Date.now() + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
      const dateString = date.toISOString().split("T")[0];
      array.push(dateString);
    }
    return array;
  }

  function getPastDate(days) {
    return new Date(Date.now() - 864e5 * days).toISOString().split("T")[0];
  }
  const today = new Date().toISOString().split("T")[0];
  const fastDate = getPastDate(3);
  const futureDates = getFutureDates(9);
  const dates = [fastDate, today].concat(futureDates).concat(["2021-04-01"]);

  const ITEMS = [
    { title: dates[0], data: [{ title: "First Route" }] },
    { title: dates[1], data: [{ title: "Second Route" }] },
    { title: dates[2], data: [{ title: "Third Route" }] },
    { title: dates[3], data: [{ title: "4 Route" }] },
    { title: dates[4], data: [{ title: "5 Route" }] },
    { title: dates[5], data: [{ title: "6 Route" }] },
    { title: dates[6], data: [{ title: "7 Route" }] },
    { title: dates[7], data: [{ title: "8 Route" }] },
    { title: dates[8], data: [{ title: "9 Route" }] },
    { title: dates[9], data: [{ title: "10 Route" }] },
    { title: dates[10], data: [{ title: "11 Route" }] },
    { title: dates[11], data: [{ title: "12 Route" }] },
  ];

  const aa = {
    "2021-03-01": { disabled: false },
    "2021-03-02": { disabled: false },
    "2021-03-03": { disabled: false },
  };

  const enabledMark = {};
  dates.map((x) => {
    enabledMark[x] = {
      disabled: false,
    };
  });

  const [nowItem, setNowItem] = useState();
  const itemPressed = (item) => {
    setNowItem(item);
    if (item.routeItems.length != 0) {
      getRegionForCoordinates(item.routeItems);
    }

    setModal(true);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { }} style={styles_detail.item}>
        <View>
          <Text style={styles_detail.itemHourText}>동선</Text>
          <Text style={styles_detail.itemDurationText}>동선</Text>
        </View>
        <Text style={styles_detail.itemTitleText}>{item.title}</Text>
        <View style={styles_detail.itemButtonContainer}></View>
      </TouchableOpacity>
    );
  };

  const [value, setValue] = useState("오늘");

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      getMonth();
      setRefreshing(false);
    });
  }, []);

  const [isMain, setIsMain] = useState(true);

  const toggleMain = () => {
    setIsMain(!isMain);
  };

  const isCloseToBottom = (e) => {
    const paddingToBottom = 20;
    return (
      e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >=
      e.nativeEvent.contentSize.height - paddingToBottom
    );
  };

  const [nowY, setNowY] = useState(0);
  const handleScroll = (e) => {
    // console.log(e.nativeEvent.contentOffset.y);
    setNowY(e.nativeEvent.contentOffset.y);
    if (isCloseToBottom(e)) {
      // console.log("bottom");
    }
  };

  const [nickname, setNickname] = useState("");

  const divHeight = windowHeight / 15;

  var smooth = require("smooth-polyline");

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>

        <SafeAreaView style={styles_detail.detail}>
          <View
            style={{
              height: windowHeight / 10,
              width: "100%",
              backgroundColor: "white",
              zIndex: 15,
              position: "absolute",
              top: -50,
              left: 0,
            }}
          />

          {modal ? (
            <View style={styles_detail.detail_title3}>
              {/* <Avatar.Image size={windowWidth / 15} source={require('../assets/icon.png')} /> */}
              <IconButton
                icon={"keyboard-backspace"}
                color="#555555"
                size={20}
                onPress={() => { setModal(false) }}
                style={{ alignSelf: "center" }}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>

                <Text
                  style={{
                    fontSize: windowWidth / 30,
                    fontFamily: "NotoRegular",
                    color: "#a6a6a6",
                    marginTop: windowWidth / 25,
                  }}
                >
                  2021-03-19
                </Text>
                <Text
                  style={{
                    fontSize: windowWidth / 23,
                    fontFamily: "NotoBold",
                    color: "#262223",
                  }}
                >
                  {nowItem.name}
                </Text>

              </View>


              <IconButton
                icon={""}
                color="#555555"
                size={20}
                style={{ alignSelf: "center" }}
              />

            </View>
          ) : isMain ? (
            nowY > divHeight ? (
              <View style={styles_detail.detail_title3}>
                <Avatar.Image
                  size={windowWidth / 15}
                  source={require("../assets/icon.png")}
                />
                <Text
                  style={{
                    fontSize: windowWidth / 24,
                    fontFamily: "NotoMedium",
                    color: "#262223",
                    marginLeft: 7,
                  }}
                >
                  {nickname}
                  <Text
                    style={{
                      fontSize: windowWidth / 24,
                      fontFamily: "NotoLight",
                      color: "#262223",
                    }}
                  >
                    님의 동선
                  </Text>
                </Text>
              </View>
            ) : (
              <View
                style={
                  nowY <= 0
                    ? styles_detail.detail_title
                    : styles_detail.detail_title2
                }
              >
                <Text style={styles_detail.detail_title_text}>걸음 기록</Text>
              </View>
            )
          ) : (
            <View style={styles_detail.detail_title}>
              <IconButton
                icon={"keyboard-backspace"}
                color="#555555"
                size={20}
                onPress={toggleMain}
                style={{ alignSelf: "center" }}
              />
              <Text
                style={{
                  textAlignVertical: "auto",
                  fontSize: windowHeight / 50,
                  fontFamily: "NotoMedium",
                  color: "#262223",
                  marginLeft: 15,
                }}
              >
                걸음 기록
              </Text>
              <IconButton
                icon={isList ? "format-list-bulleted" : "calendar-today"}
                color="#555555"
                size={20}
                onPress={toggleList}
                style={{ alignSelf: "center" }}
              />
            </View>
          )}

          <View style={styles_detail.detail_contents}>
            {isMain ? (
              <View style={{ flex: 1, backgroundColor: "white" }}>
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    paddingLeft: windowWidth / 18,
                    width: "100%",
                    height: nowY > 0 ? divHeight - nowY : divHeight,
                    backgroundColor: "white",
                    zIndex: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      height: "100%",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Avatar.Image
                      size={windowWidth / 10}
                      source={require("../assets/icon.png")}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: "100%",
                        width: "88%",
                        backgroundColor: "white",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: windowWidth / 24,
                            fontFamily: "NotoMedium",
                            color: "#262223",
                            marginLeft: 7,
                          }}
                        >
                          {nickname}
                          <Text
                            style={{
                              fontSize: windowWidth / 24,
                              fontFamily: "NotoLight",
                              color: "#262223",
                            }}
                          >
                            님의 동선
                          </Text>
                        </Text>

                        <Text
                          style={{
                            fontSize: windowWidth / 32,
                            fontFamily: "NotoLight",
                            color: "#262223",
                            marginLeft: 7,
                          }}
                        >
                          걸음 한 편,{" "}
                          <Text
                            style={{
                              fontSize: windowWidth / 32,
                              fontFamily: "NotoMedium",
                              color: "#262223",
                            }}
                          >
                            0
                            <Text
                              style={{
                                fontSize: windowWidth / 32,
                                fontFamily: "NotoLight",
                                color: "#262223",
                              }}
                            >
                              일{" "}
                            </Text>
                            <Text
                              style={{
                                fontSize: windowWidth / 32,
                                fontFamily: "NotoMedium",
                                color: "#262223",
                                marginLeft: 7,
                              }}
                            >
                              0
                              <Text
                                style={{
                                  fontSize: windowWidth / 32,
                                  fontFamily: "NotoLight",
                                  color: "#262223",
                                }}
                              >
                                편
                              </Text>
                            </Text>
                          </Text>
                        </Text>
                      </View>
                      {/* <IconButton
                        icon={"chevron-down"}
                        color="#555555"
                        size={30}
                        onPress={getMonth}
                      /> */}
                    </View>
                  </View>
                </View>

                <ScrollView
                  style={{
                    height: "100%",
                    left: 0,
                    top:
                      nowY <= 0
                        ? divHeight
                        : nowY < divHeight
                          ? divHeight - nowY
                          : 0,
                    zIndex: 11,
                    backgroundColor: "white",
                  }}
                  showsVerticalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <View
                    style={{
                      width: "100%",
                      height:
                        nowY <= 0
                          ? windowWidth / 2.5
                          : nowY < divHeight
                            ? windowWidth / 2.5 + nowY
                            : windowWidth / 2.5 + divHeight,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        top:
                          nowY >= divHeight ? divHeight : nowY < 0 ? 0 : nowY,
                        height: windowWidth / 8.5,
                        backgroundColor: "white",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: windowWidth / 20,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: windowWidth / 25,
                            fontFamily: "NotoMedium",
                            color: "#262223",
                            marginLeft: 7,
                          }}
                        >
                          3
                          <Text
                            style={{
                              fontSize: windowWidth / 25,
                              fontFamily: "NotoLight",
                              color: "#262223",
                            }}
                          >
                            월 총 동선 기록
                          </Text>
                        </Text>
                        <IconButton
                          icon={"help-circle-outline"}
                          color="#3f3f3f"
                          size={15}
                        />
                      </View>
                      <View
                        style={{
                          left: 0,
                          paddingRight: windowWidth / 13,
                          top: 0,
                          zIndex: 100,
                          marginTop: 0,
                          // position: "absolute",
                          // backgroundColor: "red"
                        }}
                      >
                        <RNAnimatedScrollIndicators
                          numberOfCards={2}
                          scrollWidth={windowWidth}
                          activeColor={"grey"}
                          inActiveColor={"#e2e2e2"}
                          scrollAnimatedValue={scrollX}
                        />
                      </View>
                    </View>
                    <Animated.ScrollView
                      horizontal={true}
                      pagingEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ flexGrow: 1 }}
                      onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                      )}
                    >
                      <View style={{ width: windowWidth, paddingTop: 1 }}>
                        <Surface
                          style={{
                            width: "90%",
                            height: windowWidth / 3.9,
                            top:
                              nowY >= divHeight
                                ? divHeight
                                : nowY < 0
                                  ? 0
                                  : nowY,
                            alignSelf: "center",
                            borderRadius: 10,
                            elevation: 0.97,
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              height: "100%",

                              backgroundColor: "white",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              borderRadius: 10,
                            }}
                          >
                            <View
                              style={{
                                alignItems: "center",
                                alignSelf: "center",
                                height: "90%",
                                width: "33.33%",
                              }}
                            >
                              <Avatar.Icon
                                size={windowWidth / 10}
                                icon="road-variant"
                                color="#555555"
                                style={{ backgroundColor: "white" }}
                              />
                              <Text
                                style={{
                                  fontSize: windowWidth / 20,
                                  fontFamily: "NotoBold",
                                  color: "#3c3c3c",
                                  top: -windowHeight / 150,
                                }}
                              >
                                {totalDistance.toFixed(2)}
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
                                총 거리
                              </Text>
                            </View>
                            <View
                              style={{
                                alignItems: "center",
                                alignSelf: "center",
                                height: "90%",
                                width: "33.33%",
                                borderLeftColor: "#eaeaea",
                                borderLeftWidth: 1,
                                borderRightColor: "#eaeaea",
                                borderRightWidth: 1,
                              }}
                            >
                              <Avatar.Icon
                                size={windowWidth / 10}
                                icon="clock-outline"
                                color="#555555"
                                style={{ backgroundColor: "white" }}
                              />
                              <Text
                                style={{
                                  fontSize: windowWidth / 20,
                                  fontFamily: "NotoBold",
                                  color: "#3c3c3c",
                                  top: -windowHeight / 150,
                                }}
                              >
                                {totalHours}:
                                {totalMinutes.toString().padStart(2, "0")}
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
                                총 시간
                              </Text>
                            </View>
                            <View
                              style={{
                                alignItems: "center",
                                alignSelf: "center",
                                height: "90%",
                                width: "33.33%",
                              }}
                            >
                              <Avatar.Icon
                                size={windowWidth / 10}
                                icon="map-marker-radius-outline"
                                color="#555555"
                                style={{ backgroundColor: "white" }}
                              />
                              <Text
                                style={{
                                  fontSize: windowWidth / 20,
                                  fontFamily: "NotoBold",
                                  color: "#3c3c3c",
                                  top: -windowHeight / 150,
                                }}
                              >
                                {totalMarkers}
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
                                마커 갯수
                              </Text>
                            </View>
                          </View>
                        </Surface>
                      </View>

                      <View style={{ width: windowWidth, paddingTop: 1 }}>
                        <Surface
                          style={{
                            width: "90%",
                            height: windowWidth / 3.9,
                            top:
                              nowY >= divHeight
                                ? divHeight
                                : nowY < 0
                                  ? 0
                                  : nowY,
                            alignSelf: "center",
                            borderRadius: 10,
                            elevation: 0.97,
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              height: "100%",

                              backgroundColor: "white",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              borderRadius: 10,
                            }}
                          >
                            <View
                              style={{
                                alignItems: "center",
                                alignSelf: "center",
                                height: "90%",
                                width: "50%",
                              }}
                            >
                              <Avatar.Icon
                                size={windowWidth / 10}
                                icon="calendar-range"
                                color="#555555"
                                style={{ backgroundColor: "white" }}
                              />
                              <Text
                                style={{
                                  fontSize: windowWidth / 20,
                                  fontFamily: "NotoBold",
                                  color: "#3c3c3c",
                                  top: -windowHeight / 150,
                                }}
                              >
                                0
                                <Text
                                  style={{
                                    fontSize: windowWidth / 30,
                                    fontFamily: "NotoLight",
                                    color: "#3f3f3f",
                                  }}
                                >
                                  일
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
                                기록한 날
                              </Text>
                            </View>
                            <View
                              style={{
                                alignItems: "center",
                                alignSelf: "center",
                                height: "90%",
                                width: "50%",
                                borderLeftColor: "#eaeaea",
                                borderLeftWidth: 1,
                              }}
                            >
                              <Avatar.Icon
                                size={windowWidth / 10}
                                icon="map-marker-distance"
                                color="#555555"
                                style={{ backgroundColor: "white" }}
                              />
                              <Text
                                style={{
                                  fontSize: windowWidth / 20,
                                  fontFamily: "NotoBold",
                                  color: "#3c3c3c",
                                  top: -windowHeight / 150,
                                }}
                              >
                                0
                                <Text
                                  style={{
                                    fontSize: windowWidth / 30,
                                    fontFamily: "NotoLight",
                                    color: "#3f3f3f",
                                  }}
                                >
                                  편
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
                                기록한 동선
                              </Text>
                            </View>
                          </View>
                        </Surface>
                      </View>
                    </Animated.ScrollView>
                  </View>

                  {/* <View style={{
                    width: "100%", height: 300
                    , backgroundColor: "yellow"
                  }}>

                  </View> */}
                  <View
                    style={{
                      width: "100%",
                      height: windowHeight / 40,
                      backgroundColor: "#f6f6f6",
                    }}
                  ></View>
                  <View
                    style={{
                      width: "100%",
                      height: windowHeight / 3,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "15%",
                        backgroundColor: "white",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "90%",
                          height: "100%",
                          backgroundColor: "white",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text>최근 동선</Text>
                        <TouchableOpacity onPress={toggleMain}>
                          <Text>모두 보기 </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: windowHeight / 40,
                      backgroundColor: "#f6f6f6",
                    }}
                  ></View>
                  <View
                    style={{
                      width: "100%",
                      height: windowHeight / 3,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "15%",
                        backgroundColor: "white",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "90%",
                          height: "100%",
                          backgroundColor: "white",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text>최근 동선</Text>
                        <Text>모두 보기 </Text>
                      </View>
                    </View>
                  </View>
                  {/* <View style={{ width: "100%", height: windowHeight / 20, backgroundColor: "white" }}>

                  </View> */}
                </ScrollView>
              </View>
            ) : !isList ? (
              <View>
                <Modal
                  style={{
                    margin: 0,
                  }}
                  isVisible={modal}
                  hasBackdrop={true}
                  coverScreen={false}
                >
                  <View style={{ flex: 1, backgroundColor: "white" }}>
                    <ScrollView>


                      <View
                        style={{
                          alignItems: "center",
                          paddingTop: 7,
                          marginBottom: windowHeight * 0.1
                        }}
                      >
                        <View style={{ width: windowWidth, paddingTop: 1, }}>
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

                                          justifyContent: "center"
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
                                          justifyContent: "center"
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
                                          justifyContent: "center"
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

                        <Surface style={{ width: "95%", height: windowWidth / 3 * 2, borderRadius: 15, elevation: 1 }}>
                          <MapView

                            style={{ width: "100%", height: windowWidth / 3 * 2, borderRadius: 15 }}
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
                                      // setInfoImg(route.file.image);
                                      // setInfoText(route.file.text);
                                      // setInfoContent(route.file.content);
                                      // toggleModal3();
                                    }}
                                  // centerOffset={{ x: 0, y: -22 }}
                                  >
                                    <Surface
                                      style={
                                        styles.route_contents_map_marker_shadow
                                      }
                                    >
                                      <View
                                        style={
                                          styles.route_contents_map_marker_wrap
                                        }
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
                          style={{ width: "100%", height: windowWidth / 4, marginTop: 20, marginBottom: -10 }}
                          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
                          horizontal

                          showsHorizontalScrollIndicator={false}
                        >
                          {dayItem != undefined ? dayItem.routes.map((route, index) => {
                            return (

                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  itemPressed(route);
                                  setDayItem(dayItem);
                                }}
                                style={{ marginLeft: windowWidth / 100, marginRight: windowWidth / 100, }}
                              >
                                <View
                                  style={{
                                    width: windowWidth / 5,
                                    height: windowWidth / 5,
                                    alignSelf: "center",

                                    borderRadius: 7,
                                    borderWidth: 1,
                                    borderColor: "#e6e6e6",
                                    backgroundColor: "#f6f6f6"
                                  }}
                                >
                                  <Text>동선</Text>
                                </View>
                                <Text style={{
                                  alignSelf: "center",
                                  fontSize: windowWidth / 30,
                                  fontFamily: "NotoRegular",
                                  color: "#3f3f3f",
                                }}>{route.name.length > 6 ? route.name.slice(0, 6) + "..." : route.name}</Text>
                              </TouchableOpacity>
                            );

                          }) : ""}
                        </ScrollView>




                        {nowItem !== undefined
                          ? nowItem.diaryItems.map((route, index) => {
                            return (
                              <View key={index} style={{ width: "100%", alignItems: "center" }}>
                                <View
                                  style={{
                                    width: "90%",
                                    height: 1,
                                    backgroundColor: "#f3f3f3",
                                    marginTop: 20,
                                  }}
                                ></View>
                                <View style={{ paddingTop: 10, paddingBottom: 10, width: "95%", marginTop: 20, flexDirection: "row", borderRadius: 10, backgroundColor: "#f8f8f8" }}>
                                  <View style={{ marginLeft: windowWidth / 30, justifyContent: "center" }}>
                                    <Image
                                      source={{ uri: route.thumb_url }}
                                      style={{
                                        width: windowWidth / 6,
                                        height: windowWidth / 6,
                                        borderRadius: 5,

                                      }}
                                    />
                                  </View>
                                  <View>
                                    <Text>{route.title}</Text>
                                    <Text>{route.description}</Text>
                                  </View>
                                </View>
                              </View>

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
                </Modal>
                <View
                  style={{
                    justifyContent: "center",
                    width: "100%",
                    height: windowHeight / 15,
                    borderWidth: 0,
                    backgroundColor: "white",
                    paddingBottom: windowHeight / 50,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "98%",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      {/* <IconButton
                        icon={"chevron-down"}
                        color="#555555"
                        size={30}
                        onPress={toggleMain}
                      />
                      <IconButton
                        icon={"chevron-down"}
                        color="#555555"
                        size={30}
                        onPress={toggleList}
                      /> */}
                    </View>
                  </View>

                  <View
                    style={{
                      alignSelf: "center",
                      width: "93%",
                      height: windowHeight / 23,
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: "#999999",
                    }}
                  >
                    <View
                      style={{
                        marginLeft: -3,
                        marginTop: -3,
                        marginRight: 1,
                        marginBottom: 1,
                      }}
                    >
                      <ButtonToggleGroup
                        highlightBackgroundColor={"#111111"}
                        highlightTextColor={"white"}
                        inactiveBackgroundColor={"white"}
                        inactiveTextColor={"#999999"}
                        value={value}
                        values={["오늘", "이번 주", "이번 달"]}
                        onSelect={(val) => setValue(val)}
                        style={{
                          width: "100%",
                          height: "100%",
                          paddingLeft: 4,
                          paddingTop: 4,
                        }}
                      // textStyle={{ fontSize: 20 }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ height: "100%", width: "100%" }}>
                  {value == "오늘" ? (
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "red",
                      }}
                    >
                      {data.data.map((item, index) => {
                        if (item.diaryDate == todayDate) {
                          return (
                            <View key={index}>
                              <Text>{item.diaryDate}</Text>
                              {item.routes.map((content, index) => {
                                return (
                                  <Surface
                                    key={index}
                                    style={{
                                      width: "95%",
                                      height: 50,
                                      alignSelf: "center",
                                      marginTop: 10,
                                      borderRadius: 7,
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "white",
                                        borderRadius: 7,
                                      }}
                                    >
                                      <Text>{content.name}</Text>
                                    </View>
                                  </Surface>
                                );
                              })}
                            </View>
                          );
                        }
                      })}
                    </View>
                  ) : value == "이번 주" ? (
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "blue",
                      }}
                    >
                    </View>
                  ) : (
                    <View style={{ flex: 1, backgroundColor: "white" }}>
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                          />
                        }
                      >
                        <View
                          style={{
                            alignItems: "center",
                            marginBottom: windowHeight * 0.15
                          }}
                        >
                          {data.data.map((item, index) => {
                            temp = 0;
                            let isEmpty = false;
                            item.routes.map((content, index) => {
                              if (content.routeItems.length != 0) {
                                isEmpty = true;
                              }
                            })

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
                                        marginBottom: windowWidth / 40
                                      }}
                                    >
                                      {item.diaryDate.substring(0, 4) + "년 " + item.diaryDate.substring(6, 7) + "월 " + item.diaryDate.substring(8, 10) + "일"}
                                    </Text>
                                    {item.routes.map((content, index) => {
                                      if (content.routeItems.length != 0) {
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



                                          svgMinX = [minX.toString().substring(3, 5), ".", minX.toString().substring(5, 8)].join('');
                                          svgMinY = [minY.toString().substring(4, 6), ".", minY.toString().substring(6, 9)].join('');
                                          svgMaxX = [maxX.toString().substring(3, 5), ".", maxX.toString().substring(5, 8)].join('');
                                          svgMaxY = [maxY.toString().substring(4, 6), ".", maxY.toString().substring(6, 9)].join('');

                                          svgDeltaX = (Number(svgMaxX) - Number(svgMinX)).toString().substring(0, 5);
                                          svgDeltaY = (Number(svgMaxY) - Number(svgMinY)).toString().substring(0, 5);
                                          svgMidX = ((Number(svgMaxX) + Number(svgMinX)) / 2).toString().substring(0, 6);
                                          svgMidY = ((Number(svgMaxY) + Number(svgMinY)) / 2).toString().substring(0, 6);

                                          // console.log(content.name);
                                          // console.log(svgMinX);
                                          // console.log(svgMinY);
                                          // console.log(svgMidX);
                                          // console.log(svgMidY);
                                          // console.log(svgDeltaX);
                                          // console.log(svgDeltaY);


                                          if (svgDeltaX != 0) {
                                            Number(svgDeltaY) > Number(svgDeltaX) ?
                                              go = Number(svgMidX - svgDeltaY / 2 - svgDeltaY * 0.15) + " " + Number(svgMinY - svgDeltaY * 0.15) + " " + svgDeltaY * 1.3 + " " + svgDeltaY * 1.3 :
                                              go = Number(svgMinX - svgDeltaX * 0.15) + " " + Number(svgMidY - svgDeltaX / 2 - svgDeltaX * 0.15) + " " + svgDeltaX * 1.3 + " " + svgDeltaX * 1.3;

                                          }

                                          // console.log(go);
                                          // console.log("\n");
                                        }
                                        const svgPoint = content.routeItems.map(p => `${[p.latitude.toString().substring(3, 5), ".", p.latitude.toString().substring(5, 8)].join('')},${[p.longitude.toString().substring(4, 6), ".", p.longitude.toString().substring(6, 9)].join('')}`).join(' ');
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
                                              itemPressed(content);
                                              setDayItem(item);
                                            }}
                                          >
                                            <View
                                              key={index}
                                              style={{
                                                width: "88%",
                                                alignSelf: "center",

                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                              }}
                                            >
                                              <View style={{
                                                width: 62, height: 62, backgroundColor: content.routeItems.length != 0 ? "white" : "grey",
                                                alignSelf: "center",
                                                marginLeft: windowWidth / 50,
                                                borderRadius: 5,
                                                borderWidth: 1,
                                                borderColor: "#e6e6e6",
                                                marginTop: 5,
                                                marginBottom: 5
                                              }}>
                                                <Svg
                                                  style={{ transform: [{ rotate: '-90deg' }] }}
                                                  // viewBox="-0.25 54.7 4.8 10"
                                                  // viewBox="0 55.15 4.40 300"
                                                  // viewBox="35.1751355963 0.02378590963 128.698668037 0.08597688504"
                                                  viewBox={go}
                                                  // viewBox={go != undefined ? svgMinX + " " + svgMinY + " " + 1 + " " + 3 : ""}
                                                  width="100%" height="100%" >
                                                  {/* <Svg height="100%" width="100%" viewBox="0 0 100 100"> */}
                                                  <Poly
                                                    fill="none"
                                                    stroke={polyColor[nowNum % 4]}
                                                    strokeWidth={content.routeItems.length == 0 ? "" : Number(svgDeltaY) > Number(svgDeltaX) ? Number(svgDeltaY) / 13 : Number(svgDeltaX) / 13}
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
                                              <View style={{
                                                width: "73%", height: "100%", borderTopWidth: temp == 1 ? 0 : 1,
                                                borderColor: "#e6e6e6",
                                              }}>


                                                {routeData !== undefined
                                                  ? routeData.data.map((route, index) => {

                                                    if (route.id == content.id && route.distance != 0)
                                                      return (
                                                        <View style={{ width: "100%", flexDirection: "row", marginTop: windowWidth / 50, }} key={index}>
                                                          <View
                                                            style={{
                                                              backgroundColor: "white",
                                                              flexDirection: "row",
                                                              justifyContent: "space-between",
                                                            }}
                                                            key={index}
                                                          >
                                                            {temp == 1 ? <View
                                                              style={{
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                height: windowWidth / 20,
                                                                width: windowWidth / 11,
                                                                flexDirection: "row",
                                                                borderRadius: 5,
                                                                borderWidth: 1,
                                                                borderColor: "#c6c6c6",
                                                                marginRight: windowWidth / 80
                                                              }}
                                                            >
                                                              <Text
                                                                style={{
                                                                  fontSize: windowWidth / 33,
                                                                  fontFamily: "NotoBold",
                                                                  color: "#c6c6c6",
                                                                  marginTop: -windowWidth / 90
                                                                }}
                                                              >
                                                                First
                                                          </Text>
                                                            </View> : <></>}

                                                            {route.distance >= 1 ? <View
                                                              style={{
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                height: windowWidth / 20,
                                                                width: windowWidth / 11,
                                                                flexDirection: "row",
                                                                borderRadius: 5,
                                                                borderWidth: 1,
                                                                borderColor: "#C58B41",
                                                                marginRight: windowWidth / 80
                                                              }}
                                                            >
                                                              <Text
                                                                style={{
                                                                  fontSize: windowWidth / 33,
                                                                  fontFamily: "NotoBold",
                                                                  color: "#C58B41",
                                                                  marginTop: -windowWidth / 90
                                                                }}
                                                              >
                                                                1km
                                                          </Text>
                                                            </View> : route.distance >= 0.1 ? <View
                                                              style={{
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                height: windowWidth / 20,
                                                                width: windowWidth / 11,
                                                                flexDirection: "row",
                                                                borderRadius: 5,
                                                                borderWidth: 1,
                                                                borderColor: "#C54441",
                                                                marginRight: windowWidth / 80
                                                              }}
                                                            >
                                                              <Text
                                                                style={{
                                                                  fontSize: windowWidth / 33,
                                                                  fontFamily: "NotoBold",
                                                                  color: "#C54441",
                                                                  marginTop: -windowWidth / 90
                                                                }}
                                                              >
                                                                100m
                                                          </Text>
                                                            </View> : <></>}

                                                            {route.minutes >= 5 ? <View
                                                              style={{
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                height: windowWidth / 20,
                                                                width: windowWidth / 11,
                                                                flexDirection: "row",
                                                                borderRadius: 5,
                                                                borderWidth: 1,
                                                                borderColor: "#33AB3A",
                                                                marginRight: windowWidth / 80
                                                              }}
                                                            >
                                                              <Text
                                                                style={{
                                                                  fontSize: windowWidth / 33,
                                                                  fontFamily: "NotoBold",
                                                                  color: "#33AB3A",
                                                                  marginTop: -windowWidth / 90
                                                                }}
                                                              >
                                                                5hr
                                                          </Text>
                                                            </View> : route.minutes >= 1 ? <View
                                                              style={{
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                height: windowWidth / 20,
                                                                width: windowWidth / 11,
                                                                flexDirection: "row",
                                                                borderRadius: 5,
                                                                borderWidth: 1,
                                                                borderColor: "#4aa2ad",
                                                                marginRight: windowWidth / 80
                                                              }}
                                                            >
                                                              <Text
                                                                style={{
                                                                  fontSize: windowWidth / 33,
                                                                  fontFamily: "NotoBold",
                                                                  color: "#4aa2ad",
                                                                  marginTop: -windowWidth / 90
                                                                }}
                                                              >
                                                                1hr
                                                          </Text>
                                                            </View> : <></>}


                                                          </View>
                                                        </View>
                                                      );
                                                  }
                                                  )
                                                  : ""}

                                                <Text style={{
                                                  fontSize: windowWidth / 30,
                                                  fontFamily: "NotoMedium",
                                                  color: "#3f3f3f",

                                                }}>{content.name}</Text>
                                              </View>
                                            </View>

                                          </TouchableOpacity>
                                        );
                                      }
                                    })

                                    }
                                  </View>
                                </Surface>
                              );
                            }
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* <View style={styles.route_tool_after}>
                  <Surface style={styles.route_tool_after_button_shadow}>
                    <IconButton
                      style={styles.route_tool_after_button}
                      icon={"pin"}
                      color="#3f3f3f"
                      size={30}
                      onPress={getMonth}
                    />
                  </Surface>
                </View> */}
              </View>
            ) : (
              <CalendarProvider
                date={"2021-03-09"}
                // onDateChanged={this.onDateChanged}
                // onMonthChange={this.onMonthChange}
                showTodayButton
                disabledOpacity={0.6}
                theme={{
                  todayButtonTextColor: "red",
                }}
                todayBottomMargin={16}
              >
                <ExpandableCalendar
                  horizontal={true}
                  hideArrows={true}
                  pastScrollRange={0}
                  futureScrollRange={1}
                  // minDate={'2021-02-20'}
                  // maxDate={'2021-04-10'}
                  initialPosition={ExpandableCalendar.positions.CLOSE}
                  disableWeekScroll
                  disabledByDefault={true}
                  theme={getTheme()}
                  disableAllTouchEventsForDisabledDays
                  markedDates={enabledMark}
                  hideArrows={false}
                />
                <AgendaList
                  sections={ITEMS}
                  // extraData={this.state}
                  renderItem={renderItem}
                  sectionStyle={styles.section}
                />
              </CalendarProvider>
            )}
          </View>
        </SafeAreaView>
      </Fragment >
    );
  } else {
    return null;
  }
}
