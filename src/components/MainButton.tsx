import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

// styles
import { Colors } from '../styles';

const activeOpacity = 0.7;

interface MainButtonProps {
  onPress: () => void;
  label: string;
  small?: boolean;
  type?: 'default' | 'primary';
}

export default function MainButton({
  onPress,
  label,
  small,
  type = 'default',
}: MainButtonProps) {
  return (
    <TouchableOpacity
      style={[
        small ? styles.btnSmall : styles.btn,
        type === 'primary' ? { backgroundColor: Colors.blue } : undefined,
      ]}
      {...{ activeOpacity, onPress }}>
      <Text
        style={[
          styles.btnLabel,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.gray,
    borderRadius: 40,
    color: 'white',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 12,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: {
    backgroundColor: Colors.gray,
    borderRadius: 40,
    color: 'white',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 12,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    textTransform: 'uppercase',
    color: Colors.blue,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
