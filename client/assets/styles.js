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
    // backgroundColor: "lime",
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
