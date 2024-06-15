import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import {StackActions} from 'react-navigation';
import {Card, Button, Loading, Modal} from '../components';
import { sendEmptyRemission, sendSignature } from '../actions/driver';
import {
  loginSelector,
  locationSelector,
  deviceIdSelector,
} from '../reducers/selectors';

import {withTranslation} from 'react-i18next';
import i18n from '../locales';
import SignatureCapture from 'react-native-signature-capture';
import {getCtesRemmitances} from '../actions/driver'
import RNFS from 'react-native-fs';
const {width, height} = Dimensions.get('window');
class SignatureRemissionClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data: [],
          dataCte: [],
          //cteId: props.navigation.getParam('cteId', ''),
          loading: true,
          show: false,
          parametro_checkin: false,
          paramsCheckIn: {},
          checkInDisable: false,
          dataStr: '',
          deliveryAlert: false,
          itemSignature: '',
          signBase: false
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () =>
        this.setState({loading: true}, () => this.getNfs()),
        );
    }

    getNfs = () => {
        this.setState({
            loading: false,
        });
    };

    deliveryOnPress = (bandera) => {
        if(bandera === 'delivery') {
        this.setState({deliveryAlert: true})
        }
    }

    functionTuSave = result => {
        this.setState({
            itemSignature: result.encoded,
        })

        this.props.navigation.navigate('RemissionStack', {
            itemSignature2: this.state.itemSignature,
        });
    }

    saveSign = () => {
        this.setState({loading: true})
        this.refs["sign"].saveImage();
    }

    resetSign() {
        const { params } = this.props.navigation.state
        this.refs["sign"].resetImage();
        params.screenState?.deleteFirma()
        this.setState({itemSignature : '', signBase: false})
    }

    _onSaveEvent = result => {
      if (!this.state.signBase) {
        Alert.alert('Porfavor, Introduce una firma')
        this.setState({ loading: false})
        return
      }
      const { params } = this.props.navigation.state;
      //result.encoded - for the base64 encoded png
      //result.pathName - for the file path name
      params.screenState?.addFirma(result) 
      this.setState({
        itemSignature: result,
        signatureConfirm: false,
        loading: false
      })
      this.props.navigation.goBack()
    }

    _onDragEvent = result => {
        // This callback will be called when the user enters signature
        this.saveDrag();
    }
    
    saveDrag(){
      this.setState({ signBase: true })
    }
  renderSignatureConfirm = () => {
    const {t} = this.props
    return (
      <Modal
        isVisible={this.state.signatureConfirm}
        title={t('remission.signatureTitle')}
        bodyText={t('remission.signatureConfirm')}
        buttons={[
          {
            onPress: () => {
              this.resetSign(),
              this.setState({ signatureConfirm: false})
            },
            text: 'No',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.saveSign()
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          }
        ]}
      />
    );
  };
    renderModal = () => {
        return (
        <Modal
            isVisible={this.state.deliveryAlert}
            title="signature"
            bodyText='remissiones.signatureText'
            buttons={[
            {
                onPress: () => {
                this.setState({deliveryAlert: false})
                },
                text: 'accept',
                backgroundColor: global.COLOR_TITLE_CARD,
            }
            ]}
        />
        );
    };

    render() {
        return (
        <View style={styles.container}>
            <Loading show={this.state.loading} />
            {this.renderModal()}
            {this.renderSignatureConfirm()}
            <View style={{flex: 1}}>
            <Text style={{
                marginTop: 15,
                marginBottom: 15,
            }}>Realice su firma a continuación.</Text>
                <SignatureCapture 
                    style={[{flex: 1}, styles.signature]}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    // saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    backgroundColor="#FFFFFF"
                    strokeColor="#000000"
                    minStrokeWidth={6}
                    maxStrokeWidth={6}
                    viewMode={"portrait"}
                    saveImageFileInExtStorage={true}
                />

                <View style={{ alignItems: 'center', flex: 1, justifyContent:'center' }}>
                    <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: "#1f2b52"}]}
                      onPress={() => { this.setState({ signatureConfirm: true }) } } >
                        <Text style={styles.textButtons}>Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: "#EC6010"}]}
                        onPress={() => {  this.resetSign() }  } >
                        <Text style={styles.textButtons}>Borrar</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    login: loginSelector(state),
    location: locationSelector(state),
    device_id: deviceIdSelector(state),
  };
};

const SignatureRemission = withTranslation('screens')(SignatureRemissionClass);
export default connect(mapStateToProps)(SignatureRemission);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: global.COLOR_BACKGROUND,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    containerIconTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    containerBody: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    body: {
        flexDirection: 'row',
    },
    containerButton: {
        alignItems: 'center',
        //flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'space-between',
        
    },
    label: {
        fontWeight: 'bold',
    },
    item: {
        marginHorizontal: 5,
    },
    containerHeader: {
        height: 137,
        backgroundColor: global.COLOR_TOOLBAR,
        padding: 10,
        width,
    },
    containerHeaderItem: {
        flexDirection: 'row',
    },
//   buttonStyle: {
//     width: width / 2.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 60,
//     borderRadius: 50,
//   },
    checkIn: {
        width,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },

    signature: {
        borderColor: '#78787C',
        borderWidth: 1,
        flex: 1,
        width: width - 20,
    },
    buttonStyle: {
        alignItems: "center",
        borderRadius: 50,
        //flex: 1, 
        justifyContent: "center", 
        height: 40,
        margin: 10,
        width: width / 2.7,
    },
    textButtons: {
        color: 'white',
        fontWeight: 'bold',
    }
});

const encodedEmpty= 'iVBORw0KGgoAAAANSUhEUgAAAfQAAAFVCAYAAAAZlh3BAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAV0SURBVHic7dXBDcAgEMCw0v13PobggYjsCfLLmpn5AICn/bcDAIBzhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABhg4AAYYOAAGGDgABG/BtBqYqdyYjAAAAAElFTkSuQmCC' 
