import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {useTranslation, Trans} from 'react-i18next';

const ScannerModal = ({isVisible, OnCloseModal, OnDoneModal, value}) => {
  const [t] = useTranslation('modal');
  const [description, setDescription] = useState('');

  if (!isVisible) {
    return null;
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 0.1}}></View>
            <View style={{flex: 0.8}}>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 20,
                }}>
                {t('textModal.title')}
              </Text>
            </View>
            <View style={{flex: 0.1}}>
              <TouchableOpacity onPress={OnCloseModal}>
                <Text style={{fontSize: 35, color: 'gray'}}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            onChangeText={(value) => {
              setDescription(value);
            }}
            multiline={true}
            style={styles.inputContainer}
            numberOfLines={10}
            value={description}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setDescription('');
            OnDoneModal(description);
          }}
          style={{width: '75%'}}>
          <View style={styles.redButton}>
            <Text style={styles.textButton}>{t('textModal.button')}</Text>
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
    width: '80%',
    height: 180,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 10,
  },
  redButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: global.COLOR_MAIN,
    marginVertical: 15,
  },
  textButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'gray',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
