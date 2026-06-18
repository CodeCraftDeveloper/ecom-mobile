export const BASE_URL = 'https://server.prempackaging.com/premind/api/';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP_USER: 'signup',
    LOGIN_USER: 'signin',
    VERIFY_SIGN_UP_USER_EMAIL: 'verify/email',
  },

  PASSWORD: {
    SEND_OTP_ON_EMAIL: 'reset/password/otp',
    VERIFY_OTP: 'reset/password/verify/otp',
    CHANGE_PASSWORD: 'reset/password/update',
  },

  PRODUCTS: {
    GET_ALL_PRODUCTS: 'product/all',
    GET_SINGLE_PRODUCT: 'product/get/id/',
    GET_SINGLE_PRODUCT_DETAILS: 'product/single/',
    GET_PRODUCT_BY_SLUG: 'product/get/:',
    GET_RELATED_PRODUCT_DETAILS_BY_ID: 'product/get/id/',
    SEARCH_PRODUCT: 'product/search',
    HOME_PRODUCTS_SEARCH: 'product/main/search',
    NOTIFY_PRODUCT:'notify/create'
  },

  CATEGORIES: {
    GET_ALL_CATEGORIES: 'category/all',
    GET_CATEGORIES_IMAGES: 'get/category/images',
  },

  CART: {
    GET_CART_PRODUCTS: 'cart/',
    ADD_TO_CART: 'AddtoCart',
    REMOVE_FROM_CART: 'removefromcart',
    EMPTY_CART: 'emptyCart',
    GET_TOTAL_CART_COUNT: 'cart/count/',
  },

  WISHLIST: {
    GET_WISHLIST_PRODUCTS: 'wishlist/',
    ADD_TO_WISHLIST: 'AddtoWishlist',
    REMOVE_FROM_WISHLIST: 'removefromwishlist',
    GET_TOTAL_WISHLIST_COUNT: 'wishlist/count/',
  },

  ORDERS: {
    PLACE_ORDER: 'order/create',
    GET_ALL_ORDERS: 'my/orders/',
    UPDATE_PAYMENT_STATUS:'order/update/payment/status'
  },

  USER: {
    UPDATE_PROFILE: 'edituser',
    GET_SPECIFIC_USER_DETAILS: 'getuser/',
    DELETE_USER:'deleteUser'
  },

  COUPONS: {
    GET_ALL_COUPON: 'coupon/get/all',
    GET_COUPON_BY_COUPON_CODE: 'coupon/get/code/',
  },

  ADDRESS: {
    ADD_ADDRESS: 'edituser',
    EDIT_ADDRESS: 'edituser',
    REMOVE_ADDRESS: 'edituser',
  },

  CUSTOM: {
    CUSTOM_PACKAGING: 'custom-packaging',
  },
};
