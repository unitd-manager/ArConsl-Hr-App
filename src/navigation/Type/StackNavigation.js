import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackRoute} from '../NavigationRoutes';
import {StackNav} from '../NavigationKeys';
import AuthStack from './AuthStack';
import AuthContext, {defaultState, reducer, restoreToken} from './Auth';
import HomeTab from '../../containers/tabbar/main/HomeTab';
import ViewAttendace from '../../containers/tabbar/main/ViewAttendace';
import ViewHolidays from '../../containers/tabbar/main/ViewHolidays';
import ViewLeaves from '../../containers/tabbar/main/ViewLeaves';
import ViewPayroll from '../../containers/tabbar/main/ViewPayroll';
import GeneratePayslip from '../../containers/tabbar/main/GeneratePayslip';
import RequestLeave from '../../containers/tabbar/main/RequestLeave';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  React.useEffect(() => {
    restoreToken(dispatch);
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
    }),
    [],
  );

  if (state.isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
          {state.userToken == null ? ( <Stack.Screen name={StackNav.Auth} component={AuthStack} />) : (
            <>
              <Stack.Screen name={StackNav.MainHome} component={HomeTab} />
              <Stack.Screen name={StackNav.ViewAttendace} component={ViewAttendace} />
              <Stack.Screen name={StackNav.ViewHolidays} component={ViewHolidays} />
              <Stack.Screen name={StackNav.ViewLeaves} component={ViewLeaves} />
              <Stack.Screen name={StackNav.ViewPayroll} component={ViewPayroll} />
              <Stack.Screen name={StackNav.GeneratePayslip} component={GeneratePayslip} />
              <Stack.Screen name={StackNav.RequestLeave} component={RequestLeave} />
            </>
            
          )}
    </Stack.Navigator>
    </AuthContext.Provider>
  );
}
