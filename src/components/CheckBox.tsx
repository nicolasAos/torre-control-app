import React from 'react';
import {View} from 'react-native';

import {SquareIcon, SquareCheckIcon} from '.';

interface Props {
  height: number;
  color: string;
  selected: boolean;
}

export default function CheckBox({height, color, selected}: Props) {
  if (selected) {
    return (
      <View>
        <SquareCheckIcon width={height} {...{height, color}} /> 
      </View>
    );
  } else {
    return (
      <View>
        <SquareIcon width={height} {...{height, color}} />
      </View>
    );
  }
}
