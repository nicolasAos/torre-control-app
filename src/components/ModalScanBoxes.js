import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useTranslation, Trans} from 'react-i18next';
import ModalScanner from './ScannerModal';

const ModalScanBoxes = ({isVisible, OnCloseModal, OnDoneAction, dataCte}) => {
  const [t] = useTranslation('modal');
  const [valueModal, setValueModal] = useState([]);
  const [scannerMode, setScannerMode] = useState(false);
  const [manualScanValue, setManualScanValue] = useState('');

  const doneModal = () => {
    OnDoneAction(valueModal);
    OnCloseModal();
  };

  if (!isVisible) {
    return null;
  }

  const onBarCodeRead = (code, type) => {
    if (valueModal.includes(code)) {
      Alert.alert('Esta caja ya fue escaneada con anterioridad');
    } else {
      const newArr = [...valueModal, code];
      setValueModal(newArr);
      setScannerMode(false);
    }
  };

  const scanManual = (value) => {
    let code = `${dataCte.network}U${dataCte.boxes}U${dataCte.city}`;
    code = code.toLowerCase();
  };

  if (scannerMode) {
    return (
      <ModalScanner
        isVisible={scannerMode}
        OnCloseModal={() => {
          setScannerMode(false);
        }}
        scanCallback={onBarCodeRead}
      />
    );
  }

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      onRequestClose={OnCloseModal}>
      <View style={styles.container}>
        <View style={styles.blackScreen} />
        <View style={styles.barScanerContainer}>
          <View style={styles.header}>
            <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>
              {t('modalScanQr.title')}
            </Text>
          </View>
          <View style={styles.body}>
            <Text>{t('modalScanQr.titleTwo')}</Text>
            <TextInput
              editable={false}
              value={valueModal.length.toString()}
              style={styles.inputText}
            />
            <Text>{t('modalScanQr.titleScanInput')}</Text>
            <TextInput
              editable={true}
              value={manualScanValue}
              style={styles.inputText}
            />
            <View style={styles.buttonsContainer}>
              <View style={{flex: 0.48}}>
                <TouchableOpacity onPress={doneModal} style={{width: '100%'}}>
                  <View
                    style={[
                      styles.buttons,
                      {backgroundColor: global.COLOR_TITLE_CARD},
                    ]}>
                    <Text style={styles.textButton}>
                      {t('modalScanQr.buttonLeft')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex: 0.04}} />
              <View style={{flex: 0.48}}>
                <TouchableOpacity
                  onPress={OnCloseModal}
                  style={{width: '100%'}}>
                  <View style={[styles.buttons, {backgroundColor: '#ff3362'}]}>
                    <Text style={styles.textButton}>
                      {t('modalScanQr.buttonRigth')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                OnDoneAction([]);
                OnCloseModal();
              }}
              style={{width: '100%'}}>
              <View
                style={[
                  styles.buttons,
                  {backgroundColor: global.COLOR_TITLE_CARD},
                ]}>
                <Text style={styles.textButton}>
                  {t('modalScanQr.bottomTitle')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setScannerMode(true);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#ff3362',
                  textDecorationLine: 'underline',
                  marginVertical: 3,
                }}>
                {t('modalScanQr.scanner')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalScanBoxes;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  blackScreen: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  barScanerContainer: {
    width: '80%',
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
  },
  textButton: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
    backgroundColor: global.COLOR_TITLE_CARD,
  },
  body: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  inputText: {
    width: '100%',
    padding: 5,
    marginVertical: 8,
    borderRadius: 2,
    borderWidth: 0.2,
    textAlign: 'center',
    color: 'black',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 8,
  },
});
