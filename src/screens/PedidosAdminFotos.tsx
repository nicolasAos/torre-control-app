import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Loading, Modal} from '../components';
import api from '../services/api';
import {Logger} from '../utils';
// utils

const PedidosAdminFotos = ({navigation}: any) => {
  useEffect(() => {
    Logger.log('mount PedidosAdminFotos');
    return () => {
      Logger.log('unmount PedidosAdminFotos');
    };
  }, []);

  const [newImage, setNewImage] = useState(false);
  const [datosCompletos, setDatosCompletos] = useState(
    navigation.state.params.datosCompletos,
  );
  const [modalNuevaImagen, setModalNuevaImagen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const agregarNuevaFoto = async () => {
    if (!newImage) return;
    const date = new Date();
    setModalLoading(true);
    const formSend = new FormData();
    formSend.append('planilla', datosCompletos.planilla);
    formSend.append('remesa', datosCompletos.remesa);
    formSend.append('travel_id', datosCompletos.travel_Id);
    formSend.append('destination_order', datosCompletos.destination_Order);
    formSend.append('nombre_archivo', newImage.name);
    formSend.append('imagen', newImage);
    formSend.append('tipo_archivo', 'PNG');
    formSend.append('fecha_registro', date.toISOString());
    formSend.append('movilidad_tipo_evidencia', '');
    formSend.append('clase_evidencia', newImage.type_evidence.toUpperCase());
    formSend.append('order_imagen', 1);
    formSend.append('referenciaFoto', '');

    const res = await api.post('recepcion-evidencias', formSend);
    setModalLoading(false);
    setModalNuevaImagen(true);
  };

  return (
    <View>
      <Loading show={modalLoading} />
      <Modal
        isVisible={modalNuevaImagen}
        title={''}
        bodyText={'Se añadió nueva imagen con éxito'}
        buttons={[
          {
            onPress: () => {
              setModalNuevaImagen(false);
              navigation.navigate('RemittancesStack');
            },
            text: 'accept',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
      <View
        style={{
          height: '83.5%',
          backgroundColor: 'black',
          justifyContent: 'center',
        }}>
        {newImage && (
          <Image
            style={{width, height: height / 2}}
            source={{uri: newImage.uri}}
          />
        )}
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#ccc',
            padding: 1,
            alignContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            launchCamera(
              {
                cameraType: 'back',
                mediaType: 'photo',
                allowsEditing: false,
                storageOptions: {
                  quality: 0.5,
                  cameraRoll: false,
                  skipBackup: true,
                },
                saveToPhotos: false,
              },
              (response) => {
                if (response.didCancel) return;
                const img = response.assets[0];
                ImageResizer.createResizedImage(
                  img.uri,
                  1120,
                  860,
                  'PNG',
                  100,
                  0,
                ).then((image) => {
                  setNewImage({
                    name: `nuevaImage_${image.name}`,
                    uri: image.uri,
                    type: 'image/png',
                    evidence_type: 'nueva_evidencia',
                    type_evidence: 'nueva_evidencia',
                  });
                });
              },
            );
          }}>
          <Image
            style={{width: 45, height: 45, marginVertical: 4}}
            source={require('../imgs/camera-icon.png')}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 5,
          backgroundColor: '#1f2b52',
          alignItems: 'center',
        }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{width: 15, height: 25}}
              source={require('../imgs/back-white.png')}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={agregarNuevaFoto}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../imgs/check-white.png')}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => setNewImage(false)}>
            <Image
              style={{width: 35, height: 35}}
              source={require('../imgs/close-white.png')}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FotosPedidoScreen', {
                datosCompletos: navigation.state.params.datosCompletos,
              });
            }}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../imgs/images-white.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

export default PedidosAdminFotos;
