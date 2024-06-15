import React, { Component } from 'react';
import {
    connect
} from 'react-redux';
import {
    View,
    TextInput,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    Switch
} from 'react-native';
import ReactNativePicker from 'react-native-picker-select';
import { StackActions } from 'react-navigation';
import {
    TextInputMask
} from 'react-native-masked-text';
import {
    Button,
    Modal,
    Loading
} from '../../components';
import {
    set as setOwner,
    getById as getOwnerById,
    getOwners
} from '../../actions/ownerVehicles';
import {
    cnhSelector,
    loginSelector
} from '../../reducers/selectors';

const personalType = [
    {
        label: 'Fisica',
        value: 'F'
    },
    {
        label: 'Juridica',
        value: 'J'
    }
];

const placeholderPicker = {
    label: 'Transportador',
    value: null,
    color: '#9EA0A4'
};

const typeCarrier = [
    {
        label: 'TAC',
        value: 'TAC',
    },
    {
        label: 'ETC',
        value: 'ETC',
    }
];

const {
    width
} = Dimensions.get('window');

class MyRegisterOwner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ownerId: props.navigation.getParam('id'),
            isCpf: 'F',
            isDriverOwner: false,
            showError: false,
            showSuccess: false,
            loading: false,
            message: ''
        }
    }

    componentDidMount() {
        if (this.state.ownerId) {
            this.setState({ loading: true }, () => {
                getOwnerById(this.state.ownerId)
                    .then((data) => {
                        const {
                            cpf_cnpj,
                            email,
                            nome,
                            rg_ie,
                            tipo_pessoa,
                            tipo_transp
                        } = data;
                        if (tipo_pessoa === 'F') {
                            this.setState({
                                isCpf: tipo_pessoa,
                                cpf: cpf_cnpj,
                                cpfFormated: cpf_cnpj,
                                name: nome,
                                rg: rg_ie,
                                typeCarrier: tipo_transp,
                                emailOwner: email,
                                loading: false
                            });
                        } else {
                            this.setState({
                                isCpf: tipo_pessoa,
                                cnpj: cpf_cnpj,
                                cnpjFormated: cpf_cnpj,
                                razao: nome,
                                ie: rg_ie,
                                typeCarrier: tipo_transp,
                                emailOwner: email,
                                loading: false
                            });
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false, message: error.message });
                        setTimeout(() => this.setState({ showSuccess: true }), 500);
                    });
            });
        }
    }

    onSubmitSave = () => {
        const cnhId = this.props.cnh.id;
        setOwner({ ...this.state, cnhId })
            .then(({ message }) => {
                this.setState({ loading: false, message });
                setTimeout(() => this.setState({ showSuccess: true }, () => this.props.dispatch(getOwners(this.props.cnh.id))), 500);
            })
            .catch((error) => {
                this.setState({ loading: false, message: error.message });
                setTimeout(() => this.setState({ showError: true }), 500);
            });
    }

    renderDriver = () => {
        return (
            <View style={styles.containerDriver}>
                <View style={styles.containerHorizontalDriver}>
                    <Text style={styles.driverText}>
                        Proprietário do veículo é o motorista
                    </Text>
                    <Switch
                        onValueChange={(isDriverOwner) => {
                            if (isDriverOwner) {
                                this.setState({
                                    isDriverOwner,
                                    name: this.props.login.moto_nome,
                                    cpf: this.props.login.moto_cpf,
                                    cpfFormated: this.props.login.moto_cpf,
                                    emailOwner: this.props.login.moto_email
                                });
                            } else {
                                this.setState({ isDriverOwner });
                            }
                        }}
                        value={this.state.isDriverOwner}
                    />
                </View>
            </View>
        );
    }

    renderCarrier = () => {
        return (
            <View style={styles.containerDriver}>
                <ReactNativePicker
                    selectedValue={this.state.typeCarrier}
                    value={this.state.typeCarrier}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ typeCarrier: itemValue })
                    }
                    placeholder={placeholderPicker}
                    items={typeCarrier}
                />
            </View>
        );
    }

    renderIsCpf = () => {
        return (
            <View style={styles.containerIsCpf}>
                <ReactNativePicker
                    selectedValue={this.state.isCpf}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                            isCpf: itemValue
                        })
                    }}
                    placeholder={{}}
                    value={this.state.isCpf}
                    items={personalType}
                />
            </View>
        );
    }

    renderDataOwnerF = () => {
        if (this.state.isCpf === 'F') {
            return (
                <View>
                    <TextInput
                        ref={(input) => this.nameTextInput = input}
                        onSubmitEditing={() => this.cpfTextInput.focus()}
                        style={styles.textInputs}
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        placeholder='Nome'
                        autoCapitalize='words'
                        returnKeyType='next'
                    />
                    <TextInputMask
                        refInput={(ref) => this.cpfTextInput = ref}
                        includeRawValueInChangeText={true}
                        onSubmitEditing={() => this.rgTextInput.focus()}
                        style={styles.textInputs}
                        type={'cpf'}
                        value={this.state.cpf}
                        onChangeText={(cpf, cpfFormated) => this.setState({ cpf, cpfFormated })}
                        placeholder='CPF'
                        returnKeyType='next'
                    />
                    <TextInput
                        ref={(input) => this.rgTextInput = input}
                        onSubmitEditing={() => this.emailOwnerTextInput.focus()}
                        style={styles.textInputs}
                        onChangeText={(rg) => this.setState({ rg })}
                        value={this.state.rg}
                        placeholder='RG'
                        returnKeyType='next'
                    />
                </View>
            );
        }
    }

    renderDataOwnerJ = () => {
        if (this.state.isCpf === 'J') {
            return (
                <View>
                    <TextInput
                        ref={(input) => this.razaoTextInput = input}
                        onSubmitEditing={() => this.cnpjTextInput.focus()}
                        style={styles.textInputs}
                        onChangeText={(razao) => this.setState({ razao })}
                        value={this.state.razao}
                        placeholder='Razão Social'
                        autoCapitalize='words'
                        returnKeyType='next'
                    />
                    <TextInputMask
                        refInput={(ref) => this.cnpjTextInput = ref}
                        includeRawValueInChangeText={true}
                        onSubmitEditing={() => this.ieTextInput.focus()}
                        style={styles.textInputs}
                        type={'cnpj'}
                        value={this.state.cnpj}
                        onChangeText={(cnpj, cnpjFormated) => this.setState({ cnpj, cnpjFormated })}
                        placeholder='CNPJ'
                        returnKeyType='next'
                    />
                    <TextInput
                        ref={(input) => this.ieTextInput = input}
                        onSubmitEditing={() => this.emailOwnerTextInput.focus()}
                        style={styles.textInputs}
                        onChangeText={(ie) => this.setState({ ie })}
                        value={this.state.ie}
                        placeholder='Inscrição estadual'
                        returnKeyType='next'
                    />
                </View>
            );
        }
    }

    renderEmail = () => {
        return (
            <TextInput
                ref={(input) => this.emailOwnerTextInput = input}
                style={styles.textInputs}
                onChangeText={(emailOwner) => this.setState({ emailOwner })}
                value={this.state.emailOwner}
                keyboardType="email-address"
                autoCapitalize='none'
                placeholder='E-mail para contato'
                returnKeyType='done'
            />
        );
    }

    renderModalSuccess = () => {
        return (
            <Modal
                isVisible={this.state.showSuccess}
                title='Atenção'
                bodyText={this.state.message}
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

    renderModalError = () => {
        return (
            <Modal
                isVisible={this.state.showError}
                title='Atenção'
                bodyText={this.state.message}
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

    renderButton = () => {
        return (
            <Button
                title='SALVAR'
                onPress={() => this.setState({ loading: true }, this.onSubmitSave())}
                buttonStyle={styles.buttonStyle}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Loading show={this.state.loading} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderDriver()}
                    {this.renderCarrier()}
                    {this.renderIsCpf()}
                    {this.renderDataOwnerF()}
                    {this.renderDataOwnerJ()}
                    {this.renderEmail()}
                    {this.renderModalError()}
                    {this.renderModalSuccess()}
                    {this.renderButton()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cnh: cnhSelector(state),
        login: loginSelector(state)
    }
}

export default connect(mapStateToProps)(MyRegisterOwner);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: global.COLOR_BACKGROUND
    },
    containerIsCpf: {
        width: (width / 1.1),
        height: 45,
        backgroundColor: 'white',
        marginBottom: 10,
        paddingLeft: 20,
        borderRadius: 50
    },
    containerOwner: {
        width: (width / 1.1),
        elevation: 2,
        marginVertical: 20,
        alignItems: 'center'
    },
    buttonStyle: {
        backgroundColor: global.COLOR_MAIN,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: (width / 1.1),
        marginBottom: 10,
        borderRadius: 50
    },
    textInputs: {
        width: (width / 1.1),
        height: 45,
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 50,
        paddingLeft: 20
    },
    containerHorizontalDriver: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 5
    },
    containerDriver: {
        backgroundColor: 'white',
        width: (width / 1.1),
        elevation: 2,
        marginVertical: 10,
        height: 50,
        justifyContent: 'center'
    },
    driverText: {
        color: 'black',
        fontSize: 16
    },
    containerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 5,
        width: (width / 1.2)
    }
});