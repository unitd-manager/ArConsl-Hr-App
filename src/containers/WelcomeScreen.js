import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {styles} from '../themes';
import {deviceHeight, deviceWidth} from '../common/constants';
import images from '../assets/images';
import EText from '../components/common/EText';
import {useSelector} from 'react-redux';
import {StackNav} from '../navigation/NavigationKeys';

export default function WelcomeScreen({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(StackNav.onBoarding);
    }, 1000);
  }, []);

  return (
    <View style={styles.flex}>
      <Image
        source={colors.dark ? images.welcomeDark : images.welcomeLight}
        style={localStyles.imageStyle}
        resizeMode="cover"
      />
      <View style={localStyles.bottomTextContainer}>
        <EText align={'center'} color={colors.white} type={'B46'}>
          {'Welcome to Smartcon! 👋'}
        </EText>
        <EText
          align={'center'}
          style={styles.mt15}
          color={colors.white}
          type={'R18'}>
          {
            'The best event booking and online ticketing application in this century.'
          }
        </EText>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    width: deviceWidth,
    height: deviceHeight,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 0,
    ...styles.ph20,
    ...styles.pb30,
    ...styles.selfCenter,
  },
});
