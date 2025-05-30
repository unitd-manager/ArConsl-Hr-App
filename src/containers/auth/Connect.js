// Library Imports
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import EText from '../../components/common/EText';
import {
  ACCESS_TOKEN,
  getHeight,
  isIOS,
  moderateScale,
} from '../../common/constants';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import {
  Apple_Dark,
  Apple_Light,
  Connect_Dark,
  Connect_Light,
  Facebook_Icon,
  Google_Icon,
} from '../../assets/svgs';
import {StackNav} from '../../navigation/NavigationKeys';
import EButton from '../../components/common/EButton';
import {setAsyncStorageData} from '../../utils/helpers';

export default Connect = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const onPressSignWithPassword = () => navigation.navigate(StackNav.Login);
  const onPressSignUp = () => navigation.navigate(StackNav.Register);

  const onPressSocialSign = async () => {
    await setAsyncStorageData(ACCESS_TOKEN, 'access_token');
    navigation.reset({
      index: 0,
      routes: [
        {
          name: StackNav.TabBar,
        },
      ],
    });
  };

  const SocialBtn = ({title, frontIcon, onPress = () => {}}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.btnContainer,
          {borderColor: colors.bColor, backgroundColor: colors.backgroundColor},
        ]}
        onPress={onPress}>
        {frontIcon}
        <EText style={styles.ml10} type={'S16'} color={colors.textColor}>
          {title}
        </EText>
      </TouchableOpacity>
    );
  };

  return (
    <ESafeAreaView style={styles.flexCenter}>
      {colors.dark === 'dark' ? (
        <Connect_Dark width={moderateScale(200)} height={getHeight(150)} />
      ) : (
        <Connect_Light width={moderateScale(200)} height={getHeight(150)} />
      )}
      <EText type={'B34'} style={styles.mv20}>
        {strings.letsYouIn}
      </EText>

      <SocialBtn
        title={strings.continueWithFacebook}
        frontIcon={<Facebook_Icon />}
        onPress={onPressSocialSign}
      />
      <SocialBtn
        title={strings.continueWithGoogle}
        frontIcon={<Google_Icon />}
        onPress={onPressSocialSign}
      />

      {!!isIOS && (
        <SocialBtn
          title={strings.continueWithApple}
          frontIcon={colors.dark === 'dark' ? <Apple_Light /> : <Apple_Dark />}
          onPress={onPressSocialSign}
        />
      )}

      <View style={localStyles.divider}>
        <View
          style={[localStyles.orContainer, {backgroundColor: colors.bColor}]}
        />
        <EText type={'R18'} style={styles.mh10}>
          {strings.or}
        </EText>
        <View
          style={[localStyles.orContainer, {backgroundColor: colors.bColor}]}
        />
      </View>

      <EButton
        title={strings.signWithPassword}
        type={'S16'}
        color={colors.white}
        containerStyle={localStyles.signBtnContainer}
        onPress={onPressSignWithPassword}
      />

      <TouchableOpacity
        onPress={onPressSignUp}
        style={localStyles.signUpContainer}>
        <EText color={colors.grayScale5} type={'M16'}>
          {strings.dontHaveAccount}
        </EText>
        <EText type={'b16'} style={styles.ml5} color={colors.primary5}>
          {strings.signUp}
        </EText>
      </TouchableOpacity>
    </ESafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  btnContainer: {
    ...styles.mt15,
    ...styles.center,
    ...styles.p15,
    width: '85%',
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(2),
    ...styles.rowCenter,
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
  orContainer: {
    height: moderateScale(1),
    width: '40%',
  },
  signBtnContainer: {
    width: '85%',
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
});
