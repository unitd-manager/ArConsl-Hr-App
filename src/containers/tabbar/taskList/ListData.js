import {StyleSheet, View, Text} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Imports
import EText from '../../../components/common/EText';
import {commonColor, styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import moment from 'moment';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import {Moon, Sun} from '../../../assets/svgs';

const ListData = props => {
  const {item} = props;

  const colors = useSelector(state => state.theme.theme);
  const [user, setUserData] = useState();

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  useEffect(() => {
    getUser();
  }, []);

  const InnerContainer = ({children}) => {
    return (
      <View
        style={[
          localStyles.innerContainer,
          {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1},
        ]}>
        {children}
      </View>
    );
  };

  // const InnerText = props => {
  //   const {text1, text2, isBottom = true} = props;
  //   return (
  //     <>
  //       <View style={[styles.rowSpaceBetween, isBottom && styles.pb15]}>
  //         <EText type={'s14'}>{text1}</EText>
  //         <View style={[styles.flexRow, styles.itemsCenter]}>
  //           <EText>{text2}</EText>
  //         </View>
  //       </View>
  //     </>
  //   );
  // };

  const calculateTotalTime = (startTime, endTime) => {
    const startMoment = moment(startTime, 'h:mm:ss a');
    const endMoment = moment(endTime, 'h:mm:ss a');

    const duration = moment.duration(endMoment.diff(startMoment));

    const totalHours = Math.floor(duration.asHours());
    const totalMinutes = Math.floor(duration.asMinutes()) % 60;
    const totalSeconds = Math.floor(duration.asSeconds()) % 60;

    const totalTime = `${totalHours.toString().padStart(2, '0')}:${totalMinutes
      .toString()
      .padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    return totalTime;
  };

  return (
    <View>
      {user && user.staff_id === item.staff_id ? (
        <InnerContainer>
          <View
            style={[
              localStyles.project,
              {
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              },
            ]}>
            <View>
              <Text style={localStyles.heading}>{item?.title}</Text>
              <Text style={localStyles.subHeading}>{item?.date}</Text>
            </View>
            <View>{!item?.day_check_in_time ? <Moon /> : <Sun />}</View>
          </View>
          <View style={localStyles.time}>
            <View>
              <Text style={localStyles.subHeading} text1="Check In">
                Check In
              </Text>
              {!item?.day_check_in_time ? (
                <>
                  <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                    {item?.night_check_In_time}
                  </Text>
                </>
              ) : (
                <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                  {item?.day_check_in_time}
                </Text>
              )}
            </View>

            {/* Vertical line */}
            <View style={localStyles.verticalLine} />

            <View>
              <Text style={localStyles.subHeading} text1="Check In">
                Check Out
              </Text>
              {!item?.day_check_in_time ? (
                <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                  {item?.night_check_out_time}
                </Text>
              ) : (
                <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                  {item?.day_check_out_time}
                </Text>
              )}
            </View>

            {/* Vertical line */}
            <View style={localStyles.verticalLine} />

            <View>
              <Text style={localStyles.subHeading}>Working Hrs</Text>
              <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                {!item?.day_check_in_time ? (
                  <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                    {calculateTotalTime(
                      item?.night_check_In_time,
                      item?.night_check_out_time,
                    )}
                  </Text>
                ) : (
                  <Text style={[localStyles.subHeading, {color: '#009EFF'}]}>
                    {calculateTotalTime(
                      item?.day_check_in_time,
                      item?.day_check_out_time,
                    )}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </InnerContainer>
      ) : (
        // <InnerContainer>
        //   <InnerText text1={item?.title} />
        //   <InnerText text1={`Date :`} text2={item?.date} />
        //   {!item?.day_check_in_time ? (
        //     <>
        //       <InnerText
        //         text1={`Start Time :`}
        //         text2={item?.night_check_In_time}
        //       />
        //       <InnerText
        //         text1={`End Time :`}
        //         text2={item?.night_check_out_time}
        //       />
        //       <InnerText
        //         text1="Total Time :"
        //         text2={calculateTotalTime(
        //           item?.night_check_In_time,
        //           item?.night_check_out_time,
        //         )}
        //       />
        //     </>
        //   ) : (
        //     <>
        //       <InnerText text1={`Start Time :`}
        //       text2={item?.day_check_in_time}
        //       />
        //       <InnerText text1={`End Time :`}
        //       text2={item?.day_check_out_time}
        //       />
        //       <InnerText
        //         text1="Total Time:"
        //         text2={calculateTotalTime(
        //           item?.day_check_in_time,
        //           item?.day_check_out_time,
        //         )}
        //       />
        //     </>
        //   )}
        // </InnerContainer>
        ''
      )}
    </View>
  );
};

export default memo(ListData);

const localStyles = StyleSheet.create({
  innerContainer: {
    ...styles.mv10,
    borderRadius: moderateScale(12),
    ...styles.shadowStyle,
    ...styles.mv10,
  },
  selectContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph15,
    ...styles.pv20,
    ...styles.mv10,
    ...styles.shadowStyle,
    borderRadius: moderateScale(16),
  },
  heading: {
    fontSize: 14,
    color: '#009EFF',
  },
  subHeading: {
    fontSize: 12,
    color: commonColor.black,
    ...styles.mb10,
  },
  project: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    ...styles.pv10,
    ...styles.ph20,
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECF2FF',
    ...styles.pv10,
    ...styles.ph20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dateText: {
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#000',
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderColor: '#8F8E8E',
    height: '60%',
    alignSelf:'center'
  },
});
