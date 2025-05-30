// Library import
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';

// Local import
import {styles} from '../../themes';
import EText from '../common/EText';
import strings from '../../i18n/strings';
import {
  DownloadDark,
  DownloadLight,
  PrintDark,
  PrintLight,
  ShareDark,
  ShareLight,
} from '../../assets/svgs';
import EDivider from '../common/EDivider';

export default function EReceiptMenu(props) {
  const {SheetRef, onPressCancel} = props;
  const colors = useSelector(state => state.theme.theme);

  const RenderItem = ({text, icon, onPress}) => {
    return (
      <TouchableOpacity style={localStyles.textStyle} onPress={onPress}>
        {!!icon && icon}
        <EText type={'b16'} style={styles.ph10}>
          {text}
        </EText>
      </TouchableOpacity>
    );
  };

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
        <RenderItem
          text={strings.shareEReceipt}
          icon={colors.dark ? <ShareDark /> : <ShareLight />}
          onPress={onPressCancel}
        />
        <EDivider style={styles.mv20} />
        <RenderItem
          text={strings.downloadEReceipt}
          icon={colors.dark ? <DownloadDark /> : <DownloadLight />}
          onPress={onPressCancel}
        />
        <EDivider style={styles.mv20} />
        <RenderItem
          text={strings.print}
          onPress={onPressCancel}
          icon={colors.dark ? <PrintDark /> : <PrintLight />}
        />
      </View>
    </ActionSheet>
  );
}

const localStyles = StyleSheet.create({
  actionSheetContainer: {
    ...styles.ph20,
    ...styles.pb30,
  },
  bottomContainer: {
    ...styles.pv10,
    ...styles.pv30,
    ...styles.pb50,
  },
  textStyle: {
    ...styles.flexRow,
    ...styles.alignCenter,
  },
});
