import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {StackActions} from 'react-navigation';
import {Card, Button, Loading, Modal} from '../components';
import {getNfsOffline, checkIn, getCheckIn, checkOut} from '../actions/driver';
import {
  loginSelector,
  locationSelector,
  deviceIdSelector,
} from '../reducers/selectors';

import {withTranslation} from 'react-i18next';
import { Mixpanel } from '../analitycs';
// utils
import {Logger} from '../utils';

const {width} = Dimensions.get('window');

interface Props{
  navigation: any;
  login:any;
  location:any;
  device_id:any;
}

class InvoicesClass extends Component<Props> {
  constructor(props:any) {
    super(props);
    this.state = {
      data: [],
      //empresa: props.navigation.getParam('empresa', ''),
      cteId: props.navigation.getParam('cteId', ''),
      romId: props.navigation.getParam('romId', ''),
      romInicio: props.navigation.getParam('romInicio', ''),
      loading: true,
      show: false,
      parametro_checkin: false,
      paramsCheckIn: {},
      checkIn: {},
      checkInDisable: false,
    };
  }

  componentDidMount() {
    Mixpanel.log('Invoices Screen Visited')
    Logger.log('mount Invoices screen');
    this.props.navigation.addListener('didFocus', () => {
      this.setState({loading: true});
      setTimeout(() => this.getNfs(), 1000);
      //setTimeout(() => this.getNfs(), 15000);
    });
  }

  componentWillUnmount(): void {
    Logger.log('unmount Invoices screen');
  }

  getNfs = async () => {
    // get smth from realm
    const getPedidos = await getNfsOffline(
      this.props.login.moto_id,
      this.state.cteId,
    );
    // get smth from realm
    const check = await getCheckIn(this.props.login.moto_id, {
      chave_cte: getPedidos.ctes.cte_chave,
      cte: getPedidos.ctes.cte_numero,
      cte_id: getPedidos.ctes.cte_id,
    });
    this.setState({
      data: getPedidos,
      loading: false,
      parametro_checkin: getPedidos.ctes.parametro_checkin,
      paramsCheckIn: {
        chave_cte: getPedidos.ctes.cte_chave,
        cte: getPedidos.ctes.cte_numero,
        cte_id: getPedidos.ctes.cte_id,
      },
      checkIn: check,
      checkInDisable: check.checkIn,
    });
    setTimeout(
      () =>
        this.setState({
          show: getPedidos.isClosedCte,
        }),
      500,
    );
  };

  submitCheckIn = () => {
    checkIn(
      this.props.login.moto_id,
      this.state.paramsCheckIn,
      this.props.device_id,
      this.props.location,
    )
      .then((checkIn) =>
        this.setState({
          checkIn,
          loading: false,
          checkInDisable: checkIn.checkIn,
        }),
      )
      .catch((checkIn) =>
        this.setState({
          checkIn,
          loading: false,
          checkInDisable: checkIn.checkIn,
        }),
      );
  };

  submitFinishCte = async () => {
    console.log(
      'Modal en cierre de viaje parcial y completo (Recogica y Entrega)',
    );
    const ckIn = await getCheckIn(
      this.props.login.moto_id,
      this.state.paramsCheckIn,
    );
    console.log(this.state.paramsCheckIn);
    if (ckIn.checkIn) {
      await checkOut(ckIn[0], this.props.location).then(() => {
        this.setState({loading: false}, () =>
          this.props.navigation.dispatch(StackActions.pop()),
        );
      });
    } else {
      this.setState({loading: false}, () =>
        this.props.navigation.dispatch(StackActions.pop()),
      );
    }
  };

