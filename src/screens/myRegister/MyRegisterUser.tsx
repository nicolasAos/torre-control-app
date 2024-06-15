import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  TextInput,
  Dimensions,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import {
  Button,
  Loading,
  Modal,
} from '../../components';
import {loginSelector} from '../../reducers/selectors';
import {alterDriverById} from '../../actions/driver';

import {withTranslation} from 'react-i18next';
//import i18n from '../../locales';
// utils
import {Logger} from '../../utils';

const {width} = Dimensions.get('window');

class MyRegisterUserClass extends Component {
  constructor(props:any) {
    super(props);
    this.state = {
      nickName: props.login.apelido,
      name: props.login.moto_nome,
      cpf: props.login.moto_cpf,
      phone: props.login.moto_tel,
      email: props.login.moto_email,
      show: false,
      message: '',
      loading: false,
      photoPerfil: '',
    };
  }

  componentDidMount(): void {
    Logger.log('mount MyRegisterUser screen');
  }

  componentWillUnmount(): void {
    Logger.log('unmount MyRegisterUser screen');
  }

  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.show}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () => this.setState({message: '', show: false}),
            text: 'ok',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderForm = () => {
    const {t} = this.props;

    return (
      <View style={styles.containerForm}>
        <TextInput
          ref={(input) => (this.nameTextInput = input)}
          onSubmitEditing={() => this.cpfTextInput.focus()}
          style={styles.textInputs}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          placeholder={t('menu.register.user-data.placeholder.name')}
          autoCapitalize="words"
          returnKeyType="next"
          editable={false}
        />
        {/* <TextInputMask
          refInput={(input) => (this.cpfTextInput = input)}
          onSubmitEditing={() => this.phoneTextInput.focus()}
          style={[styles.textInputs, styles.textInputDisabled]}
          onChangeText={(formatted, cpf) => this.setState({cpf})}
          keyboardType="number-pad"
          //mask={'[000].[000].[000]-[00]'}
          value={this.state.cpf}
          placeholder={t('menu.register.user-data.placeholder.cpf')}
          returnKeyType="next"
          //editable={false}
        /> */}
        <TextInputMask
          refInput={(input) => (this.phoneTextInput = input)}
          onSubmitEditing={() => this.emailTextInput.focus()}
          style={styles.textInputs}
          onChangeText={(formatted, phone) => this.setState({phone})}
          value={this.state.phone}
          mask={'[0000000000000000000]'}
          keyboardType="number-pad"
          placeholder={t('menu.register.user-data.placeholder.phone')}
          returnKeyType="next"
        />
        <TextInput
          ref={(input) => (this.emailTextInput = input)}
          onSubmitEditing={() =>
            this.setState({loading: true}, () => this.submitAlterRegister())
          }
          style={[styles.textInputs, styles.textInputDisabled]}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t('menu.register.user-data.placeholder.email')}
          returnKeyType="next"
          //editable={false}
        />
        <Button
          title="save"
          titleStyle={{
            alignSelf: 'center',
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold',
          }}
          onPress={() =>
            this.setState({loading: true}, () => this.submitAlterRegister())
          }
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  };

  submitAlterRegister = () => {
    const {nickName, name, cpf, phone, email} = this.state;
    Logger.log(`subit alter register`)
    //console.log(this.props.login);
    this.props
      .dispatch(
        alterDriverById(
          this.props.login.moto_id,
          nickName,
          this.props.login.moto_nome,
          email,
          this.props.login.user_id,
          phone,
          this.props.login.moto_senha,
          null,
          this.props.login,
        ),
      )
      .then((data:any) => {
        this.setState({loading: false, message: data.message});
        setTimeout(() => this.setState({show: true}), 500);
      })
      .catch((error:any) => {
        this.setState({message: error.message, loading: false});
        setTimeout(() => this.setState({show: true}), 500);
      });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={100}>
        <ScrollView>
          <Loading show={this.state.loading} />
          {this.renderForm()}
          {this.renderModal()}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    login: loginSelector(state, props),
  };
};
const MyRegisterUser = withTranslation('screens')(MyRegisterUserClass);
export default connect(mapStateToProps)(MyRegisterUser);

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
  //   textInputDisabled: {
  //     color: '#aaa',
  //   },
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
