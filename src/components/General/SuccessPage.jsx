import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import ApiService from "../../service/APIService";
import {
  moderateScale,
  moderateVerticalScale,
  textScale,
} from "../../utils/responsiveSize";
import FontFamily from "../../utils/FontFamily";

const SuccessPage = ({ route }) => {
  const { id } = route.params;
console.log(id,"Line 22")
  const navigation = useNavigation();

  const handleButtonPressed = async () => {
    let data = {
      id: id,
    };
    try {
      const response = await ApiService.EMPTY_CART(data);
      console.log(response,"line 31");
      if (response?.success) {
      }
    } catch (e) {
      Alert.alert("Error", e);
    }
    navigation.push("Drawer");
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/success.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.confirmTitle}>Order Confirmed!</Text>
        <Text style={styles.confirmSubtitle}>Your order has been placed </Text>
        <Text style={[styles.confirmSubtitle, { alignSelf: "center" }]}>
          successfully.{" "}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleButtonPressed}
        style={styles.addressButton}
      >
        <Text style={styles.addressText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    height: moderateScale(120),
    width: moderateScale(120),
  },
  image: {
    alignSelf: "center",
  },
  confirmTitle: {
    fontSize: textScale(20),
    fontFamily: FontFamily.Montserrat_SemiBold,
    color: Colors.black,
  },
  content: {
    marginTop: moderateVerticalScale(15),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  confirmSubtitle: {
    color: Colors.text_grey,
    fontSize: textScale(14),
  },
  addressButton: {
    backgroundColor: Colors.forgetPassword,
    justifyContent: "center",
    alignItems: "center",
    height: moderateScale(40),
    width: moderateScale(200),
    alignSelf: "center",
    borderRadius: moderateScale(5),
    marginTop: moderateVerticalScale(50),
  },
  addressText: {
    color: Colors.white,
    fontSize: textScale(14),
    textTransform: "uppercase",
  },
});
