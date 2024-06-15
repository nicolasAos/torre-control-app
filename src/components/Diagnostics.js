import {Card} from './';
import {getDateAndHour} from '../configs/utils';
import {View, Dimensions, Text, StyleSheet, FlatList} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useEffect, useState} from 'react';
import SystemSetting from 'react-native-system-setting';
import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Diagnostics = () => {
  const [battery, setBattery] = useState(0);
  const [locationIsEnable, setLocationIsEnable] = useState(false);
  const [netIsConnected, setNetIsConnected] = useState(false);
  const [netType, setNetType] = useState('');
  const [wifiIsEnable, setWifiIsEnable] = useState(false);

  const [t, i18n] = useTranslation('diagnostics');

  useEffect(() => {
    async function fetchData() {
      const netInfo = await NetInfo.fetch();

      setBattery(await DeviceInfo.getBatteryLevel());
      setLocationIsEnable(await SystemSetting.isLocationEnabled());
      setNetIsConnected(netInfo.isConnected);
      setNetType(netInfo.type);
      setWifiIsEnable(await SystemSetting.isWifiEnabled());
    }

    fetchData();
  }, []);

  function renderItem() {
    const items = [
      {
        iconName: 'ios-wifi',
        textTitle: t('internet'),
        textDescription: netIsConnected
          ? `${t('internet-on')} (${netType})`
          : t('internet-off'),
        colorBackground: netIsConnected ? '#1fb6ff' : 'red',
      },
      {
        iconName: 'ios-pin',
        textTitle: t('gps'),
        textDescription: locationIsEnable ? t('gps-on') : t('gps-off'),
        colorBackground: locationIsEnable ? '#1fb6ff' : 'red',
      },
      {
        iconName: 'md-battery-charging',
        textTitle: t('battery'),
        textDescription: Math.round(battery * 100) + '%',
        colorBackground: battery < 0.5 ? 'red' : '#1fb6ff',
      },
      {
        iconName: 'ios-time',
        textTitle: t('clock'),
        textDescription: getDateAndHour(),
        colorBackground: '#1fb6ff',
      },
    ];

    return (
      <FlatList
        data={items}
        renderItem={renderItems}
        keyExtractor={(item) => item.textTitle}
      />
    );
  }

  function renderItems({item}, index) {
    return (
      <Card containerStyle={styles.cardContainerStyle} key={index}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.containerSignaling}>
            <View
              style={[
                styles.containerIcon,
                {backgroundColor: item.colorBackground},
              ]}>
              <Ionicons name={item.iconName} color={'white'} size={20} />
            </View>
          </View>
          <View style={styles.containerService}>
            <Text style={styles.titleService}>{item.textTitle}</Text>
            <Text style={styles.descriptionService}>
              {item.textDescription}
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  return <View style={styles.container}>{renderItem()}</View>;
};

export {Diagnostics};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  cardContainerStyle: {
    marginTop: 10,
    width: width / 1.3,
    alignSelf: 'center',
    height: 60,
    justifyContent: 'center',
    borderRadius: 2,
  },
  containerIcon: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  containerSignaling: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerService: {
    flex: 3,
  },
  titleService: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
