import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  FlatList,
  Dimensions,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import {Loading, Card, Button, Modal} from '../../components';
import {
  loginSelector,
  vehiclesSelector,
  freightWishSelector,
  cnhSelector,
  freightPreferencesSelector,
  shippingCompanieSelector,
} from '../../reducers/selectors';
import {
  getOffersMyVehicle,
  getOffersOthersVehicles,
  getOffersFavorite,
  setOfferFavorite,
  alterOfferFavorite,
} from '../../actions/freightOffers';

import Share from 'react-native-share';
import {captureRef} from 'react-native-view-shot';
import Snackbar from 'react-native-snackbar';
import {withTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

/* Components */
import LoadingTimer from '../../components/LoadingTimer';
import AcceptanceOptions from './AcceptanceOptions';

/* Services */
import {acceptOffer} from '../../services/FreightOffers';
import {getShippingCompanies} from '../../services/ShippingCompany';
import {SET_SHIPPING_COMPANIE} from '../../actions/types';

/* Utils */
import SnackBarHandler from '../../utils/SnackBarHandler';

const placeholderPickerVehicles = {
  label: 'Selecione Placa',
  value: null,
  color: '#9EA0A4',
};

class FreightOffersClass extends Component {
  constructor(props) {
    super(props);
    this.ref = {};
    this.state = {
      offers: [],
      shippingCompanies: [],
      shippingCompanieId: null,
      loading: true,
      show: false,
      showApproved: false,
      showReproved: false,
      showPreference: false,
      showValidation: false,
      vehicleId: null,
      activeId: 0,
      myOffers: true,
      othersOffers: false,
      savedOffers: 0,
      isFetching: false,
      showRefreshVehicle: false,
      showWish: false,
      disabledActions: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', async () => {
      const promises = await Promise.all([
        getOffersFavorite(this.props.cnh.id),
        this.fethShippingCompanies(),
      ]);

      // let savedOffers = await getOffersFavorite(this.props.cnh.id)
      let savedOffers = promises[0];

      if (this.state.vehicleId && this.state.myOffers) {
        this.getMyVehicle();
      }

      if (this.state.vehicleId && this.state.othersOffers) {
        this.getOthersVehicles();
      }

      if (savedOffers && savedOffers.demandas) {
        savedOffers = savedOffers.demandas.length;
      }

      if (this.props.freightWish.length > 0) {
        this.setState(
          {
            vehicleId: parseInt(this.props.freightWish[0].veiculo_id),
            savedOffers:
              savedOffers[0] && savedOffers[0].demandas
                ? savedOffers[0].demandas.length
                : 0,
          },
          () => this.renderPlates(),
        );
      }

      if (this.props.freightWish.length == 0) {
        this.setState(
          {
            showWish: true,
            savedOffers:
              savedOffers[0] && savedOffers[0].demandas
                ? savedOffers[0].demandas.length
                : 0,
          },
          () => this.renderPlates(),
        );
      }
    });
  }

  getMyVehicle = () => {
    if (this.state.vehicleId) {
      getOffersMyVehicle(
        // getOffersFavorite(
        this.props.cnh.id,
        this.props.preferences.ativo == 1,
        this.state.vehicleId,
      )
        .then((data) => {
          this.setState({
            offers: data[0].demandas || [],
            loading: false,
          });
        })
        .catch(() => this.setState({loading: false}));
    } else {
      this.setState({loading: false});
    }
  };

  getOthersVehicles = () => {
    if (this.state.vehicleId) {
      getOffersOthersVehicles(
        this.props.cnh.id,
        this.props.preferences.ativo == 1,
        this.state.vehicleId,
      )
        .then((data) => {
          this.setState({
            offers: data[0].demandas || [],
            loading: false,
          });
        })
        .catch(() => this.setState({loading: false}));
    } else {
      this.setState({loading: false});
    }
  };

  fethShippingCompanies = async () => {
    if (!this.props.cnh.id) {
      return;
    }

    const shippingCompanies = await getShippingCompanies(this.props.cnh.id);

    let shippingCompanie = null;
    let shippingCompanieId = null;

    if (shippingCompanies.length) {
      shippingCompanie = shippingCompanies[0];

      shippingCompanieId = shippingCompanie.id;
    }

    this.setState(
      {
        shippingCompanies,
        shippingCompanieId,
      },
      () => this.props.setShippingCompanie(shippingCompanie),
    );
  };

  setOffer = (item, liked) => {
    const {t} = this.props;

    setOfferFavorite(this.props.cnh.id, item.id, this.state.vehicleId, liked)
      .then(() =>
        this.setState(
          {
            loading: false,
            savedOffers: this.state.savedOffers + 1,
            activeId: 0,
            offers: this.state.offers.filter((offer) => offer.id != item.id),
          },
          () =>
            setTimeout(
              () =>
                Snackbar.show({
                  title: t('menu.offers.offers.saved-in'),
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'green',
                }),
              500,
            ),
        ),
      )
      .catch(() => this.setState({loading: false}));
  };

  changeOffer = (item, liked) => {
    alterOfferFavorite(this.props.cnh.id, item.id, liked)
      .then(() =>
        this.setState(
          {
            loading: true,
          },
          () => this.getMyVehicle(),
        ),
      )
      .catch(() => this.setState({loading: false}));
  };

  renderPlates = () => {
    const {vehicleId} = this.state;

    const itemValue = vehicleId;
    let item =
      itemValue == null
        ? ''
        : this.props.vehicles.find((item) => item.value === vehicleId);
    if (this.state.myOffers) {
      this.setState(
        {
          vehicleId: itemValue,
          vehicle: itemValue != null ? item : {},
          showRefreshVehicle:
            itemValue == null
              ? false
              : item.tipo_veiculo.requer_carreta == 0 &&
                (!item.tipo_carroceria ||
                  !item.rastreador_id ||
                  !item.metros_cubicos ||
                  !item.toneladas ||
                  !item.pallets ||
                  !item.tipo_combustivel_id)
              ? false
              : item.tipo_veiculo.requer_carreta == 1 &&
                (!item.tipo_carroceria ||
                  !item.rastreador_id ||
                  !item.tipo_combustivel_id)
              ? true
              : false,
          loading: true,
        },
        () => {
          itemValue
            ? this.getMyVehicle()
            : this.setState({
                offers: [],
                loading: false,
              });
        },
      );
    } else {
      this.setState(
        {
          vehicleId: itemValue,
          vehicle: itemValue != null ? item : {},
          showRefreshVehicle:
            itemValue == null
              ? false
              : item.tipo_veiculo.requer_carreta == 0 &&
                (!item.tipo_carroceria ||
                  !item.rastreador_id ||
                  !item.metros_cubicos ||
                  !item.toneladas ||
                  !item.pallets ||
                  !item.tipo_combustivel_id)
              ? false
              : item.tipo_veiculo.requer_carreta == 1 &&
                (!item.tipo_carroceria ||
                  !item.rastreador_id ||
                  !item.tipo_combustivel_id)
              ? true
              : false,
          loading: true,
        },
        () => {
          itemValue
            ? this.getOthersVehicles()
            : this.setState({
                offers: [],
                loading: false,
              });
        },
      );
    }
  };

  renderSwitch = () => {
    return (
      <View style={styles.containerSwitch}>
        <View style={styles.containerItemsSwitch}>
          <Button
            title={'for-my-vehicle'}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 16,
              color: this.state.myOffers ? 'white' : '#A2A1A1',
            }}
            disabled={this.state.myOffers}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: this.state.myOffers
                  ? global.COLOR_MAIN
                  : '#E4E4E4',
                borderRadius: 10,
                height: 60,
              },
            ]}
            onPress={() =>
              this.setState(
                {
                  loading: true,
                  myOffers: true,
                  othersOffers: false,
                  activeId: 0,
                  offers: [],
                },
                () => this.getMyVehicle(),
              )
            }
          />
          <Button
            title={'other-offers'}
            disabled={this.state.othersOffers}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 16,
              color: this.state.othersOffers ? 'white' : '#A2A1A1',
              textAlign: 'center',
            }}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: this.state.othersOffers
                  ? global.COLOR_MAIN
                  : '#E4E4E4',
                borderRadius: 10,
                height: 60,
              },
            ]}
            onPress={() =>
              this.setState(
                {
                  loading: true,
                  othersOffers: true,
                  myOffers: false,
                  activeId: 0,
                  offers: [],
                },
                () => this.getOthersVehicles(),
              )
            }
          />
        </View>
      </View>
    );
  };

  onShare = (item) => {
    const {t} = this.props;

    captureRef(this.ref[`${item.id}`], {format: 'jpg', quality: 0.9})
      .then((uri) => {
        Share.open({
          title: t('menu.offers.offers.shared-by'),
          message: `${item.cidade_origem} X ${item.cidade_destino} ${'\n'} ${t(
            'menu.offers.offers.lets-ride-bud',
          )} ${'\n'} http://bit.ly/AGV_GO`,
          url: uri,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => err && console.log(err.message));
      })
      .catch((error) => console.log(error.message));
  };

  renderItems = ({item}, index) => {
    const {t} = this.props;

    return (
      <View
        key={index}
        style={{
          paddingVertical: 10,
          alignItems: 'center',
          width,
          backgroundColor: 'transparent',
          // zIndex: 0
        }}
        ref={(shot) => (this.ref[`${item.id}`] = shot)}>
        {this.state.activeId == item.id && item.preferencia_moto && (
          <TouchableOpacity
            onPress={() => this.setState({showPreference: true})}
            style={{
              // position: 'absolute',
              marginLeft: 18,
              marginTop: 23,
              left: 1,
              // zIndex: 0,
              // elevation: 4
            }}>
            <Image
              source={require('../../imgs/quality_white.png')}
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
        )}
        <Card containerStyle={styles.card}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                activeId: this.state.activeId == item.id ? 0 : item.id,
              })
            }
            style={styles.containerHeader}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={styles.containerTitle}>
                <Text style={styles.title}>
                  <Text>
                    {item.origem_uf}
                    {'\n'}
                  </Text>
                  <Text>{item.destino_uf}</Text>
                </Text>
              </View>
              <Image
                source={require('../../imgs/points.png')}
                style={{height: 40, width: 40}}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.containerBody}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                {this.state.activeId === item.id && (
                  <View>
                    <Text style={styles.text}>
                      <Text style={styles.label}>
                        {t('menu.offers.offers.origin')}:{' '}
                      </Text>
                      <Text>{item.origem}</Text>
                    </Text>
                    <Text style={styles.text}>
                      <Text style={styles.label}>
                        {t('menu.offers.offers.destiny')}:{' '}
                      </Text>
                      <Text>{item.destino}</Text>
                    </Text>
                  </View>
                )}
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.vehicle')}:{' '}
                  </Text>
                  <Text>{item.veiculo}</Text>
                </Text>
                {this.state.activeId !== item.id ? (
                  <Text style={styles.text}>
                    <Text style={styles.label}>
                      {t('menu.offers.offers.amount')}:{' '}
                    </Text>
                    <Text>{item.valor_frete}</Text>
                  </Text>
                ) : (
                  <Text style={styles.text}>
                    <Text style={styles.label}>
                      {t('menu.offers.offers.distance')}:{' '}
                    </Text>
                    <Text>{item.distancia}</Text>
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.setState({activeId: item.id}, () =>
                    setTimeout(() => this.onShare(item), 0),
                  )
                }>
                <Image
                  source={require('../../imgs/share.png')}
                  style={styles.imageShare}
                />
              </TouchableOpacity>
            </View>
            {this.state.activeId === item.id && (
              <View>
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.weight')}:{' '}
                  </Text>
                  <Text>{item.peso}</Text>
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.load-type')}:{' '}
                  </Text>
                  <Text>{item.tipo_carga}</Text>
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.collection')}:{' '}
                  </Text>
                  <Text>{item.coleta}</Text>
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.delivery-date')}:{' '}
                  </Text>
                  <Text>{item.entrega}</Text>
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.freight-amount')}:{' '}
                  </Text>
                  <Text>{item.valor_frete}</Text>
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>
                    {t('menu.offers.offers.payment')}:{' '}
                  </Text>
                  <Text>{item.meio_pag}</Text>
                </Text>
                {this.state.myOffers && (
                  <View style={styles.containerButtons}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({loading: true}, () =>
                          this.changeOffer(item, false),
                        )
                      }>
                      <Image
                        source={require('../../imgs/delete_active.png')}
                        style={{
                          height: 40,
                          width: 40,
                        }}
                      />
                    </TouchableOpacity>
                    <Button
                      title={'Quero essa'}
                      titleStyle={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'white',
                      }}
                      // disabled={
                      // 	this.state.disabledActions
                      // }
                      buttonStyle={[
                        styles.button,
                        {
                          backgroundColor: '#A1A1A1',
                          borderRadius: 50,
                          height: 50,
                        },
                      ]}
                      onPress={() =>
                        this.state.disabledActions
                          ? SnackBarHandler.error(
                              t('menu.offers.offers.select-plate-message'),
                            )
                          : this.setState({
                              show: true,
                              activeId: item.id,
                            })
                      }
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({loading: true}, () =>
                          this.setOffer(item, true),
                        )
                      }>
                      <Image
                        source={require('../../imgs/like_inactive.png')}
                        style={{
                          height: 40,
                          width: 40,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {this.state.activeId != item.id && item.preferencia_moto && (
              <TouchableOpacity
                onPress={() => this.setState({showPreference: true})}
                style={{
                  // position: 'absolute',
                  marginTop: 70,
                  marginLeft: 10,
                  // zIndex: 0
                }}>
                <Image
                  source={require('../../imgs/quality_blue.png')}
                  style={styles.imageShare}
                />
              </TouchableOpacity>
            )}
          </View>
          {this.state.activeId !== item.id && (
            <View style={styles.containerFooter}>
              <Button
                title={'spy'}
                titleStyle={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: 'white',
                }}
                buttonStyle={[
                  styles.button,
                  {
                    backgroundColor: '#A1A1A1',
                    borderRadius: 50,
                  },
                ]}
                onPress={() => this.setState({activeId: item.id})}
              />
            </View>
          )}
        </Card>
      </View>
    );
  };

  onRefresh = () => {
    if (this.state.myOffers) {
      this.setState(
        {
          loading: true,
          myOffers: true,
          othersOffers: false,
          activeId: 0,
        },
        () => this.getMyVehicle(),
      );
    } else {
      this.setState(
        {
          loading: true,
          othersOffers: true,
          myOffers: false,
          activeId: 0,
        },
        () => this.getOthersVehicles(),
      );
    }
  };

  renderList = () => {
    return (
      <FlatList
        data={this.state.offers}
        renderItem={this.renderItems}
        keyExtractor={(item) => String(item.id)}
        extraData={this.state}
        ref={(ref) => (this.flat = ref)}
      />
    );
  };

  renderButtonSaves = () => {
    const {t} = this.props;

    return (
      <Button
        title={'liked-offers'}
        badge={this.state.loading ? false : this.state.savedOffers > 0}
        badgeText={this.state.loading ? '' : String(this.state.savedOffers)}
        badgeStyle={styles.badgeStyle}
        titleStyle={{
          alignSelf: 'center',
          fontSize: 16,
          color: 'white',
          fontWeight: 'bold',
        }}
        onPress={() =>
          this.state.disabledActions
            ? SnackBarHandler.error(
                t('menu.offers.offers.select-plate-message'),
              )
            : this.props.navigation.navigate('freightOffersSavedStack')
        }
        buttonStyle={{
          width,
          height: 50,
          backgroundColor: global.COLOR_MAIN,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
        }}
      />
    );
  };

  gambysAgv = () => {
    this.setState({showValidation: true});
    setTimeout(() => {
      var min = 1;
      var max = 10;
      var rand = min + Math.random() * (max - min);

      this.setState({
        showValidation: false,
        showReproved: rand < 5,
        showApproved: rand >= 5,
      });
    }, 2000);
  };

  renderModalValidation = () => {
    return (
      <Modal
        isVisible={this.state.showValidation}
        title={'actions.freigth-offers.validating-travel'}
        body={
          <View style={{alignItems: 'center', alignContent: 'center'}}>
            <LoadingTimer />
          </View>
        }
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModalApproved = () => {
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.showApproved}
        title={'actions.freigth-offers.approved-freight'}
        body={
          <View style={{alignItems: 'center', alignContent: 'center'}}>
            <Image
              source={require('../../imgs/approved.png')}
              style={{width: 120, height: 100}}
            />
            <Text
              style={[
                styles.text,
                {
                  textAlign: 'center',
                  color: global.COLOR_MAIN,
                },
              ]}>
              {t('menu.offers.offers.congrats')}
            </Text>
          </View>
        }
        buttons={[
          {
            onPress: () => this.setState({showApproved: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModalReproved = () => {
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.showReproved}
        title={'actions.freigth-offers.it-wasnt-this-time'}
        body={
          <View style={{alignItems: 'center', alignContent: 'center'}}>
            <Image
              source={require('../../imgs/reproved.png')}
              style={{width: 100, height: 100}}
            />
            <Text
              style={[
                styles.text,
                {
                  textAlign: 'center',
                  color: global.COLOR_MAIN,
                },
              ]}>
              {t('menu.offers.offers.offer-unavailable-warning')}
            </Text>
          </View>
        }
        buttons={[
          {
            onPress: () => this.setState({showReproved: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModalPreference = () => {
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.showPreference}
        title={'attention'}
        body={
          <View style={{flexDirection: 'row', width: width / 1.4}}>
            <View style={{flex: 1}}>
              <Image
                source={require('../../imgs/quality_blue.png')}
                style={{width: 80, height: 80}}
              />
            </View>
            <View style={{flex: 2}}>
              <Text style={styles.text}>
                {t('menu.offers.offers.travel-preference-warning')}
              </Text>
              <Button
                title={'actions.freigth-offers.my-preferences'}
                titleStyle={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: 'white',
                }}
                buttonStyle={[
                  styles.button,
                  {
                    backgroundColor: '#A1A1A1',
                    borderRadius: 50,
                  },
                ]}
                onPress={() =>
                  this.setState({showPreference: false}, () =>
                    this.props.navigation.navigate('freightPreferencesStack'),
                  )
                }
              />
            </View>
          </View>
        }
        buttons={[
          {
            onPress: () => this.setState({showPreference: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModal = () => {
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.show}
        title={'actions.freigth-offers.do-you-accept'}
        bodyText={'actions.freigth-offers.ok-bud'}
        buttons={[
          {
            onPress: () => this.setState({show: false, activeId: 0}),
            text: 'back',
            backgroundColor: 'red',
          },
          {
            // onPress: () => this.setState({ show: false }, () => this.gambysAgv()),
            onPress: this.handleFreightAccepted,
            text: 'confirm',
            backgroundColor: 'green',
          },
        ]}
      />
    );
  };

  renderModalWish = () => {
    return (
      <Modal
        isVisible={this.state.showWish}
        title={'attention'}
        bodyText={'actions.freigth-offers.without-car-warning'}
        buttons={[
          {
            onPress: () => this.setState({showWish: false}),
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () =>
              this.setState({showWish: false}, () =>
                this.props.navigation.navigate('freightWishStack'),
              ),
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalRefreshVehicle = () => {
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.showRefreshVehicle}
        title={'attention'}
        bodyText={'actions.freigth-offers.update-needed-warning'}
        buttons={[
          {
            onPress: () => this.setState({showRefreshVehicle: false}),
            text: 'later',
            backgroundColor: 'gray',
          },
          {
            onPress: () =>
              this.setState({showRefreshVehicle: false}, () =>
                this.props.navigation.navigate('myRegisterCarStack', {
                  id: this.state.vehicleId,
                }),
              ),
            text: 'now',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  /*************************************************
   * Métodos do ACEITE DO FRENTE
   *************************************************/
  handleAcceptanceOptions = (vehicleValue, shippingCompanieValue) => {
    const isDisabled = !vehicleValue || !shippingCompanieValue;
    this.setState({disabledActions: isDisabled});

    const shippingCompanie = shippingCompanieValue
      ? this.state.shippingCompanies.find(
          (item) => item.id === shippingCompanieValue,
        )
      : null;

    this.setState(
      {
        vehicleId: vehicleValue,
        shippingCompanieId: shippingCompanieValue,
      },
      () => this.props.setShippingCompanie(shippingCompanie),
    );
  };

  handleFreightAccepted = async () => {
    try {
      await this.setState({show: false, disabledActions: true});

      const data = {
        driver_id: this.props.login.moto_id,
        vehicle_id: this.state.vehicleId,
        bodywork_id: this.props.freightWish[0].carroceria_id
          ? this.props.freightWish[0].carroceria_id
          : '',
        offer_id: this.state.activeId,
        shipping_company_id: this.state.shippingCompanieId,
      };

      setTimeout(() => {
        this.setState({showValidation: true});
      }, 1000);

      const returnAcceptOffer = await acceptOffer(data);
      const {accepted} = returnAcceptOffer;

      this.setState({
        showValidation: false,
        disabledActions: false,
        activeId: 0,
      });
      setTimeout(() => {
        this.setState({
          showReproved: !accepted,
          showApproved: accepted,
        });
      }, 1000);
    } catch (err) {
      this.setState({disabledActions: false, activeId: 0});
      SnackBarHandler.error(err);
    }
  };

  render() {
    const dataShippingCompanies = this.state.shippingCompanies.map((item) => {
      return {
        value: item.id,
        label: item.raz,
      };
    });

    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        <View style={styles.plate} />
        {/* {this.renderPlates()} */}
        {this.renderModalPreference()}
        {this.renderModal()}
        {this.renderModalWish()}
        {this.renderModalApproved()}
        {this.renderModalReproved()}
        {this.renderModalValidation()}
        {this.renderModalRefreshVehicle()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingBottom: 50,
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={() => this.onRefresh()}
            />
          }>
          {this.renderSwitch()}
          {this.renderList()}
        </ScrollView>

        {this.state.loading ? null : (
          <AcceptanceOptions
            vehicle={{
              data: this.props.vehicles,
              value: this.state.vehicleId,
            }}
            shippingCompanie={{
              data: dataShippingCompanies,
              value: this.state.shippingCompanieId,
            }}
            save={this.handleAcceptanceOptions}
          />
        )}
        {this.renderButtonSaves()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: loginSelector(state),
    vehicles: vehiclesSelector(state, true),
    freightWish: freightWishSelector(state),
    cnh: cnhSelector(state),
    preferences: freightPreferencesSelector(state),
    shippingCompanie: shippingCompanieSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShippingCompanie: (shippingCompanie) =>
      dispatch({
        type: SET_SHIPPING_COMPANIE,
        payload: shippingCompanie,
      }),
  };
};

const FreightOffers = withTranslation('screens')(FreightOffersClass);
export default connect(mapStateToProps, mapDispatchToProps)(FreightOffers);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  plate: {
    height: 50,
    backgroundColor: 'white',
    width,
    justifyContent: 'center',
    // flexDirection: 'row'
  },
  containerSwitch: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerItemsSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    width: width / 1.1,
  },
  card: {
    marginBottom: 10,
    backgroundColor: 'white',
    // elevation: 4,
    borderTopWidth: 0,
    borderRadius: 20,
  },
  containerHeader: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TITLE_CARD,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  containerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  title: {
    width: width / 1.5,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerBody: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  imageShare: {
    height: 50,
    width: 50,
  },
  containerFooter: {
    alignItems: 'center',
    marginVertical: 10,
  },
  containerButtons: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: width / 2.3,
  },
  text: {
    margin: 2,
    fontSize: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  badgeStyle: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 50,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    zIndex: 1,
    marginRight: width / 3.4,
  },
});
