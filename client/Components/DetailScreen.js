import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useState } from "react";
import { View, SafeAreaView, Platform, Text, Dimensions, TouchableOpacity } from "react-native";
import { Calendar, CalendarList, Agenda, WeekCalendar, CalendarProvider, ExpandableCalendar, AgendaList } from "react-native-calendars";
import { Avatar, IconButton, Button } from "react-native-paper";
import { LocaleConfig } from "react-native-calendars";
import styles from "../assets/styles";
import styles_detail from "../assets/styles_detail";
import Modal from "react-native-modal";

LocaleConfig.locales["ko"] = {
  monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월",],
  monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월",],
  dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일",],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";
export default function DetailScreen() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [markedDates, setMarkedDates] = React.useState({});
  const [modal, setModal] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const setNewDaySelected = (date) => {
    const markedDate = Object.assign({});
    markedDate[date] = {
      selected: true,
      selectedColor: "#522486",
    };
    console.log(markedDate);
    setSelectedDate(date);
    setMarkedDates(markedDate);
  };

  const getTheme = () => {
    return {
      textMonthFontFamily: 'NotoLight',
      textMonthFontSize: 16,

      selectedDayBackgroundColor: 'red',
      selectedDayTextColor: 'white',

      todayTextColor: 'red',
      dayTextColor: '#2d4150',
      textDisabledColor: '#d9e1e8',

      dotColor: '#e6e6e6',
      selectedDotColor: '#ffffff',

      monthTextColor: 'black',
    };
  };
  function getFutureDates(days) {
    const array = [];
    for (let index = 1; index <= days; index++) {
      const date = new Date(Date.now() + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
      const dateString = date.toISOString().split('T')[0];
      array.push(dateString);
    }
    return array;
  }

  function getPastDate(days) {
    return new Date(Date.now() - 864e5 * days).toISOString().split('T')[0];
  }
  const today = new Date().toISOString().split('T')[0];
  const fastDate = getPastDate(3);
  const futureDates = getFutureDates(9);
  const dates = [fastDate, today].concat(futureDates).concat(["2021-04-01"]);

  const ITEMS = [
    { title: dates[0], data: [{ title: 'First Route' }] },
    { title: dates[1], data: [{ title: 'Second Route' }] },
    { title: dates[2], data: [{ title: 'Third Route' }] },
    { title: dates[3], data: [{ title: '4 Route' }] },
    { title: dates[4], data: [{ title: '5 Route' }] },
    { title: dates[5], data: [{ title: '6 Route' }] },
    { title: dates[6], data: [{ title: '7 Route' }] },
    { title: dates[7], data: [{ title: '8 Route' }] },
    { title: dates[8], data: [{ title: '9 Route' }] },
    { title: dates[9], data: [{ title: '10 Route' }] },
    { title: dates[10], data: [{ title: '11 Route' }] },
    { title: dates[11], data: [{ title: '12 Route' }] },
  ];

  const aa = {
    '2021-03-01': { disabled: false },
    '2021-03-02': { disabled: false },
    '2021-03-03': { disabled: false },
  };


  const enabledMark = {};
  dates.map(x => {
    enabledMark[x] = {
      disabled: false
    };
  }
  );

  const itemPressed = (id) => {
    setModal(true);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { }} style={styles_detail.item} >
        <View>
          <Text style={styles_detail.itemHourText}>동선</Text>
          <Text style={styles_detail.itemDurationText}>동선</Text>
        </View>
        <Text style={styles_detail.itemTitleText}>{item.title}</Text>
        <View style={styles_detail.itemButtonContainer}>
        </View>
      </TouchableOpacity>
    );
  };

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles_detail.detail}>
          <View style={styles_detail.detail_title}>
            <Text style={styles_detail.detail_title_text}>걸음 기록</Text>
          </View>
          <Modal
            style={{
              margin: 0,
            }}
            isVisible={modal}
            hasBackdrop={true}
            coverScreen={false}
          >
            <View
              style={{
                flex: 0.9,
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <Text>asdf</Text>
              <Text>asdf</Text>


              <Button mode="contained" onPress={() => { setModal(false); }}>
                확인
          </Button>
            </View>
          </Modal>

          <View style={styles_detail.detail_contents}>

            <CalendarProvider
              date={'2021-03-09'}
              // onDateChanged={this.onDateChanged}
              // onMonthChange={this.onMonthChange}
              showTodayButton
              disabledOpacity={0.6}
              theme={{
                todayButtonTextColor: 'red'
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
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
