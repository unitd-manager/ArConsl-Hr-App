// Library Imports
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import strings from '../../i18n/strings';
import {colors, styles} from '../../themes';
import { getHeight, moderateScale} from '../../common/constants';
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EInput from '../../components/common/EInput';
import {validateEmail, validatePassword} from '../../utils/validators';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../components/common/EButton';
import api from '../../api/api';
import AuthContext from "../../navigation/Type/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EText from '../../components/common/EText';

const Login = () => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    // backgroundColor: colors.inputBg,
    borderColor: colors.white,
  };
  const FocusedStyle = {
    // backgroundColor: colors.white,
    borderColor: colors.white,
  };

  const BlurredIconStyle = colors.white;
  const FocusedIconStyle = colors.white;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [passwordInputStyle, setPasswordInputStyle] = useState(BlurredStyle);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const { signIn } = useContext(AuthContext)

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      !emailError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  const onChangedEmail = val => {
    const {msg} = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
  };  const onChangedPassword = val => {
    const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const EmailIcon = () => {
    return <Ionicons name="mail" size={moderateScale(20)} color={emailIcon} />;
  };

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const PasswordIcon = () => (
    <Ionicons
      name="lock-closed"
      size={moderateScale(20)}
      color={passwordIcon}
    />
  );

  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = () => (
    <TouchableOpacity
      onPress={onPressPasswordEyeIcon}
      style={localStyles.eyeIconContainer}>
      <Ionicons
        name={isPasswordVisible ? 'eye-off' : 'eye'}
        size={moderateScale(20)}
        color={passwordIcon}
      />
    </TouchableOpacity>
  );

  const onPressSignWithPassword = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      const response = await api.post('/api/login', {
        email: email.trim(),
        password: password
      });

      console.log("Login response:", response.data);
      
      if (response?.data?.msg === 'Success' && response?.data?.data) {
        await AsyncStorage.setItem('USER_TOKEN', 'loggedin');
        await AsyncStorage.setItem('USER', JSON.stringify(response.data.data));
        signIn('124');
      } else {
        Alert.alert('Login Failed', response?.data?.msg || 'Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Invalid email or password');
      } else if (!error.response) {
        Alert.alert('Network Error', 'Please check your internet connection');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    }
  };


  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);


  return (
    <ESafeAreaView style={localStyles.root}>
        <KeyBoardAvoidWrapper contentContainerStyle={{flex:1}}>

        <View style={localStyles.mainContainer}>

          <View style={[localStyles.loginBg]}>
         
            <EText type="B35" numberOfLines={1} color={colors.textRevertColor}  style={[styles.mv20, styles.selfCenter]}>
            Login
            </EText>

            <EInput
              placeHolder={strings.email}
              placeholderTextColor={colors.white}
              keyBoardType={'email-address'}
              _value={email}
              _errorText={emailError}
              errorStyle={colors.white}
              autoCapitalize={'none'}
              insideLeftIcon={() => <EmailIcon />}
              toGetTextFieldValue={onChangedEmail}
              inputContainerStyle={[
                localStyles.inputContainerStyle,
                emailInputStyle,
              ]}
              inputBoxStyle={[localStyles.inputBoxStyle]}
              _onFocus={onFocusEmail}
              onBlur={onBlurEmail}
            />

            <EInput
              placeHolder={strings.password}
              placeholderTextColor={colors.white}
              keyBoardType={'default'}
              _value={password}
              _errorText={passwordError}
              autoCapitalize={'none'}
              insideLeftIcon={() => <PasswordIcon />}
              toGetTextFieldValue={onChangedPassword}
              inputContainerStyle={[
                localStyles.inputContainerStyle,
                passwordInputStyle,
              ]}
              _isSecure={isPasswordVisible}
              inputBoxStyle={[localStyles.inputBoxStyle]}
              _onFocus={onFocusPassword}
              onBlur={onBlurPassword}
              rightAccessory={() => <RightPasswordEyeIcon />}
            />

            <EButton
              title={strings.signIn}
              type={'S16'}
              color={isSubmitDisabled && colors.white}
              containerStyle={localStyles.signBtnContainer}
              onPress={onPressSignWithPassword}
              bgColor={isSubmitDisabled && colors.backgroundColor3}
            />

          </View>
        </View>


        </KeyBoardAvoidWrapper>
       
    
    </ESafeAreaView>
  );
};

export default Login;

const localStyles = StyleSheet.create({
  mainContainer: {
   flex:1,
   justifyContent:'center'
  },
  signBtnContainer: {
    ...styles.center,
    width: '100%',
    ...styles.mv20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    ...styles.ph15,
    borderBottomWidth:moderateScale(1),
    borderTopWidth:moderateScale(0),
    borderLeftWidth:moderateScale(0),
    borderRightWidth:moderateScale(0),
    borderRadius:0,
    color:colors.white
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  root:{
    flex:1,
    justifyContent:'center',
    flexDirection:'column',
   alignContent:'center',
    backgroundColor:'#FA7547',
  },
  loginBg:{
    ...styles.ph30,
    borderTopRightRadius:100,
    paddingTop:50
  }
});
