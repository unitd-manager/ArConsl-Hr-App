// Library import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';

// Local import
import {styles} from '../../themes';
import EText from '../common/EText';
import strings from '../../i18n/strings';
import EButton from '../common/EButton';
import EDivider from '../common/EDivider';
import {StackNav} from '../../navigation/NavigationKeys';

const CancelBookingModal = props => {
  const {SheetRef} = props;
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const onPressLogOut = () => {
    SheetRef?.current?.hide();
    setTimeout(() => {
      navigation.navigate(StackNav.CancelBooking);
    }, 500);
  };

  const onPressCancel = () => SheetRef?.current?.hide();

  return (
    <ActionSheet
      ref={SheetRef}
      gestureEnabled={true}
      indicatorStyle={{
        backgroundColor: colors.dark ? colors.dark3 : colors.grayScale3,
        ...styles.actionSheetIndicator,
      }}
      containerStyle={[
        localStyles.actionSheetContainer,
        {backgroundColor: colors.backgroundColor},
      ]}>
      <View style={localStyles.bottomContainer}>
        <EText type={'B22'} style={styles.mt5} align={'center'}>
          {strings.cancelBooking}
        </EText>
        <EDivider style={styles.mv20} />
        <EText type={'b18'} align={'center'}>
          {strings.areYouSure}
        </EText>
        <EText type={'M16'} style={styles.mt15} align={'center'}>
          {strings.cancelBookingDesc}
        </EText>
        <View style={localStyles.btnContainer}>
          <EButton
            title={strings.noDonCancel}
            type={'S16'}
            containerStyle={localStyles.skipBtnContainer}
            color={colors.dark ? colors.white : colors.primary}
            bgColor={colors.dark3}
            onPress={onPressCancel}
          />
          <EButton
            title={strings.yesCancel}
            type={'S16'}
            color={colors.white}
            containerStyle={localStyles.skipBtnContainer}
            onPress={onPressLogOut}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const localStyles = StyleSheet.create({
  actionSheetContainer: {
    ...styles.ph20,
  },
  btnContainer: {
    ...styles.pv30,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
  },
  bottomContainer: {
    ...styles.pv10,
  },
});

export default CancelBookingModal;
