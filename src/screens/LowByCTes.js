import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Text,
    View,
    StyleSheet,
    FlatList,
    Linking,
    Platform
} from 'react-native';
import { StackActions } from 'react-navigation';
import {
    Card,
    Loading,
    Modal,
    Button
} from '../components';
import {
    getCtesOffline
} from '../actions/driver';
import {
    finishedTransport
} from '../actions/transport';
import {
    latlongSelector,
    loginSelector,
    cnhSelector,
    vehiclesSelector
} from '../reducers/selectors';
import moment from 'moment';
import {
    getDateBD,
    isObjectEmpty
} from '../configs/utils';

const {
    width
} = Dimensions.get('window');

class LowByCTes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                "rom": {
                    "id": 9,
                    "moto_id": 19,
                    "rom_id_controle": 1387,
                    "rom_id": "3135255",
                    "rom_km_total": "37",
                    "rom_origem": "RSCACHOEIRINHA",
                    "rom_destino": "RSPORTO ALEGRE",
                    "rom_manifesto": "27842",
                    "rom_dt_manifesto": "2019-11-07 08:33:00.000",
                    "cte_id": 2949,
                    "cte_data": "2019-11-06",
                    "cte_chave": "43191102905424003570570000001003421462349539",
                    "cte_numero": "100342",
                    "cte_tipo_produto": "SEC",
                    "cte_previsao": "2019-11-08",
                    "cte_status": " ",
                    "cte_ordem": "2",
                    "cte_data_agenda": null,
                    "cte_local_entrega": "-30.05182,-51.20517",
                    "cte_tel_destinatario": "  ",
                    "nf_id": "5782",
                    "nf_data": "2019-11-06 00:00:00.000",
                    "nf_chave": "43191108764370000450550010000057821050515977",
                    "nf_valor": "5831.4800",
                    "nf_volume": "82.0000",
                    "nf_peso": "892.020000",
                    "nf_cli_vip": "0",
                    "nf_dt_entrega": null,
                    "nf_empresa": "2",
                    "codigo": "A0",
                    "origem": "AGV LOGISTICA - CACHOERINHA",
                    "remetente": "PREMIUM SERVICE DISTRIBUIDORA DE PRODUTO",
                    "destinatario": "CLEUSA MARIA VERONESE TRYLIO ME",
                    "destino_cidade": "PORTO ALEGRE",
                    "destino_uf": "RS",
                    "transp_codigo": "XM186",
                    "nf_resp_receber": null,
                    "nf_ocorrencia": null,
                    "parametro_checkin": true,
                    "nf_obs": null
                },
                "ctesKeys": [
                    {
                        "ctes": {
                            "id": 10,
                            "moto_id": 19,
                            "rom_id_controle": 1387,
                            "rom_id": "3135255",
                            "rom_km_total": "37",
                            "rom_origem": "RSCACHOEIRINHA",
                            "rom_destino": "RSPORTO ALEGRE",
                            "rom_manifesto": "27842",
                            "rom_dt_manifesto": "2019-11-07 08:33:00.000",
                            "cte_id": 2950,
                            "cte_data": "2019-11-06",
                            "cte_chave": "43191102905424003570570000001003531289330693",
                            "cte_numero": "100353",
                            "cte_tipo_produto": "SEC",
                            "cte_previsao": "2019-11-08",
                            "cte_status": " ",
                            "cte_ordem": "1",
                            "cte_data_agenda": null,
                            "cte_local_entrega": "-30.04932,-51.20324",
                            "cte_tel_destinatario": "  ",
                            "nf_id": "5779",
                            "nf_data": "2019-11-06 00:00:00.000",
                            "nf_chave": "43191108764370000450550010000057791392063446",
                            "nf_valor": "4449.9200",
                            "nf_volume": "139.0000",
                            "nf_peso": "427.630000",
                            "nf_cli_vip": "0",
                            "nf_dt_entrega": null,
                            "nf_empresa": "2",
                            "codigo": "A0",
                            "origem": "AGV LOGISTICA - CACHOERINHA",
                            "remetente": "PREMIUM SERVICE DISTRIBUIDORA DE PRODUTO",
                            "destinatario": "VETERINARIA AQUILA LTDA",
                            "destino_cidade": "PORTO ALEGRE",
                            "destino_uf": "RS",
                            "transp_codigo": "XM186",
                            "nf_resp_receber": null,
                            "nf_ocorrencia": null,
                            "parametro_checkin": true,
                            "nf_obs": null
                        },
                        "volTotal": 139,
                        "isOccurrence": false,
                        "isStart": false,
                        "isClosedCte": false
                    },
                    {
                        "ctes": {
                            "id": 9,
                            "moto_id": 19,
                            "rom_id_controle": 1387,
                            "rom_id": "3135255",
                            "rom_km_total": "37",
                            "rom_origem": "RSCACHOEIRINHA",
                            "rom_destino": "RSPORTO ALEGRE",
                            "rom_manifesto": "27842",
                            "rom_dt_manifesto": "2019-11-07 08:33:00.000",
                            "cte_id": 2949,
                            "cte_data": "2019-11-06",
                            "cte_chave": "43191102905424003570570000001003421462349539",
                            "cte_numero": "100342",
                            "cte_tipo_produto": "SEC",
                            "cte_previsao": "2019-11-08",
                            "cte_status": " ",
                            "cte_ordem": "2",
                            "cte_data_agenda": null,
                            "cte_local_entrega": "-30.05182,-51.20517",
                            "cte_tel_destinatario": "  ",
                            "nf_id": "5782",
                            "nf_data": "2019-11-06 00:00:00.000",
                            "nf_chave": "43191108764370000450550010000057821050515977",
                            "nf_valor": "5831.4800",
                            "nf_volume": "82.0000",
                            "nf_peso": "892.020000",
                            "nf_cli_vip": "0",
                            "nf_dt_entrega": null,
                            "nf_empresa": "2",
                            "codigo": "A0",
                            "origem": "AGV LOGISTICA - CACHOERINHA",
                            "remetente": "PREMIUM SERVICE DISTRIBUIDORA DE PRODUTO",
                            "destinatario": "CLEUSA MARIA VERONESE TRYLIO ME",
                            "destino_cidade": "PORTO ALEGRE",
                            "destino_uf": "RS",
                            "transp_codigo": "XM186",
                            "nf_resp_receber": null,
                            "nf_ocorrencia": null,
                            "parametro_checkin": true,
                            "nf_obs": null
                        },
                        "volTotal": 82,
                        "isOccurrence": false,
                        "isStart": false,
                        "isClosedCte": false
                    },
                    {
                        "ctes": {
                            "id": 7,
                            "moto_id": 19,
                            "rom_id_controle": 1387,
                            "rom_id": "3135255",
                            "rom_km_total": "37",
                            "rom_origem": "RSCACHOEIRINHA",
                            "rom_destino": "RSPORTO ALEGRE",
                            "rom_manifesto": "27842",
                            "rom_dt_manifesto": "2019-11-07 08:33:00.000",
                            "cte_id": 2948,
                            "cte_data": "2019-11-06",
                            "cte_chave": "43191102905424003570570000001003561275127850",
                            "cte_numero": "100356",
                            "cte_tipo_produto": "SEC",
                            "cte_previsao": "2019-11-08",
                            "cte_status": " ",
                            "cte_ordem": "3",
                            "cte_data_agenda": null,
                            "cte_local_entrega": "-30.09485,-51.2438",
                            "cte_tel_destinatario": "513249-8246",
                            "nf_id": "5796",
                            "nf_data": "2019-11-06 00:00:00.000",
                            "nf_chave": "43191108764370000450550010000057961102913108",
                            "nf_valor": "3538.2100",
                            "nf_volume": "59.0000",
                            "nf_peso": "570.790000",
                            "nf_cli_vip": "0",
                            "nf_dt_entrega": null,
                            "nf_empresa": "2",
                            "codigo": "A0",
                            "origem": "AGV LOGISTICA - CACHOERINHA",
                            "remetente": "PREMIUM SERVICE DISTRIBUIDORA DE PRODUTO",
                            "destinatario": "FARMACIA VETERINARIA JOCKEY CLUB LTDA",
                            "destino_cidade": "PORTO ALEGRE",
                            "destino_uf": "RS",
                            "transp_codigo": "XM186",
                            "nf_resp_receber": null,
                            "nf_ocorrencia": null,
                            "parametro_checkin": true,
                            "nf_obs": null
                        },
                        "volTotal": 60,
                        "isOccurrence": false,
                        "isStart": false,
                        "isClosedCte": false
                    },
                    {
                        "ctes": {
                            "id": 6,
                            "moto_id": 19,
                            "rom_id_controle": 1387,
                            "rom_id": "3135255",
                            "rom_km_total": "37",
                            "rom_origem": "RSCACHOEIRINHA",
                            "rom_destino": "RSPORTO ALEGRE",
                            "rom_manifesto": "27842",
                            "rom_dt_manifesto": "2019-11-07 08:33:00.000",
                            "cte_id": 2947,
                            "cte_data": "2019-11-06",
                            "cte_chave": "43191102905424003570570000001003541757484810",
                            "cte_numero": "100354",
                            "cte_tipo_produto": "SEC",
                            "cte_previsao": "2019-11-08",
                            "cte_status": " ",
                            "cte_ordem": "4",
                            "cte_data_agenda": null,
                            "cte_local_entrega": "-30.14261,-51.21769",
                            "cte_tel_destinatario": "  ",
                            "nf_id": "5781",
                            "nf_data": "2019-11-06 00:00:00.000",
                            "nf_chave": "43191108764370000450550010000057811103876610",
                            "nf_valor": "5831.9400",
                            "nf_volume": "147.0000",
                            "nf_peso": "750.110000",
                            "nf_cli_vip": "0",
                            "nf_dt_entrega": null,
                            "nf_empresa": "2",
                            "codigo": "A0",
                            "origem": "AGV LOGISTICA - CACHOERINHA",
                            "remetente": "PREMIUM SERVICE DISTRIBUIDORA DE PRODUTO",
                            "destinatario": "A GRANJA PET COMERCIAL ZONA SUL LTDA",
                            "destino_cidade": "PORTO ALEGRE",
                            "destino_uf": "RS",
                            "transp_codigo": "XM186",
                            "nf_resp_receber": null,
                            "nf_ocorrencia": null,
                            "parametro_checkin": true,
                            "nf_obs": null
                        },
                        "volTotal": 147,
                        "isOccurrence": false,
                        "isStart": false,
                        "isClosedCte": false
                    }
                ],
                "travelFinished": false
            },
            empresa: props.navigation.getParam('empresa', ''),
            romId: props.navigation.getParam('romId', ''),
            loading: false,
            show: false,
            showAvailable: false,
            showError: false,
            message: '',
            latlong: '',
            destinatario: ''
        }
    }

    componentDidMount() {
        // this.props.navigation.addListener(
        //     'didFocus',
        //     () => this.setState({ loading: true }, () => this.getCtes())
        // );
    }

    getCtes = () => {
        getCtesOffline(this.props.login.moto_id, this.state.empresa, this.state.romId)
            .then((data) => {
                this.setState({ data: data, loading: false });
                setTimeout(() => this.setState({ show: data.travelFinished }), 500);
            })
    }

    submitFinishTravel = () => {
        const item = this.state.data;
        item.rom.rom_lat_long_fim = this.props.latlong;
        item.rom.rom_resp_fim = this.props.login.moto_nome;
        item.rom.rom_fim_transp = getDateBD();

        thisthis.props.login.moto_id, this.state.empresa, this.state.romId.props.dispatch(finishedTransport(this.props.login.moto_id, item))
            .then(() => {
                if (!isObjectEmpty(this.props.cnh) && this.props.veihicles.length > 0) {
                    this.setState({ loading: false });
                    setTimeout(() => this.setState({ showAvailable: true }), 500);
                } else {
                    this.setState({ loading: false }, () => this.props.navigation.dispatch(StackActions.pop({ n: 2 })));
                }
            })
            .catch((error) => {
                this.setState({ loading: false, message: error.message })
                setTimeout(() => this.setState({ showError: true }), 500);
            });
    }

    submitMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = this.state.latlong;
        const label = this.state.destinatario;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    submitPhone = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    }

    renderHeader = () => {
        if (this.state.data.length === 0) {
            return;
        }
        return (
            <View style={styles.containerHeader}>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Planilha:
                    </Text>
                    <Text style={styles.headerItem}>
                        {this.state.data.rom.rom_id}
                    </Text>
                </View>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Manifesto:
                    </Text>
                    <Text style={styles.headerItem}>
                        {this.state.data.rom.rom_manifesto}
                    </Text>
                </View>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Data de saída:
                    </Text>
                    <Text style={styles.headerItem}>
                        {moment(this.state.data.rom.rom_dt_manifesto).format('DD/MM/YYYY HH:mm')}
                    </Text>
                </View>
            </View>
        );
    }

    renderItems = ({ item }, index) => {
        return (
            <TouchableOpacity
                onPress={() => { }}
                key={index}
            >
                <Card containerStyle={styles.card}>
                    <View
                        style={styles.containerTitle}
                    >
                        <Text style={styles.title}>
                            {item.ctes.cte_numero}
                        </Text>
                    </View>
                    <View style={styles.containerBody}>
                        <Text style={styles.textBody}>
                            Deu tudo certo com a entrega desses CT-es?
                        </Text>
                        <View style={styles.containerButton}>
                            <Button
                                onPress={() => this.props.navigation.navigate('lowCteStack', { data: item })}
                                title='ENTREGA'
                                titleStyle={{
                                    alignSelf: 'center',
                                    fontSize: 18,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                                buttonStyle={[styles.buttonStyle, { backgroundColor: (this.state.parametro_checkin && !this.state.checkInDisable) ? '#666' : global.COLOR_MAIN }]}
                                disabled={this.state.parametro_checkin && !this.state.checkInDisable}
                            />
                            <Button
                                onPress={() => this.props.navigation.navigate('occurrenceNFsCteStack', { data: item })}
                                title='OCORRÊNCIA'
                                titleStyle={{
                                    alignSelf: 'center',
                                    fontSize: 18,
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                                buttonStyle={[styles.buttonStyle, { backgroundColor: (this.state.parametro_checkin && !this.state.checkInDisable) ? '#666' : 'red' }]}
                                disabled={this.state.parametro_checkin && !this.state.checkInDisable}
                            />
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    renderList = () => {
        return (
            <FlatList
                data={this.state.data.ctesKeys}
                renderItem={this.renderItems}
                keyExtractor={(item) => item.ctes.cte_numero.toString()}
            />
        );
    }

    renderModalFinishTravel = () => {
        if (this.state.data && this.state.data.travelFinished) {
            return (
                <Modal
                    isVisible={this.state.show}
                    title='Atenção'
                    bodyText={'all-ctes-completed'}
                    buttons={[
                        {
                            onPress: () => {
                                this.setState({ show: false });
                                setTimeout(() => this.setState({ loading: true }, () => this.submitFinishTravel()), 500);
                            },
                            text: 'Ok, entendi',
                            backgroundColor: global.COLOR_MAIN
                        }
                    ]}
                />
            );
        }
    }

    renderModalError = () => {
        return (
            <Modal
                isVisible={this.state.showError}
                title='Atenção'
                bodyText={`${this.state.message}. Quando ativar, aperte o botão`}
                buttons={[
                    {
                        onPress: () => {
                            this.setState({ showError: false });
                            setTimeout(() => this.setState({ loading: true }, () => this.submitFinishTravel()), 500);
                        },
                        text: 'Ok, entendi',
                        backgroundColor: global.COLOR_MAIN
                    }
                ]}
            />
        );
    }

    renderModalAvailable = () => {
        return (
            <Modal
                isVisible={this.state.showAvailable}
                title='Atenção'
                bodyText={'E aí Parceiro, que bom que deu certo a viagem! Me diz aí, já quer se colocar disponível para uma nova viagem?'}
                buttons={[
                    {
                        onPress: () => this.setState({ showAvailable: false }, () => this.props.navigation.dispatch(StackActions.pop({ n: 2 }))),
                        text: 'NÃO',
                        backgroundColor: 'red'
                    },
                    {
                        onPress: () => this.setState({ showAvailable: false }, () => {
                            this.props.navigation.dispatch(StackActions.popToTop());
                            this.props.navigation.navigate('freightWishStack');
                        }),
                        text: 'SIM',
                        backgroundColor: global.COLOR_MAIN
                    }
                ]}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Loading show={this.state.loading} />
                {this.renderHeader()}
                {this.renderModalFinishTravel()}
                {this.renderModalError()}
                {this.renderModalAvailable()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderList()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        login: loginSelector(state, props),
        latlong: latlongSelector(state),
        cnh: cnhSelector(state),
        veihicles: vehiclesSelector(state)
    }
}

export default connect(mapStateToProps)(LowByCTes);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: global.COLOR_BACKGROUND
    },
    card: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        elevation: 2,
        borderTopWidth: 0,
        width: (width / 1.1),
        borderRadius: 20
    },
    containerTitle: {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        width: (width / 1.1),
        backgroundColor: global.COLOR_TITLE_CARD,
        height: 60,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    containerBody: {
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    label: {
        fontWeight: 'bold'
    },
    containerHeader: {
        height: 80,
        backgroundColor: global.COLOR_TOOLBAR,
        padding: 10,
        width
    },
    containerHeaderItem: {
        flexDirection: 'row'
    },
    headerLabel: {
        fontWeight: 'bold',
        color: 'white'
    },
    headerItem: {
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 5
    },
    text: {
        margin: 2,
        fontSize: 15
    },
    textBody: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
    },
    containerButton: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between'
    },
    buttonStyle: {
        width: (width / 2.7),
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        borderRadius: 50
    }
});
