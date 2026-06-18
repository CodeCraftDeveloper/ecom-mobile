import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Colors from '../../components/Colors';
import {responsiveFontSize, responsivePadding} from '../../components/Responsive';

const ProductSlider = ({activeSection, onSectionChange}) => {
  const handleSectionPress = sectionName => {
    onSectionChange(sectionName);
  };

  const getSectionStyle = sectionName => {
    return activeSection === sectionName
      ? styles.activeSection
      : styles.inactiveSection;
  };

  const getSectionTextStyle = sectionName => {
    return activeSection === sectionName
      ? styles.activeText
      : styles.inactiveText;
  };

  return (
    <>
    <View style={styles.main}>
      <TouchableOpacity
        style={[styles.sectionHolder, getSectionStyle('Product Details')]}
        onPress={() => handleSectionPress('Product Details')}>
        <Text style={[styles.text, getSectionTextStyle('Product Details')]}>
         Product Details
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionHolder, getSectionStyle('Usage')]}
        onPress={() => handleSectionPress('Usage')}>
        <Text style={[styles.text, getSectionTextStyle('Usage')]}>Usage</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionHolder, getSectionStyle('Overview')]}
        onPress={() => handleSectionPress('Overview')}>
        <Text style={[styles.text, getSectionTextStyle('Overview')]}>
          Quick Overview
        </Text>
      </TouchableOpacity>

     
    </View>
    
    <View style={styles.divider}/>

    </>
  );
};

const styles = StyleSheet.create({
  main: {
    // backgroundColor: Colors.white,
    // width: '95%',
    alignSelf: 'center',
    marginVertical: responsivePadding(20),
    borderRadius: responsivePadding(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal:10
  },
  sectionHolder: {
    width: '30%',
    marginStart:"3%",
    // padding: responsivePadding(15),
    // borderRadius: responsivePadding(10),
    alignItems: 'center',
    // height: responsivePadding(50),
  },
  activeSection: {
    borderBottomColor:Colors.red,
    borderBottomWidth:2,
    marginTop:responsivePadding(5),
    marginHorizontal:10
  },
  inactiveSection: {
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    color:"gray"
  },
  activeText: {
    color: Colors.black,
  },
  inactiveText: {
    color: Colors.black,
  },
  divider:{
    borderWidth:0.3,
    borderColor:Colors.border_grey,
    alignSelf:"center",
    width:'90%'
   },
});

export default ProductSlider;
