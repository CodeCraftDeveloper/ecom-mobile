import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import Colors from '../Colors';
import {responsiveFontSize, responsivePadding} from '../Responsive';
import {useNavigation, useRoute} from '@react-navigation/native';
import FilterScreen from './FilterScreen';
import PopularProducts from './popularProducts';
import Loading from '../General/loading';

const {width, height} = Dimensions.get('window');

const CategoryDetails = ({
  setShowCategoryDetails,
  selectedCategory,
  allProducts,
  navigation,
  handleAddToCart,
}) => {
  console.log;

  const route = useRoute();
  if (route.params) {
    selectedCategory = route.params.name;
  }

  const [selectedSort, setSelectedSort] = useState('Default Sorting');
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleSortModal = () => {
    setShowSort(prevState => !prevState);
  };
  const gotoFilter = () => {
    setShowFilters(true);
  };

  return (
    <>
      {showFilters ? (
        <FilterScreen
          selectedCategory={selectedCategory}
          setShowFilters={setShowFilters}
          navigation={navigation}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.headerView}>
              <TouchableOpacity
                onPress={() => {
                  setShowCategoryDetails(false);
                }}>
                <ArrowLeftIcon
                  size={responsivePadding(30)}
                  strokeWidth={2}
                  color={Colors.forgetPassword}
                />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>
                {selectedCategory?.name || route.params.name}
              </Text>
              <View style={styles.icons}>
                <TouchableOpacity onPress={toggleSortModal}>
                  <Image source={require('../../assets/image/sort.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={gotoFilter}>
                  <Image source={require('../../assets/image/filter.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {allProducts.length > 0 ? (
            <View>
              <PopularProducts
                data={allProducts}
                navigation={navigation}
                handleAddToCart={handleAddToCart}
              />
            </View>
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: Colors.forgetPassword}}>
                No Products available for this category
              </Text>
            </View>
          )}

          {showSort && (
            <View style={styles.mainView}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Pressable
                  onPress={() => setSelectedSort('Default Sorting')}
                  style={[
                    styles.sortItem,
                    {
                      backgroundColor:
                        selectedSort === 'Default Sorting' ? 'gray' : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.sortText,
                      {
                        color:
                          selectedSort === 'Default Sorting'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    Default Sorting
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSelectedSort('High to Low')}
                  style={[
                    styles.sortItem,
                    {
                      backgroundColor:
                        selectedSort === 'High to Low' ? 'gray' : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.sortText,
                      {
                        color:
                          selectedSort === 'High to Low' ? 'white' : 'black',
                      },
                    ]}>
                    High to Low
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSelectedSort('Low to High')}
                  style={[
                    styles.sortItem,
                    {
                      backgroundColor:
                        selectedSort === 'Low to High' ? 'gray' : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.sortText,
                      {
                        color:
                          selectedSort === 'Low to High' ? 'white' : 'black',
                      },
                    ]}>
                    Low to High
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(18),
    fontWeight: '400',
  },
  main: {
    backgroundColor: Colors.white,
  },
  headerView: {
    paddingTop: responsivePadding(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsivePadding(10),
    marginBottom: 10,
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },

  mainView: {
    backgroundColor: 'white',
    height: responsivePadding(110),
    width: responsivePadding(150),
    position: 'absolute',
    top: 55,
    right: 50,
  },
  sortText: {
    color: Colors.black,
    fontSize: responsiveFontSize(15),
  },
  sortItem: {
    padding: 8,
    width: responsivePadding(150),
  },
});
