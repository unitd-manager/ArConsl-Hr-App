import {Image, StyleSheet, TouchableOpacity, View,Alert, Text} from 'react-native';
import React, {createRef,useState,useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
// custom imports
import {styles} from '../../themes';
import EText from '../common/EText';
import {moderateScale} from '../../common/constants';
import LogOut from '../models/LogOut';
import ProfilePicture from '../models/ProfilePicture';
import images from '../../assets/images';
import {EditDark, EditLight} from '../../assets/svgs';


function HomeHeader({user}) {

  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const [selectImage, setSelectImage] = useState('');

  const LogOutSheetRef = createRef();
  const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();
  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();
  const ProfilePictureSheetRef = createRef();

  useEffect(() => {
    ProfilePictureSheetRef?.current?.hide();
  }, [selectImage]);


  const onPressCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setSelectImage(image);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(images => {
      console.log("images",images)
      setSelectImage(images);
    });
  };

  useEffect(() => {
    if (selectImage && selectImage.path) {
      onPressUpdate();
    }
  }, [selectImage]);

  const onPressUpdate = async () => {

    if (!selectImage || !selectImage.path) {
      return; 
    }

    const formData = new FormData();

    formData.append("room_name", "App");
    formData.append('files', {
      type:selectImage.mime,
      uri: selectImage.path,
      name: selectImage.path.replace(/^(file:\/\/)/, ''),
    });
    
    try {
      const res = await fetch('http://43.228.126.245:3001/file/uploadFiles', {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: "application/json"
        },
      });

      let responseJson = await res.json();

      console.log("responseJson",responseJson)
      if (responseJson.message == "success") {
        Alert.alert("Profile picture updated Successful");
      }else{
        Alert.alert("Something went wrong, please try again");
      }
    } catch (error) {
      console.log(error.message);
    }  

};

  return (
    <View>
       <View style={localStyles.headerContainer}>            
        <View style={localStyles.textContainer}>
          <EText type="m16" numberOfLines={1} color={colors.textColor}>
            Hi {user && user.first_name}
          </EText>
          <EText type="B20" numberOfLines={1} color={colors.textColor}>
           Welcome Back
          </EText>
        </View>

        <TouchableOpacity
          onPress={onPressLogOutBtn}
          style={[
            localStyles.notificationContainer,
            {borderColor: colors.dark ? colors.grayScale8 : colors.grayScale3},
          ]}>
          <Ionicons
            name={'log-out-outline'}
            size={moderateScale(28)}
            color={colors.textRevertColor}
            style={{backgroundColor:colors.backgroundColor,padding:5,borderRadius:50}}
          /> 
        </TouchableOpacity>
        <LogOut SheetRef={LogOutSheetRef} navigation={navigation} />

      <ProfilePicture
        onPressCamera={onPressCamera}
        onPressGallery={onPressGallery}
        SheetRef={ProfilePictureSheetRef}
      />

    </View>
    </View>
   
  );
}

export default React.memo(HomeHeader);

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.flex,
    ...styles.mt15,
   flex:0,
   marginBottom:20,
  },
  userImageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  textContainer: {
    ...styles.mh10,
    ...styles.flex,
  },
  notificationContainer: {
    ...styles.center,
    ...styles.ph10,
    ...styles.pv10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
