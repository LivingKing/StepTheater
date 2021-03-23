import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles_detail = StyleSheet.create({
  detail: { flex: 1, backgroundColor: "white" },
  detail_logo: {
    width: "35%",
    height: "100%",
  },
  detail_header: {
    fontSize: windowWidth / 24,
    fontFamily: "NotoLight",
    color: "#262223",
  },
  detail_title: {
    marginTop: 3.8,
    flex: 0.05,
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "row",
    zIndex: 16,
    paddingBottom: 10,
    alignItems: "center",
  },
  detail_title2: {
    marginTop: 3.8,
    flex: 0.05,
    backgroundColor: "white",
    justifyContent: "center",
    flexDirection: "row",
    zIndex: 16,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomColor: "#e6e6e6",
    borderBottomWidth: 1,
  },
  detail_title3: {
    marginTop: 3.8,
    flex: 0.05,
    backgroundColor: "white",
    flexDirection: "row",
    zIndex: 16,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#e6e6e6",
    borderBottomWidth: 1,
  },
  detail_title_text: {
    textAlignVertical: "auto",
    fontSize: windowWidth / 21.5,
    fontFamily: "NotoMedium",
    color: "#262223",
    marginLeft: 15,
  },

  detail_contents: { flex: 0.95, backgroundColor: "#f6f6f6" },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },

  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  section: {
    backgroundColor: "#EBF9F9",
    color: "grey",
    textTransform: "capitalize",
  },
  item: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "grey",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
});
export default styles_detail;
