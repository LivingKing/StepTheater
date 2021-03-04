

import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  com_headers: { flex: 0, backgroundColor: "white", },
  com_safeView: { flex: 1, backgroundColor: "#f4f0ec", },
  com_safeView_title: { flex: 0.45, justifyContent: "center", backgroundColor: "white" },


  route: { flex: 1, backgroundColor: "white", },

  route_title: { marginTop: 10, flex: 0.05, backgroundColor: "white", justifyContent: "center", },
  route_title_text: { textAlignVertical: "auto", fontSize: windowHeight / 38, fontFamily: "NotoMedium", color: "#262223", marginLeft: 15, },

  route_title_after: { marginTop: 10, flex: 0.05, backgroundColor: "white", justifyContent: "center", },


  route_info: { flex: 0.065, backgroundColor: "white", flexDirection: "row", paddingLeft: 7, paddingRight: 23, justifyContent: "space-between", },
  route_info_user: { height: windowHeight / 10, width: "93%", },
  route_info_text: { fontSize: windowHeight / 60, fontFamily: "NotoRegular", color: "#3f3f3f", marginTop: -windowHeight / 24, paddingLeft: windowHeight / 20 },

  route_info_after: { flex: 0.065, backgroundColor: "white", flexDirection: "row", justifyContent: "space-between" },
  route_info_after_text_wrap: { width: "100%", justifyContent: "center", flexDirection: "row" },
  route_info_text_after: { fontSize: windowHeight / 60, fontFamily: "NotoRegular", color: "#3f3f3f", marginTop: windowHeight / 150, },


  route_contents: { flex: 0.585, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f6f6", },
  route_contents_shadow: { width: "94%", height: "94%", backgroundColor: "black", borderRadius: 15, alignItems: "center", elevation: 4, marginBottom: 3, },
  route_contents_map: { width: "100%", height: "100%", borderRadius: 15, },

  route_contents_after: { flex: 0.885, justifyContent: "center", alignItems: "center", marginTop: "-2.5%", backgroundColor: "#f6f6f6", },
  route_contents_shadow_after: { width: "100%", height: "100%", },
  route_contents_map_after: { width: "100%", height: "100%", },

  route_contents_map_marker_shadow: { width: 34, height: 34, backgroundColor: "white", borderTopLeftRadius: 17, borderTopRightRadius: 17, borderBottomRightRadius: 17, transform: [{ rotate: "-45deg" }], alignItems: "center", justifyContent: "center", elevation: 10, },
  route_contents_map_marker_image: { width: 30, height: 30, borderRadius: 30 / 2, backgroundColor: "white", marginTop: 2, marginLeft: 2, transform: [{ rotate: "45deg" }], },
  route_contents_map_marker_wrap: { width: 34, height: 34, backgroundColor: "white", borderTopLeftRadius: 17, borderTopRightRadius: 17, borderBottomRightRadius: 17, },

  route_contents_pinModal_imageButton: { backgroundColor: "white", width: "100%", borderRadius: 50, },
  route_contents_pinModal_concanButton: { marginTop: 18, bottom: 0, width: "40%", marginLeft: "4%", marginBottom: "4%", borderRadius: 50, borderColor: "#555555", borderWidth: 1, backgroundColor: "white", },
  route_contents_pinModal_concanButton_wrap: { flexDirection: "row", },


  route_tool: { flex: 0.3, backgroundColor: "#f6f6f6", alignItems: "center", },
  route_tool_shadow: { width: "100%", height: "100%", borderTopLeftRadius: 15, borderTopRightRadius: 15, },
  route_tool_phrase_wrap: { borderRadius: 15, backgroundColor: "white", paddingLeft: 20, paddingRight: 20, paddingTop: 41, },
  route_tool_phrase: { paddingTop: windowHeight / 120, fontSize: windowHeight / 45, fontFamily: "NotoMedium", color: "#2a2a2a", },
  route_tool_who: { fontSize: windowHeight / 50, fontFamily: "NotoRegular", textAlign: "right", },
  route_tool_button: { position: "absolute", bottom: 0, width: "92%", marginLeft: "4%", height: windowHeight / 19, marginBottom: "4%", borderRadius: 50, borderColor: "#555555", borderWidth: 1, backgroundColor: "white", },
  route_tool_button_label: { fontSize: windowHeight / 50, fontFamily: "NotoMedium", textAlign: "right", color: "black", marginTop: windowHeight / 100 },
  route_tool_routeInfo: { backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", paddingLeft: "5%", paddingRight: "5%", marginTop: windowHeight / 15, },
  route_tool_routeInfo_wrap: { width: "30%", },
  route_tool_routeInfo_text: { fontSize: windowHeight / 50, fontFamily: "NotoRegular", textAlign: "center", },
  route_tool_routeInfo_textBold: { fontSize: windowHeight / 30, fontFamily: "NotoBold", textAlign: "center", },

  route_tool_after: { width: "100%", position: "absolute", top: windowHeight * 0.7, flexDirection: "row", justifyContent: "space-between", },
  route_tool_after_button_shadow: { width: 70, height: 50, borderRadius: 50, margin: 40, alignItems: "center", justifyContent: "center", elevation: 4, },
  route_tool_after_button: { backgroundColor: "white", },


  com_safeView_title_text: { fontSize: 25, fontWeight: "700", fontFamily: "DoHyeon", color: "#262223", marginLeft: 15, },
  com_safeView_contents: { flex: 7, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f6f6", },
  com_safeView_contents_text: { textAlign: "right", fontFamily: "DoHyeon", fontSize: 20, },
  route_safeView_contents_map: { width: "100%", height: "100%", },
  login_safeView_contents_logoView: { flex: 0.2, justifyContent: "center", alignItems: "center", marginBottom: 10, },
  login_safeView_contents_logoView_logoText: { fontSize: 50, fontWeight: "700", fontFamily: "DoHyeon", color: "#262223", },
  login_safeView_contents_loginView: { flex: 0.4, width: "90%", justifyContent: "center", alignItems: "center", padding: 5, },
  login_safeView_contents_loginView_btnView: { flexDirection: "row", marginBottom: 10, },
  login_safeView_contents_oAuthView: { flex: 0.35, },
  regi_safeView_contents_RegiView: { flex: 0.9, width: "90%", },
  regi_safeView_contents_RegiView_multiView: { width: "100%", flexDirection: "row", justifyContent: "space-between", },
  regi_safeView_contents_RegiView_btnView: { width: "100%", flexDirection: "row", justifyContent: "space-around", },
  com_safeView_btn: { fontFamily: "DoHyeon", fontSize: 30, },
  regi_dialog_title: { fontSize: 25, fontWeight: "700", fontFamily: "DoHyeon", color: "#262223", },
  regi_dialog_contents: { fontSize: 18, fontFamily: "DoHyeon", color: "#262223", textAlign: "center", },
  regi_dialog_btn: { fontSize: 16, fontFamily: "DoHyeon", color: "#262223", },
  find_safeView_contents_FindView: { flex: 1, width: "90%", },
  find_safeView_contents_FindView_title: { fontSize: 25, fontFamily: "DoHyeon", color: "#262223", },
  find_safeView_contents_FindView_IdView: { flex: 0.7, marginTop: 10, justifyContent: "center", alignItems: "center", },
  find_safeView_contents_FindView_PwView: { flex: 1, justifyContent: "center", alignItems: "center", },
});
export default styles;
