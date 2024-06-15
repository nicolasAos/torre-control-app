import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

// styles
import {Colors} from '../styles';
// types
import { BaseOrderInterface } from '../types';
// components
import NativeCheckBox from '@react-native-community/checkbox';

export interface RemesaBox {
  sent: boolean;
  remesaID: string;
  matrixID: string;
  boxNumber: number;
}

interface Props {
  box: RemesaBox;
  onPress: (val: string) => void;
  datosRemesa: BaseOrderInterface,
  navigation:any
  photoCallback: (matrixID:string)=> void;
}

export default function RemesaBox({box, onPress, navigation, datosRemesa, photoCallback}: Props) {
  const {sent, remesaID, boxNumber} = box;

  function sendBox() {
    onPress(box.matrixID);
  }

  function onPhoto() {
    photoCallback(box.matrixID)
    /*
    const datosCompletos = {
      planilla: datosRemesa.no_planilla,
      remesa: datosRemesa.nf_id,
      travel_Id: datosRemesa.rom_id,
      destination_Order: 2
    }
    navigation.navigate('PedidosAdminFotosScreen', {datosCompletos, fromScreen: 'remesaBoxesStack'})
    */
  }


  return (
    <View style={styles.remesaBox}>
      <View style={styles.leftGrap}>
        <TouchableOpacity {...{onPress: sendBox}} disabled={box.sent}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <NativeCheckBox
              value={sent}
              onValueChange={() => {}}
              color={Colors.blue}
              tintColors={{true: Colors.green, false: Colors.blue}}
            />
            <Text style={styles.remesaID}>{`${remesaID}`}</Text>
          </View>
        </TouchableOpacity>
        <Text>{`#${boxNumber}`}</Text>
      </View>
      <TouchableOpacity onPress={onPhoto}>
        <Image
          style={{width: 30, height: 30, marginRight: 10}}
          source={require('../imgs/camera-icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainGrap: {},
  remesaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray,
    margin: 2,
    padding: 5,
  },
  leftGrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remesaID: {
    color: Colors.blue,
    fontWeight: 'bold',
    marginRight: 20,
    marginLeft: 10,
  },
});
