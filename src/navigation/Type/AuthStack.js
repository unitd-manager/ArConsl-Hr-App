import React from 'react';
import {StackNav} from '../NavigationKeys';
import {StackRoute} from '../NavigationRoutes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  

  return (
   
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={StackNav.Splash}>
          <Stack.Screen name={StackNav.Login} component={StackRoute.Login} />
      </Stack.Navigator>
   
  );
}
