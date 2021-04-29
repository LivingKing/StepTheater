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
  Animated,
  Image,
} from "react-native";
import { Avatar, IconButton, Surface } from "react-native-paper";
import styles from "../../assets/styles";
import styles_detail from "../../assets/styles_detail";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import RNAnimatedScrollIndicators from "react-native-animated-scroll-indicators";
import { useFocusEffect } from "@react-navigation/core";
import { server } from "../../app.json";

import Svg, { Polyline as Poly } from "react-native-svg";

export default function DetailScreen({ navigation }) {
  const [thumbImage, setThumbImage] = useState("");
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalMarkers, setTotalMarkers] = useState(0);
  const [totalRecordDays, setTotalRecordDays] = useState(0);
  const [totalRecordRoutes, setTotalRecordRoutes] = useState(0);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [markedDates, setMarkedDates] = React.useState({});
  const [modal, setModal] = useState(false);
  const [data, setData] = useState();
  const [routeInfo, setRouteInfo] = useState();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [isList, setIsList] = useState(false);
  const toggleList = () => {
    setIsList(!isList);
  };
  const scrollX = new Animated.Value(0);

  let nowNum = -1;
  let temp = 0;

  const [recentData, setRecentData] = useState();

  const [todayDate, setTodayDate] = useState();

  const [dayItem, setDayItem] = useState();

  const getRecent = async () => {
    if (recentData == undefined) {
      const id = await SecureStore.getItemAsync("UserId");
      const response = await fetch(
        `${server.address}/api/diary/recent?id=${id}&count=6`
        // `${server.address}/api/diary/date?id=1&&date=2021-03-17&&type=month`
      );
      const result = await response.json();
      setRecentData(result);
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

  const polyColor = ["blanchedalmond", "blueviolet", "thistle", "yellowgreen"];

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
  let nowRouteIndex = -1;
  const [routeData, setRouteData] = useState();
  const getRouteData = async () => {
    const id = await SecureStore.getItemAsync("UserId");
    const today = await SecureStore.getItemAsync("today");

    let response = await fetch(
      `${server.address}/api/routes?id=${id}&date=${today}&type=month`
    );
    let result = await response.json();
    setRouteData(result);
    setTotalDistance(result.totalDistance);
    setTotalHours(result.totalHours);
    setTotalMinutes(result.totalMinutes);
    setTotalMarkers(result.totalMarkers);
    setTotalRecordRoutes(result.count);

    response = await fetch(
      `${server.address}/api/diary/date?id=${id}&date=${today}&type=month`
    );
    result = await response.json();
    setTotalRecordDays(result.data.length);
  };

  const getSettings = async () => {
    setNickname(await SecureStore.getItemAsync("NickName"));
    setThumbImage(await SecureStore.getItemAsync("Thumb_Url"));
  };

  useFocusEffect(
    useCallback(() => {
      getRecent();
      getDate();
      getRouteData();
      getSettings();
      //console.log(data.data);
    }, [])
  );

  const [nowItem, setNowItem] = useState();
  const itemPressed = (item) => {
    setNowItem(item);
    if (item.routeItems.length != 0) {
      getRegionForCoordinates(item.routeItems);
    }

    setModal(true);
  };

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

  const [isModalVisible3, setModalVisible3] = useState(false);

  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  const [nowDiaryItem, setNowDiaryItem] = useState();

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

          {nowY > divHeight ? (
            <View style={styles_detail.detail_title2}>
              <Avatar.Image
                size={windowWidth / 15}
                source={{ url: thumbImage }}
              />
              <Text
                style={[
                  styles_detail.detail_header,
                  { marginLeft: 7, fontFamily: "NotoMedium" },
                ]}
              >
                {nickname}
                <Text style={styles_detail.detail_header}>님의 동선</Text>
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles_detail.detail_title,
                nowY >= 0 && {
                  borderBottomColor: "#e6e6e6",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Image
                style={styles_detail.detail_logo}
                source={require("../../assets/detail.png")}
              />
            </View>
          )}

          <View style={styles_detail.detail_contents}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  paddingLeft: windowWidth / 18,
                  width: "100%",
                  height: 60,
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
                    source={{ url: thumbImage }}
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
                      top: nowY >= divHeight ? divHeight : nowY < 0 ? 0 : nowY,
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
                        {moment().format("MM")}
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
                            nowY >= divHeight ? divHeight : nowY < 0 ? 0 : nowY,
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
                            nowY >= divHeight ? divHeight : nowY < 0 ? 0 : nowY,
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
                              {totalRecordDays}
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
                              {totalRecordRoutes}
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
                />

                <View
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    paddingBottom: windowWidth / 20,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: windowWidth / 8,
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
                      <Text
                        style={{
                          fontSize: windowWidth / 25,
                          fontFamily: "NotoMedium",
                          color: "#555555",
                        }}
                      >
                        최근 동선
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.push("모든기록", {
                            routeData: routeData,
                          });
                        }}
                      >
                        <Text
                          style={{
                            fontSize: windowWidth / 30,
                            fontFamily: "NotoRegular",
                            color: "#777777",
                            marginRight: -windowWidth / 100,
                          }}
                        >
                          모두 보기 ❯
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{}}>
                    {recentData != undefined ? (
                      recentData.data.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            {item.routes.map((content, index) => {
                              if (content.routeItems.length != 0) {
                                nowNum++;
                                temp++;
                                let svgMinX;
                                let svgMinY;
                                let svgMidX;
                                let svgMidY;
                                let svgDeltaX;
                                let svgDeltaY;
                                let go;
                                let temp;
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
                                  temp = content.routeItems.slice();
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
                                      svgDeltaY > svgDeltaX
                                        ? svgDeltaY
                                        : svgDeltaX;
                                    go = `${svgMidX - val / 2 - val * 0.15} ${
                                      svgMidY - val / 2 - val * 0.15
                                    } ${val * 1.3} ${val * 1.3}`;
                                  }
                                }
                                const svgPoint = temp
                                  .map(
                                    (p) =>
                                      `${[p.latitude].join("")},${[
                                        p.longitude,
                                      ].join("")}`
                                  )
                                  .join(" ");
                                return (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                      navigation.push("기록지도", {
                                        nowItem: content,
                                        dayItem: item,
                                        routeData: routeData,
                                      });
                                    }}
                                    style={{
                                      width: "100%",
                                      alignSelf: "center",
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
                                          borderTopWidth: nowNum == 0 ? 0 : 1,
                                          borderColor: "#e6e6e6",
                                        }}
                                      >
                                        {routeData !== undefined ? (
                                          routeData.data.map((route, index) => {
                                            if (
                                              route.id == content.id &&
                                              route.distance != 0
                                            )
                                              return (
                                                <View
                                                  style={{
                                                    width: "100%",
                                                    flexDirection: "row",
                                                    marginTop: windowWidth / 80,
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
                                                    {route.distance >= 1 ? (
                                                      <View
                                                        style={{
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
                                                          height:
                                                            windowWidth / 20,
                                                          width:
                                                            windowWidth / 11,
                                                          flexDirection: "row",
                                                          borderRadius: 5,
                                                          borderWidth: 1,
                                                          borderColor:
                                                            "#C58B41",
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
                                                    ) : route.distance >=
                                                      0.1 ? (
                                                      <View
                                                        style={{
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
                                                          height:
                                                            windowWidth / 20,
                                                          width:
                                                            windowWidth / 11,
                                                          flexDirection: "row",
                                                          borderRadius: 5,
                                                          borderWidth: 1,
                                                          borderColor:
                                                            "#C54441",
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
                                                          width:
                                                            windowWidth / 11,
                                                          flexDirection: "row",
                                                          borderRadius: 5,
                                                          borderWidth: 1,
                                                          borderColor:
                                                            "#33AB3A",
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
                                                          5min
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
                                                          width:
                                                            windowWidth / 11,
                                                          flexDirection: "row",
                                                          borderRadius: 5,
                                                          borderWidth: 1,
                                                          borderColor:
                                                            "#4aa2ad",
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
                                                          1min
                                                        </Text>
                                                      </View>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </View>
                                                </View>
                                              );
                                          })
                                        ) : (
                                          <></>
                                        )}
                                        <View
                                          style={{
                                            flex: index == 1 ? 1 : 0.6,
                                            justifyContent: "space-between",
                                            marginTop: "1%",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: windowWidth / 28,
                                              fontFamily: "NotoMedium",
                                              color: "#444444",
                                            }}
                                          >
                                            {content.name}
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize: windowWidth / 35,
                                              fontFamily: "NotoRegular",
                                              color: "#777777",
                                            }}
                                          >
                                            {item.diaryDate}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                );
                              }
                            })}
                          </View>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: windowHeight / 40,
                    backgroundColor: "#f6f6f6",
                  }}
                ></View>
                {/* <View
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
                </View> */}
                {/* <View style={{ width: "100%", height: windowHeight / 20, backgroundColor: "white" }}>

                  </View> */}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
