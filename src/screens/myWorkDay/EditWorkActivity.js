import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, SafeAreaView, StyleSheet, Image, Alert} from 'react-native';
import {
  State,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import {Button} from '../../components/Button';
import {shadows} from '../../theme/shadow';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReactNativePicker from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { StackRouter } from 'react-navigation';


const EditWorkActivity = (props) => {
  const dispatch = useDispatch();

  const [selectedValue, setSelectedValue] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [title, setTitle] = useState(null);
	const [hour, setHour] = useState();
	const [status, setStatus] = useState('new');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setHour(moment(date).format('HH:mm'));
    hideDatePicker();
  };
  // const handleDel = (index) => {
  //   dispatch({
  //     type: 'DEL_WORK_STATUS',
  //     payload: {
  //       key: ,
  //       title,
  //       body,
  //     },
  //   });
  // }
  // };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerPicker}>
        <ReactNativePicker
          placeholder={{
            label: 'Seleccione una actividad',
            value: null,
            color: 'black',
          }}
          selectedValue={title}
          onValueChange={(itemValue) => setTitle(itemValue)}
          items={[
            {label: 'Em Servicio', value: 'Em Servicio'},
            {label: 'Manejando', value: 'Manejando'},
            {label: 'Retorno Almoço', value: 'Retorno Almoço'},
            {label: 'Camarote', value: 'Camarote'},
            {label: 'Fuera de Serviço', value: 'Fuera de Serviço'},
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

      <View style={{width: '95%'}}>
        <TouchableOpacity style={styles.pickerHour} onPress={showDatePicker}>
          {!hour ? (
            <Text style={{fontSize: 20}}>Seleccionar hora</Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 20, paddingRight: 10}}>{hour}</Text>
              <FontAwesome
                name="check"
                color={global.COLOR_SUCCESS}
                size={40}
                style={{alignSelf: 'center'}}
              />
            </View>
          )}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          is24Hour={true}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <Button
        buttonStyle={styles.buttonStyle}
        title={'Salvar'}
        titleStyle={{fontSize: 25, color: 'white'}}
      />
      <Text>
        {title}
        {hour}
      </Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR_BACKGROUND,
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  containerPickerSelect: {
    paddingLeft: 15,
    margin: 10,
    backgroundColor: global.COLOR_WHITE_PLATINUM,
    width: '95%',
    ...shadows.primary,
    borderRadius: 50,
    height: 50,
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
  },
  pickerHour: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.COLOR_WHITE_PLATINUM,
    ...shadows.primary,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '95%',
    borderRadius: 50,
    ...shadows.primary,
  },
});

export default EditWorkActivity;
