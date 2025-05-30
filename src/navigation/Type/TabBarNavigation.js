import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';

// Local Imports
import {TabRoute} from '../NavigationRoutes';
import {TabNav} from '../NavigationKeys';
import {styles} from '../../themes';
import {getHeight} from '../../common/constants';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import {
  HomeActiveWh,
  HomeUnActive,
  TicketActiveWh,
  TicketUnActive,
} from '../../assets/svgs';

export default function TabBarNavigation() {
  const colors = useSelector(state => state.theme.theme);
  const Tab = createBottomTabNavigator();

  const TabText = memo(({IconType, label, focused}) => (
    <View style={localStyle.tabViewContainer}>
      {IconType}
      <EText
        style={[styles.mt5, {color: colors.white}]}
        numberOfLines={1}
        color={focused ? colors.textColor : colors.grayScale5}
        type={'R14'}>
        {label}
      </EText>
    </View>
  ));

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        // tabBarStyle: [
        //   localStyle.tabBarStyle,
        //   {backgroundColor: colors.backgroundColor3},
        // ],
        tabBarShowLabel: false,
      }}
      initialRouteName={TabNav.MainHome}>
      <Tab.Screen
        name={TabNav.MainHome}
        component={TabRoute.MainHome}
        // options={{
        //   tabBarIcon: ({focused}) => (
        //     <TabText
        //       IconType={focused ? <HomeActiveWh /> : <HomeUnActive />}
        //       focused={focused}
        //       label={strings.home}
        //     />
        //   ),
        // }}
      />
      <Tab.Screen
        name={TabNav.TaskTab}
        component={TabRoute.TaskTab}
        // options={{
        //   tabBarIcon: ({focused}) => (
        //     <TabText
        //       IconType={focused ? <TicketActiveWh /> : <TicketUnActive />}
        //       focused={focused}
        //       label={strings.TaskList}
        //     />
        //   ),
        // }}
      />
    </Tab.Navigator>
  );
}

const localStyle = StyleSheet.create({
  tabBarStyle: {
    height: getHeight(60),
    ...styles.ph20,
    borderTopWidth: 0,
  },
  tabViewContainer: {
    ...styles.center,
  },
});
