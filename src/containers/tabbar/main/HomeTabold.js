// // Library Imports
// import {StyleSheet, View, Alert} from 'react-native';
// import React, {useState, useEffect, useCallback} from 'react';
// import {useSelector} from 'react-redux';
// import {FlashList} from '@shopify/flash-list';
// import filter from 'lodash.filter';
// import moment from 'moment';
// // Custom Imports
// import {styles, commonColor} from '../../../themes';
// import HomeHeader from '../../../components/homeComponent/HomeHeader';
// import SearchComponent from '../../../components/homeComponent/SearchComponent';
// import ProjectConfirmModal from '../../../components/models/ProjectConfirmModal';
// import CardData from './CardData';
// import strings from '../../../i18n/strings';
// import api from '../../../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Geolocation from '@react-native-community/geolocation';
// // import Home from './Home';

// export default function HomeTab({navigation}) {
//   const colors = useSelector(state => state.theme.theme);
//   // const userData = useSelector(state => state.user.userData);
//   const [currentInsertId, setCurrentInsertId] = useState(null);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [project, setProject] = useState();
//   const [isLoading, setIsLoading] = useState('');
//   const [error, setError] = useState('');
//   const [fullData, setFullData] = useState('');
//   const [searchProject, setSearchProject] = useState('');
//   const [selectedProject, setSelectedProject] = useState();
//   const [btnTextDay, setBtnTextDay] = useState(strings.daycheckIn);
//   const [btnTextNight, setBtnTextNight] = useState(strings.nightcheckIn);
//   const [headerTitle, setHeaderTitle] = useState(strings.confirmationIn);
//   const [lastClickedButton, setLastClickedButton] = useState('day');
//   const [isDayButtonVisible, setIsDayButtonVisible] = useState(true);
//   const [isNightButtonVisible, setIsNightButtonVisible] = useState(true);
//   const [user, setUserData] = useState();
//   const [insertedData, setInsertedData] = useState(null);
//   const [location, setLocation] = useState({latitude: 0, longitude: 0});

//   Geolocation.getCurrentPosition(data => {
//     setLocation({
//       latitude: data.coords.latitude,
//       longitude: data.coords.longitude,
//     });
//   });

//   const onPressModalClose = useCallback(() => {
//     setModalVisible(false);
//   }, [modalVisible]);
//   // const [checkOutdata, setCheckOutData] = useState();

//   const getUser = async () => {
//     let userData = await AsyncStorage.getItem('USER');
//     userData = JSON.parse(userData);
//     setUserData(userData);
//   };

//   const getProject = () => {
//     api
//       .get('/attendance/getProjects')
//       .then(res => {
//         setProject(res.data.data);
//         setFullData(res.data.data);
//         setIsLoading(false);
//       })
//       .catch(error => {
//         setError(error);
//         setIsLoading(false);
//       });
//   };

//   const insertAttendance = selectedProject => {
//     const project_id = selectedProject.project_id;
//     const staff_id = user.staff_id;
//     const employee_id = user.employee_id;
//     const currentDate = moment().format('DD-MM-YYYY');
//     const currentTime = moment().format('h:mm:ss a');
//     const day_checkIn_latitude = location.latitude;
//     const day_checkIn_longitude = location.longitude;
//     const night_checkIn_latitude = location.latitude;
//     const night_checkIn_longitude = location.longitude;

//     if (lastClickedButton === 'day') {
//       const user = {
//         date: currentDate,
//         project_id: project_id,
//         staff_id: staff_id,
//         employee_id: employee_id,
//         day_check_in_time: currentTime,
//         day_checkIn_latitude: day_checkIn_latitude,
//         day_checkIn_longitude: day_checkIn_longitude,
//       };

//       api
//         .post('/attendance/insertAppAttendance', user)
//         .then(({data}) => {
//           setCurrentInsertId(data.data.insertId);
//           setInsertedData(user);
//           Alert.alert('Day Attendance inserted successfully.');
//           navigation.navigate('TaskTab', {insertedData: user});
//         })
//         .catch(error => {
//           console.log('Error: ', error);
//           Alert.alert('Network connection error.');
//         });
//     } else if (lastClickedButton === 'night') {
//       const user = {
//         date: currentDate,
//         project_id: project_id,
//         staff_id: staff_id,
//         employee_id: employee_id,
//         night_check_In_time: currentTime,
//         night_checkIn_latitude: night_checkIn_latitude,
//         night_checkIn_longitude: night_checkIn_longitude,
//       };

//       api
//         .post('/attendance/insertAppAttendance', user)
//         .then(({data}) => {
//           setCurrentInsertId(data.data.insertId);
//           setInsertedData(user);
//           Alert.alert('Night Attendance inserted successfully.');
//           navigation.navigate('TaskTab', {insertedData: user});
//         })
//         .catch(() => {
//           Alert.alert('Network connection error.');
//         });
//     }
//   };

//   const checkOut = selectedProject => {
//     const currentTime = moment().format('h:mm:ss a');
//     const currentDate = moment().format('DD-MM-YYYY');
//     const day_checkOut_latitude = location.latitude;
//     const day_checkOut_longitude = location.longitude;
//     const night_checkOut_latitude = location.latitude;
//     const night_checkOut_longitude = location.longitude;

