import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


import { responsiveFontSize, responsivePadding } from '../components/Responsive'
import Colors from './Colors'


const ProgramerDropdown = ({ label, selectedData,title,containerStyles,data, value }) => {

   

    return (
        <View style={[styles.container, containerStyles]}>
         

            {/* <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => {
                    selectedData(selectedItem.title)
                }}
                defaultButtonText={value}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return value ? value : selectedItem.title;
                }}
                rowTextForSelection={(item, index) => {
                    return item.title;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={Colors.text_grey} size={30} />;
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
                selectedRowStyle={styles.dropdown1SelectedRowStyle}
            /> */}

<SelectDropdown
    data={data}
    onSelect={(selectedItem, index) => {

    }}
    renderButton={(selectedItem, isOpened) => {
      return (
        <View style={styles.dropdownButtonStyle}>
          {/* {selectedItem && (
            <FontAwesome name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
          )} */}
          <Text style={styles.dropdownButtonTxtStyle}>
            {(selectedItem && selectedItem.title|| title)}
          </Text>
          <FontAwesome  name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
        </View>
      );
    }}
    renderItem={(item, index, isSelected) => {
      return (
        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
          <FontAwesome name={item.icon} style={styles.dropdownItemIconStyle} />
          <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
        </View>
      );
    }}
    showsVerticalScrollIndicator={false}
    dropdownStyle={styles.dropdownMenuStyle}
  />

        </View>
    )
}


export default ProgramerDropdown

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8
    },
    label: {
        fontSize: responsiveFontSize(16),
        color: Colors.text_grey
    },
  

    dropdownButtonStyle: {
    
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: 'gray',
      },
      dropdownButtonArrowStyle: {
        fontSize: 22,
      },
      dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
      dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
      },
      dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
})