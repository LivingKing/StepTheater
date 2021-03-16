import { StatusBar } from "expo-status-bar";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  SafeAreaView,
  Platform,
  Text,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import styles from "../assets/styles";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { getDistance } from "geolib";
import {
  IconButton,
  Button,
  Surface,
  Avatar,
  Snackbar,
  TextInput,
  Paragraph,
  Dialog,
  Portal,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import RNAnimatedScrollIndicators from "react-native-animated-scroll-indicators";
import * as ImageManipulator from "expo-image-manipulator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/core";

export default function RouteScreen() {
  const [image, setImage] = useState(null);
  const [thumbImage, setThumbImage] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nickname, setNickname] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [routeCnt, setRouteCnt] = useState(0);
  const captureRef = useRef();
  const polyColor = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];

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
  };

  const getDate = async () => {
    await SecureStore.getItemAsync("today")
      .then(async (date) => {
        const id = await SecureStore.getItemAsync("UserId");
        const response = await fetch(
          `http://203.241.228.112:11200/api/diary?id=${id}&date=${date}`
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
  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const getSettings = async () => {
    setNickname(await SecureStore.getItemAsync("NickName"));
  };

  const getRouteCount = async () => {
    const response = await fetch(
      `http://203.241.228.112:11200/api/route?id=${await SecureStore.getItemAsync(
        "UserId"
      )}&date=${await SecureStore.getItemAsync("today")}`
    );
    const result = await response.json();
    setRouteCnt(result.count);
  };
  useFocusEffect(
    useCallback(() => {
      getLocation();
      getDate();
      getPermission();
      getSettings();
      getRouteCount();
    }, [])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      setIsImageLoading(true);
      const form = new FormData();

      form.append("key", "7ea0466a1e47a7bede0c9d28bd16c4db");
      form.append("image", result.base64);
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });
      const res = await response.json();
      console.log(res.data.image.url);
      setThumbImage(res.data.thumb.url);
      setImage(res.data.medium.url);
    }
    setIsImageLoading(false);
  };

  /* 지도 */
  const [polyLine, setPolyLine] = useState([]); // 경로저장

  const [prevLine, setPrevLine] = useState(null); // 이전 위치 좌표
  const [current, setCurrent] = useState(null); // 현재 위치 좌표
  const [count, setCount] = useState(0); // 경로(polyLine)내 좌표(prevLine)들의 갯수
  const [recording, setRecording] = useState(false); // 현재 경로 기록 여부
  const [routeM, setRouteM] = useState([]);
  const [prevRouteM, setPrevRouteM] = useState(null);
  /* 마커 */
  const [adding, setAdding] = useState(false); // 현재 마커 추가 중인지 여부
  const [pinArray, setPinArray] = useState([]); // 마커들이 저장된 배열
  const [tempPinCount, setTempPinCount] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);
  const [pause, setPause] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [isModalVisible2, setModalVisible2] = useState(false);

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const [isModalVisible3, setModalVisible3] = useState(false);

  const toggleModal3 = () => {
    if (recording) setModalVisible3(!isModalVisible3);
  };

  const [infoImg, setInfoImg] = useState(null);
  const [infoText, setInfoText] = useState(null);
  const [infoContent, setInfoContent] = useState(null);

  var smooth = require("smooth-polyline");

  const routeStateChange = () => {
    setRecording(!recording);

    //console.log(recording);
  };

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const postRoute = async () => {
    const id = await SecureStore.getItemAsync("UserId");
    const date = await SecureStore.getItemAsync("today");

    const response = await fetch("http://203.241.228.112:11200/api/route", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: routeName,
        date: date,
      }),
    });
  };

  const postRouteItem = async (route) => {
    const id = await SecureStore.getItemAsync("UserId");
    const date = await SecureStore.getItemAsync("today");

    const response = await fetch(
      "http://203.241.228.112:11200/api/route/item",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          date: date,
          data: route,
          route_name: routeName,
        }),
      }
    );
  };

  const startRecording = () => {
    showSnackBar("동선기록을 시작합니다.");
    routeStateChange();
    hideDialog();
    postRoute();
  };

  const stopRecording = () => {
    console.log("stop");
    setVisible(false);
    showSnackBar("동선기록을 정지합니다.");
    postRouteItem(polyLine);

    setRecording(false);
    setModalVisible(false);
    setModalVisible2(false);
    setAdding(false);

    var temp = arrCount + 1;
    setArrCount(temp);
    setCount(0);
    setPolyLine([]);
  };

  const addPin = () => {
    if (adding) setAdding(false);
    else setAdding(true);
    //console.log(adding);
  };

  const addPinArray = async () => {
    const file = {
      image: image,
      thumbImage: thumbImage,
      text: textzzz,
      content: contentzzz,
    };
    const nextObject = { ...current, file };
    console.log(arrCount);
    const response = await fetch(
      "http://203.241.228.112:11200/api/diary/item",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: await SecureStore.getItemAsync("UserId"),
          date: await SecureStore.getItemAsync("today"),
          title: file.text,
          desc: file.content,
          thumb_url: thumbImage,
          image_url: image,
          latitude: current.latitude,
          longitude: current.longitude,
          route_name: routeName,
        }),
      }
    );
    setPinArray([...pinArray, nextObject]);
    var temp = tempPinCount + 1;
    setTempPinCount(temp);

    setAdding(false);
    toggleModal2();
    //console.log(pinArray);
  };

  const markerRef = useRef(null);
  const [hide, setHide] = useState(false);

  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackBar = (message) => {
    setSnackbarMessage(message);
    setVisible(true);
  };
  const onDismissSnackBar = () => setVisible(false);

  const showSnackBar2 = (message) => {
    setSnackbarMessage(message);
    setVisible2(true);
  };
  const onDismissSnackBar2 = () => setVisible2(false);

  const scrollX = new Animated.Value(0);

  const [textzzz, setTextzzz] = useState("");
  const [contentzzz, setContentzzz] = useState("");
  const [arrCount, setArrCount] = useState(0);

  const [visibleDialog, setVisibleDialog] = useState(false);

  const showDialog = () => setVisibleDialog(true);

  const hideDialog = () => setVisibleDialog(false);

  const [routeName, setRouteName] = useState("");

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.route}>
          <View
            style={recording ? styles.route_title_after : styles.route_title}
          >
            <Text style={styles.route_title_text}>걸음 한 편</Text>
          </View>

          {recording ? (
            <View style={styles.route_info_after}>
              <View style={styles.route_info_after_text_wrap}>
                <Text style={styles.route_info_text_after}>
                  {isModalVisible
                    ? "일시정지 되었습니다."
                    : "🏃 " + routeName + " 동선을 기록하고 있어요 !"}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.route_info}>
              <View style={styles.route_info_user}>
                <Avatar.Icon
                  style={{
                    backgroundColor: "white",
                    paddingTop: windowHeight / 200,
                  }}
                  size={windowHeight / 20}
                  color="#b4b4b4"
                  icon="account-circle"
                />
                <Text style={styles.route_info_text}>
                  {nickname}님, 총{" "}
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "NotoBold",
                      fontSize: windowHeight / 45,
                    }}
                  >
                    {routeCnt}
                  </Text>
                  편의 동선을 만드셨네요 !
                </Text>
              </View>
              <IconButton
                style={{ marginTop: windowHeight / 130 }}
                icon="menu"
                color="#555555"
                size={windowHeight / 40}
                // onPress={() => console.log("Pressed")}
              />
            </View>
          )}

          <View
            style={
              recording ? styles.route_contents_after : styles.route_contents
            }
          >
            <Surface
              style={
                recording
                  ? styles.route_contents_shadow_after
                  : styles.route_contents_shadow
              }
            >
              {isModalVisible && (
                <Modal
                  style={{
                    justifyContent: "flex-end",
                    margin: 0,
                  }}
                  isVisible={isModalVisible}
                  hasBackdrop={true}
                  coverScreen={false}
                  onBackdropPress={toggleModal}
                >
                  <Surface
                    style={{
                      flex: 0.34,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                  >
                    <View
                      style={{
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.route_contents_pause_title}>
                        <Text style={styles.route_contents_pause_title_text}>
                          현재 동선 정보
                        </Text>
                      </View>
                      <View style={styles.route_contents_pause_info}>
                        <View style={styles.route_tool_routeInfo_wrap}>
                          <Text style={styles.route_tool_routeInfo_text}>
                            걸은 거리
                          </Text>
                          <Text style={styles.route_tool_routeInfo_textBold}>
                            0.0{polyLine.length * 1}{" "}
                            <Text style={styles.route_tool_routeInfo_text}>
                              km
                            </Text>
                          </Text>
                        </View>
                        <View style={styles.route_tool_routeInfo_wrap}>
                          <Text style={styles.route_tool_routeInfo_text}>
                            걸은 시간
                          </Text>
                          <Text style={styles.route_tool_routeInfo_textBold}>
                            0:00{" "}
                            <Text style={styles.route_tool_routeInfo_text}>
                              분
                            </Text>
                          </Text>
                        </View>
                        <View style={styles.route_tool_routeInfo_wrap}>
                          <Text style={styles.route_tool_routeInfo_text}>
                            추가한 마커
                          </Text>
                          <Text style={styles.route_tool_routeInfo_textBold}>
                            {tempPinCount}
                            <Text style={styles.route_tool_routeInfo_text}>
                              {" "}
                              개
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <View style={styles.route_contents_pause_tool}>
                        <Button
                          style={styles.route_contents_pause_tool_button}
                          labelStyle={
                            styles.route_contents_pause_tool_button_label
                          }
                          icon="run"
                          mode="outlined"
                          onPress={toggleModal}
                        >
                          재개하기
                        </Button>
                        <Button
                          style={styles.route_contents_pause_tool_button}
                          labelStyle={
                            styles.route_contents_pause_tool_button_label
                          }
                          icon="stop"
                          mode="outlined"
                          onPress={stopRecording}
                        >
                          정지하기
                        </Button>
                      </View>
                    </View>
                  </Surface>
                </Modal>
              )}
              {isModalVisible2 && (
                <Modal
                  style={{
                    margin: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                  }}
                  isVisible={isModalVisible2}
                  hasBackdrop={true}
                  coverScreen={false}
                  animationInTiming={0.1}
                >
                  <KeyboardAwareScrollView
                    contentContainerStyle={{ flex: 1 }}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: "90%",
                          flex: 0.5,
                        }}
                      >
                        {isImageLoading && <ActivityIndicator size="large" />}
                        {image && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={pickImage}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 10,
                            }}
                          >
                            <Image
                              source={{ uri: image }}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                              }}
                            ></Image>
                          </TouchableOpacity>
                        )}
                        {!image && !isImageLoading && (
                          <IconButton
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            icon={"plus"}
                            color="black"
                            size={80}
                            onPress={pickImage}
                          />
                        )}
                      </View>

                      <TextInput
                        mode="outlined"
                        value={textzzz}
                        placeholder="제목"
                        onChangeText={(textzzz) => setTextzzz(textzzz)}
                        text="black"
                        theme={{
                          colors: {
                            placeholder: "#999999",
                            text: "#e2e2e2",
                            primary: "#545454",
                            background: "white",
                          },
                        }}
                        style={{ width: "90%", flex: 0.2 }}
                      />
                      <Text
                        style={{
                          width: "90%",
                          textAlign: "right",
                        }}
                      >
                        {contentzzz.length}/100
                      </Text>
                      <TextInput
                        mode="outlined"
                        placeholder="내용"
                        value={contentzzz}
                        multiline={true}
                        maxLength={100}
                        onChangeText={(contentzzz) => {
                          setContentzzz(contentzzz);
                        }}
                        text="black"
                        theme={{
                          colors: {
                            placeholder: "#999999",
                            text: "#e2e2e2",
                            primary: "#545454",
                            background: "white",
                          },
                        }}
                        style={{ width: "90%", flex: 0.4 }}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <Button
                          style={{ margin: 10 }}
                          labelStyle={
                            styles.com_safeView_title_route_total_content_text6
                          }
                          mode="outlined"
                          onPress={addPinArray}
                        >
                          추가하기
                        </Button>
                        <Button
                          style={{ margin: 10 }}
                          labelStyle={
                            styles.com_safeView_title_route_total_content_text6
                          }
                          mode="outlined"
                          onPress={toggleModal2}
                        >
                          취소하기
                        </Button>
                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </Modal>
              )}
              {isModalVisible3 && (
                <Modal
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
                      {infoText}
                    </Text>
                    <Image
                      resizeMode="stretch"
                      source={{ uri: infoImg }}
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
                      {infoContent.trim()}
                    </Text>

                    <Button
                      style={{ margin: 10, flex: 0.065 }}
                      mode="contained"
                      onPress={toggleModal3}
                    >
                      확인
                    </Button>
                  </View>
                </Modal>
              )}
              <MapView
                opacity={recording ? 1 : 1}
                style={
                  recording
                    ? styles.route_contents_map_after
                    : styles.route_contents_map
                }
                rotateEnabled={false}
                showsUserLocation={true}
                followsUserLocation={adding ? false : true}
                onRegionChange={(Region) => {
                  setCurrent({
                    latitude: Region.latitude,
                    longitude: Region.longitude,
                  });
                  //console.log(current);
                }}
                onPanDrag={(Region) => {
                  if (markerRef.current != null) {
                    if (hide) {
                      markerRef.current.hideCallout();
                      setHide(false);
                    }
                  }
                }}
                onRegionChangeComplete={(Region) => {
                  if (isModalVisible2 == true) {
                    Region = null;
                  }
                  if (markerRef.current != null) {
                    if (Region != null) {
                      if (
                        Region.latitude == current.latitude &&
                        Region.longitude == current.longitude
                      ) {
                        markerRef.current.showCallout();
                        setHide(true);
                      }
                    }
                  }
                }}
                onUserLocationChange={(e) => {
                  if (e.nativeEvent.coordinate.accuracy <= 15) {
                    const newLine = {
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                    };

                    if (recording == true) {
                      if (count == 0) {
                        setPolyLine([...polyLine, Object.values(newLine)]);
                        if (arrCount != 0) {
                          setPrevRouteM(routeM);
                        }
                        setPrevLine(newLine);
                        setCount(1);
                      } else {
                        if (getDistance(prevLine, newLine) >= 10) {
                          if (arrCount != 0) {
                            const now = [];
                            now.push([...polyLine, Object.values(newLine)]);
                            console.log(now);
                            if (prevRouteM.concat(now) != null) {
                              setRouteM(prevRouteM.concat(now));
                            }
                          } else {
                            console.log([
                              [...polyLine, Object.values(newLine)],
                            ]);
                            setRouteM([[...polyLine, Object.values(newLine)]]);
                          }
                          setPrevLine(newLine);
                          setPolyLine([...polyLine, Object.values(newLine)]);
                        }
                      }
                    }
                  }
                }}
              >
                {pinArray != null
                  ? pinArray.map((route, index) => {
                      // console.log(route);
                      return (
                        <Marker
                          key={index}
                          draggable
                          coordinate={{
                            latitude: route.latitude,
                            longitude: route.longitude,
                          }}
                          onPress={() => {
                            setInfoImg(route.file.image);
                            setInfoText(route.file.text);
                            setInfoContent(route.file.content);
                            toggleModal3();
                          }}
                          centerOffset={{ x: 0, y: -22 }}
                        >
                          <Surface
                            style={styles.route_contents_map_marker_shadow}
                          >
                            <View style={styles.route_contents_map_marker_wrap}>
                              <Image
                                source={{ uri: route.file.thumbImage }}
                                style={styles.route_contents_map_marker_image}
                              />
                            </View>
                          </Surface>
                        </Marker>
                      );
                    })
                  : null}

                {adding ? (
                  <Marker
                    pinColor="#e33333"
                    draggable
                    coordinate={current}
                    ref={markerRef}
                    onDragEnd={(e) => {
                      setCurrent({
                        latitude: e.nativeEvent.coordinate.latitude,
                        longitude: e.nativeEvent.coordinate.longitude,
                      });
                    }}
                  >
                    <MapView.Callout
                      tooltip={true}
                      style={{}}
                      onPress={() => {
                        toggleModal2();
                        setImage(null);
                        setTextzzz(null), setContentzzz(null);
                      }}
                    >
                      <View style={{ backgroundColor: "white" }}>
                        <Button icon="plus" mode="outlined">
                          이 위치에 마커 추가
                        </Button>
                      </View>
                    </MapView.Callout>
                  </Marker>
                ) : (
                  <></>
                )}

                {routeM.map((route, index) => {
                  if (route != null) {
                    if (route != undefined) {
                      return (
                        <Polyline
                          key={index}
                          coordinates={smooth(smooth(route)).map(
                            ([latitude, longitude]) => ({
                              latitude,
                              longitude,
                            })
                          )}
                          strokeColor={polyColor[index % 6]} // fallback for when `strokeColors` is not supported by the map-provider
                          strokeWidth={8}
                        />
                      );
                    }
                  }
                })}

                {/* {nowArr == 1 ? (
                  <Polyline
                    coordinates={output2}
                    strokeColor="#0000ff" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={8}
                  />
                ) : (
                  <></>
                )}
                */}

                {/* <Provider>
                  <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                      </View>
                      <IconButton
                        style={styles.route_safeView_contents_tool_button}
                        icon={"plus"}
                        color="black"
                        size={80}
                        onPress={() => {
                          pickImage();
                        }
                        }
                      />
                      <Button icon="camera" mode="contained" onPress={() => { addPinArray(); }}>
                        확인
                    </Button>
                    </Modal>
                  </Portal>
                </Provider> */}

                {/* <Provider>
                  <Portal>
                    <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={containerStyle}>
                      <Text>Example Modal.  Click outside this area to dismiss.</Text>
                      <Image source={{ uri: infoImg }} style={{ width: '100%', height: '100%' }} />
                    </Modal>
                  </Portal>
                </Provider> */}
              </MapView>
            </Surface>
          </View>

          {recording == false ? (
            <View style={styles.route_tool}>
              <Surface style={styles.route_tool_shadow}>
                <View
                  style={{
                    left: 0,
                    right: 0,
                    top: 0,
                    zIndex: 100,
                    marginTop: 20,
                    position: "absolute",
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
                  <View style={{ width: windowWidth }}>
                    <View style={styles.route_tool_phrase_wrap}>
                      {/* <Text style={styles.com_safeView_title_route_total_content_text4}>걷는 것이 바로 최고의 약이다.</Text>
                <Text style={styles.com_safeView_title_route_total_content_text5}>- 히포크라테스 -</Text> */}
                      <Text style={styles.route_tool_phrase}>
                        진정으로 모든 위대한 생각은{"\n"}걷는 것으로부터 나온다.
                      </Text>
                      <Text style={styles.route_tool_who}>- F. 니체 -</Text>
                    </View>
                  </View>
                  <View style={{ width: windowWidth }}>
                    <View style={styles.route_tool_routeInfo}>
                      <View style={styles.route_tool_routeInfo_wrap}>
                        <Text style={styles.route_tool_routeInfo_text}>
                          총 거리
                        </Text>
                        <Text style={styles.route_tool_routeInfo_textBold}>
                          0.0{polyLine.length * 1}{" "}
                          <Text style={styles.route_tool_routeInfo_text}>
                            km
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.route_tool_routeInfo_wrap}>
                        <Text style={styles.route_tool_routeInfo_text}>
                          총 시간
                        </Text>
                        <Text style={styles.route_tool_routeInfo_textBold}>
                          0:00{" "}
                          <Text style={styles.route_tool_routeInfo_text}>
                            분
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.route_tool_routeInfo_wrap}>
                        <Text style={styles.route_tool_routeInfo_text}>
                          마커 갯수
                        </Text>
                        <Text style={styles.route_tool_routeInfo_textBold}>
                          {pinArray.length}
                          <Text style={styles.route_tool_routeInfo_text}>
                            {" "}
                            개
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animated.ScrollView>

                <Button
                  style={styles.route_tool_button}
                  labelStyle={styles.route_tool_button_label}
                  icon="run"
                  mode="outlined"
                  onPress={() => {
                    setRouteName("");
                    showDialog();
                  }}
                >
                  동선 기록 시작하기
                </Button>
              </Surface>
            </View>
          ) : (
            <View style={styles.route_tool_after}>
              {!isModalVisible && !isModalVisible2 && !isModalVisible3 ? (
                <Surface style={styles.route_tool_after_button_shadow}>
                  <IconButton
                    style={styles.route_tool_after_button}
                    icon={"pause"}
                    color="#3f3f3f"
                    size={30}
                    onPress={toggleModal}
                  />
                </Surface>
              ) : (
                <></>
              )}
              {!isModalVisible && !isModalVisible2 && !isModalVisible3 ? (
                <Surface style={styles.route_tool_after_button_shadow}>
                  <IconButton
                    style={styles.route_tool_after_button}
                    icon={adding ? "close" : "pin"}
                    color="#3f3f3f"
                    size={30}
                    onPress={addPin}
                  />
                </Surface>
              ) : (
                <></>
              )}

              {/* <IconButton
                style={styles.route_safeView_contents_tool_record_button}
                icon="stop"
                color="#5c6bc0"
                size={45}
                onPress={stopRecording}
              />
              <IconButton
                style={styles.route_safeView_contents_tool_record_button}
                icon={adding ? "close" : "pin"}
                color="#5c6bc0"
                size={45}
                onPress={addPin}
              /> */}
            </View>
          )}
          <View>
            <Portal>
              <View
                style={{
                  width: "90%",
                  left: "5%",
                  position: "absolute",
                  top: windowHeight * 0.35,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  zIndex: 999999,
                }}
              >
                {visible2 ? (
                  <Snackbar
                    visible={visible2}
                    duration={1000}
                    onDismiss={onDismissSnackBar2}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 5,
                      color: "black",
                    }}
                  >
                    <Text style={{ color: "black" }}>
                      ❌{"  "}
                      {snackbarMessage}
                    </Text>
                  </Snackbar>
                ) : (
                  <></>
                )}
              </View>
              <Dialog
                visible={visibleDialog}
                onDismiss={() => {
                  setVisible2(false);
                  hideDialog();
                }}
                style={{ borderRadius: 10 }}
              >
                <Dialog.Title>동선 이름</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>동선의 이름을 정해주세요</Paragraph>
                  <TextInput
                    mode="outlined"
                    onChangeText={(routeName) => setRouteName(routeName)}
                    text="black"
                    theme={{
                      colors: {
                        placeholder: "#999999",
                        text: "#222222",
                        primary: "#545454",
                        background: "white",
                      },
                    }}
                    style={{ width: "100%", height: 30 }}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setVisible2(false);
                      hideDialog();
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    onPress={() => {
                      if (routeName == "") {
                        showSnackBar2("동선이름은 필수입니다.");
                      } else {
                        startRecording();
                      }
                    }}
                  >
                    확인
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
          <View
            style={{
              width: "100%",
              position: "absolute",
              top: windowHeight * 0.12,
              flexDirection: "row",
              justifyContent: "space-between",
              zIndex: 999999,
            }}
          >
            <Snackbar
              visible={visible}
              duration={1000}
              onDismiss={onDismissSnackBar}
            >
              {snackbarMessage}
            </Snackbar>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
