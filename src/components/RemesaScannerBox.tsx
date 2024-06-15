import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

// components
import {MainButton} from '../components';
import ScannerModal from '../components/ScannerModal';
// styles
import {Colors} from '../styles';

interface Props {
  onPress: (val: string) => void;
}

export default function RemesaScannerBox({onPress}: Props) {
  const [value, setValue] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  function clearInput() {
    setValue('');
  }

  function sendValue() {
    if (value) onPress(value);
  }

  function onShowScanner() {
    setShowScanner((prev) => !prev);
  }

  function scannerCallback(data: string) {
    setValue(data);
    onShowScanner();
  }

  return (
    <View style={styles.mainGrap}>
      <View style={styles.scannerBox}>
        <View style={styles.header}>
          <Text style={styles.readLabel}>Leer Mercancia</Text>
          <MainButton onPress={clearInput} label={'limpiar cód'} small />
        </View>
        <View style={styles.textInputGrap}>
          <TextInput
            {...{value}}
            style={styles.textInput}
            placeholder={'Código'}
            onChangeText={(t) => setValue(t)}
          />
        </View>
        <View style={styles.bottomButtons}>
          <MainButton onPress={onShowScanner} label={'escaner camara'} />
          <MainButton onPress={sendValue} label={'procesar'} />
        </View>
      </View>
      <ScannerModal
        scanCallback={scannerCallback}
        isVisible={showScanner}
        OnCloseModal={onShowScanner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainGrap: {
    padding: 10,
  },
  scannerBox: {
    padding: 5,
    backgroundColor: Colors.blue,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  textInputGrap: {
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  textInput: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue,
  },
  readLabel: {
    color: 'white',
  },
  bottomButtons: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
