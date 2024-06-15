import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {Button, Photo, Modal, Loading} from '../components';
import {loginSelector, latlongSelector} from '../reducers/selectors';
import {getDateBD} from '../configs/utils';
import {sacReportTypesSelector} from '../reducers/selectors';
import {
  getNfsSupervisorOffline,
  sendEmptyRemission,
  sendEvidencias,
  getNovedades,
  sendEvidenceArr,
} from '../actions/driver';
import {withTranslation} from 'react-i18next';
const {width} = Dimensions.get('window');
import Geolocation from '@react-native-community/geolocation';
import CustomIconSelect from '../components/CustomIconSelect';
import {NavigationEvents} from 'react-navigation';
import {getCtesRemmitances} from '../actions/driver';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import generatePdf from '../utils/pdfGenerator';

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

const uriValues = [
  require('../imgs/reporte/No_Rotulo_7ea2d2b6976d4c4796f1cf4126da165f.png'),
  require('../imgs/reporte/Cerrado_b6166aae4b27409b831c2ee0545e3a96.png'),
  require('../imgs/reporte/Sobredimensionada_10871923481548548f2f92f2f43e01e4.png'),
  require('../imgs/reporte/Varios_631bd6998bc5431c82118ef2406a0f72.png'),
  require('../imgs/reporte/novisita.png'),
  require('../imgs/reporte/Sobrante_8d4aef7643674b4389698e38ab50afff.png'),
  require('../imgs/reporte/Troque_0cc881f1dc5841ef974c513fa1745b32.png'),
  require('../imgs/reporte/Demora_9375bdddfe3d4b44a38d4deb11c2fe07.png'),
  require('../imgs/reporte/Averia_349d19117fb743a1b297af178258ca4a.png'),
  require('../imgs/reporte/Faltante_2514ae96a3ff4c0688da63f6f14348b1.png'),
  require('../imgs/reporte/Cfrio_15c261ebbf674c71ae1ca760ba476054.png'),
  require('../imgs/reporte/No_Rotulo_7ea2d2b6976d4c4796f1cf4126da165f.png'),
  require('../imgs/reporte/RED_No_bf835bb4c16f44779c8b50a1f9af4ee0.png'),
  require('../imgs/reporte/No_Lista_ba7c01c2214a483a9d05b0ab00200c8d.png'),
];

class SACReportClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 0,
      loading: false,
      description: '',
      data: props.navigation.getParam('data', {}),
      nf_id: props.navigation.getParam('nf_id', ''),
      todosDatos: props.navigation.getParam('todosDatos', ''),
      show: false,
      showError: false,
      error: '',
      success: '',
      novedades: [],
      photos: [],
      selectedValue: 'Seleccione una incidencia',
      userId: props.navigation.getParam('userId', ''),
      datosUsuario: props.navigation.getParam('datosUsuario', '')
    };
    this.getNfs();
  }

  getNfs = () => {
    // console.log("NF_ID", this.state.nf_id);
    // getNfsSupervisorOffline(this.state.nf_id).then(
    //   async (data) => {
    //     console.log("Trae la info de NF_ID", data);
    //     this.setState({
    //       data: data,
    //     });
    //   },
    // );
    const objetoNuevo = {...this.state.todosDatos, nf_id: this.state.nf_id};
    this.setState({todosDatos: objetoNuevo});
  };

  getAllNovedades = () => {
    this.setState({loading: true});
    getNovedades(this.props.navigation.state.params.sacMenu).then(
      (response) => {
        const newArr = response.data.map((item, index) => {
          return {
            value: item.ID_ESTATUS,
            renderValue: item.ESTATUS,
            image: uriValues[index],
          };
        });
        const customValue = {
          value: '',
          renderValue: '',
          image: '',
        };
        newArr.push(customValue);
        this.setState({novedades: newArr});
      },
    );
    this.setState({loading: false});
  };

  handleDelete = (i) => {
    const photos = this.state.photos.filter((item, index) => index !== i);
    this.setState({photos: photos});
  };

  setSACReport = () => {
    const data = {
      ...this.state.todosDatos,
      nf_id: this.state.nf_id,
      no_planilla: this.state.todosDatos.planilla,
      rom_id: this.state.todosDatos.travel_Id,
      cte_ordem: this.state.todosDatos.destination_Order,
      ejecutivo: this.state.datosUsuario.moto_nome,
      telefono_ejecutivo: this.state.datosUsuario.moto_tel,
      cargando: "",
    };

    Geolocation.getCurrentPosition(
      (info) => {
        sendEmptyRemission(
          this.state.userId + '',
          data,
          'C',
          '',
          info.coords.latitude,
          info.coords.longitude,
          typeof this.state.selectedValue == 'string'
            ? ''
            : this.state.novedades[this.state.selectedValue].value,
          this.state.description,
        )
          .then(async (response) => {
            const newArr = this.state.photos;
            await sendEvidenceArr(data, newArr);
            await getCtesRemmitances(this.props.login.moto_id);
            this.setState({showSuccess: true, succes: 'done'});
            // setTimeout(() => this.props.navigation.goBack(), 1000);
          })
          .catch((error) => {
            console.log(error);
            this.setState({loading: false, error: 'Error', showError: true});
          });
      },
      (error) => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  renderCamera = async () => {
    this.setState({loading: true});
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
            this.setState({loading: false});
            return;
          }
          const img = response.assets[0];
          ImageResizer.createResizedImage(
            img.uri,
            1120,
            860,
            'PNG',
            100,
            0,
          ).then((image) => {
            this.setState({
              photos: [
                ...this.state.photos,
                {
                  name: `reportesac_${this.state.nf_id}_${this.state.photos.length}`,
                  uri: image.uri,
                  type: 'image/png',
                  evidence_type: 'reportesac',
                  type_evidence: 'reportesac',
                },
              ],
              loading: false,
            });
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.show}
        title="attention"
        bodyText="save-the-occurrence"
        buttons={[
          {
            onPress: () => this.setState({show: false}),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({show: false});
              setTimeout(
                () => this.setState({loading: true}, () => this.setSACReport()),
                500,
              );
            },
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  onGoBack = () => {
    const {params} = this.props.navigation.state;
    this.setState({showSuccess: false});
    this.props.navigation.navigate('RemittancesStack');
  };

  setMenuValue = (i) => {
    this.setState({selectedValue: i});
  };

  addCustomValue = (index, value) => {
    const newArr = [...this.state.novedades];
    newArr[index].value = value;
    newArr[index].renderValue = value;
    this.setState({novedades: newArr, selectedValue: index});
  };

  renderModalError = () => {
    return (
      <Modal
        isVisible={this.state.showError}
        title="attention"
        bodyText={this.state.error}
        buttons={[
          {
            onPress: () => this.setState({showError: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalSuccess = () => {
    return (
      <Modal
        isVisible={this.state.showSuccess}
        title="attention"
        bodyText={'Reporte enviado'}
        buttons={[
          {
            onPress: () => this.onGoBack(),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderHeader = () => {
    const {t} = this.props;
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('sacReport.nf')}</Text>
          <Text style={styles.headerItem}>1Edit</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('sacReport.volume')}</Text>
          <Text style={styles.headerItem}>2</Text>
        </View>
      </View>
    );
  };

  renderDescription = () => {
    const {t} = this.props;
    return (
      <TextInput
        ref={(input) => (this.description = input)}
        style={styles.textInputs}
        onChangeText={(description) => this.setState({description})}
        value={this.state.description}
        placeholder={t('sacReport.description')}
        multiline={true}
      />
    );
  };

  // renderPhoto = () => {
  //   return (
  //     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
  //       <Photo
  //         path={this.state.pathOccurrence1}
  //         delete={(value) => this.handlePath('pathOccurrence1', value)}
  //         setPath={(value) => this.handlePath('pathOccurrence1', value)}
  //       />
  //       <Photo
  //         path={this.state.pathOccurrence2}
  //         delete={(value) => this.handlePath('pathOccurrence2', value)}
  //         setPath={(value) => this.handlePath('pathOccurrence2', value)}
  //       />
  //       <Photo
  //         path={this.state.pathOccurrence3}
  //         delete={(value) => this.handlePath('pathOccurrence3', value)}
  //         setPath={(value) => this.handlePath('pathOccurrence3', value)}
  //       />
  //     </View>
  //   );
  // };

  renderPhoto = () => {
    return (
      <ScrollView
        horizontal
        style={{
          flexDirection: 'row',
          width: '100%',
        }}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 20,
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.renderCamera();
            }}>
            <View
              style={{
                width: 105,
                height: 105,
                borderRadius: 105,
                overflow: 'hidden',
                backgroundColor: 'gray',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome5 name="camera" color="white" size={40} />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.photos.map((item, index) => {
          return (
            <View
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 20,
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  width: 105,
                  height: 105,
                  borderRadius: 85,
                  overflow: 'hidden',
                  backgroundColor: 'gray',
                }}>
                <ImageBackground
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  source={{uri: item.uri}}
                />
              </View>
              <View
                style={{
                  bottom: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.handleDelete(index);
                  }}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 35,
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FontAwesome5 name="trash" size={18} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  renderButton = () => {
    return (
      <View>
        <Button
          title="save-occurrence"
          titleStyle={{
            alignSelf: 'center',
            fontSize: 14,
            color: 'white',
            fontWeight: 'bold',
          }}
          onPress={
            () => {
              setTimeout(
                () => this.setState({loading: true}, () => this.setSACReport()),
                500,
              );
            } /*() => this.setState({show: true})*/
          }
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationEvents
          onWillFocus={async () => this.setState({loading: true})}
        />
        <NavigationEvents onWillFocus={async () => this.getAllNovedades()} />
        {/* <View>{this.renderHeader()}</View> */}
        <Loading show={this.state.loading} />
        <View style={{height: 160}}>{this.renderPhoto()}</View>
        <CustomIconSelect
          menus={this.state.novedades}
          currentValue={this.state.selectedValue}
          menuSelect={this.setMenuValue}
          withCustom={false}
          onPressCustom={this.addCustomValue}
        />
        <View style={{paddingHorizontal: 15}}>
          {this.renderDescription()}
          {this.renderButton()}
        </View>
        {this.renderModal()}
        {this.renderModalError()}
        {this.renderModalSuccess()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: loginSelector(state),
    latlong: latlongSelector(state),
    sacReportTypes: sacReportTypesSelector(state, true),
  };
};

const SACReport = withTranslation('screens')(SACReportClass);
export default connect(mapStateToProps)(SACReport);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
    zIndex: 1,
  },
  areaScroll: {
    padding: 20,
    paddingTop: 5,
  },
  containerHeader: {
    height: 70,
    backgroundColor: global.COLOR_TOOLBAR,
    padding: 10,
    width,
    marginBottom: 10,
  },
  containerHeaderItem: {
    flexDirection: 'row',
  },
  headerLabel: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerItem: {
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 5,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    marginVertical: 10,
    borderRadius: 50,
  },
  textInputs: {
    width: '100%',
    height: 160,
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 5,
    //borderRadius: 30,
    paddingLeft: 20,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  containerType: {
    backgroundColor: 'white',
    width: '100%',
    height: 60,
    marginBottom: 10,
    //borderRadius: 50,
    justifyContent: 'center',
    borderWidth: 1,
    paddingRight: 5,
  },
});
