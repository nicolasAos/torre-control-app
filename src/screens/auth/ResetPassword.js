import React, {useRef, useState} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Loading, Modal, TextInputPassword} from '../../components';
import {StackActions} from 'react-navigation';
import {driverSelector} from '../../reducers/selectors';
import {resetPassword} from '../../actions/login';

import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const ResetPassword = (props) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const [t] = useTranslation('screens');

  const passwordTextInput = useRef();
  const passwordConfirmTextInput = useRef();

  function renderModal() {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: error
              ? () => {
                  setMessage('');
                  setShow(false);
                }
              : () => {
                  setMessage('');
                  setShow(false);

                  props.navigation.dispatch(StackActions.popToTop());
                },
            text: 'ok',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderForm() {
    return (
      <View style={styles.containerForm}>
        <Text style={styles.text}>{t('reset-token.reset-password-token')}</Text>
        <TextInputPassword
          ref={passwordTextInput}
          onSubmitEditing={() => passwordConfirmTextInput.current.focus()}
          onChangeText={(value) => setPassword(value)}
          containerStyle={styles.textInput}
          value={password}
          returnKeyType="next"
        />
        <TextInputPassword
          ref={passwordConfirmTextInput}
          onSubmitEditing={() => {
            setLoading(true);
            submitResetPassword();
          }}
          onChangeText={(value) => setPasswordConfirm(value)}
          value={passwordConfirm}
          containerStyle={styles.textInput}
          placeholder="confirm-password"
        />
        <Button
          title="confirm"
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            setLoading(true);
            submitResetPassword();
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  function submitResetPassword() {
    props
      .dispatch(resetPassword(props.driver.moto_id, password, passwordConfirm))
      .then((data) => {
        setLoading(false);

        setTimeout(() => {
          setError(false);
          setMessage(data.message);
          setShow(true);
        }, 500);
      })
      .catch((err) => {
        setLoading(false);

        setTimeout(() => {
          setError(true);
          setMessage(err.message);
          setShow(true);
        }, 500);
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Loading show={loading} />
      {renderModal()}
      {renderForm()}
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state, props) => {
  return {
    driver: driverSelector(state, props),
  };
};

export default connect(mapStateToProps)(ResetPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  containerForm: {
    marginTop: 20,
    alignItems: 'center',
  },
  textInput: {
    width: width / 1.1,
    height: 60,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 50,
    paddingLeft: 20,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 1.1,
    marginTop: 20,
    borderRadius: 50,
  },
  buttonTitleStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    width: width / 1.1,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
