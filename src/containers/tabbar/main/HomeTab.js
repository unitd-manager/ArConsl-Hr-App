import { StyleSheet, View, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles, colors } from '../../../themes';
import { popularEventData } from '../../../api/constant';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import { Clock, Caledar } from '../../../assets/svgs';
import EText from '../../../components/common/EText';
import EButton from '../../../components/common/EButton';
import ProjectConfirmModal from '../../../components/models/ProjectConfirmModal';
import strings from '../../../i18n/strings';
import api from '../../../api/api';

export default function HomeTab() {
  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(true);
  const [user, setUserData] = useState();

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
    setExtraData(prev => !prev); // Trigger re-render
  };
  

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  useEffect(() => {
    getUser();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentInsertId, setCurrentInsertId] = useState(null);
  const [btnTextDay, setBtnTextDay] = useState(strings.daycheckIn);
  const [btnTextNight, setBtnTextNight] = useState(strings.nightcheckIn);
  const [headerTitle, setHeaderTitle] = useState(strings.confirmationIn);
  const [lastClickedButton, setLastClickedButton] = useState('day');
  const [isDayButtonVisible, setIsDayButtonVisible] = useState(true);
  const [isNightButtonVisible, setIsNightButtonVisible] = useState(true);
  const [insertedData, setInsertedData] = useState(null);
  const [data, setData] = useState([]);

  const FetchData = async () => {
    if (!user) return;
  
    const userss = {
      staff_id: user.staff_id,
      site_id: user.site_id,
      branch_id: user.branch_id
    };
  
    try {
      const res = await api.post(`/attendance/getEmployeeSiteData`, userss);
      const allData = res.data.data;
      
      const todayDate = moment().format('DD-MM-YYYY');
  
      // Filter records for today's date
      const todayRecord = allData.find(record => record.date === todayDate);
  
      if (todayRecord) {
        setData(todayRecord);
  
        // Store check-in status locally
        await AsyncStorage.setItem('DAY_CHECKED_IN', todayRecord.day_check_in_time && !todayRecord.day_check_out_time ? 'true' : 'false');
        await AsyncStorage.setItem('NIGHT_CHECKED_IN', todayRecord.night_check_In_time && !todayRecord.night_check_out_time ? 'true' : 'false');
      } else {
        setData(null); // No record for today
      }
    } catch (error) {
      alert('Network connection error.');
    }
  };
  
  

  const insertAttendance = () => {
    const staff_id = user.staff_id;
    const employee_id = user.employee_id;
    const site_id = user.site_id;
    const branch_id = user.branch_id;
    const currentDate = moment().format('DD-MM-YYYY');
    const currentTime = moment().format('h:mm:ss a');

    if (lastClickedButton === 'day') {
      const user = {
        project_id: 1,
        date: currentDate,
        staff_id: staff_id,
        employee_id: employee_id,
        site_id: site_id,
        branch_id: branch_id,
        day_check_in_time: currentTime,
      };

      api
        .post('/attendance/insertAppAttendance', user)
        .then(({ data }) => {
          setCurrentInsertId(data.data.insertId);
          setInsertedData(user);
          Alert.alert('Day Attendance inserted successfully.');
          FetchData();
        })
        .catch(error => {
          console.log('Error: ', error);
          Alert.alert('Network connection error.');
        });
    } else if (lastClickedButton === 'night') {
      const user = {
        project_id: 1,
        date: currentDate,
        staff_id: staff_id,
        employee_id: employee_id,
        site_id: site_id,
        branch_id: branch_id,
        night_check_In_time: currentTime,
      };

      api
        .post('/attendance/insertAppAttendance', user)
        .then(({ data }) => {
          setCurrentInsertId(data.data.insertId);
          setInsertedData(user);
          Alert.alert('Night Attendance inserted successfully.');
          FetchData();
        })
        .catch(() => {
          Alert.alert('Network connection error.');
        });
    }
  };

  const checkOut = () => {
    const currentTime = moment().format('h:mm:ss a');
    const currentDate = moment().format('DD-MM-YYYY');

    if (lastClickedButton === 'day') {
      const user = {
        day_check_out_time: currentTime,
        date: currentDate,
        id: currentInsertId,
      };
      api
        .post('/attendance/updateAppAttendance', user)
        .then(() => {
          Alert.alert('Day check-out time inserted successfully.');
          setInsertedData(user);
          FetchData();
        })
        .catch(() => {
          Alert.alert('Network connection error.');
        });
    } else if (lastClickedButton === 'night') {
      const user = {
        night_check_out_time: currentTime,
        date: currentDate,
        id: currentInsertId,
      };

      api
        .post('/attendance/updateAppAttendance', user)
        .then(() => {
          Alert.alert('Night check-out time inserted successfully.');
          setInsertedData(user);
          FetchData();
        })
        .catch(() => {
          Alert.alert('Network connection error.');
        });
    }
  };

  const onPress = (buttonType) => {
    setModalVisible(true);
    setLastClickedButton(buttonType);

    if (buttonType === 'day' && btnTextDay === strings.daycheckout) {
      if (headerTitle === strings.confirmationIn) {
        setHeaderTitle(strings.confirmationOut);
      }
    }

    if (btnTextNight === strings.nightcheckout) {
      if (headerTitle === strings.confirmationIn) {
        setHeaderTitle(strings.confirmationOut);
      }
    }
  };

  const onPressYes = async () => {
    if (lastClickedButton === 'day') {
      if (btnTextDay === strings.daycheckIn) {
        setBtnTextDay(strings.daycheckout); 
        insertAttendance();
        setIsNightButtonVisible(false);
        await AsyncStorage.setItem('DAY_CHECKED_IN', 'true');
      } else {
        setBtnTextDay(strings.daycheckIn);
        checkOut();
        setIsNightButtonVisible(true);
        await AsyncStorage.setItem('DAY_CHECKED_IN', 'false');
      }
    } else if (lastClickedButton === 'night') {
      if (btnTextNight === strings.nightcheckIn) {
        setBtnTextNight(strings.nightcheckout);
        insertAttendance();
        setIsDayButtonVisible(false);
        await AsyncStorage.setItem('NIGHT_CHECKED_IN', 'true');
      } else {
        setBtnTextNight(strings.nightcheckIn);
        checkOut();
        setIsDayButtonVisible(true);
        await AsyncStorage.setItem('NIGHT_CHECKED_IN', 'false');
      }
    }
    setModalVisible(false);
  };
  
  
  const onPressNo = () => {
    setModalVisible(false);
  };


  const loadButtonState = async () => {
    const dayCheckedIn = await AsyncStorage.getItem('DAY_CHECKED_IN');
    const nightCheckedIn = await AsyncStorage.getItem('NIGHT_CHECKED_IN');
  
    // Check day shift status
    if (data?.day_check_in_time && !data?.day_check_out_time) {
      setBtnTextDay(strings.daycheckout); // Show "Check-Out" if checked in but not out
    } else {
      setBtnTextDay(strings.daycheckIn); // Show "Check-In" otherwise
    }
  
    // Check night shift status
    if (data?.night_check_In_time && !data?.night_check_out_time) {
      setBtnTextNight(strings.nightcheckout); // Show "Check-Out" if checked in but not out
    } else {
      setBtnTextNight(strings.nightcheckIn); // Show "Check-In" otherwise
    }
  
    setIsDayButtonVisible(true);
    setIsNightButtonVisible(true);
  };
  

  useEffect(() => {
   
    calculateTotalTime();
  }, []);
  useEffect(() => {
    FetchData().then(() => loadButtonState()); // Ensure button states update after fetching data
  }, [user]);
  
  


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


  const renderCategoryItem = ({ item, index }) => {
    return <SmallCardComponent item={item} key={index} />;
  };


  const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await FetchData(); // Fetch the latest data
  await loadButtonState(); // Ensure button states update after fetching data
  setRefreshing(false);
};



  return (
    <>
      <HomeHeader user={user} style={{ flex: 1 }} />
         <View>

      <View style={localStyles.card}>
        <View style={localStyles.left}>
          <EText type="m16" numberOfLines={1} color={colors.textColor}> Create Attendance </EText>
          <Text style={{color:'#4D4C4C'}}>Click on Day Clock In or Night Clock In button to generate attendance</Text>
        </View>
        <Caledar />
      </View>
    </View>
      <View style={localStyles.bottomClock}>
          <View style={localStyles.btnContainer}>
            <View style={{ flexDirection: 'row', color: colors.white, alignItems: 'center' }}>
              <Clock />
              <View style={{ marginLeft: 10 }}>
                <EText type="m14" numberOfLines={1} color={colors.white}>{moment().format('dddd')}</EText>
                <EText type="m16" numberOfLines={1} color={colors.white}>{moment().format('DD-MMM-YYYY')}</EText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Clock />
  <View style={{ marginLeft: 10 }}>
    <EText type="m14" numberOfLines={1} color={colors.white}>Shift</EText>
    {data ? (
      <EText type="m16" numberOfLines={1} color={colors.white}>
        {data.day_check_in_time
          ? moment(data.day_check_in_time, 'h:mm:ss a').format('h:mm a')
          : moment(data.night_check_In_time, 'h:mm:ss a').format('h:mm a')
        } - {data.day_check_out_time
          ? moment(data.day_check_out_time, 'h:mm:ss a').format('h:mm a')
          : moment(data.night_check_out_time, 'h:mm:ss a').format('h:mm a')
        }
      </EText>
    ) : (
      <EText type="m16" numberOfLines={1} color={colors.white}>
        No attendance record
      </EText>
    )}
  </View>
</View>


          </View>
          {(data?.day_check_out_time || data?.night_check_out_time) && (
  <View style={localStyles.centeredTextContainer}>
    <EText type="m20" numberOfLines={1} color={colors.white}>
      <Clock /> 
      {data?.day_check_in_time 
        ? calculateTotalTime(data?.day_check_in_time, data?.day_check_out_time) 
        : calculateTotalTime(data?.night_check_In_time, data?.night_check_out_time)}
    </EText>
  </View>
)}


          <View style={localStyles.btnContainer}>
            {isDayButtonVisible && (
              <EButton
                title={btnTextDay}
                type={'S16'}
                containerStyle={localStyles.skipBtnContainer}
                color={colors.white}
                onPress={() => onPress('day')}
                isDayButtonVisible={isDayButtonVisible}
              />
            )}
            {isNightButtonVisible && (
              <EButton
                title={btnTextNight}
                type={'S16'}
                color={colors.white}
                containerStyle={localStyles.skipBtnContainer}
                onPress={() => onPress('night')}
                isNightButtonVisible={isNightButtonVisible}
              />
            )}
          </View>
        </View>

        <ProjectConfirmModal
          visible={modalVisible}
          headerTitle={headerTitle}
          btnText1={"Yes"}
          btnText2={"No"}
          onPressBtn1={onPressYes}
          onPressBtn2={onPressNo}
        />
      <View style={[styles.flexGrow1, { backgroundColor: '#f5f5f5' }]}>
        <FlashList
          data={popularEventData}
          extraData={extraData}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          numColumns={2}
          // ListHeaderComponent={<RenderHeaderItem />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.contentContainerStyle}
          refreshing={refreshing} // Enable pull-to-refresh
          onRefresh={onRefresh} // Trigger refresh when pulled down
        />

      
      </View>
    </>
  );
}

const RenderHeaderItem = React.memo(() => {
  return (
    <View>

      <View style={localStyles.card}>
        <View style={localStyles.left}>
          <EText type="m16" numberOfLines={1} color={colors.textColor}> Create Attendance </EText>
          <Text style={{color:'#4D4C4C'}}>Click on Day Clock In or Night Clock In button to generate attendance</Text>
        </View>
        <Caledar />
      </View>
    </View>
  );
});

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  card: {
    backgroundColor: '#FEE4D8',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    ...styles.p20,
  },
  left: {
    maxWidth: '70%',
  },
  bottomClock: {
    backgroundColor: '#FA7547',
    ...styles.pv30,
    ...styles.ph30,
  },
  centeredTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...styles.mv15,
  },
  skipBtnContainer: {
    width: '45%',
  },
});