  renderHeader = () => {
    const {t} = this.props;
    if (this.state.data.length === 0) {
      return;
    }
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.CT-e')}:</Text>
          <Text style={styles.headerItem} numberOfLines={1}>
            {this.state.data.ctes.rom_id}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.recipient')}:</Text>
          <Text
            style={[styles.headerItem, {width: width / 1.4}]}
            numberOfLines={1}>
            {this.state.data.ctes.cte_type_delivery == 'P'
              ? this.state.data.ctes.rom_origem
              : this.state.data.ctes.rom_destino}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.destination')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.26}]}>
            {this.state.data.ctes.destino}
          </Text>
        </View>
      </View>
    );
  };

  renderItems = ({item}:any) => {
    const {t} = this.props;
    return (
      <Card containerStyle={styles.card}>
        {item.nf.cte_type_delivery === 'D' && (
          <View style={styles.containerTitleDelivery}>
            <View style={styles.containerIconTitle}>
              <Text style={styles.title}>
                {t('invoices.delivery')}- {item.nf.cte_ordem}
              </Text>
            </View>
          </View>
        )}

        {item.nf.cte_type_delivery === 'P' && (
          <View style={styles.containerTitlePickup}>
            <View style={styles.containerIconTitle}>
              <Text style={styles.title}>
                {t('invoices.pickup')}- {item.nf.cte_ordem}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.containerBody}>
          <View style={styles.body}></View>
          {!item.closed && (
            <View style={styles.containerButton}> 
              <Button
                onPress={() =>
                  this.props.navigation.navigate(
                    this.state.data.ctes.cte_type_delivery == 'P'
                      ? 'pickupStack'
                      : 'lowStack',
                    {
                      data: item.nf,
                      romInicio: this.state.romInicio,
                    },
                  )
                }
                title={
                  this.state.data.ctes.cte_type_delivery == 'P'
                    ? 'pickup'
                    : 'delivery'
                }
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                buttonStyle={[
                  styles.buttonStyle,
                  {
                    backgroundColor:
                      this.state.parametro_checkin && !this.state.checkInDisable
                        ? '#666'
                        : global.COLOR_MAIN,
                  },
                ]}
                disabled={
                  this.state.parametro_checkin && !this.state.checkInDisable
                }
              />
              <Button
                onPress={() =>
                  this.props.navigation.navigate('occurrenceStack', {
                    data: item.nf,
                  })
                }
                title="occurrence"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                buttonStyle={[
                  styles.buttonStyle,
                  {
                    backgroundColor:
                      this.state.parametro_checkin && !this.state.checkInDisable
                        ? '#666'
                        : 'red',
                  },
                ]}
                disabled={
                  this.state.parametro_checkin && !this.state.checkInDisable
                }
              />
            </View>
          )}
        </View>
      </Card>
    );
  };

  renderButtonCheckIn = () => {
    if (this.state.parametro_checkin) {
      return (
        <Button
          onPress={() =>
            this.setState({loading: true}, () => this.submitCheckIn())
          }
          title="checkin"
          titleStyle={{
            alignSelf: 'center',
            fontSize: 14,
            color: 'white',
            fontWeight: 'bold',
          }}
          buttonStyle={[
            styles.checkIn,
            {
              backgroundColor: this.state.checkInDisable ? 'grey' : 'orange',
            },
          ]}
          disabled={this.state.checkInDisable}
        />
      );
    }
  };

  renderList = () => {
    return (
      <FlatList
        data={this.state.data.nfsKeys}
        renderItem={this.renderItems}
        keyExtractor={(item) => item.nf_type_number}
        extraData={this.state.parametro_checkin && !this.state.checkInDisable}
      />
    );
  };

  renderFinishCte = () => {
    if (this.state.data.isClosedCte) {
      console.log(
        'Entrando en la sección: ',
        'Se han finalizado todos los fechas , se finalizará el CTE.',
      );
      let message = '';
      if (this.state.checkInDisable) {
        message = 'checkout-automatically';
      }
      return (
        <Modal
          isVisible={this.state.show}
          title="attention"
          bodyText={'cte-finalized'}
          buttons={[
            {
              onPress: () => {
                this.setState({show: false});
                setTimeout(
                  () =>
                    this.setState(
                      {loading: true},
                      async () => await this.submitFinishCte(),
                    ),
                  500,
                );
              },
              text: 'ok-got-it',
              backgroundColor: global.COLOR_MAIN,
            },
          ]}
        />
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        {this.renderHeader()}
        {this.renderFinishCte()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderList()}
        </ScrollView>
        {this.renderButtonCheckIn()}
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

const Invoices = withTranslation('screens')(InvoicesClass);
export default connect(mapStateToProps)(Invoices);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    width: width / 1.1,
    borderRadius: 20,
  },
  containerTitleDelivery: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TOOLBAR,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  containerTitlePickup: {
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
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
  },
  item: {
    marginHorizontal: 5,
  },
  containerHeader: {
    maxHeight: 330,
    backgroundColor: global.COLOR_TOOLBAR,
    padding: 10,
    width,
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
    width: width / 2.7,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 50,
  },
  checkIn: {
    width,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
