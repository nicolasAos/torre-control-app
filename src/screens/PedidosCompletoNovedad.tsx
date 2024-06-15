import React from 'react';
import {View, Text, Image} from 'react-native';
import {useEffect} from 'react';
import api from '../services/api';
import {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
// utils
import {Logger} from '../utils';

const PedidosCompletoNovedad = ({navigation}: any) => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    Logger.log('mount PedidosCompletosNovedad');
    const getPedidos = () => {
      api
        .post('pedidos-completos', {
          userId: navigation.state.params.dataUser.moto_id,
        })
        .then((response) => response.data)
        .then((data) => {
          if (navigation.state.params.namePed === 'Pedidos completos') {
            setPedidos(data.data.data.filter((item) => !item.novedadId));
          } else {
            setPedidos(data.data.data.filter((item) => item.novedadId));
          }
        })
        .catch((error) => {
          Logger.recordError(error);
        });
    };

    getPedidos();

    return () => {
      Logger.log('unmount PedidosCompletosNovedad');
    };
  }, []);

  function goToPhotosScreen(item: any) {
    Logger.log('goToPhotosScreen');
    navigation.navigate('PedidosAdminFotosScreen', {
      datosCompletos: item,
      datosUsuario: navigation.state.params.dataUser,
    });
  }

  function goToReportScreen(item: any) {
    Logger.log('goToReportScreen');
    navigation.navigate('NovedadReporteSacScreen', {
      remision: item.planilla,
      cliente: item.cliente,
      destinatario: item.destinatario,
      direccion: item.direccion,
      ejecutivo: item.nombre_ejec,
      telefono: item.telefono_eje,
      cajas: item.total_cajas,
      datosCompletos: item,
      userId: navigation.state.params.dataUser.moto_id,
      datosUsuario: navigation.state.params.dataUser,
    });
  }

  return (
    <View>
      <Text
        style={{
          backgroundColor: '#eee',
          color: 'black',
          paddingVertical: 6,
          fontWeight: 'bold',
        }}>
        {navigation.state.params.namePed}
      </Text>
      {pedidos &&
        pedidos.map((item: any) => {
          //console.log({item})
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
                alignItems: 'center',
              }}>
              <View style={{width: '78%'}}>
                <TouchableOpacity
                  disabled={
                    navigation.state.params.namePed === 'Pedidos completos'
                      ? false
                      : true
                  }
                  style={{backgroundColor: '#ccc', padding: 4}}
                  onPress={() => goToReportScreen(item)}>
                  <Text>Cliente: {item.cliente}</Text>
                  <Text>Remesa: {item.remesa}</Text>
                  <Text>Dirección: {item.direccion}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  width: '22%',
                }}>
                <Image
                  style={{width: 45, height: 45}}
                  source={require('../imgs/camera-icon.png')}
                />

                <View style={{position: 'absolute', zIndex: 10}}>
                  <TouchableOpacity onPress={() => goToPhotosScreen(item)}>
                    <View style={{width: 40, height: 40}} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default PedidosCompletoNovedad;
