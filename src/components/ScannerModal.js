import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useTranslation, Trans} from 'react-i18next';

const ScannerModal = ({isVisible, scanCallback, OnCloseModal}) => {
  const [t] = useTranslation('buttons');

  if (!isVisible) {
    return null;
  }

  const onBarCodeRead = (e) => {
    scanCallback(e.data, e.type);
  };

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      onRequestClose={OnCloseModal}>
      <View style={styles.container}>
        <View style={styles.blackScreen} />
        <View style={styles.barScanerContainer}>
          <RNCamera
            onBarCodeRead={onBarCodeRead}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            OnCloseModal();
          }}
          style={{width: '75%'}}>
          <View style={styles.redButton}>
            <Text style={styles.textButton}>{t('cancel')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ScannerModal;

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
    width: '75%',
    height: '75%',
    overflow: 'hidden',
    borderRadius: 15,
  },
  redButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#FC3860',
    marginVertical: 15,
  },
  textButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
