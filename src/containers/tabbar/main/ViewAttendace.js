import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import EHeader from '../../../components/common/EHeader';
import { Calender, CardClock, CheckIn } from '../../../assets/svgs';
import api from '../../../api/api';

const ViewAttendance = () => {
  const [user, setUserData] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  // Load user data from AsyncStorage
  useEffect(() => {
    const getUser = async () => {
      let userData = await AsyncStorage.getItem('USER');
      userData = JSON.parse(userData);
      console.log('User Data:', userData);
      setUserData(userData);
    };

    getUser();
  }, []);

  // Set the first day of the current month
  useEffect(() => {
    const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    setSelectedStartDate(firstDayOfMonth);
  }, []);

  // Whenever user or selectedStartDate changes, fetch attendance
  useEffect(() => {
    if (selectedStartDate && user) {
      ShowMonthlyAttendance();
    }
  }, [selectedStartDate, user]);

  // Fetch attendance data from the API, then filter to current month
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

  // Helper to calculate duration between two times
  const calculateTotalTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '00:00:00';

    const startMoment = moment(startTime, 'h:mm:ss a');
    const endMoment = moment(endTime, 'h:mm:ss a');

    if (!startMoment.isValid() || !endMoment.isValid()) return '00:00:00';

    const duration = moment.duration(endMoment.diff(startMoment));
    const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
    const minutes = String(duration.minutes()).padStart(2, '0');
    const seconds = String(duration.seconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.mainContainer}>
      <EHeader title="Attendance Report" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {filteredAttendances.length > 0 ? (
            filteredAttendances.map((ele, index) => {
              // Determine which labels to show (day vs. night)
              const checkInLabel = ele.day_check_in_time
                ? 'Day Check In'
                : ele.night_check_In_time
                ? 'Night Check In'
                : 'Check In';

              const checkOutLabel = ele.day_check_out_time
                ? 'Day Check Out'
                : ele.night_check_out_time
                ? 'Night Check Out'
                : 'Check Out';

              // Format check‐in/check‐out times for display
              const displayedCheckInTime = ele.day_check_in_time
                ? moment(ele.day_check_in_time, 'h:mm:ss a').format('h:mm a')
                : ele.night_check_In_time
                ? moment(ele.night_check_In_time, 'h:mm:ss a').format('h:mm a')
                : '--';

              const displayedCheckOutTime = ele.day_check_out_time
                ? moment(ele.day_check_out_time, 'h:mm:ss a').format('h:mm a')
                : ele.night_check_out_time
                ? moment(ele.night_check_out_time, 'h:mm:ss a').format('h:mm a')
                : '--';

              // ----- Updated totalTime logic: prioritize day, then night -----
              let totalTime = '00:00:00';
              if (ele.day_check_in_time && ele.day_check_out_time) {
                totalTime = calculateTotalTime(ele.day_check_in_time, ele.day_check_out_time);
              } else if (ele.night_check_In_time && ele.night_check_out_time) {
                totalTime = calculateTotalTime(ele.night_check_In_time, ele.night_check_out_time);
              }
              // ----------------------------------------------------------------

              return (
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
                        <Text style={styles.heading}>{totalTime}</Text>
                      </View>
                    </View>

                    <View style={styles.timeRow}>
                      <View style={styles.timeItem}>
                        <CheckIn />
                        <Text style={styles.subHeading}>{checkInLabel}</Text>
                        <Text style={styles.heading}>{displayedCheckInTime}</Text>
                      </View>
                      <View style={styles.timeItem}>
                        <CheckIn />
                        <Text style={styles.subHeading}>{checkOutLabel}</Text>
                        <Text style={styles.heading}>{displayedCheckOutTime}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
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
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
