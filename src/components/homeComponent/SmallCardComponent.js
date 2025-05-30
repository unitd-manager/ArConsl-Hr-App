import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

// Custom Imports
import EText from '../common/EText';
import {commonColor, styles} from '../../themes';
import {deviceWidth, getHeight, moderateScale} from '../../common/constants';

export default function SmallCardComponent({item, index}) {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const onPressDetail = () => {
    if (item.url === 'ViewAttendace') {
      navigation.navigate('ViewAttendace'); 
    } else if (item.url === 'ViewLeaves') {
      navigation.navigate('ViewLeaves');
    } else if (item.url === 'ViewPayroll') {
      navigation.navigate('ViewPayroll');
    } else if (item.url === 'ViewHolidays') {
      navigation.navigate('ViewHolidays');
    }
  };

  return (
    <TouchableOpacity
      style={[
        localStyles.root,
        index % 2 === 0 ? styles.mr5 : styles.ml5,
        {backgroundColor: colors.white ? '#fafafa' : colors.white},
      ]}
      onPress={onPressDetail} >

      <ImageBackground
        source={item?.image}
        style={localStyles.imageStyle}
        imageStyle={{borderRadius: moderateScale(16)}}
        >
      </ImageBackground>

      <EText
        type={'S16'}
        numberOfLines={1}
        style={localStyles.textStyle}>
        {item?.title}
      </EText>
 

    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.p10,
    ...styles.flex,
    ...styles.shadowStyle,
    ...styles.justifyCenter,
    width: (deviceWidth - moderateScale(120)) / 2,
    ...styles.mt15,
    borderRadius: moderateScale(5),
  },
  imageStyle: {
    width:'90%',
    height: getHeight(120),
    alignSelf:'center',
   resizeMode: 'cover',
  },
  textStyle: {
    ...styles.mt10,
    ...styles.flex,
    alignSelf:'center',
  },
  locationSubContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.flex,
  },
  locationContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt10,
    ...styles.mb5,
  },
  freeContainer: {
    height: moderateScale(22),
    width: moderateScale(36),
    borderRadius: moderateScale(8),
    ...styles.selfEnd,
    ...styles.center,
    backgroundColor: commonColor.primary5,
    right: moderateScale(10),
    top: moderateScale(10),
  },
});
