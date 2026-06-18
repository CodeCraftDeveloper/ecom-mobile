import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsivePadding } from '../Responsive'
import Colors from '../Colors'
import { ScrollView } from 'react-native-gesture-handler'
import { brandData } from '../../assets/dummyjson/brands'
import { HeartIcon } from 'react-native-heroicons/outline'

export default function Brands() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Brands</Text>

    <View style={styles.brand}>
    {
        brandData.map((brand, index)=>{
            return(
                <TouchableOpacity onPress={()=>handleBrandSelect(brand.name)}  key={index} style={styles.brandContainer}>
                     <Image
                      source={brand.image}
                      style={styles.image}
                      resizeMode='contain'
                     />
                </TouchableOpacity>
            )
        })
       }

    </View>
    </View>
  )
}

const styles = StyleSheet.create({
   container:{
    marginHorizontal:responsivePadding(20),
    marginTop:responsivePadding(20)
   },
   title:{
    fontSize:responsiveFontSize(16),
    color:Colors.black,
    fontWeight:"600"
   },
   brandContainer:{
    marginHorizontal:responsivePadding(2),
    marginTop:responsivePadding(10),
    elevation:5

   },
   image:{
    width:responsivePadding(75),
    height:responsivePadding(70),
    backgroundColor:Colors.white,
    padding:30,
    borderColor:'red',
    borderWidth:2,
    borderRadius:responsivePadding(10),
  
    
   },
   brand:{
    flexDirection:"row",
    gap:responsivePadding(5)
  
   }
})