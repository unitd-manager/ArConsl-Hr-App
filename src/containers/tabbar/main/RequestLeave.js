import { View, StyleSheet,TextInput, TouchableOpacity, Alert, ScrollView,  Keyboard, 
  TouchableWithoutFeedback ,Text ,FlatList} from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import EInput from '../../../components/common/EInput';
import { styles } from '../../../themes';
import { Dropdown } from 'react-native-element-dropdown';
import { LeaveType } from '../../../api/constant';
import { getHeight, moderateScale } from '../../../common/constants';
import EButton from '../../../components/common/EButton';
import moment from 'moment';
import { StackNav } from '../../../navigation/NavigationKeys';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EText from '../../../components/common/EText';
import api from '../../../api/api';

const RequestLeave = ({route}) => {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.backgroundColor,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.backgroundColor,
    color: colors.textColor
  };
  const [leaveType, setLeaveType] = useState('');
  const [totalDaysInputStyle, SetTotalDaysInputStyle] = useState(BlurredStyle);
  const [totalDays, SetTotalDays] = useState('');
  const [reason, setReason] = useState('');
  const [leaveHours, setLeaveHours] = useState('');


  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onBlurInput = onHighlight => onHighlight(FocusedStyle);
  const onChangedLeaveType = text => setLeaveType(text.value);
  const onChangedtotalDays = text => SetTotalDays(text);
  const onChangedReason = text => setReason(text);
  const onFocustotalDays = () => onFocusInput(SetTotalDaysInputStyle);
  const onBlurtotalDays = () => onBlurInput(SetTotalDaysInputStyle);

  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isFullDay, setIsFullDay] = useState(true);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const handleStartDateConfirm = (date) => {
    const formattedDate = formatDate(date);
    setStartDate(formattedDate);
  
    if (endDate) {
      calculateTotalDays(date, endDate);
    }
  
    setStartDatePickerVisible(false);
  };
  
  const handleEndDateConfirm = (date) => {
    const formattedDate = formatDate(date);
    setEndDate(formattedDate);
  
    if (startDate) {
      calculateTotalDays(startDate, date);
    }
  
    setEndDatePickerVisible(false);
  };
  
  // Function to calculate total days
  const calculateTotalDays = (start, end) => {
    const startMoment = moment(start, "DD-MM-YYYY");
    const endMoment = moment(end, "DD-MM-YYYY");
    
    if (endMoment.isBefore(startMoment)) {
      Alert.alert("End date cannot be before start date.");
      return;
    }
  
    const daysDiff = endMoment.diff(startMoment, "days") + 1; // +1 to include start day
    SetTotalDays(daysDiff.toString());
  };
  

  const formatDate = date => {
    const formattedDate = date.toISOString().split('T')[0];
    const day = formattedDate.split('-')[2];
    const month = formattedDate.split('-')[1];
    const year = formattedDate.split('-')[0];
    return day + '-' + month + '-' + year;
  };

  const hideStartDatePicker = () => setStartDatePickerVisible(false);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);

  const onPressStartDate = () => setStartDatePickerVisible(true);
  const onPressEndDate = () => setEndDatePickerVisible(true);

  const toggleFullDay = () => {
    setIsFullDay(!isFullDay);
    setIsHalfDay(false);
  };

  const toggleHalfDay = () => {
    setIsHalfDay(!isHalfDay);
    setIsFullDay(false);
  };

  const [showHoursDropdown, setShowLeavehourTypeDropdown] = useState(false);

  const leavehourTypes = ['1','2','3','4','5'];
  const onPressSubmit = () => {
    const formData = {
      no_of_days: leaveType === 'Permission' ? '0' : totalDays,
      leave_type: leaveType,
      from_date: startDate,
      hours: leaveHours,
      to_date: endDate,
      isFullDay,
      isHalfDay,
      reason,
      employee_id: route.params.staff_id,
      site_id: route.params.site_id,
      branch_id: route.params.branch_id,
      creation_date: moment().format('DD-MMM-YYYY')
    };
  
    if (!leaveType || !startDate || !endDate) {
      Alert.alert('Please fill in all required fields.');
      return;
    }

    // First check if there's an existing leave request for these dates
    api
      .post('/leave/getLeaveEmpByid', { employee_id: route.params.staff_id })
      .then((res) => {
        const existingLeaves = res.data.data || [];
        const hasOverlappingLeave = existingLeaves.some(leave => {
          const existingStartDate = moment(leave.from_date, 'DD-MM-YYYY');
          const existingEndDate = moment(leave.to_date, 'DD-MM-YYYY');
          const newStartDate = moment(startDate, 'DD-MM-YYYY');
          const newEndDate = moment(endDate, 'DD-MM-YYYY');
          
          return (newStartDate.isBetween(existingStartDate, existingEndDate, null, '[]') || 
                 newEndDate.isBetween(existingStartDate, existingEndDate, null, '[]') ||
                 existingStartDate.isBetween(newStartDate, newEndDate, null, '[]') ||
                 existingEndDate.isBetween(newStartDate, newEndDate, null, '[]'));
        });

        if (hasOverlappingLeave) {
          Alert.alert('Leave Request Overlap', 'You already have a leave request for these dates.');
          return;
        }

        // If no overlapping leaves, proceed with submitting the new request
        api
          .post('/leave/insertLeave', formData)
          .then(() => {
            Alert.alert('Leave Request sent successfully.');
            navigation.navigate(StackNav.ViewLeaves);
          })
          .catch(error => {
            console.log('Error:', error);
            Alert.alert('Error', 'Failed to submit leave request. Please try again.');
          });
      })
      .catch(error => {
        console.log('Error checking existing leaves:', error);
        Alert.alert('Error', 'Failed to validate leave request. Please try again.');
      });
  };
  const handleLeaveHoursSelection = (hours) => {
    setLeaveHours(hours);
    setShowLeavehourTypeDropdown(false);
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      

    <View style={{ backgroundColor: '#fafafa', flex: 1 }}>
      <EHeader title={'Request Leave'} />
      <ScrollView contentContainerStyle={localStyles.scrollViewContainer}>
        <View style={localStyles.contentContainerStyle}>
        <DateTimePickerModal
            isVisible={startDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            date={new Date()}
            minimumDate={new Date()}
          />

          <DateTimePickerModal
            isVisible={endDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
            date={new Date()}
            minimumDate={new Date()}
          />

          


          <View style={localStyles.rowContainer}>
            <TouchableOpacity
              onPress={onPressStartDate}
              style={[
                localStyles.datePickerStyle,
                totalDaysInputStyle
              ]}
              _onFocus={onFocustotalDays}
              onBlur={onBlurtotalDays}
            >
              <EText
                type={'r16'}
                color={startDate ? colors.textColor : colors.grayScale5}>
                {startDate ? startDate : 'Start Date'}
              </EText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressEndDate}
              style={[
                localStyles.datePickerStyle,
                totalDaysInputStyle
              ]}>
              <EText
                type={'r16'}
                color={endDate ? colors.textColor : colors.grayScale5}>
                {endDate ? endDate : 'End Date'}
              </EText>
            </TouchableOpacity>
          </View>

          <Dropdown
            style={[
              localStyles.dropdownStyle,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.backgroundColor,
                color: colors.white,
              },
            ]}
            placeholderStyle={{ color: colors.grayScale5 }}
            data={LeaveType}
            maxHeight={moderateScale(180)}
            labelField="label"
            valueField="value"
            placeholder="Leave Type"
            value={leaveType}
            itemTextStyle={{
              color: colors.textColor,
              fontSize: moderateScale(16),
            }}
            onChange={onChangedLeaveType}
            selectedTextStyle={{
              color: colors.textColor,
            }}
            itemContainerStyle={{
              backgroundColor: colors.inputBg,
            }}
            activeColor={colors.inputBg}
          />

{leaveType === 'Permission' && (
  <>
    <Text style={styles.label}>Select Hours *</Text>

    <Dropdown
      style={[
        localStyles.dropdownStyle,
        {
          backgroundColor: colors.inputBg,
          borderColor: colors.backgroundColor,
          color: colors.white,
        },
      ]}
      placeholderStyle={{ color: colors.grayScale5 }}
      data={leavehourTypes.map((item) => ({ label: item, value: item }))}
      maxHeight={moderateScale(180)}
      labelField="label"
      valueField="value"
      placeholder="Select Hours"
      value={leaveHours}
      onChange={(item) => setLeaveHours(item.value)}
      selectedTextStyle={{
        color: colors.textColor,
        fontSize: moderateScale(16),
      }}
      itemContainerStyle={{
        backgroundColor: colors.inputBg,
      }}
      activeColor={colors.inputBg}
    />
  </>
)}


{leaveType !== 'Permission' && (
            <EInput
              placeHolder={'Total Days'}
              _value={totalDays}
              editable={false}
              style={{ color: colors.placeHolderColor }}
              labelField="label"
              valueField="value"
              autoCapitalize={'none'}
              onChangeText={onChangedtotalDays}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg },
                localStyles.inputContainerStyle,
                totalDaysInputStyle,
              ]}
              _onFocus={onFocustotalDays}
              onBlur={onBlurtotalDays}
            />
          )}

          {/* <View style={localStyles.rowContainer}>
            <TouchableOpacity
              onPress={toggleFullDay}
              style={[
                localStyles.toggleButtonStyle,
                totalDaysInputStyle,
                { backgroundColor: isFullDay ? colors.backgroundColor : colors.inputBg },
              ]}
            >
              <EText
                type={'r16'}
                color={isFullDay ? colors.white : colors.grayScale5}
              >
                Full Day
              </EText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleHalfDay}
              style={[
                localStyles.toggleButtonStyle,
                totalDaysInputStyle,
                { backgroundColor: isHalfDay ? colors.backgroundColor : colors.inputBg },
              ]}
            >
              <EText
                type={'r16'}
                color={isHalfDay ? colors.white : colors.grayScale5}
              >
                Half-Day
              </EText>
            </TouchableOpacity>
          </View> */}

