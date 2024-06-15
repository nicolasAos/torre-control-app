import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-share';

const NovedadReporteSac = ({navigation}) => {

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#eee',
          padding: 4,
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <Text style={{}}>Información Remisión:</Text>
        <Text>{navigation.state.params.remision}</Text>
      </View>
      <View>
        <Text>Cliente: {navigation.state.params.cliente}</Text>
        <Text>Destinatario: {navigation.state.params.destinatario}</Text>
        <Text>Dirección: {navigation.state.params.direccion}</Text>
        <Text>Ejecutivo: {navigation.state.params.ejecutivo}</Text>
        <Text>Teléfono Ejecutivo: {navigation.state.params.telefono}</Text>
        <Text>Hora: </Text>
        <Text>Cajas: {navigation.state.params.cajas}</Text>
      </View>
      <View
        style={{
          height: 5,
          backgroundColor: '#F2A71B',
          marginBottom: 20,
          marginTop: 4,
        }}></View>
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SACReportPedidosCompletosStack', {
              nf_id: navigation.state.params.datosCompletos.remesa,
              sacReport: false,
              sacMenu: 4,
              todosDatos: navigation.state.params.datosCompletos,
              userId: navigation.state.params.userId,
              datosUsuario: navigation.state.params.datosUsuario
            })
          }
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              backgroundColor: '#F2A71B',
              paddingHorizontal: 15,
              paddingVertical: 7,
              fontWeight: 'bold',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={require('../imgs/assistance.png')}
            />
            {'    '}Reporte SAC
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Text>{navigation.state.params.hola}</Text> */}
    </View>
  );
};

export default NovedadReporteSac;
