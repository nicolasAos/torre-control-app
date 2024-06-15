import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Dimensions,
    ScrollView,
    Text,
    View,
    TextInput,
    StyleSheet
} from 'react-native';
import { StackActions } from 'react-navigation';
import ReactNativePicker from 'react-native-picker-select';
import { Button, Photo, Modal, Loading } from '../components';
import { sendOccurence } from '../actions/occurrence';
import { loginSelector, latlongSelector } from '../reducers/selectors';
import { getDateBD } from '../configs/utils';
import { occurrenceTypesSelector } from '../reducers/selectors';
import moment from 'moment';
import { ADD_OCCURRENCED_NOTE } from '../actions/types'

const { width } = Dimensions.get('window');

const placeholderPicker = {
    label: 'TIPO DE OCORRÊNCIA',
    value: null,
    color: '#9EA0A4'
};
class OccurrenceCte extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: 0,
            loading: false,
            description: '',
            data: props.navigation.getParam('data', {}),
            cte : props.navigation.getParam('cte', {}),
            pathOccurrence1: '',
            pathOccurrence2: '',
            pathOccurrence3: '',
            show: false,
            showError: false,
            error: '',
            success: ''
        }
    }

    handlePath = (ref, path) => {
        this.setState({ [ref]: path })
    }

    setOccurrence = () => {
        const notes = this.state.data;

        const notesUpdated = notes.map(note => ({
            ...note,
            nf_oco_foto_1: this.state.pathOccurrence1,
            nf_oco_foto_2: this.state.pathOccurrence2,
            nf_oco_foto_3: this.state.pathOccurrence3,
            nf_obs: this.state.description,
            nf_lat_long_ocorrencia: this.props.latlong,
            nf_ocorrencia: this.state.type,
            nf_dt_ocorrencia: getDateBD(),
        }))

        sendOccurence(this.props.login.moto_id, notesUpdated)
            .then(async (data) => {
                const notes = this.state.data.map(note => note.nf_id);
                await this.props.setOccurrencedNote(notes);
                this.setState({ loading: false, success: 'Ocorrência salva com sucesso! Deseja confirmar as outras as outras NF-es?' });
                setTimeout(() => this.setState({ showSuccess: true }), 500);
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false, error: error.message });
                setTimeout(() => this.setState({ showError: true }), 500);
            })
    }

    renderModal = () => {
        return (
            <Modal
                isVisible={this.state.show}
                title='Atenção'
                bodyText='Deseja salvar ocorrência?'
                buttons={[
                    {
                        onPress: () => this.setState({ show: false }),
                        text: 'Não',
                        backgroundColor: 'red'
                    },
                    {
                        onPress: () => {
                            this.setState({ show: false });
                            setTimeout(() => this.setState({ loading: true }, () => this.setOccurrence()), 500);
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
                        text: 'Não',
                        backgroundColor: 'red'
                    },
                    {
                        onPress: () => this.setState({ showSuccess: false }, () => this.props.navigation.dispatch(StackActions.pop({ n: 2}))),
                        text: 'Sim',
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
                        CT-e:
                    </Text>
                    <Text style={styles.headerItem}>
                        {this.state.cte.cte_numero}
                    </Text>
                </View>
                <View style={styles.containerHeaderItem}>
                    <Text style={styles.headerLabel}>
                        Data de saída:
                    </Text>
                    <Text style={styles.headerItem}>
                        {moment(this.state.cte.rom_dt_manifesto).format('DD/MM/YYYY HH:mm')}
                    </Text>
                </View>
            </View>
        );
    }

    renderType = () => {
        return (
            <View>
                <View style={styles.containerType}>
                    <ReactNativePicker
                        selectedValue={this.state.type}
                        onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })
                        }
                        placeholder={placeholderPicker}
                        items={this.props.occurrenceTypes}
                        style={styles.textInputs}
                    />
                </View>
            </View>
        );
    }

    renderDescription = () => {
        return (
            <TextInput
                ref={(input) => this.description = input}
                style={styles.textInputs}
                onChangeText={(description) => this.setState({ description })}
                value={this.state.description}
                placeholder='DESCRIÇÃO'
            />
        );
    }

    renderPhoto = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Photo
                    path={this.state.pathOccurrence1}
                    delete={(value) => this.handlePath('pathOccurrence1', value)}
                    setPath={(value) => this.handlePath('pathOccurrence1', value)}
                />
                <Photo
                    path={this.state.pathOccurrence2}
                    delete={(value) => this.handlePath('pathOccurrence2', value)}
                    setPath={(value) => this.handlePath('pathOccurrence2', value)}
                />
                <Photo
                    path={this.state.pathOccurrence3}
                    delete={(value) => this.handlePath('pathOccurrence3', value)}
                    setPath={(value) => this.handlePath('pathOccurrence3', value)}
                />
            </View>
        );
    }

    renderButton = () => {
        return (
            <Button
                title='REGISTRAR OCORRÊNCIA'
                titleStyle={{
                    alignSelf: 'center',
                    fontSize: 14,
                    color: 'white',
                    fontWeight: 'bold'
                }}
                onPress={() => this.setState({ show: !this.state.show })}
                buttonStyle={styles.buttonStyle}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <Loading show={this.state.loading} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderPhoto()}
                    {this.renderType()}
                    {this.renderDescription()}
                    {this.renderButton()}
                    {this.renderModal()}
                    {this.renderModalError()}
                    {this.renderModalSuccess()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login: loginSelector(state),
        latlong: latlongSelector(state),
        occurrenceTypes: occurrenceTypesSelector(state, true),
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		setOccurrencedNote: (note) =>
			dispatch({
				type: ADD_OCCURRENCED_NOTE,
				payload: note
			})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OccurrenceCte);

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
        height: 160,
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 30,
        paddingLeft: 20,
        textAlignVertical: 'top',
        fontSize: 14
    },
    containerType: {
        backgroundColor: 'white',
        width: (width / 1.1),
        height: 60,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 50,
        justifyContent: 'center'
    }
});