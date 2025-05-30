// Library Imports
import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local Imports
import {colors, styles} from '../../themes';
import {StackNav} from '../../navigation/NavigationKeys';
import {ACCESS_TOKEN, ON_BOARDING, THEME} from '../../common/constants';
import {changeThemeAction} from '../../redux/action/themeAction';
import {initialStorageValueGet} from '../../utils/asyncstorage';
import ESafeAreaView from '../../components/common/ESafeAreaView';

const Splash = ({navigation}) => {
  const color = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();

  const asyncProcess = async () => {
    try {
      let asyncData = await initialStorageValueGet();
      let {themeColor, onBoardingValue, acessTokenValue} = asyncData;
      if (!!asyncData) {
        if (!!themeColor) {
          if (themeColor === 'light') {
            dispatch(changeThemeAction(colors.light));
          } else {
            dispatch(changeThemeAction(colors.dark));
          }
        }
        if (!!acessTokenValue) {
          // navigation.replace(StackNav.TabBar);
          navigation.replace(StackNav.Auth);
        } else if (!!onBoardingValue) {
          navigation.replace(StackNav.Auth);
        } else {
          navigation.replace(StackNav.WelcomeScreen);
        }
      }
    } catch (e) {
      console.log('error ', e);
    }
  };

  useEffect(() => {
    SplashScreen.hide();
    asyncProcess();
  }, []);

  return (
    <ESafeAreaView style={localStyles.container}>
      <ActivityIndicator size="large" color={color.darkColor} />
    </ESafeAreaView>
  );
};

export default Splash;

const localStyles = StyleSheet.create({
  container: {
    ...styles.itemsCenter,
    ...styles.flex,
    ...styles.justifyCenter,
  },
});
