import { View, Image, StyleSheet, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { styles } from '../../../themes';
import EHeader from '../../../components/common/EHeader';
import EText from '../../../components/common/EText';
import api from '../../../api/api';

const ViewHolidays = () => {
  const colors = useSelector(state => state.theme.theme);
  const [holiday, setHoliday] = useState();

  useEffect(() => {
    api
      .get('/setting/getholiday')
      .then(res => {
        setHoliday(res.data.data);
      })
      .catch(() => {
        alert('Network connection error.');
      });
  }, []);

  const renderHolidayItem = ({ item }) => {
    return <>
      <View style={HolidayStyles.list}>
        <EText
          type="b14"
          numberOfLines={1}
          color={colors.textcolor}
          style={{ textAlign: 'center', }}>
          {item?.holidayList}
        </EText>
        <EText
          type="b14"
          numberOfLines={1}
          color={colors.textcolor}
          style={{ textAlign: 'center', }}>
          {item?.code}
        </EText>
      </View>
    </>
  };

  return (
    <View style={{ flex: 1 }}>
      <EHeader title={'Holiday'} />
      <View>
        <Image
          style={HolidayStyles.Img}
          source={require('../../../assets/images/holidayList.jpg')}
        />
      </View>
      <View>
        <EText
          type="b20"
          numberOfLines={1}
          color={colors.textcolor}
          style={{ textAlign: 'center', ...styles.mv15 }}>
          Holiday List
        </EText>
      </View>
      <View style={HolidayStyles.header}>
        <EText
          type="b16"
          numberOfLines={1}
          color={colors.white}
          style={{ textAlign: 'center', ...styles.mv5 }}>
          Holiday
        </EText>
        <EText
          type="b16"
          numberOfLines={1}
          color={colors.white}
          style={{ textAlign: 'center', ...styles.mv5 }}>
          Date
        </EText>

      </View>
      <View style={HolidayStyles.flatlist}>
        <FlashList
          data={holiday}
          renderItem={renderHolidayItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ViewHolidays;

const HolidayStyles = StyleSheet.create({
  Img: {
    alignSelf: 'center',
    height: 200,
    resizeMode: 'stretch',
    width: '100%',
  },
  list: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    ...styles.pv10,
  },
  flatlist: {
    backgroundColor: '#FEE4D8',
    flex: 1,
    ...styles.mh20,
    ...styles.ph25,
    ...styles.pv10,
    ...styles.mb20,
  },
  header: {
    backgroundColor: '#FA7547',
    ...styles.mh20,
    ...styles.ph25,
    ...styles.pv10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
});
