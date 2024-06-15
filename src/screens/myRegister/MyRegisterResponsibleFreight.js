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
    set as setResponsible,
    getByIdCNH as getResponsibleByIdCNH
} from '../../actions/responsibleFreight';
import {
    cnhSelector,
    loginSelector,
    responsibleFreightSelector
} from '../../reducers/selectors';

const {
    width
} = Dimensions.get('window');

class MyRegisterResponsibleFreight extends Component {

    constructor(props) {
        super(props);

        const { responsibleFreight: { id: responsibleId, nome: name, tel_1: telCell1, tel_2: telCell2, email } } = this.props;

        this.state = {
            responsibleId,
            name,
            telCell1,
            telCell1Formated: telCell1,
            telCell2Formated: telCell2,
            telCell2,
            email,
            isDriverResponsible: false,
            showError: false,
            showSuccess: false,
            loading: false,
            message: '',
        }
    }

    componentDidMount() {
        this.props.getResponsibleByIdCNH()
    }

    onSubmitSave = () => {
        const cnhId = this.props.cnh.id;
        setResponsible({ ...this.state, cnhId })
            .then(({ message }) => {
                this.setState({ loading: false, message });
                setTimeout(() => this.setState({ showSuccess: true }, () => this.props.getResponsibleByIdCNH()), 500);
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
                        Responsável pelo frete é o motorista
                    </Text>
                    <Switch
                        onValueChange={(isDriverResponsible) => {
                            if (isDriverResponsible) {
                                this.setState({
                                    isDriverResponsible,
                                    name: this.props.login.moto_nome,
                                    telCell1: this.props.login.moto_tel,
                                    telCell1Formated: this.props.login.moto_tel,
                                    email: this.props.login.moto_email
                                });
                            } else {
                                this.setState({ isDriverResponsible });
                            }
                        }}
                        value={this.state.isDriverResponsible}
                    />
                </View>
            </View>
        );
    }

    renderDataResponsible = () => {
        return (
            <View style={styles.containerResponsibleFreight}>
                <TextInput
                    ref={(input) => this.nameresponsibleTextInput = input}
                    onSubmitEditing={() => this.telCell1TextInput.focus()}
                    style={styles.textInputs}
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.name}
                    placeholder='Nome responsável pelo frete'
                    autoCapitalize='words'
                    returnKeyType='next'
                />
                <TextInputMask
                    refInput={(ref) => this.telCell1TextInput = ref}
                    includeRawValueInChangeText={true}
                    onSubmitEditing={() => this.telCell2TextInput.focus()}
                    style={styles.textInputs}
                    type={'cel-phone'}
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                    }}
                    value={this.state.telCell1}
                    onChangeText={(telCell1, telCell1Formated) => this.setState({ telCell1, telCell1Formated })}
                    placeholder='Tel/Cel 1'
                    returnKeyType='next'
                />
                <TextInputMask
                    refInput={(ref) => this.telCell2TextInput = ref}
                    includeRawValueInChangeText={true}
                    onSubmitEditing={() => this.emailresponsibleTextInput.focus()}
                    style={styles.textInputs}
                    type={'cel-phone'}
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                    }}
                    value={this.state.telCell2}
                    onChangeText={(telCell2, telCell2Formated) => this.setState({ telCell2, telCell2Formated })}
                    placeholder='Tel/Cel 2'
                    returnKeyType='next'
                />
                <TextInput
                    ref={(input) => this.emailresponsibleTextInput = input}
                    style={styles.textInputs}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                    keyboardType="email-address"
                    autoCapitalize='none'
                    placeholder='E-mail responsável pelo frete'
                    returnKeyType='done'
                />
            </View>
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
                onPress={() => this.setState({ loading: true }, () => this.onSubmitSave())}
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
                    {this.renderDataResponsible()}
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
        login: loginSelector(state),
        responsibleFreight: responsibleFreightSelector(state)
    }
}

export default connect(mapStateToProps, { getResponsibleByIdCNH })(MyRegisterResponsibleFreight);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: global.COLOR_BACKGROUND
    },
    containerResponsibleFreight: {
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