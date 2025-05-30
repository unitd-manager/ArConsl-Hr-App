import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import EText from '../../../components/common/EText';
import {commonColor, styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import EButton from '../../../components/common/EButton';

const CardData = props => {
  const {
    item,
    btnTextDay,
    btnTextNight,
    onPressBtnDay,
    onPressBtnNight,
    isDayButtonVisible,
    isNightButtonVisible,
    insertAttendance,
  } = props;
  const colors = useSelector(state => state.theme.theme);

  return (
    <View
      style={[
        localStyles.root,
        {backgroundColor: colors.dark ? colors.dark2 : colors.white},
      ]}>
      <View style={localStyles.innerContainer}>
        <View style={localStyles.rightContainer}>
          <EText type={'b16'} numberOfLines={1} style={localStyles.textStyle}>
            {item?.title}
          </EText>
        </View>
      </View>
      <View>
        <View style={localStyles.btnContainer}>
          {isDayButtonVisible && (
            <EButton
              title={btnTextDay}
              type={'S14'}
              color={colors.white}
              containerStyle={localStyles.skipBtnContainer}
              bgColor={colors.btnColorCard}
              onPress={onPressBtnDay}
              insertAttendance={insertAttendance}
            />
          )}

          {isNightButtonVisible && (
            <EButton
              title={btnTextNight}
              type={'S14'}
              containerStyle={localStyles.skipBtnContainer}
              onPress={onPressBtnNight}
              insertAttendance={insertAttendance}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(CardData);

const localStyles = StyleSheet.create({
  root: {
    ...styles.p10,
    ...styles.shadowStyle,
    width: '100%',
    ...styles.mt15,
    borderRadius: moderateScale(16),
  },
  innerContainer: {
    ...styles.justifyCenter,
    ...styles.flexRow,
  },
  imageStyle: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: 'cover',
  },
  textStyle: {
    ...styles.mt10,
    ...styles.flex,
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
  rightContainer: {
    ...styles.flex,
    ...styles.ml10,
  },
  btnTextContainer: {
    ...styles.ml15,
    ...styles.p5,
    ...styles.center,
    ...styles.justifyCenter,
    borderRadius: moderateScale(8),
    borderColor: commonColor.redColor,
    borderWidth: moderateScale(1),
  },
  btnContainer: {
    ...styles.pb5,
    ...styles.rowSpaceAround,
    ...styles.mv15,
  },
  skipBtnContainer: {
    width: '45%',
    height: moderateScale(35),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1),
    borderColor: commonColor.lightblue,
  },
});
