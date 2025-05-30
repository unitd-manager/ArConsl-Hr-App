import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import {styles} from '../../themes';
import TicketCardComponent from '../../components/ticketComponent/TicketCardComponent';
import {ProjectListData} from '../../api/constant';

export default function HomeListCard() {
  const renderVerticalItem = ({item, index}) => {
    return <TicketCardComponent item={item} key={index} />;
  };

  return (
    <FlashList
      data={ProjectListData}
      renderItem={renderVerticalItem}
      keyExtractor={(item, index) => index.toString()}
      estimatedItemSize={10}
      contentContainerStyle={localStyles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
});
