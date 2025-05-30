import React, {createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const defaultState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  loginBy: null,
};

const reducer = (prevState, action) => { 
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token, 
        isLoading: false,
      };
    case 'SIGN_IN':
      return { 
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true, 
        userToken: null,
      };
  }
};

const restoreToken = async (dispatch) => {
  let userToken;
  try {
    userToken = await AsyncStorage.getItem('USER_TOKEN');
    console.log('e',userToken)
  } catch (e) {
    console.log(e);
  }
  dispatch({type: 'RESTORE_TOKEN', token: userToken});
};

export {AuthContext as default, defaultState, reducer, restoreToken};
