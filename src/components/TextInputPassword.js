import React, {useState} from 'react';
import {
  View,
  Dimensions,
  TextInput,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const TextInputPassword = React.forwardRef((props, refInput) => {
  const [show, setShow] = useState(false);

  const {containerStyle} = props;

  const [t] = useTranslation('text-input-password');

  return (
    <View style={containerStyle}>
      {renderInput()}
      {renderIcon()}
    </View>
  );

  function renderInput() {
    const {
      inputStyle,
      value,
      placeholder,
      returnKeyType,
      onSubmitEditing,
      onChangeText,
    } = props;

    return (
      <TextInput
        style={inputStyle}
        autoCapitalize="none"
        autoCorrect={false}
        ref={refInput}
        placeholder={t(placeholder)}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={!show}
      />
    );
  }

  function renderIcon() {
    return (
      <TouchableOpacity
        style={styles.containerIconStyle}
        onPress={() => {
          setShow(!show);

          if (Platform.OS === 'android') {
            const {current} = refInput;
            current.setNativeProps({
              text: props.value,
            });
            setTimeout(() => setLastPositionCursor(), 0);
          } else {
            setFirstPositionCursor();
            setLastPositionCursor();
          }
        }}>
        <FontAwesome5
          name={show ? 'eye' : 'eye-slash'}
          color={show ? '#000' : '#C7C7Cd'}
          size={20}
        />
      </TouchableOpacity>
    );
  }

  function focus() {
    const {current} = refInput;
    current.focus();
  }

  function setFirstPositionCursor() {
    const {current} = refInput;
    current.setNativeProps({
      selection: {
        start: 0,
        end: 0,
      },
    });
  }

  function setLastPositionCursor() {
    const {current} = refInput;
    current.setNativeProps({
      selection: {
        start: props.value.length,
        // end: this.props.value.length // comentei essa parte pois estava bugando no android, a barra se deslocava para a esquerda a cada novo caractere
      },
    });
  }
});

TextInputPassword.propTypes = {
  inputStyle: PropTypes.object,
  placeholder: PropTypes.string,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string.isRequired,
};

TextInputPassword.defaultProps = {
  inputStyle: {
    flex: 1,
    paddingRight: 70,
  },
  containerStyle: {
    width: width / 1.1,
    height: 60,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 20,
  },
  returnKeyType: 'done',
  placeholder: 'password',
};

export {TextInputPassword};

const styles = StyleSheet.create({
  containerIconStyle: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 35,
  },
});
