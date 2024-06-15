import React from 'react';
import ReactNativePicker from 'react-native-picker-select';

import {SelectComponent} from './styles';

const styleSelect = {
  textAlign: 'left',
  alignItems: 'center',
  width: '100%',
  height: 35,
  fontSize: 16,
  borderRadius: 8,
  color: 'black',
  fontWeight: '400',
  paddingTop: 5,
};

export function Select(props) {
  const {placeholder, data, value, onChange} = props;

  return (
    <SelectComponent>
      <ReactNativePicker
        selectedValue={value}
        value={value}
        items={data}
        onValueChange={(newValue) => onChange(newValue)}
        style={{
          inputIOS: styleSelect,
          inputAndroid: styleSelect,
        }}
        placeholder={placeholder}
        useNativeAndroidPickerStyle={false}
      />
    </SelectComponent>
  );
}
