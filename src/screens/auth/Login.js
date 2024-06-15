import React, {useContext, useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Image,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  PermissionsAndroid,
  Alert,
  BackHandler,
} from 'react-native';
import {doLogin, loginHomolog, getToken} from '../../actions/login';
import {loginHomologSelector, loginSelector} from '../../reducers/selectors';
import DeviceInfo from 'react-native-device-info';
import {TextInputPassword, Modal, Loading, Button} from '../../components';
import CheckBox from 'react-native-check-box';
import TextInputMask from 'react-native-text-input-mask';
import {useTranslation} from 'react-i18next';
import {NavigationContext} from 'react-navigation';
import RNExitApp from 'react-native-exit-app';

const {width} = Dimensions.get('window');

const Login = () => {
  const {homolog} = useSelector((state) => ({
    homolog: loginHomologSelector(state),
  }));

  const dispatch = useDispatch();

  const navigation = useContext(NavigationContext);

  const [t] = useTranslation('screens');

  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHomolog, setShowHomolog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHomolog, setPasswordHomolog] = useState('');
  const [isHomolog, setIsHomolog] = useState(homolog);
  const [location, setLocation] = useState(false);

  const passwordTextInput = useRef();
  const homologPasswordTextInput = useRef();
  const cpfTextInput = useRef();

  useEffect(() => {
    getGlobalPermission();
  }, []);

  const getGlobalPermission = async () => {
    Alert.alert(
      'Aviso de Privacidad',
      'Al oprimir el botón aceptar confirmas lo siguiente:\n\n1. Ha leído y acepta los "Términos de uso" https://solistica.com/terminos-legales/mx/ y la "Política de privacidad" https://solistica.com/aviso-de-privacidad/ ("los Acuerdos"). El uso de los Servicios está sujeto a los Acuerdos e indica su consentimiento para ellos. Este resumen no pretende reemplazarlos. Está diseñado solo para fines prácticos.\n\n2. El uso de esta aplicación esta diseñada específicamente para empresas transportistas previamente registradas en Solistica SA de CV ("la Compañía"), lo que significa que la aplicación no esta enfocada a un usuario final residencial.\n\n3. El rastreo de ubicación en segundo plano solo esta habilitado cuando el usuario se encuentre correctamente ingresado dentro de la aplicación y cuente con un numero de viaje valido e iniciado, dicho viaje debe estar previamente generado por el área de operaciones de la Compañía, la ubicación en segundo plano también estara habilitado cuando exista en una jornada de trabajo activa (bitácora electrónica o plan de viaje).\n\n4. El rastreo de ubicación en segundo plano permite calcular el tiempo de llegada de un viaje a los destinos de entrega, así como el historico de eventos de la ruta, verificar los eventos de manejando y detenido para la bitácora electrónica y el seguimiento a ruta en el plan de viaje.\n\n5. Por la presente, usted confirma que todos los datos y el contenido ("el Contenido") que proporciona al Servicio son cedidos a la Compañía para usar, copiar, distribuir, crear trabajos derivados, mostrar públicamente y explotar de cualquier otra manera el Contenido, principalmente para fines de monitoreo y seguridad de el viaje en curso a entregar.',
      [
        {
          text: 'Rechazar',
          onPress: () => RNExitApp.exitApp(),
          style: 'cancel',
        },
        {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
      ],
    );
  };

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

  function verifyPasswordHomolog() {
    setLoading(false);

    if (passwordHomolog === global.PASSWORD_HOMOLOG) {
      setTimeout(() => {
        setShowHomolog(true);
        setPasswordHomolog('');
      }, 500);
    } else {
      setTimeout(() => {
        setShow(true);
        setMessage('login.incorrect-password');
        setPasswordHomolog('');
      }, 500);
    }
  }

  function renderModalHomolog() {
    return (
      <Modal
        isVisible={showHomolog}
        title="attention"
        body={
          <CheckBox
            style={styles.checkboxStyle}
            onClick={() => setIsHomolog(!isHomolog)}
            isChecked={isHomolog}
            rightText={t('modal.use-test-mode')}
          />
        }
        buttons={[
          {
            onPress: () => setShowHomolog(false),
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              setShowHomolog(false);
              dispatch(loginHomolog(isHomolog));
            },
            text: 'ok',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalPasswordHomolog() {
    return (
      <Modal
        isVisible={showPassword}
        title="enter-the-password"
        body={
          <TextInputPassword
            ref={homologPasswordTextInput}
            value={passwordHomolog}
            onChangeText={(value) => setPasswordHomolog(value)}
            onSubmitEditing={() => setLoading(false)}
            containerStyle={styles.containerStyle}
          />
        }
        buttons={[
          {
            onPress: () => {
              setShowPassword(false);
              setPasswordHomolog('');
            },
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              setShowPassword(false);

              setTimeout(() => {
                setLoading(true);
                verifyPasswordHomolog();
              }, 500);
            },
            text: 'ok',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderImage() {
    return (
      <TouchableOpacity
        style={styles.containerImage}
        onLongPress={() => setShowPassword(true)}>
        <Image
          resizeMode="contain"
          source={require('../../imgs/solistica-logo.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  }

  function renderForm() {
    return (
      <View style={styles.containerForm}>
        <TextInputMask
          refInput={cpfTextInput}
          onSubmitEditing={() => {
            passwordTextInput.current.focus();
          }}
          style={styles.textInputCpf}
          onChangeText={(formatted, value) => setCpf(value)}
          keyboardType="number-pad"
          mask={'[00000000000]'}
          value={cpf}
          placeholder={t('login.numbers-only')}
          returnKeyType="next"
        />
        <TextInputPassword
          ref={passwordTextInput}
          value={password}
          onChangeText={(value) => setPassword(value)}
          onSubmitEditing={() => {
            submitLogin();
          }}
        />
        <Button
          title="enter"
          titleStyle={styles.buttonTitleStyle}
          buttonStyle={styles.buttonStyle}
          onPress={() => {
            submitLogin();
          }}
        />
        <View
          style={{
            marginVertical: 8,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ResetPasswordScreen', {
                api: isHomolog,
              });
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                textDecorationLine: 'underline',
              }}>
              Recuperar contraseña
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View style={styles.containerFooter}>
        <View
          style={[styles.containerTextForms, styles.containerTextFormsHeight]}>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('registerStack')}>
            <Text style={styles.textForms}>{t('login.new-here')}</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('forgotStack')}>
            <Text style={styles.textForms}>{t('login.forgot-password')}</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.containerTextForms}>
          <Text style={styles.versionText}>Solistica {'\u00A9'} 2020</Text>
          <Text style={styles.versionText}>
            Torre de Control {DeviceInfo.getVersion()}
          </Text>
        </View>
      </View>
    );
  }

  async function submitLogin() {
    setLoading(true);
    // if (!location) {
    //   Alert.alert('Necesitamos permiso para acceder a su ubicación')
    //   setLoading(false)
    //   return
    // }
    getToken()
      .then(async () => {
        await dispatch(doLogin(cpf, password))
          .then((response) => {
            setLoading(false);
            navigation.navigate('App');
          })
          .catch((error) => {
            setMessage(error.message);
            setLoading(false);

            setTimeout(() => setShow(true), 500);
          });
      })
      .catch((error) => {
        setMessage(error.message);
        setLoading(false);

        setTimeout(() => setShow(true), 500);
      });
  }

  return (
    <ImageBackground
      source={require('../../imgs/background_torre.png')}
      style={styles.imageBackground}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="#d19968" barStyle="light-content" />
          <Loading show={loading} />
          {renderModalPasswordHomolog()}
          {renderModalHomolog()}
          {renderModal()}
          {renderImage()}
          {renderForm()}
          {renderFooter()}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    // backgroundColor: global.COLOR_MAIN,
  },
  containerImage: {
    marginTop: 100,
    width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  containerForm: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  containerFooter: {
    flex: 1,
    width,
    alignItems: 'center',
    paddingTop: 40,
    justifyContent: 'space-between',
    zIndex: 0,
  },
  image: {
    height: 180,
    width: width / 2,
  },
  textInputCpf: {
    width: width / 1.1,
    height: 60,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 50,
    paddingLeft: 20,
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 1.1,
    marginTop: 15,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  buttonTitleStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  containerTextForms: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerTextFormsHeight: {height: 50},
  textForms: {
    color: 'white',
    fontSize: 16,
  },
  containerStyle: {
    width: width / 1.5,
    height: 45,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 20,
    borderColor: '#666',
    borderWidth: 1,
  },
  versionText: {
    color: 'white',
  },
  checkboxStyle: {
    width: width / 2,
    height: 45,
    alignSelf: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  footerInfo: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