<View style={[localStyles.textInputStyle, { backgroundColor: colors.inputBg, borderColor: colors.backgroundColor, minHeight: moderateScale(90) }]}>
  <TextInput
    placeholder="Reason"
    placeholderTextColor={colors.placeHolderColor}
    keyboardType="default"
    value={reason}
    multiline={true}  // Enables textarea behavior
    numberOfLines={4}
    style={{ color: colors.textColor, fontSize: moderateScale(16), flex: 1 }}
    autoCapitalize="none"
    onChangeText={onChangedReason}
  />
</View>
        </View>
      </ScrollView>
      <EButton
            type={'S16'}
            title={'Submit Request'}
            color={colors.white}
            onPress={onPressSubmit}
            containerStyle={localStyles.continueBtnStyle}
          />
    </View>
    </TouchableWithoutFeedback>
  );
};

export default RequestLeave;

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph25,
    ...styles.pv20,
  },
  space: {
    ...styles.pv10,
  },
  dropdownStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph25,
    ...styles.mv15,
  },
  continueBtnStyle: {
    ...styles.mb10,
    ...styles.mh15,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(10),
  },

  datePickerStyle: {
    flex: 1,
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },

  toggleButtonStyle: {
    flex: 1,
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: moderateScale(10),
  },

  textInputStyle: {
    height: getHeight(100),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph15,
    ...styles.pv10,
  },
});
