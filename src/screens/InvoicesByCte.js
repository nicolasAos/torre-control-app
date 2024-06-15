import React, {Component, Fragment} from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {Card, Button, Loading, Modal} from '../components';
import {getNfsOffline, checkIn, getCheckIn, checkOut} from '../actions/driver';
import {
  loginSelector,
  locationSelector,
  deviceIdSelector,
} from '../reducers/selectors';

import {withTranslation} from 'react-i18next';
import i18n from '../locales';

const {width} = Dimensions.get('window');

class InvoicesByCteClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      empresa: props.navigation.getParam('empresa', ''),
      cteId: props.navigation.getParam('cteId', ''),
      loading: true,
      show: false,
      parametro_checkin: false,
      paramsCheckIn: {},
      checkIn: {},
      checkInDisable: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () =>
      this.setState({loading: true}, () => this.getNfs()),
    );
  }

  getNfs = () => {
    getNfsOffline(
      this.props.login.moto_id,
      this.state.empresa,
      this.state.cteId,
    ).then(async (data) => {
      const check = await getCheckIn(this.props.login.moto_id, {
        chave_cte: data.ctes.cte_chave,
        cte: data.ctes.cte_numero,
        cte_id: data.ctes.cte_id,
      });
      this.setState({
        data: data,
        loading: false,
        parametro_checkin: data.ctes.parametro_checkin,
        paramsCheckIn: {
          chave_cte: data.ctes.cte_chave,
          cte: data.ctes.cte_numero,
          cte_id: data.ctes.cte_id,
        },
        checkIn: check,
        checkInDisable: check.checkIn,
      });
      setTimeout(
        () =>
          this.setState({
            show: data.isClosedCte,
          }),
        500,
      );
    });
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
    const ckIn = await getCheckIn(
      this.props.login.moto_id,
      this.state.paramsCheckIn,
    );
    if (ckIn.checkIn) {
      checkOut(ckIn[0], this.props.location).then(() => {
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
          <Text style={styles.headerLabel}>{t('invoices.CT-e')}</Text>
          <Text style={styles.headerItem} numberOfLines={1}>
            {this.state.data.ctes.cte_numero}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.recipient')}:</Text>
          <Text
            style={[styles.headerItem, {width: width / 1.4}]}
            numberOfLines={1}>
            {this.state.data.ctes.destinatario}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.destination')}:</Text>
          <Text
            style={[styles.headerItem, {width: width / 1.26}]}
            numberOfLines={1}>
            {this.state.data.ctes.destino_cidade} -{' '}
            {this.state.data.ctes.destino_uf}
          </Text>
        </View>
      </View>
    );
  };

  renderButtonCheckIn = () => {
    const {t} = this.props;
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

  renderFinishCte = () => {
    if (this.state.data.isClosedCte) {
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
                    this.setState({loading: true}, () =>
                      this.submitFinishCte(),
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
    const {data, loading} = this.state;
    const {t} = this.props;

    return (
      <View style={styles.container}>
        {loading ? (
          <Loading show={loading} />
        ) : (
          <Fragment>
            {this.renderHeader()}
            {this.renderFinishCte()}
            <ScrollView showsVerticalScrollIndicator={false}>
              <Card containerStyle={styles.card}>
                <View style={styles.containerTitle}>
                  <View style={styles.containerIconTitle}>
                    <Text style={styles.title}>
                      {t('invoices.CT-e')}
                      {data.ctes.cte_numero}
                    </Text>
                  </View>
                </View>
                <View style={styles.containerBody}>
                  {data.nfsKeys.map((item, index) => (
                    <View
                      style={[
                        styles.body,
                        {
                          alignItems: 'center',
                          paddingBottom: 5,
                          paddingTop: 5,
                          borderBottomColor: '#999999',
                          borderBottomWidth: 1,
                        },
                      ]}
                      key={index}>
                      <FontAwesome5 name="file-alt" color="#999999" size={22} />
                      <Text style={[styles.item, {fontSize: 20}]}>
                        {parseFloat(item.nf.nf_id)}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.body}>
                    <Text style={[styles.label, {fontSize: 20}]}>
                      {t('invoices.invoices-total')}
                    </Text>
                    <Text style={[styles.item, {fontSize: 20}]}>
                      {data.nfsKeys.length}
                    </Text>
                  </View>

                  {!data.closed && (
                    <View style={styles.containerButton}>
                      <Button
                        onPress={() =>
                          this.props.navigation.navigate('lowStack', {
                            data: data.ctes,
                            invoices: data.nfsKeys,
                          })
                        }
                        title="delivery"
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
                              this.state.parametro_checkin &&
                              !this.state.checkInDisable
                                ? '#666'
                                : global.COLOR_MAIN,
                          },
                        ]}
                        disabled={
                          this.state.parametro_checkin &&
                          !this.state.checkInDisable
                        }
                      />

                      <Button
                        onPress={() => {
                          this.props.navigation.navigate(
                            'occurrenceNFsCteStack',
                            {
                              data: data.ctes,
                              invoices: data.nfsKeys,
                            },
                          );
                        }}
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
                              this.state.parametro_checkin &&
                              !this.state.checkInDisable
                                ? '#666'
                                : 'red',
                          },
                        ]}
                        disabled={
                          this.state.parametro_checkin &&
                          !this.state.checkInDisable
                        }
                      />
                    </View>
                  )}
                </View>
              </Card>
            </ScrollView>
            {this.renderButtonCheckIn()}
          </Fragment>
        )}
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

const InvoicesByCte = withTranslation('screens')(InvoicesByCteClass);
export default connect(mapStateToProps)(InvoicesByCte);

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
    marginTop: 15,
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
    height: 80,
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
