import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ButtonIcon, Modal, Button, Loading} from '.';
import {useDispatch, useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {loginSelector} from '../reducers/selectors';
import {alterDriverById} from '../actions/driver';
import {
  savePhotoPerfil,
  getPhotoPerfil,
  deletePhotoPerfil,
} from '../database/models/photoPerfil';
import {useTranslation} from 'react-i18next';
import ImageResizer from 'react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import {LOGIN_SUCCESS} from '../actions/types';

const PhotoPerfil = (props) => {
  const dispatch = useDispatch();
  const {login} = useSelector((state) => ({
    login: loginSelector(state),
  }));
  const [id, setId] = useState(0);
  const [photo, setPhoto] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [t] = useTranslation('photo-perfil');

  useEffect(() => {
    getPhotoPerfil(props.motoristaId).then((data) => {
      if (data.photoExists) {
        setId(data.id);
        setPhoto({
          data: data.photo,
        });
      }
    });
  }, [props.motoristaId]);

  function renderCamera() {
    const {motoristaId} = props;

    const options = {
      title: t('options.title'),
      cameraType: 'back',
      cancelButtonTitle: t('options.buttons.cancel'),
      takePhotoButtonTitle: t('options.buttons.take-photo'),
      chooseFromLibraryButtonTitle: t('options.buttons.from-library'),
      mediaType: 'photo',
      storageOptions: {
        cameraRoll: false,
        skipBackup: true,
      },
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const img = response.assets[0];
        console.log(img);
        ImageResizer.createResizedImage(img.uri, 480, 480, 'JPEG', 50, 0)
          .then((image) => {
            setPhoto({
              name: `avatar_${login.user_id}_${JSON.stringify(
                new Date(),
              )}.JPEG`,
              uri: image.uri,
              type: 'image/jpeg',
            });
          })
          .catch((err) => {
            Alert.alert(JSON.stringify(err));
          });
      }
    });
  }

  function renderPhoto() {
    return (
      <View style={styles.containerProfilePicture}>
        {photo !== '' && (
          <ImageBackground
            style={{
              width: '100%',
              height: '100%',
            }}
            source={{uri: photo.uri}}></ImageBackground>
        )}
        {photo == '' && (
          <ImageBackground
            style={{
              width: '100%',
              height: '100%',
            }}
            source={
              login.foto == null
                ? require('../imgs/placeholder.png')
                : {uri: login.foto}
            }></ImageBackground>
        )}
      </View>
    );
    /*
    if (photo !== '') {
      return (
        <TouchableOpacity onPress={() => setShow(true)}>
          <Image
            source={{uri: photo.uri}}
            style={styles.containerProfilePicture}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={renderCamera}>
          <Image
            source={require('../imgs/placeholder.png')}
            style={styles.containerProfilePicture}
           />
        </TouchableOpacity>
      );
    }
    */
  }

  function deletePhoto() {
    deletePhotoPerfil(props.motoristaId);
    setId(0);
    setPhoto('');
  }

  const sendPhotoToBackend = async () => {
    console.log(login, 'login');
    if (!photo) {
      return null;
    }
    setLoading(true);
    dispatch(
      alterDriverById(
        login.moto_id,
        login.apelido,
        login.moto_nome,
        login.moto_email,
        login.user_id,
        login.moto_tel,
        login.moto_senha,
        photo,
        login,
      ),
    )
      .then(() => {
        setLoading(false);
        setPhoto('');
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  function renderModal() {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText="delete-profile-photo"
        buttons={[
          {
            onPress: () => setShow(false),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              setShow(false);
              deletePhoto();
            },
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.photoContainer}>
      <Loading show={loading} />
      {renderModal()}
      {renderPhoto()}
      <View
        style={{
          width: 100,
          flexDirection: 'row',
          bottom: 10,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          {photo == '' && typeof photo !== 'object' && (
            <TouchableOpacity onPress={renderCamera}>
              <FontAwesome5 name="camera" size={22} color={global.COLOR_MAIN} />
            </TouchableOpacity>
          )}
          {photo !== '' && typeof photo == 'object' && (
            <TouchableOpacity onPress={sendPhotoToBackend}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#5bb762',
                }}>
                <FontAwesome5 name="check" size={19} color={'white'} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}>
          {photo !== '' && (
            <TouchableOpacity
              onPress={() => {
                setPhoto('');
              }}>
              <FontAwesome5 name="trash" size={22} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonIconStyle: {
    position: 'absolute',
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerProfilePicture: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    width: 130,
    borderRadius: 130,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden',
  },
});

export {PhotoPerfil};
