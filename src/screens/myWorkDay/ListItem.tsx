import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {shadows} from '../../theme/shadow';

const ListItem = ({data, index, onPress}: any) => (
  <View style={styles.container}>
    <View>
      <Text>
        <Text style={styles.textTitle}>Horas Fuera de Servicio:</Text>
        <Text
          style={styles.textSubtitle}>{` ${data.horasFueraDeServicio}`}</Text>
      </Text>
      <Text>
        <Text style={styles.textTitle}>Horas Manejando:</Text>
        <Text style={styles.textSubtitle}>{` ${data.horasManejando}`}</Text>
      </Text>
      <Text>
        <Text style={styles.textTitle}>Horas en Servicio:</Text>
        <Text style={styles.textSubtitle}>{` ${data.horasEnServicio}`}</Text>
      </Text>
      <Text>
        <Text style={styles.textTitle}>Horas en Cabina:</Text>
        <Text style={styles.textSubtitle}>{` ${data.horasEnCabina}`}</Text>
      </Text>
    </View>
  </View>
);

export {ListItem};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    height: 130,
    borderRadius: 7,
    padding: 10,
    ...shadows.primary,
  },
  iconsArea: {
    padding: 2,
    width: 100,
    height: 70,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titlesArea: {},
  textTitle: {
    fontSize: 20,
    color: '#5d615d',
  },
  textSubtitle: {
    fontSize: 16,
    color: '#5d615d',
  },
});
