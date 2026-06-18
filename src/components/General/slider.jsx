import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Colors from '../Colors';
import {responsiveFontSize, responsivePadding} from '../Responsive';

const Slider = ({activeSection, onSectionChange}) => {
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
    <View style={styles.main}>
      <TouchableOpacity
        style={[styles.sectionHolder, getSectionStyle('Upcoming')]}
        onPress={() => handleSectionPress('Upcoming')}>
        <Text style={[styles.text, getSectionTextStyle('Upcoming')]}>
        Product Details
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionHolder, getSectionStyle('Missed')]}
        onPress={() => handleSectionPress('Missed')}>
        <Text style={[styles.text, getSectionTextStyle('Missed')]}>Missed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionHolder, getSectionStyle('Completed')]}
        onPress={() => handleSectionPress('Completed')}>
        <Text style={[styles.text, getSectionTextStyle('Completed')]}>
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.white,
    width: '95%',
    alignSelf: 'center',
    marginVertical: responsivePadding(20),
    borderRadius: responsivePadding(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHolder: {
    width: '44%',
    padding: responsivePadding(15),
    borderRadius: responsivePadding(10),
    alignItems: 'center',
    height: responsivePadding(50),
  },
  activeSection: {
    backgroundColor: Colors.backGround,
  },
  inactiveSection: {
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: responsiveFontSize(14),
    fontWeight: '400',
   
   
  },
  activeText: {
    color: Colors.white,
  },
  inactiveText: {
    color: Colors.text_grey,
  },
});

export default Slider;
