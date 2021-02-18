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
    flex: 0.5,
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
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
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
});
export default styles;
