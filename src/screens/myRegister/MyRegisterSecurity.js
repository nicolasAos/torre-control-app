import React, {useRef, useState} from 'react';
import {connect} from 'react-redux';
import {View, Dimensions, ScrollView, StyleSheet} from 'react-native';
import {Button, TextInputPassword, Loading, Modal} from '../../components';
import {loginSelector} from '../../reducers/selectors';
import {alterPasswordDriverById} from '../../actions/driver';

const {width} = Dimensions.get('window');

const MyRegisterSecurity = (props) => {
  const [passwordMoment, setPasswordMoment] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordMomentTextInput = useRef();
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
        <TextInputPassword
          ref={passwordMomentTextInput}
          onSubmitEditing={() => passwordTextInput.current.focus()}
          onChangeText={(value) => setPasswordMoment(value)}
          containerStyle={[styles.textInputPassword, {marginBottom: 40}]}
          value={passwordMoment}
          placeholder="password"
          returnKeyType="next"
        />
        <TextInputPassword
          ref={passwordTextInput}
          onSubmitEditing={() => passwordConfirmTextInput.current.focus()}
          onChangeText={(value) => setPassword(value)}
          containerStyle={styles.textInputPassword}
          value={password}
          placeholder="new-password"
          returnKeyType="next"
        />
        <TextInputPassword
          ref={passwordConfirmTextInput}
          onSubmitEditing={() => {
            setLoading(true);
            submitAlterRegister();
          }}
          onChangeText={(value) => setPasswordConfirm(value)}
          value={passwordConfirm}
          placeholder="confirm-new-password"
        />
        <Button
          title="save"
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            setLoading(true);
            submitAlterRegister();
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  function submitAlterRegister() {
    props
      .dispatch(
        alterPasswordDriverById(
          props.login.moto_id,
          props.login.moto_senha,
          passwordMoment,
          password,
          passwordConfirm,
        ),
      )
      .then((data) => {
        setLoading(false);
        setTimeout(() => {
          setMessage(data.message);
          setShow(true);
        }, 500);
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
    <ScrollView style={styles.container}>
      <Loading show={loading} />
      {renderForm()}
      {renderModal()}
    </ScrollView>
  );
};

const mapStateToProps = (state, props) => {
  return {
    login: loginSelector(state, props),
  };
};

export default connect(mapStateToProps)(MyRegisterSecurity);

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
  buttonTitleStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
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
