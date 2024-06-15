import React from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  CheckBox,
  ScrollView,
} from 'react-native';
import {Loading} from '../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ScannerModal from '../components/ScannerModal';
import {NavigationEvents} from 'react-navigation';
import {useEffect} from 'react';
import moment from 'moment';
import Modal from 'react-native-modal';
import axios from 'axios';
const {height, width} = Dimensions.get('window');

const ProcesoCargue = ({navigation}) => {
  const date = moment(new Date());

  const [renderScanner, setRenderScanner] = useState(false);
  const [code, setCode] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalPedido, setModalPedido] = useState(false);
  const [zonasDistribucion, setZonasDistribucion] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remesaAgregada, setRemesaAgregada] = useState(0);
  const [numCajaAgregada, setNumCajaAgregada] = useState(0);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

  useEffect(() => {
    axios
      .post('http://190.145.108.98:8081/CreoServicesV4/rest/WSTraeZona', {
        CantidadZonas: '0',
      })
      .then((response) =>
        setZonasDistribucion(response.data.SDTZonaDistribucion),
      );
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalPedido = () => {
    setModalPedido(!modalPedido);
  };

  const procesarCodigo = () => {
    setLoading(true);
    const codigoSplit = code.split('U');
    setRemesaAgregada(codigoSplit[0]);
    setNumCajaAgregada(codigoSplit[1]);
    const currentTime = moment(new Date());
    axios({
      method: 'post',
      url: 'http://190.145.108.98:8081/CreoServicesV4/rest/WSValidaCargue',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'ASP.NET_SessionId=jvbjo2wsng1g10ds15t11zva',
      },
      data: JSON.stringify({
        SDTCarMerDet: {
          CarMenCdg: navigation.state.params.dataCte.no_planilla,
          CarMenDetSec: 'd8761b8c-5677-4ee3-8728-be55695aa2f1',
          CarMenDetTip: codigoSplit[4],
          CarMenDetRem: codigoSplit[0],
          CarMenDetHabEst: 0,
          CarMenDetPed: '',
          CarMenDetNumCaj: codigoSplit[1],
          CarMenDetTotCaj: codigoSplit[2],
          CarMenDetCajLei: codigoSplit[1],
          CarMenDetEstLei: 0,
          CarMenDetLoc: navigation.state.params.dataCte.cte_local_entrega,
          CarMenDetCed: navigation.state.params.idUsuario,
          CarMenDetCiu: '',
          CarMenDetDir: '',
          CarMenDetDes: '',
          CarMenDetFri: '',
          CarMenDetPesKil: 1,
          CarMenDetVal: 0,
          CarMenDetCod: '',
          CarMenDetZonCod: codigoSplit[3],
          CarMenDetObs: '',
          CarMenDetIndCar: '',
          CarMenDetFec: currentTime,
        },
      }),
    }).then((response) => {
      axios({
        method: 'post',
        url: 'http://190.145.108.98:8081/CreoServicesV4/rest/WSAgregaCargue',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'ASP.NET_SessionId=tjyviytgthj5ldpdsaxtni3s',
        },
        data: JSON.stringify({
          Tipo: 'INS',
          SDTCarMerDet: {
            CarMenCdg: navigation.state.params.dataCte.no_planilla,
            CarMenDetSec: 'd8761b8c-5677-4ee3-8728-be55695aa2f1',
            CarMenDetTip: codigoSplit[4],
            CarMenDetRem: codigoSplit[0],
            CarMenDetHabEst: 0,
            CarMenDetPed: '',
            CarMenDetNumCaj: codigoSplit[1],
            CarMenDetTotCaj: codigoSplit[2],
            CarMenDetCajLei: codigoSplit[1],
            CarMenDetEstLei: 0,
            CarMenDetLoc: navigation.state.params.dataCte.cte_local_entrega,
            CarMenDetCed: navigation.state.params.idUsuario,
            CarMenDetCiu: '',
            CarMenDetDir: '',
            CarMenDetDes: '',
            CarMenDetFri: '',
            CarMenDetPesKil: 1,
            CarMenDetVal: 0,
            CarMenDetCod: '',
            CarMenDetZonCod: codigoSplit[3],
            CarMenDetObs: '',
            CarMenDetIndCar: '',
            CarMenDetFec: currentTime,
          },
        }),
      }).then((responses) => {
        setLoading(false);
        setMostrarNotificacion(true);
        setTimeout(() => setMostrarNotificacion(false), 5000);
      });
    });

    setCode('');
  };

  return (
    <View>
      <Loading show={loading} />
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 40,
            padding: 15,
            paddingBottom: 25,
          }}>
          <Text>Número Remesa</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Número de Cajas</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
            }}>
            <Button
              title="Confirmar"
              onPress={toggleModal}
              color={global.COLOR_TITLE_CARD}
            />
            <Button
              title="Cancelar"
              onPress={toggleModal}
              color={global.COLOR_TITLE_CARD}
            />
          </View>
        </View>
      </Modal>

      <Modal isVisible={modalPedido}>
        <ScrollView
          style={{
            backgroundColor: '#fff',
            borderRadius: 40,
            padding: 15,
          }}>
          <Text>Número Pedido</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>C.Frío?</Text>
          <CheckBox value={isSelected} onValueChange={setSelection} />
          <Text>Número de Cajas</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Peso por caja (Kilos)</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Valor Declarado</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Destinatario</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Ciudad</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Dirección</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <Text>Observación</Text>
          <TextInput
            style={{borderBottomColor: '#000000', borderBottomWidth: 1}}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
              paddingBottom: 25,
            }}>
            <Button
              title="Confirmar"
              onPress={toggleModalPedido}
              color={global.COLOR_TITLE_CARD}
            />
            <Button
              title="Cancelar"
              onPress={toggleModalPedido}
              color={global.COLOR_TITLE_CARD}
            />
          </View>
        </ScrollView>
      </Modal>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#ddd',
        }}>
        <Text>Inf. Orden de Cargue</Text>
        <Text>{navigation.state.params.dataCte.nit}</Text>
      </View>

      <View style={{paddingHorizontal: 10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Ciente</Text>
          <Text>{navigation.state.params.dataCte.cliente}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Placa Vehículo</Text>
          <Text>{navigation.state.params.dataCte.placa}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Fecha</Text>
          <Text>{date.format('DD/MM/YYYY')}</Text>
        </View>
        <View
          style={{
            borderColor: 'orange',
            borderBottomWidth: 1,
            borderWidth: 5,
            height: 5,
          }}
        />
        <View>
          <Text style={{textAlign: 'center'}}>
            CARGUE DE CAJAS, ESTIBAS O HABLADORES
          </Text>
        </View>
      </View>
      <View style={{height: 20}} />
      <View>
        {mostrarNotificacion && (
          <Text style={{textAlign: 'center', paddingBottom: 5}}>
            Remesa {remesaAgregada} Caja #{numCajaAgregada} ingresada
          </Text>
        )}

        <View style={{padding: 15, backgroundColor: '#103778'}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'white'}}>Leer Mercancía</Text>
            {/* <TouchableOpacity style={styles.button} onPress={onPress}> */}
            <TouchableOpacity onPress={() => setCode('')}>
              <Text
                style={{color: 'black', backgroundColor: '#bbb', padding: 2}}>
                LIMPIAR CÓD
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                backgroundColor: 'white',
                textTransform: 'uppercase',
              }}
              placeholder="Código"
              onChangeText={setCode}
              value={code}
            />
          </View>
          <ScannerModal
            scanCallback={(data) => {
              setCode(data);
              setRenderScanner(false);
            }}
            isVisible={renderScanner}
            OnCloseModal={() => {
              setRenderScanner(false);
            }}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => setRenderScanner(true)}>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#bbb',
                  padding: 2,
                  width: 130,
                  textAlign: 'center',
                }}>
                ESCANER CAMARA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => procesarCodigo()}>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#bbb',
                  padding: 2,
                  width: 130,
                  textAlign: 'center',
                }}>
                PROCESAR
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => toggleModal()}>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#bbb',
                  padding: 2,
                  width: 130,
                  textAlign: 'center',
                }}>
                REMESA MANUAL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModalPedido()}>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#bbb',
                  padding: 2,
                  width: 130,
                  textAlign: 'center',
                }}>
                CARGAR PEDIDO
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VerCargueScreen', {
                  dataCte: navigation.state.params.dataCte,
                })
              }>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#bbb',
                  padding: 2,
                  width: 130,
                  textAlign: 'center',
                }}>
                VER CARGUE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#bbb',
                  padding: 2,
                  width: 130,
                  textAlign: 'center',
                }}>
                CERRAR CARGUE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProcesoCargue;
