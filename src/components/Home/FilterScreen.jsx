import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import Colors from "../Colors";
import { responsiveFontSize, responsivePadding } from "../Responsive";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
// import { Checkbox } from "react-native-paper";
import { filterCategories } from "../../assets/dummyjson/filterCategories";
import { brandData } from "../../assets/dummyjson/brands";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import InternalHeader from "../header/InternalHeader";
import CustomSlider from "../General/CustomSlider";
import CustomButton from "../General/CustomButton";
import Data from "../../assets/dummyjson/Categories.json";
import { CheckBox } from '@rneui/themed';

const FilterScreen = () => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [check1, setCheck1] = useState(false);

  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
  };

  const handleBrandChange = (id) => {
    setSelectedBrand(id);
  };

  return (
    <View style={styles.container}>
     
      <SafeAreaView style={{ backgroundColor: Colors.white }} />
      <StatusBar barStyle={"dark-content"} backgroundColor={Colors.white} />
      <InternalHeader title={"Filter"} />
      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {/* Filter by Size View */}
        <View style={styles.lowerView}>
          <Text style={styles.label}>Filter by Size</Text>

          <CustomSlider name={"Length"} minValue={0} maxValue={100} />
          <CustomSlider name={"Breadth"} minValue={0} maxValue={100} />
          <CustomSlider name={"Height"} minValue={0} maxValue={100} />
          <CustomButton
            name={"Apply"}
            handleAction={() => console.log("Clicked on the Apply Button")}
          />
        </View>

        <View style={styles.lowerView}>
          <Text style={styles.label}>Filter by Category</Text>

          {Data.map((item) => {
            return (
              <View key={item?.id} style={styles.contentContainer}>
                {/* <CheckBox
                  status={
                    selectedCategory === item?.id ? "checked" : "unchecked"
                  }
                  value={selectedCategory === item?.id} // Only checked if this index is selected
                  onPress={() => handleCategoryChange(item?.id)}
                /> */}
                <CheckBox
                  center
                  title={item?.name}
                  checked={check1}
                  onPress={() => setCheck1(!check1)}
                />
                {/* <Text style={styles.categoryText}>{item?.name}</Text> */}
              </View>
            );
          })}
        </View>

        <View style={styles.lowerView}>
          <Text style={styles.label}>Filter by Brand</Text>

          {brandData.map((item, index) => {
            return (
              <View key={index} style={styles.contentContainer}>
                {/* <Checkbox
                  style={styles.checkbox}
                  color={selectedBrand === item?.id ? "red" : "transparent"}
                  status={selectedBrand === item?.id ? "checked" : "unchecked"}
                  onPress={() => handleBrandChange(item?.id)}
                /> */}
                <Text style={styles.categoryText}>{item?.name}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(18),
    fontWeight: "400",
  },
  main: {
    backgroundColor: Colors.white,
  },
  headerTitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(18),
    fontWeight: "400",
  },
  headerView: {
    paddingTop: responsivePadding(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: responsivePadding(10),
    marginBottom: 10,
  },
  icons: {
    flexDirection: "row",
    gap: 10,
  },

  mainView: {
    backgroundColor: "white",
    height: responsivePadding(110),
    width: responsivePadding(150),
    position: "absolute",
    top: 55,
    right: 50,
  },
  sortText: {
    color: Colors.black,
    fontSize: responsiveFontSize(15),
  },
  sortItem: {
    padding: 8,
    width: responsivePadding(150),
  },
  label: {
    fontSize: responsiveFontSize(16),
    color: Colors.black,
    fontWeight: "500",
  },
  lowerView: {
    width: "90%",
    backgroundColor: "white",
    padding: responsivePadding(20),
    gap: responsivePadding(10),
    alignSelf: "center",
    marginTop: responsivePadding(30),
  },
  categoryText: {
    color: Colors.black,
    fontSize: responsiveFontSize(13),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginVertical: 3,
  },
  checkbox: {},
  button: {
    backgroundColor: Colors.forgetPassword,
    justifyContent: "center",
    alignItems: "center",
    height: responsivePadding(30),
    width: responsivePadding(100),
    borderRadius: responsivePadding(10),
    marginStart: responsivePadding(10),
    marginBottom: responsivePadding(30),
  },
  buttonText: {
    fontSize: responsiveFontSize(12),
    color: Colors.white,
  },
});
