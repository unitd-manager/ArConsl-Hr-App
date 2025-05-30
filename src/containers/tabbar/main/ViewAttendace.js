import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EHeader from '../../../components/common/EHeader';
import { Calender, CardClock, CheckIn } from '../../../assets/svgs';
import api from '../../../api/api';

const ViewAttendance = () => {
  const [user, setUserData] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      let userData = await AsyncStorage.getItem('USER');
      userData = JSON.parse(userData);
      console.log('User Data:', userData);
      setUserData(userData);
    };

    getUser();
  }, []);

  useEffect(() => {
    const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    setSelectedStartDate(firstDayOfMonth);
  }, []);

  useEffect(() => {
    if (selectedStartDate && user) {
      ShowMonthlyAttendance();
    }
  }, [selectedStartDate, user]);

  const ShowMonthlyAttendance = async () => {
    if (!user) return;

    const payload = {
      staff_id: user.staff_id,
      site_id: user.site_id,
      branch_id: user.branch_id,
    };

    try {
      const res = await api.post('/attendance/getEmployeeSiteData', payload);
      console.log('API Response:', res.data);

      if (res.data && res.data.data) {
        const currentMonth = moment().format('MM-YYYY');

        const filteredAttendance = res.data.data.filter(
          (entry) =>
            entry.date &&
            moment(entry.date, 'DD-MM-YYYY').format('MM-YYYY') === currentMonth &&
            entry.staff_id === user.staff_id
        );

        console.log('Filtered Attendance:', filteredAttendance);
        setFilteredAttendances(filteredAttendance);
      } else {
        console.log('No attendance data found');
        setFilteredAttendances([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Network connection error.');
    }
  };

  const calculateTotalTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '00:00:00';

    const startMoment = moment(startTime, 'h:mm:ss a');
    const endMoment = moment(endTime, 'h:mm:ss a');

    if (!startMoment.isValid() || !endMoment.isValid()) return '00:00:00';

    const duration = moment.duration(endMoment.diff(startMoment));
    return `${String(Math.floor(duration.asHours())).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`;
  };

  return (
    <View style={styles.mainContainer}>
      <EHeader title="Attendance Report" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {filteredAttendances.length > 0 ? (
            filteredAttendances.map((ele, index) => (
              <View key={index} style={styles.attendanceCardWrapper}>
                <View style={styles.attendanceCard}>
                  <View style={styles.row}>
                    <Calender />
                    <View>
                      <Text style={styles.subHeading}>Date</Text>
                      <Text style={styles.heading}>{ele.date}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <CardClock />
                    <View>
                      <Text style={styles.subHeading}>Total</Text>
                      <Text style={styles.heading}>
                        {calculateTotalTime(ele.day_check_in_time, ele.day_check_out_time) ||
                          calculateTotalTime(ele.night_check_In_time, ele.night_check_out_time)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timeRow}>
                    <View style={styles.timeItem}>
                      <CheckIn />
                      <Text style={styles.subHeading}>Check In</Text>
                      <Text style={styles.heading}>
                        {ele.day_check_in_time
                          ? moment(ele.day_check_in_time, 'h:mm:ss a').format('h:mm a')
                          : ele.night_check_In_time
                          ? moment(ele.night_check_In_time, 'h:mm:ss a').format('h:mm a')
                          : '--'}
                      </Text>
                    </View>
                    <View style={styles.timeItem}>
                      <CheckIn />
                      <Text style={styles.subHeading}>Check Out</Text>
                      <Text style={styles.heading}>
                        {ele.day_check_out_time
                          ? moment(ele.day_check_out_time, 'h:mm:ss a').format('h:mm a')
                          : ele.night_check_out_time
                          ? moment(ele.night_check_out_time, 'h:mm:ss a').format('h:mm a')
                          : '--'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No attendance records found for this month.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewAttendance;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, // Ensures the whole screen is occupied
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Ensures scrolling even when content doesn't fill the screen
    padding: 15,
  },
  subHeading: {
    fontSize: 15,
    color: '#8B0000',
  },

  heading: {
    fontSize: 13,
    color: '#000000',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  attendanceCardWrapper: {
    width: '45%',
    marginVertical: 5,
  },
  attendanceCard: {
    
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9A7F',
    backgroundColor: '#FEE4D8',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
