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

const ModalValue = ({
  isVisible,
  OnCloseModal,
  OnDoneModal,
  icon,
  title,
  message,
  withClose,
}) => {
  const [t] = useTranslation('modal');
  const [description, setDescription] = useState('');

  if (!isVisible) {
    return null;
  }

  const renderIcon = () => {
    if (icon) {
      return icon();
    }
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: global.COLOR_MAIN,
              height: 40,
            }}>
            <View
              style={{
                flex: 0.2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {renderIcon()}
            </View>
            <View style={{flex: 0.6}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {title}
              </Text>
            </View>
            <View style={{flex: 0.2}}>
              {withClose && (
                <TouchableOpacity onPress={OnCloseModal}>
                  <Text
                    style={{fontSize: 35, color: 'white', fontWeight: 'bold'}}>
                    X
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{width: '100%', padding: 10}}>
            <Text
              style={{
                color: 'gray',
                fontSize: 12,
                marginVertical: 4,
              }}>
              {message}
            </Text>
            <TextInput
              keyboardType="numeric"
              onChangeText={(value) => {
                setDescription(value);
              }}
              style={styles.inputContainer}
              numberOfLines={1}
              value={description}
            />
            <TouchableOpacity
              onPress={() => {
                OnDoneModal(description);
                setDescription('');
              }}
              style={{width: '100%'}}>
              <View style={styles.redButton}>
                <Text style={styles.textButton}>{t('textModal.button')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalValue;

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
    height: 200,
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  redButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
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
    padding: 5,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'gray',
    justifyContent: 'flex-start',
  },
});
