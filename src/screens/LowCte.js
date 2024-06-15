import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    Dimensions,
    ScrollView,
    Text,
    View,
    TextInput,
    StyleSheet
} from 'react-native';
import { StackActions } from 'react-navigation';
import {
    Button,
    Photo,
    Modal,
    Loading
} from '../components';
import {
    loginSelector,
    latlongSelector
} from '../reducers/selectors';
import {
    sendLow
} from '../actions/low';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    getParsedDate,
    getDateBD
} from '../configs/utils';
import moment from 'moment';

const {
    width
} = Dimensions.get('window');

class LowCte extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: '',
            deliveryDate: '',
            data: props.navigation.getParam('data', []),
            pathDelivery: '',
            show: false,
            showError: false,
            error: '',
            success: ''
        }
    }

    setLow = () => {
        const data = this.state.data;
        data.canhoto_img = this.state.pathDelivery;
        data.nf_lat_long_entrega = this.props.latlong;
        data.nf_dt_entrega = (this.state.deliveryDate) ? getParsedDate(this.state.deliveryDate) : '';
        data.nf_dt_canhoto = getDateBD();
        data.nf_resp_receber = this.state.name;
        sendLow(this.props.login.moto_id, data)
            .then(() => {
                this.setState({ loading: false, success: 'Entrega confirmada com sucesso!' });
                setTimeout(() => this.setState({ showSuccess: true }), 500);
            })
            .catch((error) => {
                this.setState({ loading: false, error: error.message });
                setTimeout(() => this.setState({ showError: true }), 500);
            })
    }

    renderModal = () => {
        return (
            <Modal
                isVisible={this.state.show}
                title='Atenção'
                bodyText='Deseja confirmar entrega?'
                buttons={[
                    {
                        onPress: () => this.setState({ show: false }),
                        text: 'Não',
                        backgroundColor: 'red'
                    },
                    {
                        onPress: () => {
                            this.setState({ show: false });
                            setTimeout(this.setState({ loading: true }, () => this.setLow()), 500);
                        },
                        text: 'Sim',
                        backgroundColor: global.COLOR_MAIN
                    }
                ]}
            />
        );
    }

    renderModalError = () => {
        return (
            <Modal
                isVisible={this.state.showError}
                title='Atenção'
                bodyText={this.state.error}
                buttons={[
                    {
                        onPress: () => this.setState({ showError: false }),
                        text: 'Ok, entendi',
                        backgroundColor: global.COLOR_MAIN
                    }
                ]}
            />
        );
    }

    renderModalSuccess = () => {
        return (
            <Modal
                isVisible={this.state.showSuccess}
                title='Atenção'
                bodyText={this.state.success}
                buttons={[
                    {
                        onPress: () => this.setState({ showSuccess: false }, () => this.props.navigation.dispatch(StackActions.pop())),
                        text: 'Ok, entendi',
                        backgroundColor: global.COLOR_MAIN
                    }
                ]}
            />
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.containerHeader}>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Planilha:
                    </Text>
                    <Text style={styles.headerItem}>
                        {this.state.data.ctes.rom_id}
                    </Text>
                </View>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Manifesto:
                    </Text>
                    <Text style={styles.headerItem}>
                        {this.state.data.ctes.rom_manifesto}
                    </Text>
                </View>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Data de saída:
                    </Text>
                    <Text style={styles.headerItem}>
                        {moment(this.state.data.ctes.rom_dt_manifesto).format('DD/MM/YYYY HH:mm')}
                    </Text>
                </View>
            </View>
        );
    }

    renderName = () => {
        return (
            <TextInput
                ref={(input) => this.nameTextInput = input}
                style={styles.textInputs}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Nome'
            />
        );
    }

    handlePath = (ref, path) => {
        this.setState({ [ref]: path })
    }

    renderPhoto = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Photo
                    path={this.state.pathDelivery}
                    delete={(value) => this.handlePath('pathDelivery', value)}
                    setPath={(value) => this.handlePath('pathDelivery', value)}
                />
            </View>
        );
    }

    renderDeliveryDate = () => {
        return (
            <View>
                <DateTimePicker
                    ref={(input) => this.deliveryDate = input}
                    style={styles.textInputs}
                    placeholder='Data de entrega'
                    date={this.state.deliveryDate}
                    mode="date"
                    androidMode="spinner"
                    maxDate={moment().format("DD/MM/YYYY")}
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            borderWidth: 0
                        }
                    }}
                    onDateChange={(deliveryDate) => {
                        this.setState({ deliveryDate })
                    }}
                />
                <Button
                    title='CONFIRMAR ENTREGA'
                    titleStyle={{
                        alignSelf: 'center',
                        fontSize: 14,
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                    onPress={() => this.setState({ show: true })}
                    buttonStyle={styles.buttonStyle}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <Loading show={this.state.loading} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderPhoto()}
                    {this.renderName()}
                    {this.renderDeliveryDate()}
                    {this.renderModal()}
                    {this.renderModalError()}
                    {this.renderModalSuccess()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        login: loginSelector(state, props),
        latlong: latlongSelector(state, props)
    }
}

export default connect(mapStateToProps)(LowCte);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: global.COLOR_BACKGROUND
    },
    containerHeader: {
        height: 70,
        backgroundColor: global.COLOR_TOOLBAR,
        padding: 10,
        width,
        marginBottom: 10
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
    buttonStyle: {
        backgroundColor: global.COLOR_MAIN,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: (width / 1.1),
        marginVertical: 10,
        borderRadius: 50
    },
    textInputs: {
        width: (width / 1.1),
        height: 60,
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20
    }
});