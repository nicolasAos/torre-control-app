import React from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const ButtonRegion = (props) => {
  const {
    onPress,
    buttonStyle,
    title,
    titleStyle,
    colorTitleEnabled,
    colorTitleDisabled,
    container,
    enabled,
    colorButtonEnabled,
    colorButtonDisabled,
  } = props;

  const [t] = useTranslation('buttons');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        buttonStyle,
        {backgroundColor: enabled ? colorButtonEnabled : colorButtonDisabled},
      ]}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={container}>
          <Text
            style={[
              titleStyle,
              {color: enabled ? colorTitleEnabled : colorTitleDisabled},
            ]}>
            {t(title)}
          </Text>
          {enabled ? (
            <FontAwesome5 name="check" color="white" size={18} />
          ) : (
            <View />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

ButtonRegion.propTypes = {
  container: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  colorTitleEnabled: PropTypes.string.isRequired,
  colorTitleDisabled: PropTypes.string.isRequired,
  colorButtonEnabled: PropTypes.string.isRequired,
  colorButtonDisabled: PropTypes.string.isRequired,
};

ButtonRegion.defaultProps = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width / 4,
  },
  buttonStyle: {
    height: 45,
    borderRadius: 50,
    marginBottom: 10,
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 13,
  },
};

export {ButtonRegion};
