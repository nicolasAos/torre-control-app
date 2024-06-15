import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import {ButtonIcon} from './';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import ImageResizer from 'react-native-image-resizer';
const options = {
  cameraType: 'back',
  mediaType: 'photo',
  allowsEditing: false,
  storageOptions: {
    quality: 0.5,
    cameraRoll: false,
    skipBackup: true,
  },
  saveToPhotos: false,
};

const Photo = (props) => {
  const [visible, setVisible] = useState(false);

  const [t] = useTranslation('photo');

  function renderHeader() {
    const {title, subTitle} = props;

    return (
      <View>
        <Text style={styles.titleStyle}>{t(title)}</Text>
        <Text style={styles.subTitleStyle}>{t(subTitle)}</Text>
      </View>
    );
  }

  function deleteFiles(pathFile = null) {
    if (!pathFile) {
      return;
    }

    return (
      RNFS.unlink(pathFile)
        .then(() => {
          console.log('FILE DELETED');
          RNFS.scanFile(pathFile)
            .then(() => {
              console.log('scanned');
            })
            .catch((err) => {
              console.log(err);
            });
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
          console.log(err.message);
        })
    );
  }

  async function renderCamera() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Torre de Control solicita permisos',
          message: '¿Desea Permitir el acceso a su camara?',
          buttonNeutral: 'Preguntame mas tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera(options, (response) => {
          if (response.didCancel) {
            return;
          }
          const img = response.assets[0];
          ImageResizer.createResizedImage(
            img.uri,
            1280,
            960,
            'PNG',
            100,
            0,
          ).then((image) => {
            props.setPath({
              name: image.name,
              uri: image.uri,
              type: 'image/png',
              evidence_type: 'reportesac',
            });
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  function renderPhoto() {
    if (props.uri !== '' && props.uri !== null) {
      return (
        <Image source={{uri: props.uri}} style={styles.containerStylePhoto} />
      );
    }
  }

  function renderButtonTake() {
    if (props.uri === '' || props.uri === null) {
      return (
        <ButtonIcon
          nameIcon="plus"
          colorIcon="white"
          sizeIcon={14}
          onPress={() => renderCamera()}
          buttonStyle={[
            styles.buttonIconStyle,
            {backgroundColor: global.COLOR_MAIN},
          ]}
        />
      );
    }
  }

  function renderButtonDelete() {
    if (props.uri !== '' && props.uri !== null) {
      return (
        <ButtonIcon
          nameIcon="trash"
          colorIcon="white"
          sizeIcon={14}
          onPress={() => props.delete('')}
          buttonStyle={[
            styles.buttonIconStyle,
            {borderColor: 'red', backgroundColor: 'red'},
          ]}
        />
      );
    }
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          props.uri === '' || props.uri === null
            ? renderCamera()
            : setVisible(true)
        }>
        <View style={styles.containerStyle}>
          {(props.uri === '' || props.uri === null) && (
            <FontAwesome5
              name="camera"
              color="grey"
              size={30}
              style={{height: 120, position: 'absolute'}}
            />
          )}
          {renderPhoto()}
          {renderHeader()}
        </View>
      </TouchableOpacity>
      {renderButtonTake()}
      {renderButtonDelete()}
    </View>
  );
};

Photo.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  subTitle: PropTypes.string,
  fileName: PropTypes.string,
};

Photo.defaultProps = {
  path: '',
};

const styles = StyleSheet.create({
  buttonIconStyle: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  titleStyle: {
    fontSize: 16,
    marginLeft: 5,
  },
  subTitleStyle: {
    fontSize: 12,
    marginLeft: 5,
  },
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  containerStylePhoto: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

export {Photo};
