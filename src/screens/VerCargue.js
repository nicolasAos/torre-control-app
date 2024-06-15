import React from 'react';
import {useState} from 'react';
import {View, Text, TextInput, Button, Dimensions, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ScannerModal from '../components/ScannerModal';
import {NavigationEvents} from 'react-navigation';
import {useEffect} from 'react';
import moment from 'moment';
import Modal from 'react-native-modal';
const {height, width} = Dimensions.get('window');
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

let dataCte = {};

function HomeScreen() {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#ddd',
        }}>
        <Text>Inf. Orden de Cargue</Text>
        <Text>{dataCte.nit}</Text>
      </View>
      <View style={{paddingHorizontal: 10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Ciente</Text>
          <Text>{dataCte.cliente}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Placa Vehículo</Text>
          <Text>{dataCte.placa}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            placeholder="Remesa/Estiba/Pedido"
            style={{
              borderBottomColor: '#000000',
              borderBottomWidth: 1,
              width: 250,
            }}
          />
          <Image
            style={{width: 25, height: 25}}
            source={require('../imgs/refresh_icon.png')}
          />
        </View>
      </View>
      <View
        style={{
          height: 5,
          backgroundColor: 'orange',
          marginVertical: 5,
        }}></View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#bbb',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text>{'Remesa'}</Text>
            <Text>
              Caja # {1} de {4}
            </Text>
          </View>
          <View>
            <Text>- Caja Remesa</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 35, height: 35}}
              source={require('../imgs/white_camera_icon..png')}
            />
            <Text style={{padding: 5}}>{0}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#ddd',
        }}>
        <Text>Inf. Orden de Cargue</Text>
        <Text>{dataCte.nit}</Text>
      </View>
      <View style={{paddingHorizontal: 10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Ciente</Text>
          <Text>{dataCte.cliente}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Placa Vehículo</Text>
          <Text>{dataCte.placa}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            placeholder="Remesa/Estiba/Pedido"
            style={{
              borderBottomColor: '#000000',
              borderBottomWidth: 1,
              width: 250,
            }}
          />
          <Image
            style={{width: 25, height: 25}}
            source={require('../imgs/refresh_icon.png')}
          />
        </View>
      </View>
      <View
        style={{
          height: 5,
          backgroundColor: 'orange',
          marginVertical: 5,
        }}></View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#bbb',
            justifyContent: 'space-between',
            paddingBottom: 7
          }}>
          <View>
            <Text>{'Remesa'}</Text>
          </View>
          <View>
            <Text>- Caja Remesa</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          </View>
        </View>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const VerCargue = ({navigation}) => {
  useEffect(() => {
    dataCte = navigation.state.params.dataCte;
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveBackgroundColor: global.COLOR_TITLE_CARD,
          tabBarLabelPosition: 'beside-icon',
          tabBarActiveTintColor: '#fff',
          headerShown: false,
          tabBarIconStyle: {display: 'none'},
          tabBarLabelStyle: {
            fontWeight: '700',
            fontSize: 15,
          },
        }}>
        <Tab.Screen name="DETALLADO" component={HomeScreen} />
        <Tab.Screen name="REMESAS" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default VerCargue;
