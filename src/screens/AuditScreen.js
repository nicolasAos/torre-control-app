import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';
import {StackActions} from 'react-navigation';
import {Button, Photo, Modal, Loading} from '../components';
import {sendAudit} from '../actions/audit';
import {
  loginSelector,
  latlongSelector,
  deviceIdSelector,
} from '../reducers/selectors';
import {getDateBD} from '../configs/utils';
import {withTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

class AuditScreenClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [{id: getDateBD(), fileName: '', path: '', uri: ''}],
      travelId: props.navigation.getParam('travelId', ''),
      license: props.navigation.getParam('license', ''),
      superName: '',
      totalOrders: '',
      totalOrdersDelivered: '',
      orderIssues: '',
      observations: '',
      dateDone: getDateBD(),
      loading: true,
      show: false,
      showError: false,
      error: '',
      success: '',
      data: {},
    };
  }

  async componentDidMount() {
    this.setState({loading: false});
  }


  handleDelete = (id) => {
    const photos = this.state.photos.filter((item) => item.id !== id);
    this.setState({photos});
  };


  handlePath = (id, {uri, fileName, path}) => {
    const photos = this.state.photos.map((item) => {
      if (item.id === id) {
        return {...item, uri, fileName, path};
      }
      return item;
    });

    this.setState(
      {
        photos: [...photos, {id: id + 1, fileName: '', path: '', uri: ''}],
      },
      () => console.log(this.state.photos),
    );
  };


  setAudit = () => {
    const data = this.state.data;
    data.license = this.state.license;
    data.travelId = this.state.travelId;
    data.superName = this.state.superName;
    data.totalOrders = this.state.totalOrders;
    data.totalOrdersDelivered = this.state.totalOrdersDelivered;
    data.orderIssues = this.state.orderIssues;
    data.update_or_end = this.state.type ? true : false;
    data.observations = this.state.observations;
    data.dateDone = this.state.dateDone;
    data.photos = this.state.photos.slice(0, this.state.photos.length - 1);
    console.log("data audit:");
    console.log(data);
    sendAudit(this.props.login.moto_id, data)
      .then(() => {
        this.setState({
          loading: false,
          success: 'audit-saved',
        });
        setTimeout(() => this.setState({showSuccess: true}), 500);
      })
      .catch((error) => {
        this.setState({loading: false, error: error.message});
        setTimeout(() => this.setState({showError: true}), 500);
      });
  };
  
  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.show}
        title="attention"
        bodyText="confirm-audit"
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
                  this.setState({loading: true}, () => this.setAudit()),
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



  
  renderPhoto = () => {
    let data = this.state.data;
  
    return (
      <ScrollView
        horizontal
        style={{
          flexDirection: 'row',
          // backgroundColor: 'blue',
          height: '10%',
        }}>
        {this.state.photos.map((item) => {
          return (
            <View style={{paddingLeft: 10, paddingRight: 10, marginTop: 50}}>
              <Photo
                path={item.path === '' ? item.path : item}
                delete={() => this.handleDelete(item.id)}
                setPath={(value) => this.handlePath(item.id, value)}
                fileName={
                  data.license +
                  '_' +
                  'EVIDENCE' +
                  '_' +
                  Date.now() +
                  '.png'
                }
              />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  renderAudit = () =>{
    const {t} = this.props;
    return (

      <SafeAreaView style={styles.safeAreaStyle}>
      <TextInput
        ref={(input) => this.superName = input}
        style={styles.textInputs}
        onChangeText={(superName) => this.setState({ superName })}
        value={this.state.superName}
        placeholder={t('audits.superName')}
      />
       <TextInput
        ref={(input) => this.totalOrders = input}
        style={styles.textInputs}
        onChangeText={(totalOrders) => this.setState({ totalOrders })}
        value={this.state.totalOrders}
        placeholder={t('audits.totalOrders')}
      />
       <TextInput
        ref={(input) => this.totalOrdersDelivered = input}
        style={styles.textInputs}
        onChangeText={(totalOrdersDelivered) => this.setState({ totalOrdersDelivered })}
        value={this.state.totalOrdersDelivered}
        placeholder={t('audits.totalOrdersDelivered')}
      />
       <TextInput
        ref={(input) => this.orderIssues = input}
        style={styles.textInputs}
        onChangeText={(orderIssues) => this.setState({ orderIssues })}
        value={this.state.ordersIssues}
        placeholder={t('audits.orderIssues')}
      />
        <TextInput
        ref={(input) => this.observations = input}
        style={styles.textInputs}
        onChangeText={(observations) => this.setState({ observations })}
        value={this.state.observations}
        placeholder={t('audits.observations')}
      />
       <Button
                title="save-audit"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onPress={() => this.setState({show: true})}
                buttonStyle={styles.buttonStyle}
              />
       </SafeAreaView>
    )
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        <ScrollView showsVerticalScrollIndicator={false}>
        {this.renderPhoto()}      
          {this.renderAudit()}
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
    deviceId: deviceIdSelector(state),
  };
};

const AuditScreen = withTranslation('screens')(AuditScreenClass);
export default connect(mapStateToProps)(AuditScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    width: width / 1.1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    borderRadius: 20,
    zIndex: 99,
  },
  containerTitle: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TITLE_CARD,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerIconTitle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  containerBody: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  body: {
    flexDirection: 'row',
    marginTop: 3,
  },
  bodyBottomCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  item: {
    marginHorizontal: 5,
    width: width / 1.6,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 2,
    borderRadius: 50,
    marginVertical: 15,
    top:14,
    left:90
  },
  buttonTravelMaps: {
    backgroundColor: '#ec6036',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: -10,
    width: width / 2,
    borderRadius: 50,
    marginVertical: 15,
  },
  alert: {
    position: 'absolute',
    top: -20,
    right: 3,
    //elevation: 5,
    width: 80,
    height: 80,
    borderRadius: 40,
    //backgroundColor: '#cccd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonRoute: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputs: {
    width: (width / 1.1),
    height: 42,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 30,
    paddingLeft: 20,
    textAlignVertical: 'top',
    fontSize: 14
},
safeAreaStyle:{
  margin: 10,
  marginTop:10,
  flex: 1,

},
photoAudit:{
  width: 90,
  height: 90,
  borderRadius: 90/ 2,
  borderColor: '#000',
  marginBottom:28,
  marginTop:12
}
});
