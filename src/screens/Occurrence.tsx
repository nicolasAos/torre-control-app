import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {StackActions} from 'react-navigation';
//import ReactNativePicker from 'react-native-picker-select';
import {Button, Modal, Loading} from '../components';
import {sendOccurence} from '../actions/occurrence';
import {loginSelector, latlongSelector} from '../reducers/selectors';
import {getDateBD} from '../configs/utils';
import {occurrenceTypesSelector} from '../reducers/selectors';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {withTranslation} from 'react-i18next';
import CustomSelect from '../components/CustomIconSelect';
import {Mixpanel} from '../analitycs';
// utils
import {Logger} from '../utils';

const options = {
  cameraType: 'back',
  mediaType: 'photo',
  allowsEditing: false,
  storageOptions: {
    quality: 0.5,
    cameraRoll: false,
    skipBackup: true,
  },
  saveToPhotos: true,
};

const {width} = Dimensions.get('window');

interface Props {
  login: any;
  navigation: any;
}

class OccurrenceClass extends Component<Props> {
  constructor(props: any) {
    super(props);

    this.state = {
      type: 0,
      loading: false,
      description: '',
      data: props.navigation.getParam('data', {}),
      romInicio: props.navigation.getParam('data', ''),  
      pathOccurrence1: '',
      pathOccurrence2: '',
      pathOccurrence3: '',
      show: false,
      showError: false,
      error: '',
      success: '',
      photos: [],
    };
  }

  componentDidMount(): void {
    Logger.log(`mount Ocurrence screen`);
    Mixpanel.log('Ocurrence Screen Visited');
  }

  componentWillUnmount(): void {
    Logger.log(`unmount Ocurrence screen`);
  }

  handleDelete = (id: any) => {
    const photos = this.state.photos.filter((item) => item.id !== id);
    this.setState({photos});
  };

  setOccurrence = async () => {
    Logger.log('save ocurrence');
    const menussend = this.props.occurrenceTypes.filter((item) =>
      this.state.data.cte_type_delivery === 'P'
        ? item.oco_cod_proceda === 3
        : item.oco_cod_proceda === 4,
    );
    let data = this.state.data;
    data.start_travel = ''; //this.state.romInicio;
    data.nf_oco_foto_1 = this.state.pathOccurrence1;
    data.nf_oco_foto_2 = this.state.pathOccurrence2;
    data.nf_oco_foto_3 = this.state.pathOccurrence3;
    data.update_or_end = this.state.type ? true : false;
    data.nf_obs = this.state.description;
    data.nf_lat_long_ocorrencia = this.props.latlong;
    data.nf_ocorrencia = menussend[this.state.type].oco_id;
    data.nf_dt_ocorrencia = getDateBD();
    data.moto_nome = this.props.login.moto_nome;
    data.moto_tel = this.props.login.moto_tel;
    data.rom_motorista = this.props.login.user_id;
    data.photos = this.state.photos;
    try { 
      const response = await sendOccurence(
        this.props.login.moto_id,
        [{...data}],
        this.props.login.user_id,
      );
      this.setState({
        loading: false,
        success: 'occurrence-saved',
      });
      setTimeout(() => this.setState({showSuccess: true}), 500);
    } catch (error) {
      console.log(error);
      this.setState({loading: false, error: error.message});
      setTimeout(() => this.setState({showError: true}), 500);
    }
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
          console.log('launch camara');
          if (response.didCancel) {
            this.setState({loading: false});
            return;
          }
          const img = response.assets[0];
          ImageResizer.createResizedImage(
            img.uri,
            840,
            480,
            'JPEG',
            50,
            0,
          ).then(async (image) => {
            let data = this.state.data;
            let name = `ocurrence_${data.rom_id}_${data.cte_type_delivery}_${
              data.cte_ordem
            }_${this.state.photos.length}_${new Date().toISOString()}.JPEG`;
            this.setState({
              photos: [
                ...this.state.photos,
                {
                  fileName: name,
                  uri: image.uri,
                  type: 'image/jpeg',
                  path: image.path,
                  id: name,
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
  handleDelete = (i) => {
    const photos = this.state.photos.filter((item, index) => index !== i);
    this.setState({photos: photos});
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
                () =>
                  this.setState({loading: true}, () => this.setOccurrence()),
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
        bodyText={this.state.success}
        buttons={[
          {
            onPress: () =>
              this.setState({showSuccess: false}, () =>
                this.props.navigation.dispatch(StackActions.pop()),
              ),
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
          <Text style={styles.headerLabel}>{t('occurrence.nf')}</Text>
          <Text style={styles.headerItem}>{this.state.data.nf_id}</Text>
        </View>
        {/* <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('occurrence.volume')}</Text>
          <Text style={styles.headerItem}>
            {!this.state.data.nf_volume ? 0 :parseFloat(this.state.data.nf_volume)}
          </Text>
        </View> */}
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
        placeholder={t('occurrence.description')}
      />
    );
  };

  renderPhoto = () => {
    let data = this.state.data;
    let nfId = data.nf_id ? data.nf_id : 0;
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
                  bottom: 45,
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
          onPress={() => this.setState({show: true})}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  };

  render() {
    const menus = this.props.occurrenceTypes.filter((item) =>
      this.state.data.cte_type_delivery === 'P'
        ? item.oco_cod_proceda === 3
        : item.oco_cod_proceda === 4,
    );
    return (
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.areaScroll}
          contentContainerStyle={{flex: 1}}>
          <Loading show={this.state.loading} />
          <View>{this.renderHeader()}</View>
          {this.renderPhoto()}
          <CustomSelect
            menus={menus.map((item) => {
              return {
                value: item.oco_id,
                renderValue: item.label,
                image: null,
              };
            })}
            currentValue={this.state.type}
            menuSelect={(value) => {
              this.setState({type: value});
            }}
            withCustom={false}
          />
          <View style={{padding: 10}}>
            {this.renderDescription()}
            {this.renderButton()}
          </View>
          {this.renderModal()}
          {this.renderModalError()}
          {this.renderModalSuccess()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: loginSelector(state),
    latlong: latlongSelector(state),
    occurrenceTypes: occurrenceTypesSelector(state, true),
  };
};

const Occurrence = withTranslation('screens')(OccurrenceClass);
export default connect(mapStateToProps)(Occurrence);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  areaScroll: {
    flex: 1,
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
    width: width / 1.1,
    height: 160,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 30,
    paddingLeft: 20,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  containerType: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 10,
    paddingLeft: 10,
  },
});
