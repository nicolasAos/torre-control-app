import React, {useRef, useState} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Loading, Modal} from '../../components';
import {driverSelector} from '../../reducers/selectors';
import {confirmToken} from '../../actions/login';

const {width} = Dimensions.get('window');

import {useTranslation} from 'react-i18next';

const ForgotToken = (props) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [t] = useTranslation('screens');

  const codeTextInput = useRef();

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
        <Text style={styles.text}>{t('token-verify.token')}</Text>
        <TextInput
          ref={codeTextInput}
          style={styles.textInput}
          onSubmitEditing={() => {
            setLoading(true);
            submitVerifyCode();
          }}
          onChangeText={(value) => setCode(value)}
          value={code}
          placeholder={t('token-verify.placeholder-token')}
        />
        <Button
          title="verify"
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            setLoading(true);
            submitVerifyCode();
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  function submitVerifyCode() {
    props
      .dispatch(confirmToken(props.driver.moto_id, code))
      .then(() => {
        setLoading(false);
        props.navigation.navigate('resetPasswordStack');
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

const mapStateToProps = (state, props) => {
  return {
    driver: driverSelector(state, props),
  };
};

export default connect(mapStateToProps)(ForgotToken);

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
    marginBottom: 30,
    width: width / 1.1,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
