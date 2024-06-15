import React, {useState, useEffect, useRef, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Switch,
  Dimensions,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, Loading, Modal, ButtonRegion} from '../../components';
import {
  setPreferences as setFreightPreferences,
  getPreferences as getFreightPreferences,
} from '../../actions/freightPreferences';
import {loginSelector, regionsSelector} from '../../reducers/selectors';
import Slider from 'react-native-slider';
import {NavigationContext, StackActions} from 'react-navigation';
import {TextInputMask} from 'react-native-masked-text';

import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const FreightPreferences = () => {
  const [t] = useTranslation('screens');

  const refInput = useRef();

  const dispatch = useDispatch();

  const {login, regions} = useSelector((state) => ({
    login: loginSelector(state),
    regions: regionsSelector(state, true),
  }));

  const navigation = useContext(NavigationContext);

  const [isPreferences, setIsPreferences] = useState(false);
  const [loadValueKMs, setLoadValueKMs] = useState(1);
  const [shortRoute, setShortRoute] = useState(false);
  const [longRoute, setLongRoute] = useState(false);
  const [shortValueKMs, setShortValueKMs] = useState(1);
  const [longValueKMs, setLongValueKMs] = useState(201);
  const [all, setAll] = useState(false);
  const [centroOeste, setCentroOeste] = useState(false);
  const [norte, setNorte] = useState(false);
  const [nordeste, setNordeste] = useState(false);
  const [sudeste, setSudeste] = useState(false);
  const [sul, setSul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [showDirectRoute, setShowDirectRoute] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [messageRedirect, setMessageRedirect] = useState('');
  const [messageQuestion, setMessageQuestion] = useState('');
  const [showSetKms, setShowSetKms] = useState(false);
  const [short, setShort] = useState(false);
  const [kms, setKms] = useState('');
  const [titleSetKms, setTitleSetKms] = useState('');

  useEffect(() => {
    dispatch(getFreightPreferences(login.moto_id))
      .then((data) => {
        setLoading(false);

        if (data) {
          data.destinos.map((destino) => {
            if (destino.descricao === 'SUL') {
              setSul(destino.ativo == 1 ? true : false);
            }
            if (destino.descricao === 'SUDESTE') {
              setSudeste(destino.ativo == 1 ? true : false);
            }
            if (destino.descricao === 'CENTRO OESTE') {
              setCentroOeste(destino.ativo == 1 ? true : false);
            }
            if (destino.descricao === 'NORTE') {
              setNorte(destino.ativo == 1 ? true : false);
            }
            if (destino.descricao === 'NORDESTE') {
              setNordeste(destino.ativo == 1 ? true : false);
            }
          });

          setIsPreferences(data.ativo != 0);
          setLoadValueKMs(
            data.raio_origem == 0 ? 1 : parseInt(data.raio_origem),
          );
          setShortValueKMs(
            data.raio_destino_curto == 0
              ? 1
              : parseInt(data.raio_destino_curto),
          );
          setLongValueKMs(
            data.raio_destino_longo == 0
              ? 201
              : parseInt(data.raio_destino_longo),
          );
          setShortRoute(data.raio_destino_curto == 0 ? false : true);
          setLongRoute(data.raio_destino_longo == 0 ? false : true);
        } else {
          setTimeout(() => {
            setMessageRedirect('preferences.license-required');
            setShowDirectRoute(true);
          }, 500);
        }
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          setMessageRedirect(error.message);
          setShowDirectRoute(true);
        }, 500);
      });
  }, [t, dispatch, login]);

  function setPreferences() {
    if (!isPreferences) {
      dispatch(setFreightPreferences(login.moto_id, getAllStates(), regions))
        .then(() => {
          setLoading(false);

          setTimeout(() => {
            setMessageRedirect('preferences.preferences-disabled');
            setShowDirectRoute(true);
          }, 500);
        })
        .catch((error) => {
          setLoading(false);
          setIsPreferences(true);

          setTimeout(() => {
            setMessage(error.message);
            setShowMessage(true);
          }, 500);
        });
    }
  }

  function setPreferencesButton() {
    dispatch(setFreightPreferences(login.moto_id, getAllStates(), regions))
      .then(() => {
        setLoading(false);

        setTimeout(() => {
          setMessageRedirect('preferences.preferences-saved');
          setShowDirectRoute(true);
        }, 500);
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          setMessage(error.message);
          setShowMessage(true);
        }, 500);
      });
  }

  function getAllStates() {
    return {
      isPreferences: isPreferences,
      loadValueKMs: loadValueKMs,
      shortRoute: shortRoute,
      longRoute: longRoute,
      shortValueKMs: shortValueKMs,
      longValueKMs: longValueKMs,
      all: all,
      centroOeste: centroOeste,
      norte: norte,
      nordeste: nordeste,
      sudeste: sudeste,
      sul: sul,
      loading: loading,
      showMessage: showMessage,
      message: message,
      showDirectRoute: showDirectRoute,
      showQuestion: showQuestion,
      messageRedirect: messageRedirect,
      messageQuestion: messageQuestion,
      showSetKms: showSetKms,
    };
  }

  function renderModalMessage() {
    return (
      <Modal
        isVisible={showMessage}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => setShowMessage(false),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalDirect() {
    return (
      <Modal
        isVisible={showDirectRoute}
        title="attention"
        bodyText={messageRedirect}
        buttons={[
          {
            onPress: () => {
              setShowDirectRoute(false);
              navigation.dispatch(StackActions.pop());
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalQuestion() {
    return (
      <Modal
        isVisible={showQuestion}
        title="attention"
        bodyText={messageQuestion}
        buttons={[
          {
            onPress: () => {
              setShowQuestion(false);
              setTimeout(() => setIsPreferences(true), 500);
            },
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              setShowQuestion(false);

              setTimeout(() => {
                setLoading(true);
                setPreferences();
              }, 500);
            },
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderPreferences() {
    return (
      <View style={styles.containerPreferences}>
        <View style={styles.containerHorizontalPreferences}>
          <Text style={styles.preferencesText}>
            {t('menu.offers.preferences.edit-freight-preferences')}
          </Text>
          <Switch
            onValueChange={(value) => {
              setIsPreferences(value);
              setShowQuestion(!value);
              setMessageQuestion('preferences.erase-warning');
            }}
            value={isPreferences}
            thumbTintColor={isPreferences ? '#273381' : 'white'}
            trackColor={{true: '#2E5B88', false: '#C0C0C0'}}
          />
        </View>
      </View>
    );
  }

  function renderKmPreferences() {
    if (isPreferences) {
      return (
        <View style={styles.containerCards}>
          <Text style={styles.titleText}>
            {t('menu.offers.preferences.km-to-load')}
          </Text>
          <Text style={styles.titleText}>{loadValueKMs}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.titleText, {flex: 1}]}>10</Text>
            <Slider
              step={10}
              minimumValue={10}
              maximumValue={200}
              onValueChange={(value) => {
                setLoadValueKMs(value);
              }}
              value={loadValueKMs}
              style={{flex: 5}}
              thumbTintColor={global.COLOR_MAIN}
              minimumTrackTintColor="#808080"
              maximumTrackTintColor="#C0C0C0"
              trackStyle={{height: 7}}
            />
            <Text style={[styles.titleText, {flex: 1}]}>200</Text>
          </View>
        </View>
      );
    }
  }

  function checkKms() {
    if (short && kms > 9 && kms < 191) {
      setShortValueKMs(parseInt(kms));
      setKms('');
      return;
    }
    if (!short && kms > 199 && kms < 5001) {
      setLongValueKMs(parseInt(kms));
      setKms('');
      return;
    }
    setKms('');
  }

  function renderModalSetKms() {
    return (
      <Modal
        isVisible={showSetKms}
        title="attention"
        body={
          <View>
            <Text style={styles.titleText}>{titleSetKms}</Text>
            <TextInputMask
              refInput={refInput}
              onSubmitEditing={() => {
                setShowSetKms(false);
                checkKms();
              }}
              style={styles.inputKms}
              type={'only-numbers'}
              value={kms}
              onChangeText={(value) => setKms(value)}
            />
          </View>
        }
        buttons={[
          {
            onPress: () => {
              setShowSetKms(false);
              checkKms();
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderRoutesPreferences() {
    if (isPreferences) {
      return (
        <View>
          <View style={[styles.containerCards, {borderBottomWidth: 0}]}>
            <Text style={styles.titleText}>
              {t('menu.offers.preferences.prefer-routes')}
            </Text>
          </View>
          <View
            style={[
              styles.containerCards,
              {
                width,
                borderRightWidth: 1,
                borderRightColor: '#cccccc',
                paddingVertical: 5,
              },
            ]}>
            <View style={styles.containerHorizontalPreferences}>
              <Text style={styles.preferencesText}>
                {t('menu.offers.preferences.short')}
              </Text>
              <Switch
                onValueChange={(value) => setShortRoute(value)}
                value={shortRoute}
                thumbTintColor={shortRoute ? '#273381' : 'white'}
                trackColor={{true: '#2E5B88', false: '#C0C0C0'}}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSetKms(true);
                setShort(true);
                setTitleSetKms(t('menu.offers.preferences.enter-short-km'));
              }}
              style={{marginVertical: 5}}>
              <Text style={styles.titleText}>{shortValueKMs}</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.titleText, {flex: 1}]}>10</Text>
              <Slider
                step={10}
                minimumValue={10}
                maximumValue={190}
                onValueChange={(value) => {
                  setShortValueKMs(value);
                }}
                value={shortValueKMs}
                style={{flex: 5}}
                thumbTintColor={global.COLOR_MAIN}
                minimumTrackTintColor="#808080"
                maximumTrackTintColor="#C0C0C0"
                trackStyle={{height: 7}}
              />
              <Text style={[styles.titleText, {flex: 1}]}>190</Text>
            </View>
          </View>
          <View
            style={[
              styles.containerCards,
              {
                width,
                borderLeftWidth: 1,
                borderLeftColor: '#cccccc',
                paddingVertical: 5,
              },
            ]}>
            <View style={styles.containerHorizontalPreferences}>
              <Text style={styles.preferencesText}>
                {t('menu.offers.preferences.long')}
              </Text>
              <Switch
                onValueChange={(value) => setLongRoute(value)}
                value={longRoute}
                thumbTintColor={longRoute ? '#273381' : 'white'}
                trackColor={{true: '#2E5B88', false: '#C0C0C0'}}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowSetKms(true);
                setShort(false);
                setTitleSetKms(t('menu.offers.preferences.enter-long-km'));
              }}
              style={{marginVertical: 5}}>
              <Text style={styles.titleText}>{longValueKMs}</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.titleText, {flex: 1}]}>200</Text>
              <Slider
                step={100}
                minimumValue={200}
                maximumValue={5000}
                onValueChange={(value) => {
                  setLongValueKMs(value);
                }}
                value={longValueKMs}
                style={{flex: 5}}
                thumbTintColor={global.COLOR_MAIN}
                minimumTrackTintColor="#808080"
                maximumTrackTintColor="#C0C0C0"
                trackStyle={{height: 7}}
              />
              <Text style={[styles.titleText, {flex: 1}]}>5000</Text>
            </View>
          </View>
        </View>
      );
    }
  }

  function renderRegions() {
    if (isPreferences) {
      return (
        <View
          style={[
            styles.containerCards,
            {backgroundColor: '#EFEFEF', elevation: 0, borderBottomWidth: 0},
          ]}>
          <Text style={[styles.titleText, {marginBottom: 10}]}>
            {t('menu.offers.preferences.preferred-regions')}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: width / 3}}>
              <ButtonRegion
                onPress={() => setCentroOeste(!centroOeste)}
                title="midwest"
                colorTitleEnabled="white"
                colorTitleDisabled="#ABABAB"
                enabled={centroOeste}
                colorButtonEnabled="#97E2FF"
                colorButtonDisabled="#D8D8D8"
                titleStyle={{fontWeight: 'bold'}}
              />
              <ButtonRegion
                onPress={() => setNorte(!norte)}
                title="north"
                colorTitleEnabled="white"
                colorTitleDisabled="#ABABAB"
                enabled={norte}
                colorButtonEnabled="#66CBFF"
                colorButtonDisabled="#D8D8D8"
              />
              <ButtonRegion
                onPress={() => setNordeste(!nordeste)}
                title="northeast"
                colorTitleEnabled="white"
                colorTitleDisabled="#ABABAB"
                enabled={nordeste}
                colorButtonEnabled="#3598FE"
                colorButtonDisabled="#D8D8D8"
              />
              <ButtonRegion
                onPress={() => setSudeste(!sudeste)}
                title="southeast"
                colorTitleEnabled="white"
                colorTitleDisabled="#ABABAB"
                enabled={sudeste}
                colorButtonEnabled="#205FBC"
                colorButtonDisabled="#D8D8D8"
              />
              <ButtonRegion
                onPress={() => setSul(!sul)}
                title="south"
                colorTitleEnabled="white"
                colorTitleDisabled="#ABABAB"
                enabled={sul}
                colorButtonEnabled="#22438A"
                colorButtonDisabled="#D8D8D8"
              />
            </View>
            <View
              style={{
                width: width / 1.7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../imgs/brazil.png')}
                style={{height: 230, width: width / 1.8}}
              />
              {sul && (
                <Image
                  source={require('../../imgs/sul.png')}
                  style={{
                    height: 230,
                    width: width / 1.8,
                    position: 'absolute',
                  }}
                />
              )}
              {sudeste && (
                <Image
                  source={require('../../imgs/sudeste.png')}
                  style={{
                    height: 230,
                    width: width / 1.8,
                    position: 'absolute',
                  }}
                />
              )}
              {centroOeste && (
                <Image
                  source={require('../../imgs/centrooeste.png')}
                  style={{
                    height: 230,
                    width: width / 1.8,
                    position: 'absolute',
                  }}
                />
              )}
              {nordeste && (
                <Image
                  source={require('../../imgs/nordeste.png')}
                  style={{
                    height: 230,
                    width: width / 1.8,
                    position: 'absolute',
                  }}
                />
              )}
              {norte && (
                <Image
                  source={require('../../imgs/norte.png')}
                  style={{
                    height: 230,
                    width: width / 1.8,
                    position: 'absolute',
                  }}
                />
              )}
            </View>
          </View>
        </View>
      );
    }
  }

  function renderButton() {
    if (isPreferences) {
      return (
        <Button
          title="save"
          titleStyle={{
            alignSelf: 'center',
            fontSize: 14,
            color: 'white',
            fontWeight: 'bold',
          }}
          onPress={() => {
            setLoading(true);
            setPreferencesButton();
          }}
          buttonStyle={styles.buttonStyle}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <Loading show={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderPreferences()}
        {renderKmPreferences()}
        {renderRoutesPreferences()}
        {renderModalMessage()}
        {renderModalDirect()}
        {renderModalQuestion()}
        {renderRegions()}
        {renderButton()}
        {renderModalSetKms()}
      </ScrollView>
    </View>
  );
};

export default FreightPreferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
  },
  containerPreferences: {
    backgroundColor: '#D7D9D8',
    width,
    elevation: 2,
    height: 50,
    justifyContent: 'center',
    borderBottomColor: '#aaaaaa',
    borderBottomWidth: 1,
    padding: 10,
  },
  containerHorizontalPreferences: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  preferencesText: {
    color: global.COLOR_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerCards: {
    backgroundColor: '#D7D9D8',
    elevation: 2,
    justifyContent: 'center',
    paddingVertical: 5,
    borderBottomColor: '#aaaaaa',
    borderBottomWidth: 1,
    padding: 10,
  },
  titleText: {
    textAlign: 'center',
    color: global.COLOR_MAIN,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputKms: {
    width: width / 1.5,
    height: 45,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 20,
    borderColor: '#666',
    borderWidth: 1,
  },
  containerHorizontalRegions: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 50,
  },
});
