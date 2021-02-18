import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useState } from "react";
import { View, SafeAreaView, Platform, Text } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import styles from "../assets/styles";
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
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [markedDates, setMarkedDates] = React.useState({});

  const setNewDaySelected = (date) => {
    const markedDate = Object.assign({});
    markedDate[date] = {
      selected: true,
      selectedColor: "#DFA460",
    };
    console.log(markedDate);
    setSelectedDate(date);
    setMarkedDates(markedDate);
  };

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView}>
          <View style={styles.com_safeView_title}>
            <Text style={styles.com_safeView_title_text}>걸음 기록</Text>
          </View>
          <View style={styles.com_safeView_contents}>
            <CalendarList
              style={{ backgroundColor: "#f4f0ec" }}
              markedDates={markedDates}
              current={selectedDate}
              pastScrollRange={24}
              futureScrollRange={24}
              horizontal
              pagingEnabled
              onDayPress={(day) => {
                setNewDaySelected(day.dateString);
              }}
            />
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
