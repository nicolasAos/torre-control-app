import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Colors} from '../styles';

interface Props {
  title: string;
  remesaID: string;
}

export default function RemissionHeader({title, remesaID}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.title}>
        <Text>{`${title}:`}</Text>
        <Text>{remesaID}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    padding: 4,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
