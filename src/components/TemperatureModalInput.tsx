import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

import {MainButton} from '../components';
import NativeCheckBox from '@react-native-community/checkbox';

// styles
import {Colors} from '../styles';
import {Logger} from '../utils';

interface Props {
  temp: string;
  observation: string;
  matrixID: string;
  _tempIsGlobal: boolean;
  callback: (temp: string, observacion: string, tempIsGlobal: boolean) => void;
}

export default function TemperatureModalInput({
  temp,
  callback,
  observation,
  matrixID,
  _tempIsGlobal,
}: Props) {
  const [localTemp, setLocalTemp] = useState(temp);
  const [localObervation, setLocalObervation] = useState(observation);
  const [tempCheck, setTempCheck] = useState(false);
  const [tempIsGlobal, setTempIsGloblal] = useState(_tempIsGlobal);

  const boxNumber = Number(matrixID.split('U')[1]);

  function onConfirm() {
    if (tempCheck && !localObervation) {
      Logger.log('add a obervation');
      return;
    }
    if (!tempCheck && !localTemp) {
      Logger.log('add a temperature');
      return;
    }

    callback(localTemp, localObervation, tempIsGlobal);
  }

  return (
    <View style={styles.mainGrap}>
      <Text style={{textAlign: 'center'}}>
        {boxNumber ? `Unidad #${boxNumber}` : ''}
      </Text>
      <View style={styles.tempInputGrap}>
        <Text>Temperatura</Text>
        <TextInput
          placeholder={'0.0'}
          style={styles.tempInput}
          keyboardType={'decimal-pad'}
          defaultValue={localTemp}
          onChangeText={(val) => setLocalTemp(val)}
        />
      </View>
      <View style={styles.leftGrap}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <NativeCheckBox
            value={tempCheck}
            onValueChange={() => {
              setTempCheck((val) => !val);
              setLocalTemp('0');
            }}
            color={Colors.blue}
            tintColors={{true: Colors.blue, false: Colors.blue}}
          />
          <Text style={{width: 100}}>No Tomar Temperatura</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <NativeCheckBox
            value={tempIsGlobal}
            onValueChange={() => {
              setTempIsGloblal((val) => !val);
            }}
            color={Colors.blue}
            tintColors={{true: Colors.blue, false: Colors.blue}}
          />
          <Text style={{width: 100}}>Temperatura Global</Text>
        </View>
      </View>

      <View style={styles.obervationGrap}>
        {tempCheck ? (
          <>
            <Text>Motivo no registra Temperatura</Text>
            <TextInput
              style={styles.observationInput}
              defaultValue={observation}
              onChangeText={(val) => setLocalObervation(val)}
              placeholder={'Ingrese el motivo'}
            />
          </>
        ) : null}
      </View>

      <View style={styles.leftGrap}>
        <MainButton type={'primary'} label={'confirmar'} onPress={onConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainGrap: {
    width: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    padding: 10,
    paddingBottom: 20,
  },
  leftGrap: {
    width: 150,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  obervationGrap: {
    marginVertical: 20,
  },
  tempInputGrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  tempInput: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue,
    fontSize: 16,
    padding: 0,
  },
  observationInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue,
    fontSize: 16,
    padding: 0,
    marginTop: 10,
    marginBottom: 10,
  },
});
