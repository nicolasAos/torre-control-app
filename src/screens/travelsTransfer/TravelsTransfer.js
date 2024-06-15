import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Button, Modal} from '../../components';
import {travelTranfer} from '../../actions/travelsTranfer';
import {useSelector} from 'react-redux';
import {NavigationContext} from 'react-navigation';

import {useTranslation} from 'react-i18next';

const TravelsTranfers = () => {
  const [t] = useTranslation('screens');

  const [planilla, setPlanilla] = useState('');
  const [remessa, setRemessa] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const {user_id} = useSelector(({login}) => login.content);
  const currentTravel = useSelector(({currentTrip}) => currentTrip.content);

  const navigation = useContext(NavigationContext);

  const sendTravelsTranfers = async () => {
    if (remessa && planilla) {
      setMessage(t('travels-tranfer.just-an-option'));
      setShow(true);
    } else if (!remessa && !planilla) {
      setMessage(t('travels-tranfer.consignment-or-planillla'));
      setShow(true);
    } else {
      travelTranfer(planilla, remessa, user_id, currentTravel)
        .then((data) => {
          setMessage(t('travels-tranfer.send-sucess'));
          setShow(true);
          setPlanilla('');
          setRemessa('');
          setTimeout(() => navigation.navigate('homeStack'), 2000);
        })
        .catch((error) => {
          setMessage(t(`travels-tranfer.send-error ${error}`));
          setShow(true);
        });
    }
  };

  const modalOpen = () => {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => {
              setShow(false);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {modalOpen()}
      <View style={styles.areaText}>
        <Text style={styles.textWarn}>
          {t('travels-tranfer.consignment-or-planillla')}
        </Text>
      </View>
      <TextInput
        value={planilla}
        onChangeText={(t) => setPlanilla(t)}
        style={styles.inputs}
        placeholder="Planillha"
        keyboardType="numeric"
      />
      <TextInput
        value={remessa}
        onChangeText={(t) => setRemessa(t)}
        style={styles.inputs}
        placeholder="Remessa"
        keyboardType="numeric"
      />
      <Button
        onPress={() => sendTravelsTranfers()}
        title="send"
        buttonStyle={styles.buttonStyle}
      />
    </SafeAreaView>
  );
};

export default TravelsTranfers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR_BACKGROUND,
  },
  areaText: {
    width: '100%',
    height: 50,
    backgroundColor: global.COLOR_TOOLBAR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWarn: {
    color: 'white',
    fontSize: 17,
  },
  inputs: {
    backgroundColor: '#eee',
    width: '90%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 50,
    paddingLeft: 15,
    elevation: 2,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    height: 50,
    width: '90%',
    marginTop: 20,
    borderRadius: 50,
    elevation: 2,
  },
});
