import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EHeader from '../../../components/common/EHeader';
import { commonColor, styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { Calender } from '../../../assets/svgs';
import EButton from '../../../components/common/EButton';
import { StackNav } from '../../../navigation/NavigationKeys';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import api from '../../../api/api';
const { width } = Dimensions.get('window');

const ViewLeaves = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 

  const [user, setUserData] = useState();

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  useEffect(() => {
    getUser();
  }, []);

  const Email = user?.staff_id
  const [leave, setLeave] = useState();

  const [sickLeave, setSickLeaveCount] = useState(0);
  const [annualLeave, setAnnualLeaveCount] = useState(0);
  const [casualLeave, setCasualLeaveCount] = useState(0);
  
  let sickLeaveCount = 0;
  let annualLeaveCount = 0;
  let casualLeaveCount = 0;
  
  useEffect(() => {
    const fetchData = () => {
      if (Email) {

        api
          .post('/leave/getLeaveEmpByid', { employee_id: Email })
          .then((res) => {
            setLeave(res.data.data);

            res.data.data.forEach((entry) => {
              if (entry.leave_type === 'Sick Leave') {
                sickLeaveCount += entry.no_of_days + (entry.no_of_days_next_month || 0);
              } else if (entry.leave_type === 'Annual Leave') {
                annualLeaveCount += entry.no_of_days + (entry.no_of_days_next_month || 0);
              } else if (entry.leave_type === 'Absent' || entry.leave_type === 'Casual Leave') {
                casualLeaveCount += entry.no_of_days + (entry.no_of_days_next_month || 0);
              }
            });

            setSickLeaveCount(sickLeaveCount);
            setAnnualLeaveCount(annualLeaveCount);
            setCasualLeaveCount(casualLeaveCount);
          })
          .catch(() => {
            alert('Network connection error.');
          });
      }
    };

    // Fetch data when the component mounts and whenever the screen is focused
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, Email, navigation]); 

  const BoxComponent = ({ imageSource, heading, description }) => {
    return (
      <View style={Leavestyles.box}>
        <View style={Leavestyles.imageContainer}>
          <Image source={imageSource} style={Leavestyles.image} />
        </View>
        <Text style={[Leavestyles.heading, { color: '#fff' }]}>{heading}</Text>
        <Text style={[Leavestyles.description, { color: '#fff' }]}>{description}</Text>
      </View>
    );
  };

  const InnerContainer = ({ children }) => {
    return (
      <View
        style={[
          Leavestyles.innerContainer,
          { backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1 },
        ]}>
        {children}
      </View>
    );
  };
  const onPressContinue = () =>
    navigation.navigate(StackNav.RequestLeave,user);

  return (
    <>
      <EHeader title={'Leave'} />

      <ScrollView>
        <View style={Leavestyles.container}>

          <BoxComponent
            imageSource={require('../../../assets/images/casual.webp')}
            heading={`${casualLeave}/12`}
            description="Casual Leave"
          />
          <BoxComponent
            imageSource={require('../../../assets/images/sickLeave.webp')}
            heading={`${sickLeave}/12`}
            description="Sick Leave"
          />
          <BoxComponent
            imageSource={require('../../../assets/images/annualLeave.webp')}
            heading={`${annualLeave}/12`}
            description="Annual Leave"
          />
        </View>

        <View style={{ marginHorizontal: 10 }}>

          <EButton
            type={'S16'}
            title={'Request Leave'}
            color={colors.white}
            onPress={onPressContinue}
            containerStyle={Leavestyles.continueBtnStyle}
          />

          <Text style={[Leavestyles.Historyheading]}>Recent Leave History</Text>

          {leave && leave.length > 0 && leave.map((item) => (
            <InnerContainer>
              <View
                style={[
                  Leavestyles.project,
                  {
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingRight: 20,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Calender />
                  <View>
                    <Text style={Leavestyles.subHeading}>From Date</Text>
                    <Text style={Leavestyles.heading}>{item?.from_date}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Calender />
                  <View>
                    <Text style={Leavestyles.subHeading}>To Date</Text>
                    <Text style={Leavestyles.heading}>{item?.to_date}</Text>
                  </View>
                </View>
              </View>
              <View style={{ borderWidth: .6, borderColor: '#FF9A7F', width: '90%', alignSelf: 'center' }}></View>
              <View
                style={[
                  Leavestyles.project,
                  {
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingRight: 20,
                  },
                ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                    <Text style={[Leavestyles.heading, { color: '#222' }]}>{item.no_of_days + item.no_of_days_next_month} Day Leave</Text>
                    <Text style={[Leavestyles.heading, { color: '#5271FF' }]}>{item.leave_type}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={
                  item.status === 'Approved' ? { backgroundColor: '#74CD8B', ...Leavestyles.waitingButton } : 
                  item.status === 'Denied' ? { backgroundColor: '#FF5757', ...Leavestyles.waitingButton } : 
                  item.status === 'Hold' ? { backgroundColor: '#5271FF', ...Leavestyles.waitingButton } : 
                  item.status === 'Applied' ? { backgroundColor: '#FFB600', ...Leavestyles.waitingButton } : 
                  Leavestyles.waitingButton}
                  >
                    {item.status}</Text>
                </View>
              </View>
            </InnerContainer>
       ) )}

        </View>
      </ScrollView>
    </>
  )
}

export default ViewLeaves

const Leavestyles = StyleSheet.create({
  innerContainer: {
    ...styles.mv10,
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: '#FF9A7F',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: commonColor.black,
  },
  subHeading: {
    fontSize: 12,
    color: commonColor.black,
    fontWeight: '600',
  },
  project: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    ...styles.pb10,
    ...styles.ph20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    alignSelf: 'center',
  },
  waitingButton: {
    color: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4
  },
  continueBtnStyle: {
    ...styles.mv10,
  },
  Historyheading: {
    fontSize: 16,
    color: '#222',
    fontWeight: '700',
    ...styles.mv20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  box: {
    width: width * 0.3,
    alignItems: 'center',
    backgroundColor: '#FF9A7F',
    padding: 10,
    borderRadius: 8
  },
  imageContainer: {
    width: '90%',
    height: 90,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
});