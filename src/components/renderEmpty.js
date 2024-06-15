import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {View, Text} from 'react-native';

const RenderEmpty = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
      }}>
      <FontAwesome5 name="cloud" size={80} color={global.COLOR_MAIN} />
      <Text
        style={{
          flex: 5,
          alignSelf: 'center',
          fontSize: 18,
          color: global.COLOR_MAIN,
        }}>
        There is not a items on Search
      </Text>
    </View>
  );
};

export default RenderEmpty;
