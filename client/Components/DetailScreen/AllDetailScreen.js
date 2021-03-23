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
import styles from "../../assets/styles"
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
import Items from "./Items"

export default function AllDetailScreen({ navigation, route }) {
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    const [value, setValue] = useState("오늘");

    const routeData = route.params.routeData;


    const [dayData, setDayData] = useState();
    const [weekData, setWeekData] = useState();
    const [monthData, setMonthData] = useState();

    useFocusEffect(
        useCallback(() => {
            getDay();
            //console.log(data.data);
        }, [])
    );

    const getDay = async () => {
        if (dayData == undefined) {
            const id = await SecureStore.getItemAsync("UserId");
            const today = await SecureStore.getItemAsync("today");
            const response = await fetch(
                `${server.address}/api/diary/date?id=${id}&date=${today}&type=day`
                // `${server.address}/api/diary/date?id=1&&date=2021-03-17&&type=month`
            );
            const result = await response.json();
            setDayData(result);

        }
    };

    const getWeek = async () => {
        if (weekData == undefined) {
            const id = await SecureStore.getItemAsync("UserId");
            const today = await SecureStore.getItemAsync("today");
            const response = await fetch(
                `${server.address}/api/diary/date?id=${id}&date=${today}&type=week`
                // `${server.address}/api/diary/date?id=1&&date=2021-03-17&&type=month`
            );
            const result = await response.json();
            setWeekData(result);
        }
    };

    const getMonth = async () => {
        if (monthData == undefined) {
            const id = await SecureStore.getItemAsync("UserId");
            const today = await SecureStore.getItemAsync("today");
            const response = await fetch(
                `${server.address}/api/diary/date?id=${id}&date=${today}&type=month`
                // `${server.address}/api/diary/date?id=1&&date=2021-03-17&&type=month`
            );
            const result = await response.json();
            setMonthData(result);
        }
    };




    if (Platform.OS === "ios") {
        return (
            <Fragment>
                <SafeAreaView style={styles.com_headers}>
                    <StatusBar style="dark" />
                </SafeAreaView>

                <SafeAreaView style={styles_detail.detail}>

                    <View style={styles_detail.detail_title}>
                        <IconButton
                            size={windowWidth / 13}
                            icon="chevron-left"
                            color="#555555"
                            style={{ backgroundColor: "white" }}
                            onPress={() => {
                                navigation.pop();
                            }}
                        />
                    </View>



                    <View style={styles_detail.detail_contents}>

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
                                        onSelect={(val) => {
                                            setValue(val);
                                            if (val == "오늘") {
                                                getDay();
                                            } else if (val == "이번 주") {
                                                getWeek();
                                            } else if (val == "이번 달") {
                                                getMonth();
                                            }
                                        }}
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
                            {value == "오늘" ?
                                <Items route={dayData} routeInfo={routeData} navigation={navigation} /> : value == "이번 주" ?
                                    <Items route={weekData} routeInfo={routeData} navigation={navigation} /> :
                                    <Items route={monthData} routeInfo={routeData} navigation={navigation} />}
                        </View>
                    </View>
                </SafeAreaView>
            </Fragment >
        );
    } else {
        return null;
    }
}
