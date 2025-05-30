import React, {useState, useRef, useCallback, Fragment} from 'react';
import {StyleSheet, FlatList, Image, View, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {OnBoardingSlide} from '../api/constant';
import {
  deviceHeight,
  deviceWidth,
  getHeight,
  moderateScale,
} from '../common/constants';
import EButton from '../components/common/EButton';
import EText from '../components/common/EText';
import strings from '../i18n/strings';
import {StackNav} from '../navigation/NavigationKeys';
import {styles} from '../themes';
import {setOnBoarding} from '../utils/asyncstorage';

const OnBoarding = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    setCurrentIndex(viewableItems[0]?.index);
  }, []);
  const _viewabilityConfig = {itemVisiblePercentThreshold: 50};

  const onPressRightArrow = async () => {
    if (currentIndex === 2) {
      await setOnBoarding(true);
      navigation.reset({
        index: 0,
        routes: [{name: StackNav.Auth}],
      });
    } else {
      slideRef.current._listRef._scrollRef.scrollTo({
        x: deviceWidth * (currentIndex + 1),
      });
    }
  };

  const titleText = () => {
    switch (currentIndex) {
      case 0:
        return strings.onBoardingTitle1;
      case 1:
        return strings.onBoardingTitle2;
      case 2:
        return strings.onBoardingTitle3;
      default:
        return strings.onBoardingTitle1;
    }
  };

  const DescText = () => {
    switch (currentIndex) {
      case 0:
        return strings.onBoardingDesc1;
      case 1:
        return strings.onBoardingDesc2;
      case 2:
        return strings.onBoardingDesc3;
      default:
        return strings.onBoardingDesc1;
    }
  };

  const RenderOnboardingItem = useCallback(
    ({item, index}) => {
      return (
        <View style={localStyles.rendetItemConatiner}>
          <Image
            source={item.image}
            resizeMode="contain"
            style={localStyles.imageStyle}
          />
        </View>
      );
    },
    [OnBoardingSlide],
  );

  return (
    <Fragment>
      <SafeAreaView
        style={[styles.flex, {backgroundColor: colors.backgroundColor2}]}>
        <FlatList
          data={OnBoardingSlide}
          ref={slideRef}
          renderItem={({item, index}) => (
            <RenderOnboardingItem item={item} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          horizontal
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={_viewabilityConfig}
          pagingEnabled
        />
        <View
          style={[
            localStyles.bottomStyle,
            {backgroundColor: colors.backgroundColor1},
          ]}>
          <EText
            align={'center'}
            color={colors.primary5}
            style={styles.mt10}
            type={'B34'}>
            {titleText()}
          </EText>
          <EText align={'center'} style={styles.mv15} type={'r16'}>
            {DescText()}
          </EText>
          <View style={styles.rowCenter}>
            {OnBoardingSlide.map((_, index) => (
              <View
                style={[
                  localStyles.bottomIndicatorStyle,
                  {
                    width:
                      index !== currentIndex
                        ? moderateScale(10)
                        : moderateScale(20),
                    backgroundColor:
                      index !== currentIndex ? colors.bColor : colors.primary5,
                  },
                ]}
              />
            ))}
          </View>
          <EButton
            title={currentIndex === 2 ? strings.getStarted : strings.next}
            containerStyle={localStyles.submitButton}
            type={'M18'}
            color={colors.white}
            onPress={onPressRightArrow}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: colors.backgroundColor1}} />
    </Fragment>
  );
};

const localStyles = StyleSheet.create({
  submitButton: {
    ...styles.mt15,
    ...styles.mh25,
    width: '100%',
  },
  rendetItemConatiner: {
    width: deviceWidth,
    ...styles.ph20,
    ...styles.center,
  },
  imageStyle: {
    height: deviceHeight - getHeight(340),
    width: deviceWidth - moderateScale(40),
  },
  bottomIndicatorStyle: {
    height: moderateScale(10),
    ...styles.mt10,
    borderRadius: moderateScale(10),
    ...styles.mh5,
  },
  bottomStyle: {
    backgroundColor: 'white',
    ...styles.pv10,
    minHeight: getHeight(340),
    borderTopEndRadius: moderateScale(26),
    borderTopStartRadius: moderateScale(26),
    ...styles.center,
    ...styles.ph20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default OnBoarding;
