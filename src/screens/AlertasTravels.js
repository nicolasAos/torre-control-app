import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {Button, Modal, Loading} from '../components';
import {StackActions} from 'react-navigation';
import ReactNativePicker from 'react-native-picker-select';
import {useSelector} from 'react-redux';
import {shadows} from '../theme/shadow';

const AlertasTravels = (props) => {
  const [novedad, setNovedad] = useState('');
  const romId = props.navigation.getParam('romId', '');
  const [show, setShow] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [loading, setLoading] = useState(false);
  const {moto_nome, moto_tel, user_id} = useSelector(
    ({login}) => login.content,
  );

  const sendResgister = () => {
    setLoading(true);
    setShow(false);
    setShowFinish(true)
  };

  const renderLoading = () => {
    return <Loading show={loading} />;
  };
  const renderButtonSend = () => {
    return (
      <Button
        title="Enviar Novedad"
        titleStyle={{
          alignSelf: 'center',
          fontSize: 20,
          color: 'white',
          fontWeight: 'bold',
        }}
        onPress={() => setShow(true)}
        buttonStyle={styles.buttonStyle}
      />
    );
  };
  const renderModal = () => {
    return (
      <Modal
        isVisible={show}
        title="Attention"
        bodyText="confirmar el envío del evento?"
        buttons={[
          {
            onPress: () => setShow(false),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => sendResgister(),
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };
  const renderPickerSelect = () => {
    return (
      <View style={styles.containeirPicker}>
        <ReactNativePicker
          placeholder={{
            label: 'Seleccione la ocurrencia',
            value: null,
            color: 'black',
          }}
          selectedValue={novedad}
          onValueChange={(itemValue) => setNovedad(itemValue)}
          items={[
            {label: 'Reporte de accidente', value: 1},
            {label: 'Reporte de varada o falla mecánica', value: 2},
            {
              label: 'Reporte de alta congestión vehicular o cierre vial',
              value: 3,
            },
            {label: 'Reporte de robo', value: 4},
            {label: 'Reporte de novedad con la carga', value: 5},
            {label: 'Otro', value: 6},
          ]}
          style={{
            inputAndroid: {
              paddingLeft: 50,
              textAlign: 'center',
              alignItems: 'center',
              fontSize: 30,
              borderRadius: '20%',
              color: '#000',
              fontWeight: 'bold',
              height: 50
            },
            inputIOS: {
              textAlign: 'center',
              alignItems: 'center',
              color: '#000',
              fontWeight: 'bold',
            },
          }}
        />
      </View>
    );
  };
  const renderAreaText = () => {
    return (
      <View style={styles.containerText}>
        <Text style={styles.textTitle}>Viaje:</Text>
        <Text style={styles.textItem}>{romId}</Text>
      </View>
    );
  };
  const renderModalSendFinish = () => {
    return (
      <Modal
        isVisible={showFinish}
        title="Attention"
        bodyText="¡Ocurrencia enviada con éxito!"
        buttons={[
          {
            onPress: () => props.navigation.dispatch(StackActions.pop()),
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {renderAreaText()}
      {renderPickerSelect()}
      {renderButtonSend()}
      {renderLoading()}
      {renderModal()}
      {renderModalSendFinish()}
    </SafeAreaView>
  );
};
export default AlertasTravels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  containeirPicker: {
    width: '95%',
    paddingLeft: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: global.COLOR_WHITE_PLATINUM,
    ...shadows.primary,
  },
  containerText: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 120,
    width: '100%'
  },
  textTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  textItem: {
    fontSize: 25,
  },
});
