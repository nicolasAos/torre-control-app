import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Button} from '../../components';
import {ListItem} from './ListItem';
import ReactNativePicker from 'react-native-picker-select';
import {useSelector, useDispatch} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {shadows} from '../../theme/shadow';
import moment from 'moment';
import ActionButton from 'react-native-action-button';

import {
  getJourneysOfOperator,
  getListJourneysOfOperator,
  postJourneysOfOperator,
} from '../../actions/jorneysOfOperator';
import {getDateBD} from '../../configs/utils';
// utils
import {Logger} from '../../utils';

const MyWorkDay = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [option, setOption] = useState(null);
  const [hour, setHour] = useState('');

  const {user_id} = useSelector(({login}: any) => login.content);

  const journeyOperatorTypes = useSelector(
    ({jorneyOfOperatorType}: any) => jorneyOfOperatorType.content,
  );

  const journeyOperator = useSelector(
    ({jorneyOfOperator}: any) => jorneyOfOperator.content,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    Logger.log(`mount MyWorkDay screen`);
    return () => {
      Logger.log(`unmount MyWorkDay screen`);
    };
  }, []);

  useEffect(() => {
    dispatch(getJourneysOfOperator());
    dispatch(getListJourneysOfOperator(user_id));
  }, [dispatch, user_id]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setHour(moment(date).format('DD:MM:YYYY HH:mm'));
    hideDatePicker();
  };

  const handleConfirmHourButtonn = () => {
    setHour(moment(getDateBD()).format('DD:MM:YYYY HH:mm'));
    hideDatePicker();
  };

  function onSave(){
    Logger.log(`on save operator journey`)
    if (!option || !hour) {
      return;
    }
    dispatch(postJourneysOfOperator({option, hour, user_id}));
    setOpenModal(false);
    setHour('');
    setOption(null);
  };

  const handleCancel = () => {
    Logger.log(`close modal`)
    setOption(null);
    setHour(null);
    setOpenModal(false);
  };
  const renderModal = (props?: any) => {
    return (
      <Modal title="Selecione" visible={openModal} animationType="slide">
        <View
          style={{
            marginLeft: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.areaTextINstructions}>
            <Text style={styles.textInstructions}>
              Hola conductor, mantenga su información de viaje actualizada
              durante el día.
            </Text>
          </View>
          <View style={styles.containerPicker}>
            <ReactNativePicker
              placeholder={{
                label: 'Seleccione una opción',
                value: null,
                color: 'black',
              }}
              selectedValue={option ? option.label : ''}
              onValueChange={(itemValue, index) =>
                setOption(
                  journeyOperatorTypes.filter(
                    (item) => item.oco_id === itemValue,
                  )[0],
                )
              }
              items={journeyOperatorTypes}
              style={{
                inputAndroid: {
                  paddingLeft: 50,
                  textAlign: 'center',
                  alignItems: 'center',
                  fontSize: 30,
                  //borderRadius: '20%',
                  color: '#000',
                  fontWeight: 'bold',
                  height: 30,
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

          <View style={styles.pickerDataArea}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                //backgroundColor: 'blue'
              }}>
              <Text style={{fontSize: 15, paddingRight: 10}}>
                {hour ? hour : 'Seleccionar hora'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleConfirmHourButtonn}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome name="clock-o" size={30} color={global.COLOR_MAIN} />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              is24Hour={true}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Button
              buttonStyle={[styles.buttonStyle, {backgroundColor: 'red'}]}
              title={'cancel'}
              titleStyle={{fontSize: 20, color: 'white'}}
              onPress={handleCancel}
            />
            <Button
              disabled={!hour || !option}
              buttonStyle={[
                styles.buttonStyle,
                {
                  backgroundColor:
                    !hour || !option ? '#aaa' : global.COLOR_MAIN,
                },
              ]}
              title={'save'}
              titleStyle={{fontSize: 20, color: 'white'}}
              onPress={onSave}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderList = () => {
    return (
      <View style={styles.containerList}>
        {journeyOperator && (
          <FlatList
            data={journeyOperator}
            renderItem={({item}) => <ListItem data={item} />}
            keyExtractor={(item) => item.id}
          />
        )}
        {!journeyOperator && (
          <View style={styles.textEmptyArea}>
            <Text style={styles.textInit}>
              ¡No hay tarea hoy! {'\n'} ¿Vamos a empezar?
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderButton = () => {
    return (
      <ActionButton buttonColor="#283484" onPress={() => setOpenModal(true)} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderList()}
      {renderModal()}
      {renderButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  containerList: {
    marginTop: 10,
    width: '95%',
    height: '90%',
  },
  textEmptyArea: {
    marginTop: 10,
    width: '95%',
    height: '90%',
    justifyContent: 'center',
  },
  textInit: {
    fontSize: 25,
    color: global.COLOR_MAIN,
    textAlign: 'center',
  },
  modalizeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textModalizeTitle: {
    padding: 10,
    marginTop: 10,
    fontSize: 25,
  },
  containerModal: {},
  containerPickerSelect: {
    paddingLeft: 15,
    margin: 10,
    backgroundColor: global.COLOR_WHITE_PLATINUM,
    width: '95%',
    ...shadows.primary,
    borderRadius: 50,
  },
  containerPicker: {
    width: '95%',
    paddingLeft: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: global.COLOR_WHITE_PLATINUM,
    ...shadows.primary,
    height: 40,
  },
  pickerDataArea: {
    flexDirection: 'row',
    width: '95%',
    paddingLeft: 10,
    borderRadius: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: global.COLOR_WHITE_PLATINUM,
    ...shadows.primary,
    height: 40,
  },
  pickerHour: {
    width: '50%',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'yellow',//global.COLOR_WHITE_PLATINUM,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: 40,
    borderRadius: 50,
    ...shadows.primary,
  },
  textTitle: {
    fontSize: 25,
    color: '#5d615d',
  },
  textSubtitle: {
    fontSize: 20,
    color: '#5d615d',
  },
  areaTextINstructions: {
    backgroundColor: global.COLOR_SECONDARY,
    width: '100%',
    padding: 10,
  },
  textInstructions: {
    textAlign: 'center',
    fontSize: 20,
    color: '#f0f0f0',
  },
});

export default MyWorkDay;
