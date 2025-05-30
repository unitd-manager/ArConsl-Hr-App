import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import EText from '../common/EText';
import {commonColor, styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import {LocationIcon} from '../../assets/svgs';
import strings from '../../i18n/strings';
import EDivider from '../common/EDivider';
import EButton from '../common/EButton';

const TicketCardComponent = props => {
  const {
    item,
    isCompleted = true,
    title,
    textColor,
    btnText,
    onPressBtn,
  } = props;
  const colors = useSelector(state => state.theme.theme);

  return (
    <View
      style={[
        localStyles.root,
        {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1},
      ]}>
      <View style={localStyles.innerContainer}>
        <ImageBackground
          source={{uri: item?.image}}
          style={localStyles.imageStyle}
          imageStyle={{borderRadius: moderateScale(16)}}>
          {!!item?.isFree && (
            <View style={localStyles.freeContainer}>
              <EText type={'S12'} color={colors.white} align={'center'}>
                {'FREE'}
              </EText>
            </View>
          )}
        </ImageBackground>
        <View style={localStyles.rightContainer}>
          <EText type={'b16'} numberOfLines={1} style={localStyles.textStyle}>
            {item?.title}
          </EText>
          <EText
            type={'S14'}
            numberOfLines={1}
            color={colors.primary5}
            style={localStyles.textStyle}>
            {item?.time}
          </EText>
          <View style={localStyles.locationContainer}>
            <View style={localStyles.locationSubContainer}>
              <LocationIcon
                width={moderateScale(16)}
                height={moderateScale(16)}
              />
              <EText
                type={'S12'}
                color={colors.textColor2}
                numberOfLines={1}
                style={styles.mh5}>
                {item?.address}
              </EText>
            </View>
            <TouchableOpacity
              style={[
                localStyles.btnTextContainer,
                {borderColor: isCompleted ? colors.redColor : textColor},
              ]}>
              <EText
                type={'S12'}
                color={isCompleted ? colors.redColor : textColor}
                numberOfLines={1}
                style={styles.mh5}>
                {isCompleted ? strings.canceled : title}
              </EText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {!isCompleted && (
        <View>
          <EDivider style={styles.mv15} />
          <View style={localStyles.btnContainer}>
            <EButton
              title={btnText}
              type={'S14'}
              color={colors.primary5}
              containerStyle={localStyles.skipBtnContainer}
              bgColor={colors.tranparent}
              onPress={onPressBtn}
            />
            <EButton
              title={strings.viewETicket}
              type={'S14'}
              containerStyle={localStyles.skipBtnContainer}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(TicketCardComponent);

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
  },
  skipBtnContainer: {
    width: '45%',
    height: moderateScale(35),
    borderRadius: moderateScale(17),
    borderWidth: moderateScale(1),
    borderColor: commonColor.primary5,
  },
});
