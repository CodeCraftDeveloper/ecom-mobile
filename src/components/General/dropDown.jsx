import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { responsiveFontSize, responsivePadding } from '../Responsive'
import Colors from '../Colors'


export default function DropDown({title, handleAction, placeholder}) {
  return (
    <View>
       <TouchableOpacity style={styles.inputBox} onPress={handleAction}>
           
              <Text style={{color:Colors.black}}>
                {title ? title : placeholder}
              </Text>
              <View style={styles.input}>
              <Ionicons
            style={{alignSelf:"flex-end",}}
            name="chevron-down"
            size={responsiveFontSize(15)}
            color={Colors.black}
          />
              </View>
              
            </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Center items vertically
    paddingHorizontal: responsivePadding(10),
    padding:10,
    width:250,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginVertical: responsivePadding(10),
  },
  input: {
    flex: 1, // Take remaining space in the row
    marginLeft: responsivePadding(10),
    fontSize: 16,
    color: 'black',
  },
})