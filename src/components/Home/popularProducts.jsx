import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "../../utils/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ApiService from "../../service/APIService";
import LoginPopup from "../General/loginPopup";
import {
  moderateScale,
  moderateVerticalScale,
  textScale,
  width,
} from "../../utils/responsiveSize";
import FontFamily from "../../utils/FontFamily";
import FastImage from "react-native-fast-image";
import { showMessage } from "react-native-flash-message";
import StorageService from "../../utils/storageService";
import { parseStoredUser, showSuccessMessage } from "../../utils/HelperFunction";

export default function PopularProducts({ data }) {
  const navigation = useNavigation();
  const [wishlist, setWishlist] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [localWishlistUpdates, setLocalWishlistUpdates] = useState({});

  const fetchWishlist = async () => {
    try {
      const user = await StorageService.getItem("user_data");
      if (user) {
        const userData = parseStoredUser(user);
        const response = await ApiService.GET_WISHLIST_PRODUCTS(userData?._id);
        if (response?.success) {
          setWishlist(response?.data?.products || []);
          setLocalWishlistUpdates({});
        }
      }
    } catch (error) {
      console.log("Error fetching wishlist", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const isItemInWishlist = (productId) => {
    // First check local updates
    if (localWishlistUpdates[productId] !== undefined) {
      return localWishlistUpdates[productId];
    }
    // Then check the actual wishlist
    return wishlist.some((item) => item.product?._id === productId);
  };

  const handleAddToCart = async (product) => {
    const user = await StorageService.getItem("user_data");
    if (user) {
      const userData = parseStoredUser(user);
      const cartData = {
        product: {
          brand: product?.brand?._id,
          product: product?._id,
          category: product?.category?._id,
          packSize: product?.priceList[0].number,
          price: product?.priceList[0].SP,
          quantity: 1,
          stock: 1000,
          totalWeight: product?.priceList[0].number,
          totalPackWeight: 0,
        },
        user: userData?._id,
      };

      try {
        const response = await ApiService.ADD_TO_CART(cartData);
        if (response?.success) {
          showMessage({
            message: "Product Added to cart successfully",
            type: "success",
            icon: "success",
          });
        }
      } catch (e) {
        console.log("Error adding to cart:", e);
      }
    } else {
      setShowLoginPopup(true);
    }
  };


  const handleSaveToWishList = async (product) => {
    const user = await StorageService.getItem("user_data");
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const userData = parseStoredUser(user);
      const currentStatus = isItemInWishlist(product._id);

      // Immediately update local state for instant UI feedback
      setLocalWishlistUpdates((prev) => ({
        ...prev,
        [product._id]: !currentStatus,
      }));

      if (currentStatus) {
        // Remove from wishlist
        const response = await ApiService.REMOVE_FROM_WISHLIST({
          product: product._id,
          user: userData._id,
        });

        if (!response?.success) {
          // Revert if API call fails
          setLocalWishlistUpdates((prev) => ({
            ...prev,
            [product._id]: currentStatus,
          }));
          throw new Error("Failed to remove from wishlist");
        }
        showSuccessMessage("Product removed from wishlist")
      } else {
        // Add to wishlist
        const wishlistData = {
          product: {
            brand: product?.brand?._id,
            product: product?._id,
            category: product?.category?._id,
            packSize: product?.priceList[0].number,
            price: product?.priceList[0].SP,
            quantity: 1,
            stock: 1000,
            totalWeight: product?.priceList[0].number,
            totalPackWeight: 0,
          },
          user: userData?._id,
        };

        const response = await ApiService.ADD_TO_WISHLIST(wishlistData);
        if (!response?.success) {
          // Revert if API call fails
          setLocalWishlistUpdates((prev) => ({
            ...prev,
            [product._id]: currentStatus,
          }));
          throw new Error("Failed to add to wishlist");
        }
        showSuccessMessage("Product added to wishlist")
      }

      // Refresh wishlist to sync with server
      await fetchWishlist();
    } catch (error) {
      console.log("Error updating wishlist", error);
      showMessage({
        message: error.message || "Error updating wishlist",
        type: "danger",
        icon: "danger",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productHolder}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => navigation.push("ProductDetails", { item })}
            >
              <View style={styles.imageHolder3}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item?.images[0]?.image,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.web,
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </View>
              <View style={styles.itemTextHolder}>
                <Text
                  numberOfLines={2}
                  style={[styles.nameText, { textTransform: "capitalize" }]}
                >
                  {item?.name} {item?.slug}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: moderateScale(5),
                  }}
                >
                  {/* <Text
                    style={{
                      color: Colors.brandColor,
                      fontSize: textScale(12),
                      fontFamily: FontFamily.Montserrat_Regular,
                    }}
                  >
                    M.R.P
                  </Text> */}
                  <Text style={styles.mrpText}>
                    ₹{Math.round(item?.priceList?.[0]?.MRP)}
                  </Text>
                  <Text
                    style={[
                      styles.priceText,
                      // {
                      //   color:
                      //     item?.priceList[0]?.stock_quantity > 0
                      //       ? Colors.green
                      //       : Colors.outOfStockText,
                      // },
                    ]}
                  >
                    ₹{Math.round(item?.priceList[0]?.SP || "0")}
                  </Text>
                </View>
              </View>
              <View style={styles.discountHolder}>
                <View style={styles.offerView}>
                  <Text style={styles.offerText}>
                    {parseInt(
                      ((item?.priceList[0]?.MRP - item?.priceList[0]?.SP) /
                        item?.priceList[0]?.MRP) *
                        100
                    )}
                    %{"\n"}
                    OFF
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.heartIconHolder}
                onPress={() => handleSaveToWishList(item)}
              >
                <AntDesign
                  name={isItemInWishlist(item._id) ? "heart" : "heart"}
                  size={moderateScale(25)}
                  color={
                    isItemInWishlist(item._id) ? Colors.red : Colors.text_grey
                  }
                />
              </TouchableOpacity>
              {/* <View style={styles.discountHolder}>
                <View style={styles.offerView}>
                  <Text style={styles.offerText}>
                    {parseInt(
                      ((item?.priceList[0]?.MRP - item?.priceList[0]?.SP) /
                        item?.priceList[0]?.MRP) *
                        100
                    )}{" "}
                    % OFF
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.heartIconHolder}
                onPress={() => handleSaveToWishList(item)}
              >
                <AntDesign
                  name={isItemInWishlist(item._id) ? "heart" : "hearto"}
                  size={textScale(25)}
                  color={isItemInWishlist(item._id) ? Colors.red : Colors.red}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => navigation.push("ProductDetails", { item })}
                // onPress={() => handleAddToCart(item)}
                // disabled={item?.priceList[0]?.stock_quantity <= 0}
                style={[
                  styles.button,
                  // {
                  //   backgroundColor:
                  //     item?.priceList[0]?.stock_quantity > 0
                  //       ? Colors.brandColor
                  //       : Colors.outOfStock,
                  // },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    // {
                    //   color:
                    //     item?.priceList[0]?.stock_quantity > 0
                    //       ? Colors.white
                    //       : Colors.outOfStockText,
                    // },
                  ]}
                >
                  VIEW PRODUCT
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {showLoginPopup && (
        <LoginPopup
          showLoginPopup={showLoginPopup}
          setShowLoginPopup={setShowLoginPopup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: moderateScale(10),
    backgroundColor: Colors.white,
    elevation: moderateScale(10),
    gap: moderateScale(5),
    width: width * 0.45,
  },
  image: {
    width: moderateScale(175),
    height: moderateScale(175),
    alignSelf: "center",
  },
  itemTextHolder: {
    width: "98%",
    height: moderateScale(80),
    gap: moderateScale(5),
  },
  priceText: {
    fontSize: textScale(18),
    color: Colors.green,
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  nameText: {
    fontSize: textScale(16),
    color: Colors.black,
    textAlign: "left",
  },
  discountHolder: {
    position: "absolute",
    top: "0%",
    right: "0%",
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(50),
    // borderRadius: moderateScale(5),
    width: "26%",
  },
  offerView: {
    backgroundColor: Colors.red,
    padding: moderateScale(5),
    width: "100%",
    borderBottomLeftRadius: moderateScale(10),
    // borderRadius: moderateScale(5),
  },
  outOfStock: {
    backgroundColor: Colors.red,
    padding: moderateScale(5),
    borderTopEndRadius: moderateScale(5),
    borderBottomEndRadius: moderateScale(5),
  },
  outOfStockText: {
    fontSize: textScale(14),
    color: Colors.white,
  },
  offerText: {
    fontSize: textScale(12),
    color: Colors.white,
    fontFamily: FontFamily.Montserrat_Medium,
  },
  heartIconHolder: {
    position: "absolute",
    top: "0%",
    left: "0%",
    padding: moderateScale(5),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.white,
    borderColor: Colors.border_color,
    // borderWidth: 1,
    overflow: "hidden",
  },
  button: {
    marginHorizontal: moderateScale(-10),
    marginBottom: moderateScale(-10),
    alignItems: "center",
    backgroundColor: Colors.brandColor,
  },
  buttonText: {
    fontSize: textScale(14),
    textAlign: "center",
    padding: moderateScale(10),
    fontFamily: FontFamily.Montserrat_SemiBold,
    color: Colors.white,
  },
  productHolder: {
    width: "95%",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(15),
    // alignItems:'center',
    alignSelf: "center",
    justifyContent: "space-between",
    marginVertical: moderateVerticalScale(10),
  },
  loaderContainer: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    fontSize: textScale(14),
    color: "black",
    textAlign: "center",
  },
  loaderView: {
    position: "absolute",
    width: "100%",
    top: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  mrpText: {
    fontSize: textScale(14),
    color: Colors.green,
    textDecorationLine: "line-through",
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
});
