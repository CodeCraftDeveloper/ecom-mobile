import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsivePadding } from '../Responsive'
import Colors from '../Colors'
import Data from '../../assets/dummyjson/topProduct.json'
import { CardStyleInterpolators } from '@react-navigation/stack'

export default function Categories({categories, navigation, showCategoryDetails, setShowCategoryDetails}) {
    const staticImageURL = 'https://picsum.photos/300';
  return (
    <View>
      <Text style={styles.titleText}>Shop by Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal:15}}
      >
        {
            categories.map((item, index)=>{
                return(
                   <Pressable onPress={()=>{setShowCategoryDetails(true)}} key={index} style={styles.catItem}>
                       <View style={styles.imageContainer}>
                       <Image
                         source={{uri:staticImageURL}}
                         style={styles.catImg}
                       />
                       </View>

                        <Text style={styles.itemText}>{item?.name.length>20?item?.name.slice(0,20)+'...':item?.name}</Text>
                   </Pressable>
                )
            })
        }



      </ScrollView>


    </View>
  )
}

const styles = StyleSheet.create({
   titleText:{
    fontSize:responsiveFontSize(16),
    color:Colors.black,
    fontWeight:'600',
    marginHorizontal:responsivePadding(10)
   },
   catItem:{
  
    borderRadius:responsivePadding(50),
    padding:responsivePadding(5),
    marginHorizontal:responsivePadding(10)
   },
   imageContainer:{
    width:responsivePadding(100),
    height:responsivePadding(100),
    padding:10,
    gap:responsivePadding(30),
    backgroundColor:Colors.white,
    justifyContent:"center",
    alignItems:"center",
    elevation:5,
    borderRadius:responsivePadding(50)
   },
   catImg:{
    width:responsivePadding(60),
    height:responsivePadding(60),
  
   },
   itemText:{
    marginTop:responsivePadding(5),
    color:Colors.black,
    fontWeight:"400",
    alignSelf:"center"
   }
})