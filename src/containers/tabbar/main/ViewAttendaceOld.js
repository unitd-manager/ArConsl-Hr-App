import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EHeader from '../../../components/common/EHeader';
import { Calendar } from 'react-native-calendars';
import { TouchableRipple } from 'react-native-paper';
import { commonColor, styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { Calender, CardClock, CheckIn } from '../../../assets/svgs';
import api from '../../../api/api';

const ViewAttendace = () => {

  const [user, setUserData] = useState();

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  useEffect(() => {
    getUser();
  }, []);

  const [selected, setSelected] = React.useState('');
  const [layout, setLayOut] = React.useState('daily');
  const colors = useSelector(state => state.theme.theme);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [data, setData] = useState([]);
  const [filteredAttendances, seFilteredAttendances] = useState([]);

  const InnerContainer = ({ children }) => {
    return (
      <View
        style={[
          Attendancestyles.innerContainer,
          { backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1 },
        ]}>
        {children}
      </View>
    );
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderLayout = () => {
    if (layout == 'daily') {
      return (
        <>
          <Calendar
            style={{
              borderWidth: 1,
              borderColor: '#FF9A7F',
              height: 350,
              borderRadius: moderateScale(5),
            }}
            theme={{
              selectedDayBackgroundColor: '#FF9A7F',
              todayTextColor: '#FF9A7F',
              arrowColor: '#FF9A7F',
              'stylesheet.calendar.header': {
                dayTextAtIndex0: {
                  color: 'red',
                },
                dayTextAtIndex6: {
                  color: 'green',
                },
              },
            }}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
              },
            }}
          />

          <InnerContainer>
            <View
              style={[
                Attendancestyles.project,
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
                <Text style={Attendancestyles.subHeading}>
                    {data?.date ? moment(data.date).format('dddd') : 'No Data'}
                  </Text>
                
                 <Text style={Attendancestyles.heading}>  {data?.date ? moment(data.date, 'DD-MM-YYYY').format('DD-MMM-YYYY') : 'No Data'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CardClock />
                <View>
                  <Text style={Attendancestyles.subHeading}>Total</Text>
                  <Text style={Attendancestyles.heading}>
                  {data?.day_check_in_time
  ? calculateTotalTime(data.day_check_in_time, data.day_check_out_time)
  : data?.night_check_In_time
    ? calculateTotalTime(data.night_check_In_time, data.night_check_out_time)
    : '--'} 

                  </Text>
                </View>
              </View>
            </View>

            <View style={Attendancestyles.time}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <CheckIn />
                  <Text style={Attendancestyles.subHeading}>Check In</Text>
                </View>
                <Text style={Attendancestyles.heading}>
                  {data.day_check_in_time
                    ? moment(data.day_check_in_time, 'h:mm:ss a').format('h:mm a')
                    : moment(data.night_check_In_time, 'h:mm:ss a').format('h:mm a')
                  }
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <CheckIn />
                  <Text style={Attendancestyles.subHeading}>Check Out</Text>
                </View>
                <Text style={Attendancestyles.heading}>
                  {data.day_check_out_time
                    ? moment(data.day_check_out_time, 'h:mm:ss a').format('h:mm a')
                    : moment(data.night_check_out_time, 'h:mm:ss a').format('h:mm a')
                  }
                </Text>
              </View>
            </View>
          </InnerContainer>
        </>
      );
    } else if (layout == 'monthly') {
      return (
        <>
          <View style={{ flex: 1 }}>
            <Calendar
              style={{
                borderWidth: 1,
                borderColor: "#FF9A7F",
                height: 340,
              }}
              theme={{
                selectedDayBackgroundColor: "#FF9A7F",
                todayTextColor: "#FF9A7F",
                arrowColor: "#FF9A7F",
                'stylesheet.calendar.header': {
                  dayTextAtIndex0: {
                    color: 'red',
                  },
                  dayTextAtIndex6: {
                    color: 'green',
                  },
                },
              }}
              initialDate={getCurrentDate()}
              markingType="period"
              onDayPress={(day) => handleDateSelect(day.dateString)}
              markedDates={getMarked()}
            />
            <View style={{ marginBottom: 150 }}>
              {filteredAttendances.map((ele) =>
                <InnerContainer>
                  <View
                    style={[
                      Attendancestyles.project,
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
                        <Text style={Attendancestyles.subHeading}>Date</Text>
                        <Text style={Attendancestyles.heading}>{ele.date}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <CardClock />
                      <View>
                        <Text style={Attendancestyles.subHeading}>Total</Text>
                        <Text style={Attendancestyles.heading}>
                          {ele.day_check_in_time ?
                            calculateTotalTime(ele.day_check_in_time, ele.day_check_out_time) :
                            calculateTotalTime(ele.night_check_In_time, ele.night_check_out_time)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={Attendancestyles.time}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View>
                        <CheckIn />
                        <Text style={Attendancestyles.subHeading}>wqsCheck In</Text>
                      </View>
                      <Text style={Attendancestyles.heading}>
                        {ele.day_check_in_time
                          ? moment(ele.day_check_in_time, 'h:mm:ss a').format('h:mm a')
                          : moment(ele.night_check_In_time, 'h:mm:ss a').format('h:mm a')
                        }
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View>
                        <CheckIn />
                        <Text style={Attendancestyles.subHeading}>Check Out</Text>
                      </View>
                      <Text style={Attendancestyles.heading}>
                        {ele.day_check_out_time
                          ? moment(ele.day_check_out_time, 'h:mm:ss a').format('h:mm a')
                          : moment(ele.night_check_out_time, 'h:mm:ss a').format('h:mm a')
                        }
                      </Text>
                    </View>
                  </View>
                </InnerContainer>

              )}

            </View>


          </View>
        </>
      );
    }
  };

  const handleDateSelect = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();

    if (selectedDate > today) {
      Alert.alert('You can\'t select a future date');
    } else if (selectedStartDate === null || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      const newSelectedEndDate = date;
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(newSelectedEndDate);

      // Check if the new end date is after the start date
      if (endDate > startDate) {
        const dayDifference = Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        if (dayDifference < 2) {
          Alert.alert('Please select a minimum of 2 days.');
        } else if (dayDifference <= 7) {
          setSelectedEndDate(newSelectedEndDate);

          // Update selectedDates state with all dates in the range
          const datesToAdd = [];
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            datesToAdd.push(dateString);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setSelectedDates(datesToAdd);
          ShowWeeklyAttendance();
          // Update selectedDates state with all dates in the range

        } else {
          Alert.alert('You can only select a maximum of 7 days.');
        }
      } else {
        Alert.alert("You can't select an end date earlier than the start date.");
      }
    }
  };

  const getMarked = () => {
    let marked = {};
    const today = new Date();

    if (selectedStartDate) {
      marked[selectedStartDate] = {
        color: '#FF9A7F',
        textColor: '#fff',
        startingDay: true,
      };

      if (selectedEndDate) {
        const currentDate = new Date(selectedStartDate);
        while (currentDate <= new Date(selectedEndDate)) {
          const dateString = currentDate.toISOString().split('T')[0];
          marked[dateString] = {
            color: '#FF9A7F',
            textColor: '#fff',
          };

          if (currentDate.toISOString().split('T')[0] === selectedEndDate) {
            marked[dateString].endingDay = true;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    const currentDate = new Date(selectedStartDate);
    while (currentDate > today) {
      const dateString = currentDate.toISOString().split('T')[0];
      marked[dateString] = {
        disabled: true,
        disableTouchEvent: true,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return marked;
  };

  const getSelectedDates = () => {
    const selectedDates = [];
    if (selectedStartDate && selectedEndDate) {
      let currentDate = parseISO(selectedStartDate);
      while (!isAfter(currentDate, parseISO(selectedEndDate))) {
        selectedDates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return selectedDates;
  };

  // Show Daily Attendance Report

    const ShowDailyAttendance = () => {
      if (!user || !selected) return;
    
          const userss = { staff_id: user.staff_id ,site_id: user.site_id,branch_id: user.branch_id};

    
      api
        .post('/attendance/getEmployeeSiteData', userss)
        .then(res => {
          // Filter for selected date record
          const filteredData = res.data.data.find(
            entry => entry.date === reverseDateFormat(selected) // Ensure the date format matches
          );
          setData(filteredData || {}); // If no record, set empty object
        })
        .catch(() => {
          alert('Network connection error.');
        });
    };
    

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

  // Function to reverse the date format "2024-01-08" to "08-01-2024"
  const reverseDateFormat = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };


  const ShowMonthlyAttendance = () => {
    if (!user) return;
  
        const userss = { staff_id: user.staff_id ,site_id: user.site_id,branch_id: user.branch_id};

  
    api
      .post('/attendance/getEmployeeSiteData', userss)
      .then(res => {
        // Extract month from selectedStartDate (format: YYYY-MM)
        const selectedMonth = selectedStartDate?.slice(0, 7);
  
        // Filter attendance records for that month
        const filteredAttendance = res.data.data.filter(entry =>
          entry.date.startsWith(selectedMonth) && entry.staff_id === user.staff_id
        );
  
        seFilteredAttendances(filteredAttendance);
      })
      .catch(() => {
        alert('Network connection error.');
      });
  };
  
  // Trigger this when switching to Monthly layout
  useEffect(() => {
    if (layout === 'monthly' && selectedStartDate) {
      ShowMonthlyAttendance();
    }
  }, [layout, selectedStartDate]);
  

  const ShowWeeklyAttendance = () => {
    if (!user) return;
  
        const userss = { staff_id: user.staff_id ,site_id: user.site_id,branch_id: user.branch_id};

  
    api
      .post('/attendance/getEmployeeSiteData',userss)
      .then(res => {
        const reversedSelectedDates = selectedDates.map(reverseDateFormat);
        const filteredAttendance = res.data.data.filter(entry => {
          return reversedSelectedDates.includes(entry?.date) && entry.staff_id === user.staff_id;
        });
        seFilteredAttendances(filteredAttendance)
      })
      .catch(() => {
        alert('Network connection error.');
      });
  };
  useEffect(() => {
    if (selectedDates.length > 0 && user.staff_id) {
      ShowWeeklyAttendance();
    }
  }, [selectedDates, user?.staff_id]);

  useEffect(() => {
    ShowDailyAttendance();
  }, [selected]);
  

  useEffect(() => {
    calculateTotalTime();
  }, [selectedEndDate]);

  console.log("selectedDates", selectedDates)

  return (
    <View>
      <EHeader title={'Attendance Report'} />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FF9A7F',
          justifyContent: 'space-around',
          padding: 10,
        }}>
        <TouchableRipple
          onPress={() => {
            setLayOut('daily');
          }}
          style={Attendancestyles.head}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Daily</Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setLayOut('monthly');
          }}
          style={Attendancestyles.head}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Monthly</Text>
        </TouchableRipple>
      </View>
      <ScrollView style={{ padding: 15 }}>{renderLayout()}</ScrollView>
    </View>
  );
};

export default ViewAttendace;

const Attendancestyles = StyleSheet.create({
  header: {
    borderBottomWidth: 0.3,
    borderColor: '#FA7547',
    height: 100,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginLeft: 15,
    color: '#4C4E66',
    marginVertical: 20,
  },
  head: {
    fontSize: 14,
  },
  content: {
    fontSize: 13,
    marginTop: 6,
  },
  head: {
    padding: 10,
  },

  innerContainer: {
    ...styles.mv20,
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: '#FF9A7F',
  },

  heading: {
    fontSize: 14,
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
    backgroundColor: '#FEE4D8',
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
});
