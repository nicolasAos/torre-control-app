import React from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('window');

const ButtonIcon = (props) => {
  const {
    onPress,
    buttonStyle,
    iconContainerStyle,
    nameIcon,
    colorIcon,
    styleIcon,
    sizeIcon,
  } = props;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={iconContainerStyle}>
        <FontAwesome5
          name={nameIcon}
          color={colorIcon}
          size={sizeIcon}
          style={styleIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

ButtonIcon.propTypes = {
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  nameIcon: PropTypes.string,
  colorIcon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  styleIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sizeIcon: PropTypes.number,
};

ButtonIcon.defaultProps = {
  buttonStyle: {
    borderColor: global.COLOR_MAIN,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: width / 1.5,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 50,
  },
  iconContainerStyle: {
    alignSelf: 'center',
  },
  nameIcon: 'camera',
  colorIcon: global.COLOR_MAIN,
  sizeIcon: 18,
};

export {ButtonIcon};
