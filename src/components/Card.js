import React from 'react';
import {View} from 'react-native';

const Card = (props) => {
  const {containerStyle} = props;
  return <View style={containerStyle}>{props.children}</View>;
};

export {Card};
