import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  com_headers: {
    flex: 0,
    backgroundColor: "white",
  },
  com_safeView: {
    flex: 1,
    backgroundColor: "#f4f0ec",
  },
  com_safeView_title: {
    flex: 0.45,
    justifyContent: "center",
    backgroundColor: "white",
  },

  com_safeView_title_route: {
    marginTop: 10,
    flex: 0.5,
    backgroundColor: "white",
    justifyContent: "center",
  },
  com_safeView_title_route2: {
    marginTop: 10,
    // marginBottom: 25,
    flex: 0.5,
    backgroundColor: "white",
    justifyContent: "center",
  },

  com_safeView_title_route_text: {
    textAlignVertical: "auto",
    fontSize: 26,
    fontFamily: "NotoMedium",
    color: "#262223",
    marginLeft: 15,
  },

  com_safeView_title_route_total: {
    flex: 1.1,
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: 7,
    paddingRight: 23,
  },
  com_safeView_title_route_total3: {
    flex: 1.1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 25,
  },
  com_safeView_title_route_total4: {
    flex: 1.1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 48,
  },
  textzz: {
    fontSize: 18,
    fontFamily: "NotoRegular",
    textAlign: "center",
    marginTop: 15,
    marginLeft: -3,
    color: "#3f3f3f",
  },
  com_safeView_title_route_total_content: {
    width: 90,
  },
  com_safeView_title_route_total_content_text: {
    fontSize: 21,
    fontFamily: "NotoRegular",
    textAlign: "center",
  },
  com_safeView_title_route_total_content_text2: {
    fontSize: 31,
    fontFamily: "NotoBold",
    textAlign: "center",
  },
  com_safeView_title_route_total_content_text3: {
    fontSize: 20,
    fontFamily: "NotoRegular",
    textAlign: "center",
  },

  route_safeView_contents_tool_button: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 50,
  },
  route_safeView_contents_tool_button_label: {},
  surface: {
    width: 100,
    height: 100,
    borderRadius: 50,

    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    backgroundColor: "yellow",
  },
  surface4: {
    width: 70,
    height: 50,
    borderRadius: 50,

    margin: 40,

    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  route_safeView_contents_tool_record_buttonaaa: {
    justifyContent: "center",
  },

  route_safeView_contents_tool_record: {
    width: "100%",

    height: 90,

    position: "absolute", //use absolute position to show button on top of the map
    top: "82%", //for center align
    flexDirection: "row",
    justifyContent: "space-between",
  },
  route_safeView_contents_tool_record2: {
    width: "100%",
    position: "absolute", //use absolute position to show button on top of the map
    top: "10%", //for center align
    flexDirection: "row",
    justifyContent: "space-between",
  },

  route_safeView_contents_tool_record_button: {
    backgroundColor: "white",
  },
  route_safeView_contents_tool_record_buttonbbb: {
    backgroundColor: "white",
    fontSize: 30,
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "white",
    marginTop: 2,
    marginLeft: 2,
    transform: [{ rotate: "45deg" }],
  },
  circle2: {
    width: 34,
    height: 34,
    backgroundColor: "white",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 17,
  },
  circle_shadow: {
    width: 34,
    height: 34,
    backgroundColor: "white",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 17,
    transform: [{ rotate: "-45deg" }],

    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },

  com_safeView_route: {
    flex: 1,
    backgroundColor: "white",
  },
  ababab: {
    width: "93%",
    height: "93%",
    backgroundColor: "black",
    borderRadius: 15,
    alignItems: "center",
  },
  route_safeView_route_contents_map: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  route_safeView_route_contents_map2: {
    width: "100%",
    height: "100%",
  },
  surface2: {
    width: "94%",
    height: "94%",
    backgroundColor: "black",
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
    marginBottom: 3,
  },
  surface3: {
    width: "100%",
    height: "100%",
  },
  route_safeView_contents_tool: {
    flex: 3.3,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
  },

  qwer: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  horhor: {
    width: "100vw",
    height: "80%",
    backgroundColor: "red",
  },

  com_safeView_title_route_total2: {
    borderRadius: 15,
    backgroundColor: "white",

    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 41,
  },
  com_safeView_title_route_total_content2: {},
  com_safeView_title_route_total_content_text4: {
    fontSize: 24,
    fontFamily: "NotoMedium",
    color: "#2a2a2a",
  },
  com_safeView_title_route_total_content_text5: {
    fontSize: 20,
    fontFamily: "NotoRegular",
    textAlign: "right",
  },

  com_safeView_title_route_total_content_text6: {
    fontSize: 17,
    fontFamily: "NotoMedium",
    textAlign: "right",
    color: "black",
  },

  bbbb: {
    marginTop: 18,
    position: "absolute",
    bottom: 0,
    width: "92%",
    marginLeft: "4%",
    marginBottom: "4%",
    borderRadius: 50,
    borderColor: "#555555",
    borderWidth: 1,
    backgroundColor: "white",
  },
  bbbccc: {
    marginTop: 18,
    bottom: 0,
    width: "40%",
    marginLeft: "4%",
    marginBottom: "4%",
    borderRadius: 50,
    borderColor: "#555555",
    borderWidth: 1,
    backgroundColor: "white",
  },
  zpzpzp: {
    flexDirection: "row",
  },

  com_safeView_title_text: {
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "DoHyeon",
    color: "#262223",
    marginLeft: 15,
  },
  com_safeView_contents: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#f6f6f6",
  },
  com_safeView_contents2: {
    flex: 11.3,
    //12.4
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-2.5%",

    backgroundColor: "#f6f6f6",
  },
  com_safeView_contents_text: {
    textAlign: "right",
    fontFamily: "DoHyeon",
    fontSize: 20,
  },
  route_safeView_contents_map: {
    width: "100%",
    height: "100%",
  },
  login_safeView_contents_logoView: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "pink",
    marginBottom: 10,
  },
  login_safeView_contents_logoView_logoText: {
    fontSize: 50,
    fontWeight: "700",
    fontFamily: "DoHyeon",
    color: "#262223",
  },
  login_safeView_contents_loginView: {
    flex: 0.4,
    width: "90%",
    // backgroundColor: "skyblue",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  login_safeView_contents_loginView_btnView: {
    flexDirection: "row",
    marginBottom: 10,
  },
  login_safeView_contents_oAuthView: {
    // backgroundColor: "red",
    flex: 0.35,
  },
  regi_safeView_contents_RegiView: {
    flex: 0.9,
    width: "90%",
  },
  regi_safeView_contents_RegiView_multiView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  regi_safeView_contents_RegiView_btnView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  com_safeView_btn: {
    fontFamily: "DoHyeon",
    fontSize: 30,
  },
  regi_dialog_title: {
    fontSize: 25,
    fontWeight: "700",
    fontFamily: "DoHyeon",
    color: "#262223",
  },
  regi_dialog_contents: {
    fontSize: 18,
    fontFamily: "DoHyeon",
    color: "#262223",
    textAlign: "center",
  },
  regi_dialog_btn: {
    fontSize: 16,
    fontFamily: "DoHyeon",
    color: "#262223",
  },
  find_safeView_contents_FindView: {
    flex: 1,
    width: "90%",
  },
  find_safeView_contents_FindView_title: {
    fontSize: 25,
    fontFamily: "DoHyeon",
    color: "#262223",
  },
  find_safeView_contents_FindView_IdView: {
    flex: 0.7,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  find_safeView_contents_FindView_PwView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default styles;
