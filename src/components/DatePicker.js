import React from 'react';
import {Text, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useTranslation} from 'react-i18next';
import i18n from '../locales';

const {width} = Dimensions.get('window');

const DatePicker = (props) => {
  const {
    onPress,
    onConfirm,
    onCancel,
    buttonStyle,
    titleStyle,
    placeholderStyle,
    date,
    placeholder,
    disabled,
    iconContainerStyle,
    isDatePickerVisible,
    maximumDate,
    mode,
    minimumDate,
  } = props;

  const [t, i18n] = useTranslation('date-picker');

  return (
    <View style={iconContainerStyle}>
      <Icon.Button
        onPress={onPress}
        backgroundColor="white"
        borderRadius={50}
        style={buttonStyle}
        disabled={disabled}
        name="calendar"
        color={global.COLOR_MAIN}
        size={18}>
        <Text style={[titleStyle, !date ? {color: 'gray'} : {}]}>
          {date ? date : t(placeholder)}
        </Text>
      </Icon.Button>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={new Date()}
        mode={mode}
        display="spinner"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </View>
  );
};

DatePicker.propTypes = {
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  date: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholderStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  iconContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isDatePickerVisible: PropTypes.bool.isRequired,
  maximumDate: PropTypes.Date,
  mode: PropTypes.string,
  minimumDate: PropTypes.Date,
};

DatePicker.defaultProps = {
  buttonStyle: {
    width: width / 1.1,
    height: 60,
    // marginBottom: 5,
    paddingLeft: 20,
    // justifyContent: 'center',
  },
  titleStyle: {
    fontSize: 14,
    color: 'black',
  },
  placeholderStyle: {
    color: 'lightgray',
  },
  disabled: false,
  iconContainerStyle: {
    marginBottom: 5,
  },
  isDatePickerVisible: false,
  mode: 'date',
};

export {DatePicker};
