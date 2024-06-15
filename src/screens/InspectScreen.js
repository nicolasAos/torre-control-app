import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {StackActions} from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Card, Button, Modal, Loading} from '../components';
import {shadows} from '../theme/shadow';
import {
  startTransport,
  startTransportTorre,
  finishedTransport,
} from '../actions/transport';
import {getSpreadSheetsOffline} from '../actions/driver';
import {
  loginSelector,
  latlongSelector,
  deviceIdSelector,
} from '../reducers/selectors';
import {getDateBD} from '../configs/utils';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import {withTranslation} from 'react-i18next';
import i18n from '../locales';
import MapView from 'react-native-maps';
import { getRandomTruck } from '../actions/home';
import { NavigationEvents } from 'react-navigation';
import ListContainer from '../components/ListContainerOneColumn'

const {width} = Dimensions.get('window');

class InspectScreenClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auditDate: props.navigation.getParam('auditDate', ''),
      driverName: props.navigation.getParam('driverName', ''),
      disAux: props.navigation.getParam('disAux', ''),
      license: props.navigation.getParam('license', ''),
      travelId: props.navigation.getParam('travelId', ''),
      show: false,
      loading: true,
      elements: []
    };
    
  }

  getLocations = () => { 
    this.setState({loading: true})
    Geolocation.getCurrentPosition( info => {
        getRandomTruck(info.coords.latitude, info.coords.longitude, this.props.navigation.state.params.userId).then( response => {
          this.setState({elements: response, loading: false})
        }).catch((e) => {
          console.log(e)
          this.setState({ loading: false })
        })
      }
    )
    
  }

  async componentDidMount() {
    this.setState({loading: false});
    this.props.navigation.addListener('didFocus', () => { 
      this.getLocations()
    });
  }

  


  renderRoute = () =>{
  console.log(this.props.login)
    

    const {t} = this.props;
    return this.state.elements.map((item) => {
      return (
        <Card containerStyle={styles.card}>
          <View style={styles.containerTitle}>
            <View style={styles.containerIconTitle}>
              <Text style={styles.title}>{item.truckId}</Text>
            </View>
          </View>
          <View style={styles.containerBody}>
            <View style={styles.body}>
              <Text style={styles.label}>{t('inspects.auditDate')}</Text>
              <Text style={styles.item}>{item.auditDate}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>{t('inspects.disAux')}:</Text>
              <Text style={styles.item}>{item.auxiliaryName}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>{t('inspects.driverName')}:</Text>
              <Text style={styles.item}>{item.operatorName}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>{t('inspects.license')}:</Text>
              <Text style={styles.item}>{item.truckId}</Text>
            </View>     
            <View style={styles.viewButtonRoute}>
              <Button
                title="maps"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                buttonStyle={styles.buttonTravelMaps}
                onPress={() => this.props.navigation.navigate('MapFull', { 
                    truckId: item.truckId,
                    userId: this.props.navigation.state.params.userId,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    clientName: typeof(item.clientName) == 'null' ? '' : item.clientName
                  })}
              />
            </View>
          </View>
      
            <View style={[styles.body, styles.bodyBottomCard]}>
              <Button
                title="audit"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                // onPress={() => this.setState({showFinished: true})}
                onPress={() =>
                  this.props.navigation.navigate('questionaireStack', { 
                    userId: this.props.login.moto_id,
                    asignacionId: item.asignacionId
                  })
                }
                buttonStyle={styles.buttonTravel}
              />
            </View>
              
        </Card>
      )
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderRoute()}      
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

const InspectScreen = withTranslation('screens')(InspectScreenClass);
export default connect(mapStateToProps)(InspectScreen);

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
  buttonTravel: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 2,
    borderRadius: 50,
    marginVertical: 15,
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
});
