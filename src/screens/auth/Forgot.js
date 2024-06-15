import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';
import {Button, Loading, Modal} from '../../components';
import {cpfConfirmResetPassword} from '../../actions/login';

import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Forgot = (props) => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const [t] = useTranslation('screens');

  const cpfTextInput = useRef();

  function renderModal() {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => {
              setMessage('');
              setShow(false);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderForm() {
    return (
      <View style={styles.containerForm}>
        <Text style={styles.text}>
          {t('reset-password.to-reset-your-password')}
        </Text>
        <TextInputMask
          refInput={cpfTextInput}
          style={styles.textInput}
          onSubmitEditing={() => {
            setLoading(true);
            submitForgot();
          }}
          onChangeText={(formatted, value) => setCpf(value)}
          keyboardType="number-pad"
          mask={'[000].[000].[000]-[00]'}
          value={cpf}
          placeholder="CPF"
        />
        <Button
          title="send"
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            setLoading(true);
            submitForgot();
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  function submitForgot() {
    props
      .dispatch(cpfConfirmResetPassword(cpf))
      .then(() => {
        setLoading(false);
        props.navigation.navigate('forgotTokenStack');
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          setMessage(error.message);
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

export default connect()(Forgot);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  containerForm: {
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
    marginBottom: 30,
    width: width / 1.1,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
