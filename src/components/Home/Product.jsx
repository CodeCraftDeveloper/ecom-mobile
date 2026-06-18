import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import Colors from '../Colors';
import { responsiveFontSize, responsivePadding } from '../Responsive';
import Data from '../../assets/dummyjson/topProduct.json';

const Product = ({title}) => {
    const staticImageURL = 'https://picsum.photos/300';
  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
      <Text style={styles.brandText}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {Data.top_products.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            <Image source={{ uri: staticImageURL }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>Price: ${product.price}</Text>
            <Text style={styles.productRating}>Rating: {product.rating}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Product;

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.white,
  },
  brandText: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: Colors.black,
    padding: responsivePadding(10),
    marginHorizontal: responsivePadding(10),
  },
  scrollView: {
    paddingHorizontal: responsivePadding(10),
  },
  productContainer: {
    borderWidth: responsivePadding(1),
    width: responsivePadding(200), // Set the width of each product container
    marginRight: responsivePadding(10),
    borderRadius: responsivePadding(5),
    overflow: 'hidden',
    height:'92%',
    paddingBottom:responsivePadding(10),
    borderColor:Colors.text_grey,
    alignItems:'center'
  },
  productImage: {
    width: '100%',
    height: responsivePadding(120), // Set an appropriate height for your images
    resizeMode: 'cover',
    borderRadius: responsivePadding(5),
  },
  productName: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    marginVertical: responsivePadding(5),
    paddingHorizontal: responsivePadding(5),
    color:Colors.black
  },
  productPrice: {
    fontSize: responsiveFontSize(14),
    color: Colors.forgetPassword,
    paddingHorizontal: responsivePadding(5),
  },
  productRating: {
    fontSize: responsiveFontSize(14),
    color: Colors.text_grey,
    paddingHorizontal: responsivePadding(5),
  },
});
