import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Colors from '../utils/Colors';
import { useNavigation } from '@react-navigation/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InternalHeader from './Header/InternalHeader';
import Feather from 'react-native-vector-icons/Feather';
import ApiService from '../service/APIService';
import LoginPopup from './General/loginPopup';
import { WebView } from 'react-native-webview';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  textScale,
} from '../utils/responsiveSize';
import FontFamily from '../utils/FontFamily';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import BottomModalForPackSize from './General/BottomModalForPackSize';
import FastImage from 'react-native-fast-image';
import HomePopularProduct from './Home/HomePopularProduct';
import { ImagePath } from '../utils/ImagePath';
import WrapperContainer from '../utils/WrapperContainer';
import StorageService from '../utils/storageService';
import {
  parseStoredUser,
  showErrorMessage,
  showSuccessMessage,
} from '../utils/HelperFunction';
import PendingCartService from '../utils/PendingCartService';

const ProductDetails = ({ route }) => {
  const [webViewHeight, setWebViewHeight] = useState(100);
  const { item } = route.params;
  const autoAddExecutedRef = React.useRef(false);
  console.log(item, 'Line 31');
  const [buyItWithProduct, setBuyItWithProduct] = useState([]);
  const [count, setCount] = useState(1);
  const [showDetails, setShowDetails] = useState('Description');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [webViewLoader, setWebViewLoader] = useState(true);
  const [showTermsAndConditionModal, setShowTermsAndCondition] =
    useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isRelatedProductsLoading, setIsRelatedProductsLoading] =
    useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigation = useNavigation();
  const [packSizeModal, setShowPackSizeModal] = useState(false);
  const [packSizeData, setPackSizeData] = useState([]);
  const [mrp, setMrp] = useState('');
  const [sp, setSp] = useState('');
  const [number, setNumber] = useState('');
  const [packWeight, setPackWeight] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [bigImage, setBigImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [localWishlistUpdates, setLocalWishlistUpdates] = useState({});
  const [wishListValueChanged, setWishListValueChanged] = useState(0);
  const [crossCategoryProducts, setCrossCategoryProducts] = useState([]);
  const [isCrossLoading, setIsCrossLoading] = useState(false);

  const CROSS_CATEGORY_MAP = {
    '6557df46301ec4f2f4266139': [
      '6557df4f301ec4f2f426613d',
      '6557df64301ec4f2f4266141',
    ], // Paper Bag → Poly Bag, BOPP Tape
    '6557df4f301ec4f2f426613d': [
      '6557df46301ec4f2f4266139',
      '6557df64301ec4f2f4266141',
    ], // Poly Bag → Paper Bag, BOPP Tape
  };

  const fetchCrossCategoryProducts = async () => {
    setIsCrossLoading(true);
    try {
      const response = await ApiService.GET_ALL_PRODUCTS();
      const allProducts = response?.data || [];
      const currentCategoryId = item?.category?._id;
      const targetCategoryIds = CROSS_CATEGORY_MAP[currentCategoryId] || [
        '6557df46301ec4f2f4266139',
        '6557df4f301ec4f2f426613d',
      ];
      const cross = [];
      for (const catId of targetCategoryIds) {
        const found = allProducts.find(
          p => p?.category?._id === catId && p?._id !== item?._id,
        );
        if (found) cross.push(found);
      }
      setCrossCategoryProducts(cross);
    } catch (error) {
      console.log('Error fetching cross category products:', error);
    }
    setIsCrossLoading(false);
  };

  const loadWishlist = async () => {
    try {
      const storedWishlist = await StorageService.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(parseStoredUser(storedWishlist));
      }
    } catch (error) {
      console.log('Error loading wishlist', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const user = await StorageService.getItem('user_data');

      if (user) {
        const userData = parseStoredUser(user);
        const response = await ApiService.GET_WISHLIST_PRODUCTS(userData?._id);
        if (response?.success) {
          setWishlist(response?.data?.products || []);
          setLocalWishlistUpdates({});
        }
      }
    } catch (error) {
      console.log('Error fetching wishlist', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
      fetchSingleProduct();
      fetchCrossCategoryProducts();

      if (route?.params?.autoAddToCart && !autoAddExecutedRef.current) {
        autoAddExecutedRef.current = true;
        navigation.setParams({ autoAddToCart: false });
        const pendingCount = route?.params?.pendingCount || 1;
        handleAddToCart(item, pendingCount);
      }
    }, []),
  );

  const isItemInWishlist = productId => {
    // First check local updates
    if (localWishlistUpdates[productId] !== undefined) {
      return localWishlistUpdates[productId];
    }
    // Then check the actual wishlist
    return wishlist.some(item => item.product?._id === productId);
  };

  const fetchSingleProduct = async () => {
    // console.log(buyItWithProductId, "Line 96");
    setIsLoading(true);
    const buyItProducts = [];
    if (item?.buyItWith?.length > 0) {
      for (const buyItProduct of item?.buyItWith) {
        console.log(buyItProduct?._id, 'Line 121');
        try {
          const response = await ApiService.GET_SINGLE_PRODUCT(buyItProduct);
          buyItProducts.push(response?.data);
        } catch (error) {
          console.log(error, 'Line 106');
        }
      }
      setBuyItWithProduct(buyItProducts);
    }
    setIsLoading(false);
  };

  const handleSaveToWishList = async product => {
    console.log(product, 'line 187');
    const user = await StorageService.getItem('user_data');
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const userData = parseStoredUser(user);
      const currentStatus = isItemInWishlist(product._id);

      // Immediately update local state for instant UI feedback
      setLocalWishlistUpdates(prev => ({
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
          setLocalWishlistUpdates(prev => ({
            ...prev,
            [product._id]: currentStatus,
          }));
          throw new Error('Failed to remove from wishlist');
        }
        showSuccessMessage('Product removed from wishlist');
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
          setLocalWishlistUpdates(prev => ({
            ...prev,
            [product._id]: currentStatus,
          }));
          throw new Error('Failed to add to wishlist');
        }
        showSuccessMessage('Product added to wishlist');
      }
      DeviceEventEmitter.emit('wishlistUpdated');
      setWishListValueChanged(prev => prev + 1);
      // Refresh wishlist to sync with server
      await fetchWishlist();
    } catch (error) {
      console.log('Error updating wishlist', error);
      showErrorMessage('Error updating wishlist');
    }
  };

  const fetchSpecificProductAndStore = async () => {
    setIsRelatedProductsLoading(true);
    let fetchedProducts = [];

    // Priority 1: curated relatedProducts from the product record
    if (item?.relatedProducts?.length > 0) {
      for (const relatedProduct of item.relatedProducts) {
        try {
          const response = await ApiService.GET_RELATED_PRODUCT_DETAILS_BY_ID(
            relatedProduct,
          );
          if (response?.data) fetchedProducts.push(response.data);
        } catch (error) {
          console.log('Error fetching related product:', error);
        }
      }
    }

    // Priority 2 (fallback): same category, exclude current product
    if (fetchedProducts.length === 0) {
      try {
        const response = await ApiService.GET_ALL_PRODUCTS();
        const allProducts = response?.data || [];
        const sameCat = allProducts.filter(
          p =>
            p?.category?._id === item?.category?._id && p?._id !== item?._id,
        );
        fetchedProducts = sameCat.slice(0, 5);
      } catch (error) {
        console.log('Error fetching fallback related products:', error);
      }
    }

    setRelatedProducts(fetchedProducts.slice(0, 5));
    setIsRelatedProductsLoading(false);
  };

  useEffect(() => {
    fetchSpecificProductAndStore();
  }, []);

  const additionalInformationData = [
    {
      label: 'Size in Inches',
      value: `${item?.size_inch ? item?.size_inch : 'N/A'}`,
    },
    { label: 'Size in mm', value: `${item?.size_mm ? item?.size_mm : 'N/A'}` },
    { label: 'HSN Code', value: `${item?.hsn_code ? item?.hsn_code : 'N/A'}` },
    { label: 'Color', value: `${item?.color ? item?.color : 'N/A'}` },
    {
      label: 'Breadth in inches',
      value: `${item?.breadth_inch ? item?.breadth_inch : 'N/A'}`,
    },
    {
      label: 'Breadth in mm',
      value: `${item?.breadth_mm ? item?.breadth_mm : 'N/A'}`,
    },
    {
      label: 'Height in inches',
      value: `${item?.height_inch ? item?.height_inch : 'N/A'}`,
    },
    {
      label: 'Height in mm',
      value: `${item?.height_mm ? item?.height_mm : 'N/A'}`,
    },
    {
      label: 'Length in inches',
      value: `${item?.length_inch ? item?.length_inch : 'N/A'}`,
    },
    {
      label: 'Length in mm',
      value: `${item?.length_mm ? item?.length_mm : 'N/A'}`,
    },
  ];

  const handlePackSize = item => {
    console.log(item, 'Line 185');
    setShowPackSizeModal(true);
    setPackSizeData(item?.priceList);
  };

  const handleNotify = async product => {
    const user = await StorageService.getItem('user_data');
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    const userData = parseStoredUser(user);
    try {
      setIsLoading(true);
      const payload = {
        product_id: product?._id,
        name: userData?.first_name + userData?.last_name,
        email_address: userData?.email_address,
        mobile_number: userData?.mobile_number,
      };
      const response = await ApiService.NOTIFY_PRODUCT(payload);
      if (response?.success) {
        showSuccessMessage(response.message);
      } else {
        showErrorMessage(response.message);
      }
    } catch (error) {
      showErrorMessage('Unable to create the notification');
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddToCart = async (product, overrideCount = null) => {
    let user = await StorageService.getItem('user_data');
    if (user !== null) {
      const userData = parseStoredUser(user);
      const effectiveCount = overrideCount !== null ? overrideCount : count;
      let data = {
        product: {
          brand: product?.brand?._id,
          product: product?._id,
          category: product?.category?._id,
          packSize: number ? number : product?.priceList[0].number,
          price: sp ? sp : product?.priceList?.[0]?.SP,
          quantity: effectiveCount,
          stock: 1000,
          totalWeight: product?.priceList[0].number,
          totalPackWeight: 0,
        },
        user: userData?._id,
      };
      console.log(data, 'Line 212');
      try {
        const response = await ApiService.ADD_TO_CART(data);
        console.log('Add To Cart Response:', response);
        if (response?.success) {
          showMessage({
            message: 'Product Added to cart successfully',
            type: 'success',
            icon: 'success',
          });
          DeviceEventEmitter.emit('cartUpdated');
        }
      } catch (e) {
        console.log('Error:', e);
      }
    } else {
      PendingCartService.set(product, count);
      setShowLoginPopup(true);
    }
  };

  const handleDecreaseItemQuantity = async () => {
    console.log('Clicked on the Decrease Button');
    count > 1 ? setCount(count - 1) : null;
  };

  const handleIncreaseItemQuantity = async () => {
    console.log('Clicked on the Increase Button');
    setCount(count + 1);
  };

  const onWebViewMessage = event => {
    // Get the height from the message from WebView
    setWebViewHeight(Number(event.nativeEvent.data));
  };

  const webViewScript = `
    setTimeout(function() {
      window.ReactNativeWebView.postMessage(
        document.documentElement.scrollHeight
      );
    }, 500);
  `;

  const data = [
    { id: 1, name: 'Free Delivery', image: ImagePath.delivery },
    { id: 2, name: 'Secured Transaction', image: ImagePath.secure },
    { id: 3, name: 'No Return', image: ImagePath.noReturn },
    { id: 4, name: '100% Recyclable', image: ImagePath.recycle },
  ];

  return (
    <WrapperContainer isLoading={isLoading}>
      <View style={styles.main}>
        <InternalHeader
          title={'Product Details'}
          heart={'productDetails'}
          wishlistValueChanged={wishListValueChanged}
        />
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.firstSection}>
            <View style={styles.innerView}>
              <View style={{ marginVertical: moderateVerticalScale(10) }}>
                <Text style={[styles.name, { textTransform: 'capitalize' }]}>
                  {item?.name} {item?.slug} {item?.hsn_code} ({item?.size_inch})
                  ({item?.priceList[0]?.number} Pcs)
                </Text>
              </View>
              {imageLoading && (
                <ActivityIndicator
                  size="large"
                  color={Colors.brandColor}
                  style={styles.activityIndicator}
                />
              )}
              <FastImage
                style={styles.imageStyle}
                source={{
                  uri: bigImage === null ? item?.images[0]?.image : bigImage,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.web,
                }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                resizeMode={FastImage.resizeMode.stretch}
              />
              <TouchableOpacity
                style={styles.iconHolder2}
                onPress={() =>
                  Share.share({
                    message: `Check this product https://www.store.prempackaging.com/${item?.slug} `,
                  })
                }
              >
                <Feather
                  name="share-2"
                  size={moderateScale(25)}
                  color={Colors.iconColor}
                />
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: moderateScale(15),
                  }}
                  style={styles.otherPics}
                >
                  {item?.images.map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={styles.imageContainer}
                        onPress={() => setBigImage(item?.image)}
                      >
                        <Image
                          source={{ uri: item?.image }}
                          style={styles.catImg}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View
                style={{
                  marginVertical: moderateVerticalScale(10),
                  gap: moderateScale(10),
                }}
              >
                <Text
                  style={[
                    styles.name,
                    {
                      fontFamily: FontFamily.Montserrat_Bold,
                      fontSize: textScale(15),
                    },
                  ]}
                >
                  About the item
                </Text>
                <View style={styles.itemHolder}>
                  <Text style={styles.text2}>
                    1. Price per{' '}
                    {number ? number : item?.priceList?.[0]?.number} pcs + GST
                    18%
                  </Text>
                  <Text style={styles.text2}>
                    2. Brand : - {item?.brand?.name ? item?.brand?.name : 'N/A'}{' '}
                  </Text>
                  <Text style={styles.text2}>
                    3. Model : - {item?.model ? item?.model : 'N/A'}{' '}
                  </Text>
                  <Text style={styles.text2}>
                    4. Dimensions : -{' '}
                    {item?.size_inch ? item?.size_inch : 'N/A'}( inches)
                  </Text>
                  <Text style={styles.text2}>
                    5. Pack of {number ? number : item?.priceList?.[0]?.number}{' '}
                    Pcs
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Second Sections */}
          <View style={styles.firstSection}>
            <View style={styles.innerView2}>
              <Text style={[styles.name, { fontSize: textScale(16) }]}>
                Price
              </Text>
              <Text
                style={[
                  styles.name,
                  {
                    color:
                      item?.priceList[0]?.stock_quantity > 0
                        ? Colors.green
                        : Colors.red,
                  },
                ]}
              >
                {item?.priceList[0]?.stock_quantity > 0
                  ? 'In Stock'
                  : 'Out of Stock'}
              </Text>
            </View>
            <View style={styles.priceHolder}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: moderateScale(5),
                  marginBottom: moderateVerticalScale(10),
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
                <Text style={styles.mrpText}>
                  Rs.{mrp ? mrp : item?.priceList?.[0]?.MRP}
                </Text>
              </View>
              {item?.priceList.length > 2 && (
                <Text style={styles.price}>
                  Rs.{sp ? sp : item?.priceList?.[0]?.SP}
                </Text>
              )}
              {item?.priceList.length > 2 ? (
                <View
                  style={{
                    marginVertical: moderateVerticalScale(5),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.text2}>Select Pack Size</Text>
                  <TouchableOpacity
                    style={{
                      width: '45%',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderRadius: moderateScale(5),
                      backgroundColor: Colors.border_grey,
                      borderColor: Colors.border_grey,
                      padding: moderateScale(5),
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      gap: moderateScale(5),
                    }}
                    onPress={() => handlePackSize(item)}
                  >
                    <Text style={styles.text2}>
                      {number ? number : item?.priceList[0]?.number}
                    </Text>
                    <AntDesign
                      name="down"
                      color={Colors.brandColor}
                      size={textScale(14)}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.price}>Rs.{item?.priceList?.[0]?.SP}</Text>
              )}
            </View>
            <View style={styles.divider} />
            {/* Increase and Decrease the count */}
            <View style={styles.quantityHolder}>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={handleDecreaseItemQuantity}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={textScale(25)}
                  color={Colors.black}
                />
              </TouchableOpacity>
              <Text style={styles.countText}>{count}</Text>
              <TouchableOpacity
                onPress={handleIncreaseItemQuantity}
                style={[
                  styles.iconHolder,
                  { backgroundColor: Colors.forgetPassword },
                ]}
              >
                <MaterialIcons
                  name="add"
                  size={textScale(25)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
            {/* Button and heart Icon */}
            <View style={styles.buttonHolder2}>
              <TouchableOpacity
                // onPress={() => handleAddToCart(item)}
                onPress={() =>
                  item?.priceList[0]?.stock_quantity > 0
                    ? handleAddToCart(item)
                    : handleNotify(item)
                }
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      item?.priceList[0]?.stock_quantity > 0
                        ? Colors.brandColor
                        : Colors.brandColor,
                  },
                ]}
                // disabled={item?.priceList[0]?.stock_quantity > 0 ? false : true}
              >
                <Text style={styles.addText}>
                  {item?.priceList[0]?.stock_quantity > 0
                    ? 'ADD TO CART'
                    : 'Notify Me'}
                </Text>
                {/* <Text style={styles.addText}>ADD TO CART</Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heartHolder}
                onPress={() => handleSaveToWishList(item)}
              >
                <AntDesign
                  name={isItemInWishlist(item._id) ? 'heart' : 'heart'}
                  size={moderateScale(30)}
                  color={
                    isItemInWishlist(item._id) ? Colors.red : Colors.text_grey
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: moderateScale(10),
                paddingBottom: moderateScale(10),
              }}
            >
              <MaterialCommunityIcons
                name="truck"
                color={Colors.red}
                size={moderateScale(30)}
              />
              <Text style={styles.dText}>
                Delivery Within{' '}
                {item?.delivery_time ? item?.delivery_time : '7 Working Days'}
              </Text>
            </View>
            {/* 4 Icons */}
            <View
              style={{
                marginVertical: moderateVerticalScale(10),
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                gap: moderateScale(10),
              }}
            >
              {data.map(item => (
                <View
                  key={item?.id}
                  style={{
                    alignItems: 'center',
                    gap: moderateVerticalScale(5),
                  }}
                >
                  <Image
                    source={item?.image}
                    resizeMode="contain"
                    style={{
                      width: moderateScale(30),
                      height: moderateScale(30),
                    }}
                  />
                  <Text style={[styles.dText, { width: '80%' }]}>
                    {item?.name}
                  </Text>
                </View>
              ))}
            </View>
            {/* Return Days */}
            {/* <View style={styles.returnHolder}>
            <View style={styles.innerView4}>
              <Feather
                name="refresh-ccw"
                color={Colors.red}
                size={textScale(25)}
              />
              <Text style={styles.text2}>7 Days Return. </Text>
            </View>
            <TouchableOpacity
              style={styles.tcHolder}
              onPress={() => setShowTermsAndCondition(true)}
            >
              <Text style={styles.tcText}>T&C</Text>
            </TouchableOpacity>
          </View> */}
          </View>
          {/* Third Section */}
          <View style={styles.firstSection}>
            <View style={styles.descriptionView}>
              <TouchableOpacity
                style={[
                  styles.touch,
                  showDetails === 'Description' && styles.activeTab,
                ]}
                onPress={() => setShowDetails('Description')}
              >
                <Text style={styles.tableLabel}>Description</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.touch,
                  showDetails === 'AdditionalInformation' && styles.activeTab,
                ]}
                onPress={() => setShowDetails('AdditionalInformation')}
              >
                <Text style={styles.tableLabel}>Additional Information</Text>
              </TouchableOpacity>
            </View>
            {showDetails === 'Description' ? (
              <View style={{ width: '95%', alignSelf: 'center' }}>
                {item?.description ? (
                  // <View style={{borderWidth:2,flex:1}}>
                  <WebView
                    source={{
                      html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${item?.description}</body></html>`,
                    }}
                    injectedJavaScript={webViewScript}
                    onMessage={onWebViewMessage}
                    style={{ height: webViewHeight }}
                    originWhitelist={['*']}
                  />
                ) : (
                  <View>
                    <Text style={styles.nanText}>
                      Description Not Available
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={{ width: '95%', alignSelf: 'center' }}>
                {additionalInformationData.map((item, index) => {
                  return (
                    <View style={styles.tableRow} key={item.label}>
                      <Text style={styles.productText}>{item.label}</Text>
                      <Text style={styles.tableValue}>{item.value}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          {/* Buy with it Option */}
          {/* <View style={styles.relatedView}>
            <Text
              style={[
                styles.loaderText,
                { textAlign: 'left', fontSize: textScale(17) },
              ]}
            >
              Buy it With
            </Text>
            {buyItWithProduct.length > 0 ? (
              <View>
                {isLoading === true ? (
                  <View>
                    <ActivityIndicator size="large" color={Colors.brandColor} />
                    <Text style={styles.loaderText}>
                      Please wait product is loading...
                    </Text>
                  </View>
                ) : (
                  <HomePopularProduct
                    data={buyItWithProduct}
                    width={250}
                    comingFrom={'buyItWith'}
                    setWishListValueChanged={setWishListValueChanged}
                  />
                )}
              </View>
            ) : (
              <Text style={styles.nanText}>No Buy it product Available</Text>
            )}
          </View> */}
          {/* Frequently Bought Together */}
          <View style={styles.relatedView}>
            <Text
              style={[
                styles.loaderText,
                { textAlign: 'left', fontSize: textScale(17) },
              ]}
            >
              Buy it With
            </Text>
            {isCrossLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.brandColor} />
                <Text style={styles.loaderText}>Loading please wait...</Text>
              </View>
            ) : crossCategoryProducts.length > 0 ? (
              <HomePopularProduct
                data={[item, ...crossCategoryProducts]}
                comingFrom={'buyItWith'}
                setWishListValueChanged={setWishListValueChanged}
              />
            ) : (
              <Text style={styles.nanText}>No suggestions available</Text>
            )}
          </View>
          <View style={styles.relatedView}>
            <Text
              style={[
                styles.loaderText,
                { textAlign: 'left', fontSize: textScale(17) },
              ]}
            >
              Related Products
            </Text>
            {isRelatedProductsLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.brandColor} />
                <Text style={styles.loaderText}>Loading please wait...</Text>
              </View>
            ) : relatedProducts.length > 0 ? (
              <View>
                <HomePopularProduct
                  data={relatedProducts}
                  width={250}
                  setWishListValueChanged={setWishListValueChanged}
                />
              </View>
            ) : (
              <Text style={styles.nanText}>No Related Products</Text>
            )}
          </View>
          <BottomModalForPackSize
            visible={packSizeModal}
            data={packSizeData}
            message={'Choose Pack Size'}
            hideModal={() => setShowPackSizeModal(false)}
            selectedValue={text => {
              console.log(text, 'Line 546');
              setMrp(text?.MRP);
              setSp(text?.SP);
              setNumber(text?.number);
              setPackWeight(text?.pack_weight);
              setStockQuantity(text?.stock_quantity);
              setShowPackSizeModal(false);
            }}
          />
        </ScrollView>
        {showLoginPopup && (
          <LoginPopup
            showLoginPopup={showLoginPopup}
            setShowLoginPopup={setShowLoginPopup}
            fromProductDetails={true}
          />
        )}
        <Modal
          transparent={true}
          animationType="slide"
          visible={showTermsAndConditionModal}
          statusBarTranslucent
          onRequestClose={() => setShowTermsAndCondition(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTermsAndCondition(false)}
              >
                <Feather name="x" size={textScale(25)} color={Colors.black} />
              </TouchableOpacity>
              {/* {webViewLoader && (
              <View style={styles.loaderView}>
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size={"large"} color={Colors.brandColor} />
                  <Text style={styles.loaderText}>Please wait...</Text>
                </View>
              </View>
            )} */}
              <WebView
                source={{
                  uri: 'https://www.store.prempackaging.com/terms-of-sale',
                }}
                onLoadStart={() => setWebViewLoader(true)}
                onLoadEnd={() => setWebViewLoader(false)}
                // style={webViewLoader ? { display: "none" } : { flex: 1 }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </WrapperContainer>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  imageContainer: {
    padding: 10,
    marginLeft: moderateScale(10),
    borderColor: Colors.border_grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(10),
  },
  catImg: {
    width: moderateScale(75),
    height: moderateScale(75),
  },
  firstSection: {
    width: '95%',
    borderWidth: moderateScale(1),
    alignSelf: 'center',
    marginVertical: moderateVerticalScale(10),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(5),
    borderColor: Colors.border_grey,
  },
  text2: {
    fontSize: textScale(14),
    color: Colors.brandColor,
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  stateText: {
    fontSize: textScale(20),
    fontWeight: '400',
    color: Colors.border_color,
  },
  innerView: {
    width: '100%',
    padding: moderateScale(10),
  },
  innerView2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(25),
    padding: moderateScale(10),
  },
  imageStyle: {
    height: moderateScale(275),
    width: moderateScale(350),
    alignSelf: 'center',
    marginVertical: moderateVerticalScale(10),
  },
  priceHolder: {
    paddingHorizontal: moderateScale(25),
  },
  mrpText: {
    fontSize: textScale(14),
    color: Colors.red,
    textDecorationLine: 'line-through',
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  imageView: {
    alignSelf: 'center',
    marginVertical: moderateScale(10),
  },
  detailsHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  itemHolder: {
    width: '90%',
    alignSelf: 'center',
  },
  heartHolder: {
    // borderWidth: 2,
    width: '15%',
    alignItems: 'center',
    padding: moderateScale(5),
    borderRadius: moderateScale(5),
    borderColor: Colors.border_color,
  },
  quantityHolder: {
    width: '50%',
    borderWidth: 1,
    borderColor: Colors.forgetPassword,
    marginHorizontal: moderateScale(25),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(5),
    overflow: 'hidden',
    marginBottom: moderateVerticalScale(25),
  },
  name: {
    color: Colors.brandColor,
    fontSize: textScale(13),
    fontFamily: FontFamily.Montserrat_SemiBold,
    lineHeight: scale(22),
    letterSpacing: scale(0.3),
  },
  price: {
    color: Colors.brandColor,
    fontSize: textScale(20),
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  viwHolder: {
    borderWidth: moderateScale(1),
    width: '95%',
    alignSelf: 'center',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    borderColor: Colors.text_grey,
    gap: moderateScale(5),
    backgroundColor: Colors.white,
    elevation: 5,
  },
  divider: {
    width: '100%',
    borderWidth: moderateScale(1),
    borderColor: Colors.border_grey,
    marginVertical: moderateVerticalScale(15),
  },
  rating: {
    color: Colors.text_grey,
    fontWeight: '700',
    fontSize: textScale(18),
  },
  dText: {
    fontSize: textScale(14),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: FontFamily.Montserrat_Medium,
  },
  innerView3: {
    borderWidth: 2,
    borderColor: Colors.border_color,
    borderRadius: textScale(5),
    width: '60%',
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: textScale(15),
    width: '80%',
    alignSelf: 'center',
    marginVertical: moderateScale(10),
  },
  textValue: {
    color: Colors.black,
    fontSize: textScale(18),
    marginHorizontal: moderateScale(10),
    fontWeight: '600',
  },
  otherPics: {
    flexDirection: 'row',
    marginHorizontal: moderateScale(10),
    gap: moderateScale(10),
  },
  button: {
    width: '75%',
    backgroundColor: Colors.forgetPassword,
    alignItems: 'center',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  productText: {
    color: Colors.forgetPassword,
    fontSize: textScale(15),
    fontWeight: 'bold',
    // padding: moderateScale(10),
  },
  buttonHolder2: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  productHolder: {
    borderWidth: moderateScale(1),
    marginVertical: moderateScale(10),
    width: '95%',
    alignSelf: 'center',
    borderRadius: moderateScale(5),
    borderColor: Colors.text_grey,
    padding: moderateScale(10),
    backgroundColor: Colors.white,
  },
  tcHolder: {
    width: '25%',
    alignItems: 'center',
  },
  tcText: {
    fontSize: textScale(14),
    color: Colors.blue,
    fontFamily: FontFamily.Montserrat_SemiBold,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  innerView4: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: textScale(15),
    marginHorizontal: textScale(10),
  },
  returnHolder: {
    borderWidth: moderateScale(1),
    width: '80%',
    alignSelf: 'center',
    padding: moderateScale(10),
    borderRadius: moderateScale(5),
    borderColor: Colors.border_color,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateVerticalScale(20),
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconHolder: {
    borderWidth: moderateScale(0.5),
    width: '30%',
    padding: moderateScale(10),
    alignItems: 'center',
    borderColor: Colors.text_grey,
    backgroundColor: Colors.white,
  },
  iconHolder2: {
    borderWidth: 2,
    position: 'absolute',
    top: moderateScale(75),
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(10),
    borderColor: Colors.backGround_grey,
    backgroundColor: Colors.backGround_grey,
    right: moderateScale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHolder: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
  },
  unitHolder: {
    width: '50%',
    borderWidth: moderateScale(2),
    padding: moderateScale(15),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    borderColor: Colors.forgetPassword,
    backgroundColor: Colors.white,
  },
  countText: {
    color: Colors.forgetPassword,
    fontSize: textScale(22),
    width: '40%',
    textAlign: 'center',
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  addText: {
    color: Colors.white,
    fontSize: textScale(15),
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  descriptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(10),
    backgroundColor: Colors.back,
  },
  touch: {
    width: '50%',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: moderateScale(2),
    borderColor: Colors.red,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: moderateVerticalScale(1),
    borderColor: Colors.text_grey,
    paddingVertical: moderateVerticalScale(10),
  },
  tableLabel: {
    color: Colors.text_grey,
    fontFamily: FontFamily.Montserrat_SemiBold,
    fontSize: textScale(15),
  },
  tableValue: {
    color: Colors.black,
    fontSize: textScale(14),
    marginHorizontal: moderateScale(10),
    fontFamily: FontFamily.Montserrat_Medium,
  },
  relatedProductsHolder: {
    borderWidth: 2,
    width: '95%',
    padding: moderateScale(10),
    alignSelf: 'center',
    borderRadius: moderateScale(5),
    backgroundColor: 'white',
    marginVertical: moderateScale(10),
    borderColor: Colors.border_grey,
  },
  loaderContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: textScale(15),
    color: Colors.brandColor,
    textAlign: 'center',
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  nanText: {
    fontSize: textScale(16),
    color: Colors.border_color,
    fontFamily: FontFamily.Montserrat_Bold,
    textAlign: 'center',
    padding: moderateScale(20),
  },
  webView: {
    width: '95%',
    alignSelf: 'center',
    height: moderateScale(350),
    borderColor: Colors.border_grey,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(5),
    marginBottom: moderateVerticalScale(10),
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    gap: moderateScale(10),
    flex: 0.65,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  loaderView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  relatedView: {
    borderWidth: 2,
    borderColor: Colors.white,
    marginBottom: moderateVerticalScale(10),
    width: '95%',
    alignSelf: 'center',
    padding: moderateScale(10),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(5),
  },
});
