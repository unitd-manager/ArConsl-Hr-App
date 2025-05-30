import React from 'react';
import {FlashList} from '@shopify/flash-list';

// custom imports
import CardComponent from './CardComponent';
import {popularEventData} from '../../api/constant';

export default function FeaturedComponent() {
  const RenderItem = ({item}) => {
    return <CardComponent item={item} />;
  };

  return (
    <FlashList
      data={popularEventData}
      renderItem={RenderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      estimatedItemSize={10}
    />
  );
}
