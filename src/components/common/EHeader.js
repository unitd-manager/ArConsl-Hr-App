import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

// Custom Imports
import { colors, styles } from '../../themes';
import EText from './EText';
import { moderateScale } from '../../common/constants';

const EHeader = props => {
  const { title, onPressBack, rightIcon, isHideBack, isLeftIcon } = props;
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const goBack = () => navigation.goBack();
  return (
    <View style={[localStyles.container, !!isHideBack && styles.pr10]}>
      <View style={[styles.rowStart, styles.flex, { justifyContent: 'space-between' }]}>
        <View style={styles.rowStart}>
          {!isHideBack && (
            <TouchableOpacity style={styles.pr10} onPress={onPressBack || goBack}>
              <Ionicons
                name="arrow-back-outline"
                size={moderateScale(26)}
                color={colors.white}
              />
            </TouchableOpacity>
          )}
          {!!isLeftIcon && isLeftIcon}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <EText
            numberOfLines={1}
            style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}
            type={'B22'}>
            {title}
          </EText>
        </View>
        {!!rightIcon && rightIcon}
      </View>
    </View>
  );
};

export default memo(EHeader);

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv20,
    ...styles.center,
    backgroundColor: '#FA7547',
  },
});
