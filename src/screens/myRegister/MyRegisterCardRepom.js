import React, { Component } from 'react';
import {
	connect
} from 'react-redux';
import {
	View,
	Text,
	Dimensions,
	ScrollView,
	StyleSheet
} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import {
	Button,
	Loading,
	Modal
} from '../../components';
import {
	getCardRepom,
	saveCardRepom
} from '../../actions/cardRepom';
import {
	loginSelector
} from '../../reducers/selectors';

const {
	width
} = Dimensions.get('window');

class MyRegisterCardRepom extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: false,
			message: '',
			loading: true,
			repom: ''
		}
	}

	componentDidMount() {
		getCardRepom(this.props.login.moto_id).then((data) => {
			if (data.cartao_pef) {
				this.setState({ repom: data.cartao_pef, loading: false });
			} else {
				this.setState({ loading: false });
			}
		}).catch((error) => {
			this.setState({ message: error, loading: false });
			setTimeout(() => this.setState({ show: true }), 500);
		});
	}

	setCardRepom = () => {
		saveCardRepom(this.props.login.moto_id, this.state.repom).then((data) => {
			if (data.cartao_pef) {
				this.setState({ repom: data.cartao_pef, loading: false, message: 'Operação realizada com sucesso' });
				setTimeout(() => this.setState({ show: true }), 500);
			} else {
				this.setState({ loading: false });
			}
		}).catch((error) => {
			this.setState({ message: error, loading: false });
			setTimeout(() => this.setState({ show: true }), 500);
		});
	}

	renderModal = () => {
		return (
			<Modal
				isVisible={this.state.show}
				title='Atenção'
				bodyText={this.state.message}
				buttons={[{
					onPress: () => this.setState({ message: '', show: false }),
					text: 'OK, entendi',
					backgroundColor: global.COLOR_MAIN
				}]}
			/>
		);
	}

	renderForm = () => {
		return (
			<View style={styles.containerForm}>
				<Text style={styles.text}>
					Cadastre seu cartão Repom
				</Text>
				<TextInputMask
					refInput={(ref) => this.repom = ref}
					onSubmitEditing={() => this.setState({ show: true, message: 'Cartão salvo com sucesso!' })}
					style={styles.textInputs}
					mask={"[0000] [0000] [0000] [0000]"}
					value={this.state.repom}
					onChangeText={(formatted, repom) => this.setState({ repom })}
					returnKeyType='done'
					keyboardType="number-pad"
				/>
				<Button
					title='SALVAR'
					titleStyle={{
						alignSelf: 'center',
						fontSize: 18,
						color: 'white',
						fontWeight: 'bold'
					}}
					onPress={() => this.setState({ loading: true }, () => this.setCardRepom())}
					buttonStyle={styles.buttonStyle}
				/>
			</View>
		);
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Loading show={this.state.loading} />
				{this.renderForm()}
				{this.renderModal()}
			</ScrollView>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		login: loginSelector(state, props)
	}
}

export default connect(mapStateToProps)(MyRegisterCardRepom);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: global.COLOR_BACKGROUND
	},
	containerForm: {
		marginTop: 20,
		alignItems: 'center'
	},
	textInputs: {
		width: (width / 1.1),
		height: 60,
		backgroundColor: 'white',
		marginVertical: 20,
		borderRadius: 50,
		paddingLeft: 20
	},
	buttonStyle: {
		backgroundColor: global.COLOR_MAIN,
		justifyContent: 'center',
		alignItems: 'center',
		height: 60,
		width: (width / 1.1),
		marginVertical: 20,
		borderRadius: 50
	},
	text: {
		color: 'black',
		fontSize: 22,
		fontWeight: 'bold'
	}
});