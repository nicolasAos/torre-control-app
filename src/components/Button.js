import React from 'react';
import {Text, TouchableOpacity, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Button = (props) => {
  const {
    onPress,
    buttonStyle,
    titleStyle,
    title,
    disabled = false,
    badge,
    badgeStyle,
    badgeText,
    badgeTextStyle,
    LeftIcon
  } = props;

  const [t] = useTranslation('buttons');

  if (LeftIcon !== null && LeftIcon !== undefined) {
    return(
      <TouchableOpacity  
        onPress={onPress}
        style={[buttonStyle, {flexDirection: 'row'}]} disabled={disabled}
      >
        <View style={{flex: .25, alignItems: 'center', justifyContent: 'center' }}>
          <LeftIcon/>
        </View>
        <View style={{flex: .5}}>
          <Text style={titleStyle}>
            {t(title)}
          </Text>
        </View>
        <View style={{flex: .25}}>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle} disabled={disabled}>
      {badge && (
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>{t(badgeText)}</Text>
        </View>
      )}
      <Text style={titleStyle}>{t(title)}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string.isRequired,
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  badge: PropTypes.bool,
  badgeText: PropTypes.string,
  badgeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  badgeTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Button.defaultProps = {
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 1.5,
    borderRadius: 50,
  },
  titleStyle: {
    alignSelf: 'center',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  disabled: false,
  badge: false,
  badgeStyle: {
    position: 'absolute',
    backgroundColor: 'orange',
    borderRadius: 30, //50
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  badgeTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export {Button};