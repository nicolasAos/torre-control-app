import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getToken} from '../../actions/login';
import {loginSelector} from '../../reducers/selectors';
import {useDispatch, useSelector} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {useTranslation} from 'react-i18next';
import {NavigationContext} from 'react-navigation';
import {getMe} from '../../actions/driver';
import {LOGIN_SUCCESS} from '../../actions/types';
//import {deleteCtesSupervisorProfile} from '../../database/models/invoice';
// utils
import {Logger} from '../../utils';

let timeout: ReturnType<typeof setTimeout>;

export default function AuthLoading() {
  const {login} = useSelector((state) => ({
    login: loginSelector(state),
  }));

  const dispatch = useDispatch();

  const navigation = useContext(NavigationContext);

  const [visible, setVisible] = useState(false);

  const [t] = useTranslation('screens');

  useEffect(() => {
    Logger.log('mount AuthLoading screen');
    return () => {
      if (timeout) {
        Logger.log('clear timeout');
        clearTimeout(timeout);
      }
      Logger.log('unmount AuthLoading screen');
    };
  }, []);

  useEffect(() => {
    async function getLogin() {
      try {
        const value = (await AsyncStorage.getItem('LOGIN')) ?? '';
        const data = await JSON.parse(value);
        if (data && data.success) {
          getToken()
            .then(async () => {
              await getMe(data.data.moto_id).then(async (response) => {
                dispatch({type: LOGIN_SUCCESS, payload: response[0]});
                navigation.navigate('App');
              });
            })
            .catch(() => navigation.navigate('Auth'));
        } else {
          getToken();
          navigation.navigate('Auth');
        }
      } catch (error) {
        getToken();
        navigation.navigate('Auth');
      }
    }

    getLogin();

    timeout = setTimeout(() => {
      setVisible(true);
    }, 500);
  }, [login, dispatch, navigation]);

  if (visible) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Animatable.Image
          animation="pulse"
          easing="ease-in-back"
          iterationCount="infinite"
          source={require('../../imgs/em-transito-active.png')}
        />
        <Animatable.Text
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={styles.animatableTextStyle}>
          {t('auth.loading')}
        </Animatable.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  animatableTextStyle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
