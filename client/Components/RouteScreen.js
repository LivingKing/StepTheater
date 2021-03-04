import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import RNAnimatedScrollIndicators from "react-native-animated-scroll-indicators";
import * as ImageManipulator from "expo-image-manipulator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RouteScreen() {
  const [image, setImage] = useState(null);
  const [thumbImage, setThumbImage] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nickname, setNickname] = useState("");
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
    const temp = await SecureStore.getItemAsync("NickName");
    setNickname(temp);
  };
  useEffect(() => {
    getLocation();
    getDate();
    getPermission();
    getSettings();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

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

    if (!result.cancelled) {
      setThumbImage(res.data.thumb.url);
      setImage(res.data.image.url);
    }
  };
  /* 지도 */
  const [polyLine, setPolyLine] = useState([]); // 경로저장
  const [polyLine2, setPolyLine2] = useState([]); // 경로2 저장 (임시)
  const [output, setOutput] = useState(null); // polyLine을 그리기 위한 바뀐 경로
  const [output2, setOutput2] = useState(null); // polyLine을 그리기 위한 바뀐 경로2 (임시)
  const [prevLine, setPrevLine] = useState(null); // 이전 위치 좌표
  const [current, setCurrent] = useState(null); // 현재 위치 좌표
  const [count, setCount] = useState(0); // 경로(polyLine)내 좌표(prevLine)들의 갯수
  const [nowArr, setNowArr] = useState(0); // 현재 몇번째 경로인지
  const [recording, setRecording] = useState(false); // 현재 경로 기록 여부

  /* 마커 */
  const [adding, setAdding] = useState(false); // 현재 마커 추가 중인지 여부
  const [pinArray, setPinArray] = useState([]); // 마커들이 저장된 배열

  /* 모달 */
  // const [visible, setVisible] = React.useState(false);
  // const showModal = () => setVisible(true);
  // const hideModal = () => setVisible(false);
  // const containerStyle = {

  //   flex: 11.3,
  //   width: "100%",
  //   height: "110%",

  //   backgroundColor: '#FFF',

  // };
  // // 핀추가용 모달 설정

  // const [visible2, setVisible2] = React.useState(false);
  // const showModal2 = () => setVisible2(true);
  // const hideModal2 = () => setVisible2(false);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [isModalVisible2, setModalVisible2] = useState(false);

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const [isModalVisible3, setModalVisible3] = useState(false);

  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  const [infoImg, setInfoImg] = useState(null);
  const [infoText, setInfoText] = useState(null);
  const [infoContent, setInfoContent] = useState(null);

  var smooth = require("smooth-polyline");

  const routeStateChange = () => {
    setRecording(!recording);
    onToggleSnackBar();
    //console.log(recording);
  };

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const postRoute = async (route) => {
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
        date: date,
        data: route,
      }),
    });
  };
  const stopRecording = () => {
    console.log("stop");
    if (nowArr === 0) postRoute(polyLine);
    else postRoute(polyLine2);
    setRecording(false);
    setNowArr(1);
    setModalVisible(false);
    setModalVisible2(false);
    setAdding(false);
    onToggleSnackBar();
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
        }),
      }
    );
    console.log("nextObject", nextObject);
    setPinArray([...pinArray, nextObject]);

    setAdding(false);
    toggleModal2();
    //console.log(pinArray);
  };

  const markerRef = useRef(null);
  const [hide, setHide] = useState(false);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const scrollX = new Animated.Value(0);

  const [textzzz, setTextzzz] = useState("");
  const [contentzzz, setContentzzz] = useState("");

  if (Platform.OS === "ios") {
    return (
      <Fragment>
        <SafeAreaView style={styles.com_headers}>
          <StatusBar style="dark" />
        </SafeAreaView>
        <SafeAreaView style={styles.com_safeView_route}>
          <View
            style={
              recording ? styles.com_safeView_title_route2 : styles.route_title
            }
          >
            <Text style={styles.route_title_text}>걸음 한 편</Text>
          </View>

          {recording ? (
            <View style={styles.com_safeView_title_route_total3}>
              <Text style={styles.route_info_text}>
                {isModalVisible
                  ? "일시정지 되었습니다."
                  : "동선을 기록하고 있습니다 ..."}
              </Text>
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
                    10
                  </Text>
                  편의 동선 책을 만드셨네요 !
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
              recording ? styles.com_safeView_contents2 : styles.route_contents
            }
          >
            <Surface style={recording ? styles.surface3 : styles.surface2}>
              <View>
                {isModalVisible && (
                  <View
                    style={{
                      margin: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Modal
                      style={{
                        justifyContent: "flex-end",
                        margin: 0,
                      }}
                      isVisible={isModalVisible}
                      hasBackdrop={true}
                      coverScreen={false}
                    >
                      <View
                        style={{
                          flex: 0.34,
                          backgroundColor: "white",
                          alignItems: "center",
                        }}
                      >
                        <Text>Hello!</Text>

                        <IconButton
                          icon="stop"
                          color="#5c6bc0"
                          size={45}
                          onPress={stopRecording}
                        />
                      </View>
                    </Modal>
                  </View>
                )}
              </View>

              <View>
                {isModalVisible2 && (
                  <View
                    style={{
                      margin: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "white",
                    }}
                  >
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
                            {!image && (
                              <IconButton
                                style={
                                  styles.route_safeView_contents_tool_button
                                }
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
                          <TextInput
                            mode="outlined"
                            value={contentzzz}
                            onChangeText={(contentzzz) =>
                              setContentzzz(contentzzz)
                            }
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

                          <View style={styles.zpzpzp}>
                            <Button
                              style={styles.bbbccc}
                              labelStyle={
                                styles.com_safeView_title_route_total_content_text6
                              }
                              mode="outlined"
                              onPress={addPinArray}
                            >
                              추가하기
                            </Button>
                            <Button
                              style={styles.bbbccc}
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
                  </View>
                )}
              </View>

              <View>
                {isModalVisible3 && (
                  <View
                    style={{
                      margin: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
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
                          flex: 0.7,
                          backgroundColor: "white",
                          alignItems: "center",
                        }}
                      >
                        <Text>{infoText}</Text>
                        <Text>{infoContent}</Text>
                        <Image
                          source={{ uri: infoImg }}
                          style={{
                            width: "80%",
                            height: "80%",
                            marginBottom: 10,
                            borderRadius: 15,
                          }}
                        />

                        <Button mode="contained" onPress={toggleModal3}>
                          확인
                        </Button>
                      </View>
                    </Modal>
                  </View>
                )}
              </View>
              <MapView
                opacity={recording ? 1 : 1}
                style={
                  recording
                    ? styles.route_safeView_route_contents_map2
                    : styles.route_safeView_route_contents_map
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
                      // console.log(
                      //   "distance : " + getDistance(prevLine, newLine)
                      // );

                      if (count == 0) {
                        //console.log("nowArr : " + nowArr);
                        //console.log("count : " + count);

                        if (nowArr == 0) {
                          setPolyLine([...polyLine, Object.values(newLine)]);
                          setOutput(
                            smooth(smooth(polyLine)).map(
                              ([latitude, longitude]) => ({
                                latitude,
                                longitude,
                              })
                            )
                          );
                        } else {
                          if (count == 0)
                            setPolyLine2([
                              ...polyLine2,
                              Object.values(prevLine),
                            ]);
                          setPolyLine2([...polyLine2, Object.values(newLine)]);
                          setOutput2(
                            smooth(smooth(polyLine2)).map(
                              ([latitude, longitude]) => ({
                                latitude,
                                longitude,
                              })
                            )
                          );
                          //console.log(output2)
                        }

                        setPrevLine(newLine);
                        var temp = count + 1;
                        setCount(temp);
                      } else {
                        //console.log("nowArr : " + nowArr);
                        //console.log("count : " + count);
                        if (getDistance(prevLine, newLine) >= 10) {
                          if (nowArr == 0) {
                            setPolyLine([...polyLine, Object.values(newLine)]);
                            setOutput(
                              smooth(smooth(polyLine)).map(
                                ([latitude, longitude]) => ({
                                  latitude,
                                  longitude,
                                })
                              )
                            );
                          } else {
                            if (count == 0)
                              setPolyLine2([
                                ...polyLine2,
                                Object.values(prevLine),
                              ]);
                            setPolyLine2([
                              ...polyLine2,
                              Object.values(newLine),
                            ]);
                            setOutput2(
                              smooth(smooth(polyLine2)).map(
                                ([latitude, longitude]) => ({
                                  latitude,
                                  longitude,
                                })
                              )
                            );
                            //console.log(output2)
                          }

                          setPrevLine(newLine);
                          var temp = count + 1;
                          setCount(temp);
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
                          <Surface style={styles.circle_shadow}>
                            <View style={styles.circle2}>
                              <Image
                                source={{ uri: route.file.thumbImage }}
                                style={styles.circle}
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

                <Polyline
                  coordinates={output}
                  strokeColor="#ff0000" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={8}
                />

                {nowArr == 1 ? (
                  <Polyline
                    coordinates={output2}
                    strokeColor="#0000ff" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={8}
                  />
                ) : (
                  <></>
                )}

                {/* <View style={styles.route_safeView_contents_tool_record2}>
                  <Snackbar
                    visible={visible}
                    duration={1500}
                    onDismiss={onDismissSnackBar}
                  >
                    동선 기록을 시작합니다.
                </Snackbar>
                </View> */}

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
                  onPress={routeStateChange}
                >
                  동선 기록 시작하기
                </Button>
              </Surface>
            </View>
          ) : (
            <View style={styles.route_safeView_contents_tool_record}>
              {!isModalVisible && !isModalVisible2 && !isModalVisible3 ? (
                <Surface style={styles.surface4}>
                  <IconButton
                    style={styles.route_safeView_contents_tool_record_button}
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
                <Surface style={styles.surface4}>
                  <IconButton
                    style={styles.route_safeView_contents_tool_record_button}
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
        </SafeAreaView>
      </Fragment>
    );
  } else {
    return null;
  }
}
