import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

interface Props {
  height: number;
  width: number;
  color: string;
}

export default function Square({height, width, color}: Props) {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 448 512" fill="none">
        <Path
          d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
