import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

const Geolocation = () => {
  const [t] = useTranslation('geolocation');

  useEffect(() => {
    function authLocation() {
      Alert.alert(t('alert.title'), t('alert.message'), [
        {
          text: t('alert.buttons.no'),
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: t('alert.buttons.yes'),
        },
      ]);
    }

    return () => {
      console.log("Hello");
    };
  }, [t]);

  return <View />;
};

export {Geolocation};
