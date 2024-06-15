import React, {useRef, useState} from 'react';
import {
  View,
  TextInput,
  Dimensions,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Button,
  TextInputPassword,
  Loading,
  Modal,
  PhotoPerfil,
} from '../../components';
import {StackActions} from 'react-navigation';
import TextInputMask from 'react-native-text-input-mask';
import {createDriver} from '../../actions/login';

import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Register = (props) => {
  const [nickName, setNickName] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [photoPerfil, setPhotoPerfil] = useState('');

  const [t] = useTranslation('screens');

  const nickNameTextInput = useRef();
  const nameTextInput = useRef();
  const emailTextInput = useRef();
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
            onPress: isError
              ? () => {
                  setMessage('');
                  setShow(false);
                }
              : () => {
                  setMessage('');
                  setShow(false);
                  props.navigation.dispatch(StackActions.pop());
                },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderPhoto() {
    return (
      <PhotoPerfil
        path={photoPerfil}
        setPath={(value) => setPhotoPerfil(value)}
        delete={(value) => setPhotoPerfil(value)}
      />
    );
  }

  function renderForm() {
    let cpfTextInput;
    let phoneTextInput;

    return (
      <View style={styles.containerForm}>
        <TextInput
          ref={nickNameTextInput}
          onSubmitEditing={() => nameTextInput.current.focus()}
          style={styles.textInputs}
          onChangeText={(value) => setNickName(value)}
          value={nickName}
          placeholder={t('register.nickname')}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInput
          ref={nameTextInput}
          onSubmitEditing={() => cpfTextInput.focus()}
          style={styles.textInputs}
          onChangeText={(value) => setName(value)}
          value={name}
          placeholder={t('register.name')}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInputMask
          refInput={(input) => (cpfTextInput = input)}
          onSubmitEditing={() => phoneTextInput.focus()}
          style={styles.textInputs}
          onChangeText={(formatted, value) => setCpf(value)}
          keyboardType="number-pad"
          mask={'[000].[000].[000]-[00]'}
          value={cpf}
          placeholder={t('register.cpf')}
          returnKeyType="next"
        />
        <TextInputMask
          refInput={(input) => (phoneTextInput = input)}
          onSubmitEditing={() => emailTextInput.current.focus()}
          style={styles.textInputs}
          onChangeText={(formatted, value) => setPhone(value)}
          value={phone}
          mask={'([00]) [00000]-[0000]'}
          keyboardType="number-pad"
          placeholder={t('register.cell-phone')}
          returnKeyType="next"
        />
        <TextInput
          ref={emailTextInput}
          onSubmitEditing={() => passwordTextInput.current.focus()}
          style={styles.textInputs}
          onChangeText={(value) => setEmail(value)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t('register.email')}
          returnKeyType="next"
        />
        <TextInputPassword
          ref={passwordTextInput}
          onSubmitEditing={() => passwordConfirmTextInput.current.focus()}
          onChangeText={(value) => setPassword(value)}
          containerStyle={styles.textInputPassword}
          value={password}
          returnKeyType="next"
        />
        <TextInputPassword
          ref={passwordConfirmTextInput}
          onSubmitEditing={() => {
            setLoading(true);
            submitCreateDriver();
          }}
          onChangeText={(value) => setPasswordConfirm}
          value={passwordConfirm}
          placeholder="confirm-password"
        />
        <Button
          title="register"
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            setLoading(true);
            submitCreateDriver();
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  function submitCreateDriver() {
    createDriver(nickName, name, email, password, cpf, phone, passwordConfirm)
      .then((data) => {
        setLoading(false);

        setTimeout(() => {
          setIsError(false);
          setMessage(data.message);
          setShow(true);
        }, 500);
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          setIsError(true);
          setMessage(error.message);
          setShow(true);
        }, 500);
      });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled
      keyboardVerticalOffset={100}>
      <ScrollView>
        <Loading show={loading} />
        {renderModal()}
        {renderPhoto()}
        {renderForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR_BACKGROUND,
  },
  containerForm: {
    marginTop: 20,
    alignItems: 'center',
  },
  textInputs: {
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
    marginVertical: 20,
    borderRadius: 50,
  },
  buttonTitleStyle: {
    alignSelf: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  containerProfilePicture: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 50,
    backgroundColor: '#000',
  },
  textInputPassword: {
    width: width / 1.1,
    height: 60,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 20,
    marginBottom: 10,
  },
});
