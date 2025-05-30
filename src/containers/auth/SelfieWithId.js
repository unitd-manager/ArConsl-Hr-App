import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Custom import
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import images from '../../assets/images';
import {deviceWidth, moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import EButton from '../../components/common/EButton';
import {StackNav} from '../../navigation/NavigationKeys';

export default function SelfieWithId({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.SetPin);

  return (
    <ESafeAreaView>
      <EHeader />
      <View style={styles.flex}>
        <EText type={'B32'} style={localStyles.titleContainer} align={'center'}>
          {strings.selfieIdCard}
        </EText>
        <EText type={'r16'} style={localStyles.titleContainer} align={'center'}>
          {strings.selfieIdDesc}
        </EText>
        <Image source={images.selfieWithId} style={localStyles.imageStyle} />
      </View>
      <View style={localStyles.btnContainer}>
        <EButton
          title={strings.skip}
          type={'S16'}
          color={colors.dark ? colors.white : colors.primary5}
          containerStyle={localStyles.skipBtnContainer}
          bgColor={colors.dark3}
          // onPress={onPressSkip}
        />
        <EButton
          title={strings.continue}
          type={'S16'}
          color={colors.white}
          containerStyle={localStyles.skipBtnContainer}
          onPress={onPressContinue}
        />
      </View>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  titleContainer: {
    ...styles.mt15,
  },
  imageStyle: {
    width: deviceWidth - moderateScale(40),
    height: '80%',
    resizeMode: 'contain',
    ...styles.center,
    ...styles.selfCenter,
  },
  bottomContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  btnContainer: {
    ...styles.mh20,
    ...styles.mb10,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
  },
});
