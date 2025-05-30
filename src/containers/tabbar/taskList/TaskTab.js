// Library Imports
import {StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import filter from 'lodash.filter';
import SearchComponent from '../../../components/homeComponent/SearchComponent';
// Custom Imports
import {styles} from '../../../themes';
import strings from '../../../i18n/strings';
import ListData from './ListData';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';

export default function TaskTab({route}) {
  const colors = useSelector(state => state.theme.theme);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullData, setFullData] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [extraData, setExtraData] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/attendance/getEmployeeData')
      .then(res => {
        setData(res.data.data);
        setFullData(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        alert('Network connection error.');
        setError(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (route.params && route.params.insertedData) {
      setData(prevData => [...prevData, route.params.insertedData]);

      api
        .get('/attendance/getEmployeeData')
        .then(res => {
          setData(res.data.data);
          setFullData(res.data.data);
          setIsLoading(false);
        })
        .catch(() => {
          alert('Network connection error.');
          setError(error);
          setIsLoading(false);
        });
    }
  }, [route.params]);

  useEffect(() => {
    setIsLoading(true);
    setExtraData(!extraData);
  }, [colors]);

  const handleSearch = query => {
    setSearchProject(query);
    const filteredData = filter(fullData, user => {
      return contains(user, query);
    });

    setData(filteredData);
  };

  const contains = ({title}, query) => {
    if (title?.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
    return false;
  };

  const renderVerticalItem = ({item, index}) => {
    return (
      <>
        <ListData item={item} />
      </>
    );
  };

  return (
    <View style={[styles.flexGrow1, {backgroundColor: '#F5F5F5'}]}>

      <View style={{ backgroundColor: colors.backgroundColor3}}>
        <EHeader title={strings.TaskList} />
        <SearchComponent
          search={searchProject}
          onSearchInput={handleSearch}
          isLoading={isLoading}
          error={error}
          style={{marginTop:-20}}
        />
      </View>

      <FlashList
        data={data}
        renderItem={renderVerticalItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={30}
        contentContainerStyle={localStyles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb10,
  },
});
