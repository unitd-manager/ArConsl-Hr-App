import {StyleSheet, TouchableOpacity, View, ActivityIndicator, Text} from 'react-native';
import React, {memo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import EInput from '../common/EInput';
import { Search_Icon} from '../../assets/svgs';
import strings from '../../i18n/strings';
import {moderateScale} from '../../common/constants';

const SearchComponent = props => {
  const {onSearchInput, search, isLoading,error,style } = props;
  const colors = useSelector(state => state.theme.theme);

  if ( isLoading ) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }
  
  if ( error ) {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <Text>Error in fetching data... Please check your internet connection</Text>
      </View>
    )
  }

  const searchIcon = () => {
    return (
      <TouchableOpacity >
        <Search_Icon />
      </TouchableOpacity>
    );
  };
  return (
    <View style={[{marginHorizontal:20},style]}>
      <EInput
        key="searchProject"
        placeHolder={strings.searchPlaceholder1}
        keyBoardType={'default'}
        _value={search}
        toGetTextFieldValue={onSearchInput}
        autoCapitalize={'none'}
        insideLeftIcon={searchIcon}
        inputContainerStyle={[
          {backgroundColor: colors.inputBg},
          localStyles.inputContainerStyle,
        ]}
        
      />
     
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
});

export default memo(SearchComponent);
