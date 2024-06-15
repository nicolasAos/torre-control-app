import React from 'react';
import {TouchableOpacity, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('window');

const DoubleButtonRedirecting = (props) => {
  const {
    onPressLeft,
    onPressRight,
    colorButtonLeft,
    colorButtonRight,
    buttonLeftStyle,
    buttonRightStyle,
    colorIconLeft,
    colorIconRight,
    iconLeft,
    iconRight,
    sizeButtons,
  } = props;

  return (
    <View style={{width: sizeButtons}}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={onPressLeft}
          style={[buttonLeftStyle, {backgroundColor: colorButtonLeft}]}>
          <FontAwesome5
            name={iconLeft}
            color={colorIconLeft}
            size={20}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressRight}
          style={[buttonRightStyle, {backgroundColor: colorButtonRight}]}>
          <FontAwesome5
            name={iconRight}
            color={colorIconRight}
            size={20}
            style={{alignSelf: 'center', justifyContent: 'center'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

DoubleButtonRedirecting.propTypes = {
  onPressLeft: PropTypes.func.isRequired,
  onPressRight: PropTypes.func.isRequired,
  colorButtonLeft: PropTypes.string,
  colorButtonRight: PropTypes.string,
  buttonLeftStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonRightStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  colorIconLeft: PropTypes.string,
  colorIconRight: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  sizeButtons: PropTypes.number,
};

DoubleButtonRedirecting.defaultProps = {
  buttonLeftStyle: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  buttonRightStyle: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  sizeButtons: width / 1.5,
  colorButtonLeft: 'green',
  colorButtonRight: global.COLOR_MAIN,
  colorIconLeft: 'white',
  colorIconRight: 'white',
  iconLeft: 'phone',
  iconRight: 'location-arrow',
};

export {DoubleButtonRedirecting};