//     if (lastClickedButton === 'day') {
//       const user = {
//         day_check_out_time: currentTime,
//         date: currentDate,
//         project_id: selectedProject.project_id,
//         id: currentInsertId,
//         day_checkOut_latitude: day_checkOut_latitude,
//         day_checkOut_longitude: day_checkOut_longitude,
//       };
//       api
//         .post('/attendance/updateAppAttendance', user)
//         .then(() => {
//           Alert.alert('Day check-out time inserted successfully.');
//           setInsertedData(user);
//           navigation.navigate('TaskTab', {insertedData: user});
//         })
//         .catch(() => {
//           Alert.alert('Network connection error.');
//         });
//     } else if (lastClickedButton === 'night') {
//       const user = {
//         night_check_out_time: currentTime,
//         date: currentDate,
//         project_id: selectedProject.project_id,
//         id: currentInsertId,
//         night_checkOut_latitude: night_checkOut_latitude,
//         night_checkOut_longitude: night_checkOut_longitude,
//       };

//       api
//         .post('/attendance/updateAppAttendance', user)
//         .then(() => {
//           Alert.alert('Night check-out time inserted successfully.');
//           setInsertedData(user);
//           navigation.navigate('TaskTab', {insertedData: user});
//         })
//         .catch(() => {
//           Alert.alert('Network connection error.');
//         });
//     }
//   };

//   const onPress = (data, buttonType) => {
//     setModalVisible(true);
//     setSelectedProject(data);
//     setLastClickedButton(buttonType);

//     if (btnTextDay === strings.daycheckout) {
//       if (headerTitle === strings.confirmationIn) {
//         setHeaderTitle(strings.confirmationOut);
//       }
//     }

//     if (btnTextNight === strings.nightcheckout) {
//       if (headerTitle === strings.confirmationIn) {
//         setHeaderTitle(strings.confirmationOut);
//       }
//     }
//   };

//   const onPressYes = () => {
//     const singleData = [selectedProject];
//     setProject(singleData);

//     if (lastClickedButton === 'day') {
//       if (
//         btnTextDay === strings.daycheckIn &&
//         headerTitle === strings.confirmationIn
//       ) {
//         setBtnTextDay(strings.daycheckout);
//         setHeaderTitle(strings.confirmationOut);
//         setIsNightButtonVisible(false);
//         insertAttendance(selectedProject);
//       }
//       if (btnTextDay === strings.daycheckout) {
//         setBtnTextDay(strings.daycheckIn);
//         setHeaderTitle(strings.confirmationIn);
//         checkOut(selectedProject);
//         setIsNightButtonVisible(true);
//         setProject(fullData);
//       }
//     } else if (lastClickedButton === 'night') {
//       if (
//         btnTextNight === strings.nightcheckIn &&
//         headerTitle === strings.confirmationIn
//       ) {
//         setBtnTextNight(strings.nightcheckout);
//         setHeaderTitle(strings.confirmationOut);
//         setIsDayButtonVisible(false);
//         insertAttendance(selectedProject);
//       }
//       if (btnTextNight === strings.nightcheckout) {
//         setBtnTextNight(strings.nightcheckIn);
//         setHeaderTitle(strings.confirmationIn);
//         checkOut(selectedProject);
//         setIsDayButtonVisible(true);
//         setProject(fullData);
//       }
//     }

//     setModalVisible(false);
//   };

//   const onPressNo = () => {
//     setModalVisible(false);
//     setTimeout(() => {
//       navigation.goBack();
//     }, 500);
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     getProject();
//   }, [colors]);
//   useEffect(() => {
//     getUser();
//   }, []);

//   // Search Functionality Start
//   const handleSearch = query => {
//     setSearchProject(query);
//     const filteredData = filter(fullData, user => {
//       return contains(user, query);
//     });
//     setProject(filteredData);
//   };

//   const contains = ({title}, query) => {
//     if (title?.toLowerCase().includes(query.toLowerCase())) {
//       return true;
//     }
//     return false;
//   };

//   // Search Functionality End

//   const renderVerticalItem = ({item, index}) => {
//     return (
//       <>
//         <CardData
//           item={item}
//           isCompleted={false}
//           btnTextDay={btnTextDay}
//           btnTextNight={btnTextNight}
//           textColor={commonColor.primary5}
//           onPressBtnDay={() => onPress(item, 'day')}
//           onPressBtnNight={() => onPress(item, 'night')}
//           isDayButtonVisible={isDayButtonVisible}
//           isNightButtonVisible={isNightButtonVisible}
//           insertAttendance={insertAttendance}
//         />
//       </>
//     );
//   };

//   return (
//     <View style={[styles.flexGrow1, {backgroundColor: '#F5F5F5'}]}>
//       <View
//         style={{
//           backgroundColor: colors.backgroundColor3,
//           borderBottomRightRadius: 50,
//           borderBottomLeftRadius: 50,
//           ...styles.pb50,
//         }}>
//         <HomeHeader user={user} />

//         <SearchComponent
//           search={searchProject}
//           onSearchInput={handleSearch}
//           isLoading={isLoading}
//           error={error}
//         />
//       </View>

//       <View style={{flex: 1, marginTop: -40}}>
//         <FlashList
//           keyboardShouldPersistTaps="always"
//           data={project}
//           renderItem={renderVerticalItem}
//           keyExtractor={(item, index) => index.toString()}
//           estimatedItemSize={10}
//           contentContainerStyle={localStyles.contentContainerStyle}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>

//       <ProjectConfirmModal
//         visible={modalVisible}
//         onPressModalClose={onPressModalClose}
//         headerTitle={headerTitle}
//         subTitle={strings.cancelBookingSuccess}
//         btnText1={strings.yes}
//         btnText2={strings.no}
//         onPressBtn1={onPressYes}
//         onPressBtn2={onPressNo}
//         data={selectedProject}
//       />
//     </View>
//   );
// }

// const localStyles = StyleSheet.create({
//   contentContainerStyle: {
//     ...styles.ph20,
//     ...styles.pb20,
//   },
// });
