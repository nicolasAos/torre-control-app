import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import SystemSetting from 'react-native-system-setting';
import DeviceInfo from 'react-native-device-info';
import {
    Modal,
    Diagnostics
} from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {
    width
} = Dimensions.get('window');

export default class Settings extends Component {

    isAndroid = Platform.OS === 'android';

    wifiListener = null;
    locationListener = null;
    airplaneListener = null;

    constructor(props) {
        super(props);

        this.state = {
            wifiEnable: false,
            wifiStateLoading: false,
            locationEnable: false,
            locationStateLoading: false,
            diagnostic: false
        };
    }

    async componentDidMount() {
        const wifiEnable = await SystemSetting.isWifiEnabled();
        const locationEnable = await SystemSetting.isLocationEnabled();
        const airplaneEnable = await SystemSetting.isAirplaneEnabled();

        this.setState({
            wifiEnable,
            locationEnable,
            airplaneEnable
        }, async () => {
            this.wifiListener = await SystemSetting.addWifiListener((wifiEnable) => {
                this.setState({ wifiEnable })
            });
    
            this.locationListener = await SystemSetting.addLocationListener((locationEnable) => {
                this.setState({ locationEnable })
            });
    
            this.airplaneListener = await SystemSetting.addAirplaneListener((airplaneEnable) => {
                this.setState({ airplaneEnable })
            });
        });
    }

    componentWillUnmount() {
        SystemSetting.removeListener(this.wifiListener);
        SystemSetting.removeListener(this.locationListener);
        SystemSetting.removeListener(this.airplaneListener);
    }

    changeSliderNativeVol = (slider, value) => {
        slider.setNativeProps({
            value: value
        })
    }

    openAppSetting = async () => {
        await SystemSetting.openAppSystemSettings();
    }

    switchWifi = () => {
        this.setState({
            wifiStateLoading: true
        });
        SystemSetting.switchWifi(async () => {
            this.setState({
                wifiEnable: await SystemSetting.isWifiEnabled(),
                wifiStateLoading: false
            })
        });
    }

    switchLocation = () => {
        this.setState({
            locationStateLoading: true
        });
        SystemSetting.switchLocation(async () => {
            this.setState({
                locationEnable: await SystemSetting.isLocationEnabled(),
                locationStateLoading: false
            })
        });
    }

    renderModal = () => {
        return (
            <Modal
                isVisible={this.state.diagnostic}
                title='Diagnóstico'
                body={<Diagnostics />}
                buttons={[{
                    onPress: () => this.setState({ diagnostic: false }),
                    text: 'OK, entendi',
                    backgroundColor: global.COLOR_MAIN
                }]}
            />
        );
    }

    render() {
        const {
            wifiEnable,
            wifiStateLoading,
            locationEnable,
            locationStateLoading
        } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView >
                    <StatusBar />
                    {this.renderModal()}
                    <StatusView
                        title='Wifi'
                        value={wifiEnable}
                        loading={wifiStateLoading}
                        switchFunc={(value) => this.switchWifi()} />
                    <StatusView
                        title='Localização'
                        value={locationEnable}
                        loading={locationStateLoading}
                        switchFunc={(value) => this.switchLocation()} />
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => this.setState({ diagnostic: true })}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <FontAwesome
                                    name='stethoscope'
                                    color={'black'}
                                    size={30}
                                />
                            </View>
                            <Text style={[styles.btn, { flex: 4 }]}>Diagnóstico</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={this.openAppSetting}
                    >
                        <Text style={styles.btn}>Abrir Configurações App</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Text style={styles.text}>
                    Versão {DeviceInfo.getVersion()}
                </Text>
            </View>

        );
    }
}

const StatusView = (props) => {
    const {
        title,
        switchFunc,
        value,
        loading
    } = props;
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                <Text style={{ flex: 1, opacity: 0.4, paddingHorizontal: 8 }}>Status: {loading ? 'Alterando' : (value ? 'Ligado' : 'Desligado')} </Text>
                {loading && <ActivityIndicator animating={loading} />}
                <Switch
                    onValueChange={switchFunc}
                    value={value}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7E8'
    },
    head: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
    },
    card: {
        padding: 8,
        backgroundColor: '#fff',
        marginVertical: 4,
        borderRadius: 2,
        alignSelf: 'center',
        width: (width / 1.1)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8
    },
    title: {
        fontSize: 16,
        color: '#6F6F6F'
    },
    value: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
        color: '#904ED9'
    },
    split: {
        marginVertical: 16,
        height: 1,
        backgroundColor: '#ccc',
    },
    btn: {
        fontSize: 16,
        padding: 8,
        paddingVertical: 8,
        color: '#405EFF',
        alignSelf: 'center',
    },
    text: {
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16
    }
})
