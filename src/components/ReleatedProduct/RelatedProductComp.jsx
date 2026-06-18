import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ApiService from "../../service/APIService";
import { showMessage } from "react-native-flash-message";
import FontFamily from "../../utils/FontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../utils/ResponsiveSize";
import Colors from "../Colors";
import FastImage from "react-native-fast-image";
import AntDesign from "react-native-vector-icons/AntDesign";
import StorageService from "../../utils/storageService";

const RelatedProductComp = ({ data }) => {
  const navigation = useNavigation();
  const [wishlist, setWishlist] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});

  useEffect(() => {
    (async () => {
      const savedWishlist = await StorageService.getItem("wishlist");
      savedWishlist && setWishlist(parseStoredUser(savedWishlist));
    })();
  }, []);

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

  const isItemInWishlist = (id) =>
    wishlist.some((wishItem) => wishItem._id === id);

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  const loadWishlist = async () => {
    try {
      const storedWishlist = await StorageService.getItem("wishlist");
      if (storedWishlist) {
        setWishlist(parseStoredUser(storedWishlist));
      }
    } catch (error) {
      console.log("Error loading wishlist", error);
    }
  };

  const handleSaveToWishList = async (item) => {
    try {
      const newWishlist = [...wishlist];
      const itemIndex = newWishlist.findIndex(
        (wishlistItem) => wishlistItem._id === item._id
      );

      if (itemIndex > -1) {
        newWishlist.splice(itemIndex, 1);
        showMessage({
          message: "Product removed from wishlist",
          type: "info",
          icon: "success",
          color: Colors.white,
          backgroundColor: Colors.red,
        });
      } else {
        // If the product is not in the wishlist, add it
        newWishlist.push(item);
        showMessage({
          message: "Product added to wishlist",
          type: "info",
          icon: "success",
          color: Colors.white,
          backgroundColor: Colors.brandColor,
        });
      }

      setWishlist(newWishlist);
      await StorageService.setItem("wishlist", JSON.stringify(newWishlist));
    } catch (error) {
      console.log("Error updating wishlist", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.productHolder}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
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
                resizeMode={FastImage.resizeMode.center}
              />
            </View>
            <View style={styles.itemTextHolder}>
              <Text numberOfLines={2} style={styles.nameText}>
                {item?.name} {item?.slug}
              </Text>
              <Text
                style={[
                  styles.priceText,
                  {
                    color:
                      item?.priceList[0]?.stock_quantity > 0
                        ? Colors.green
                        : Colors.outOfStockText,
                  },
                ]}
              >
                ₹ {item?.priceList[0]?.SP || "0"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(5),
                }}
              >
                <Text
                  style={{
                    color: Colors.brandColor,
                    fontSize: textScale(14),
                    fontFamily: FontFamily.Montserrat_Regular,
                  }}
                >
                  M.R.P
                </Text>
                <Text style={styles.mrpText}>{item?.priceList?.[0]?.MRP}</Text>
              </View>
            </View>
            <View style={styles.discountHolder}>
              {item?.priceList[0]?.stock_quantity > 0 ? (
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
              ) : (
                <View style={styles.outOfStock}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAddToCart(item)}
              disabled={item?.priceList[0]?.stock_quantity <= 0}
              style={[
                styles.button,
                {
                  backgroundColor:
                    item?.priceList[0]?.stock_quantity > 0
                      ? Colors.brandColor
                      : Colors.outOfStock,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      item?.priceList[0]?.stock_quantity > 0
                        ? Colors.white
                        : Colors.outOfStockText,
                  },
                ]}
              >
                Add to Cart
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* </ScrollView> */}
      {showLoginPopup && (
        <LoginPopup
          showLoginPopup={showLoginPopup}
          setShowLoginPopup={setShowLoginPopup}
        />
      )}
    </View>
  );
};

export default RelatedProductComp;

const styles = StyleSheet.create({
  item: {
    padding: moderateScale(10),
    backgroundColor: Colors.white,
    elevation: moderateScale(10),
    gap: moderateScale(5),
    width: moderateScale(250),
    margin: moderateScale(10),
  },
  image: {
    //   width: "95%",
    width: moderateScale(230),
    height: moderateScale(140),
  },
  itemTextHolder: {
    width: "98%",
    height: moderateScale(100),
    gap: moderateScale(5),
  },
  priceText: {
    fontSize: textScale(13),
    color: Colors.green,
    fontFamily:FontFamily.Montserrat_SemiBold,
  },
  nameText: {
    fontSize: textScale(16),
    color: Colors.black,
    textAlign: "left",
  },
  discountHolder: {
    position: "absolute",
    top: "5%",
    left: "0%",
    borderRadius: moderateScale(5),
  },
  offerView: {
    backgroundColor: Colors.red,
    padding: moderateScale(5),
    // borderRightWidth: responsiveFontSize(2),
    borderRadius: moderateScale(5),
  },
  outOfStock: {
    backgroundColor: Colors.brandColor,
    padding: moderateScale(5),
    borderRightWidth: moderateScale(2),
    borderRadius: moderateScale(5),
  },
  outOfStockText: {
    fontSize: textScale(14),
    color: Colors.white,
  },
  offerText: {
    fontSize: textScale(14),
    color: Colors.white,
  },
  heartIconHolder: {
    position: "absolute",
    top: "3%",
    right: "0%",
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
  },
  buttonText: {
    fontSize: textScale(14),
    textAlign: "center",
    padding: moderateScale(10),
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  productHolder: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(15),
    alignSelf: "center",
    //   justifyContent: "center",
    marginVertical: moderateScaleVertical(10),
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
    color: Colors.red,
    textDecorationLine: "line-through",
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
});
