import React, { Component } from 'react';
import {
	connect
} from 'react-redux';
import {
	View,
	Dimensions,
	ScrollView,
	Text,
	StyleSheet
} from 'react-native';
import {
	TextInputMask
} from 'react-native-masked-text';
import ReactNativePicker from 'react-native-picker-select';
import { StackActions } from 'react-navigation';
import {
	Button,
	Card,
	Loading,
	Modal
} from '../../components';
import {
	set as setTruckBody,
	getById,
	getTruckBodiesByCnhId
} from '../../actions/truckBody';
import {
	truckBodyTypesSelector,
	trackerTypesSelector,
	cnhSelector,
	truckBodiesSelector
} from '../../reducers/selectors';

const placeholderPicker = {
	label: 'Selecione',
	value: null,
	color: '#9EA0A4'
};

const placeholderPickerTruckBodies = {
	label: '',
	value: null,
	color: '#9EA0A4'
};

const {
	width
} = Dimensions.get('window');

class MyRegisterTruckBody extends Component {

	constructor(props) {
		super(props);
		this.state = {
			truckBodyId: props.navigation.getParam('id'),
			loading: false,
			showSuccess: false,
			showError: false,
			message: '',
			plate: ''
		}
	}

	componentDidMount() {
		if (this.state.truckBodyId) {
			this.setState({ loading: true }, () => {
				getById(this.state.truckBodyId)
					.then((data) => {
						const {
							placa,
							tipo_carrocerias_id,
							rastreador_id,
							pallets,
							toneladas,
							metros_cubicos
						} = data;
						this.setState({
							plate: placa,
							typeTruckBody: parseInt(tipo_carrocerias_id),
							tracker: parseInt(rastreador_id),
							pallets: pallets,
							ton: toneladas,
							m3: metros_cubicos,
							loading: false
						});
					}).catch(() => this.setState({ loading: false }));
			});
		}
	}

	onSubmitSave = () => {
		const cnhId = this.props.cnh.id;
		setTruckBody({ ...this.state, cnhId })
			.then(({ message }) => {
				this.setState({ loading: false, message });
				setTimeout(() => this.setState({ showSuccess: true }, () => this.props.dispatch(getTruckBodiesByCnhId(this.props.cnh.id))), 500);
			})
			.catch((error) => {
				this.setState({ loading: false, message: error.message });
				setTimeout(() => this.setState({ showError: true }), 500);
			});
	}

	renderPlate = () => {
		return (
			<View>
				<Text style={styles.titleStyle}>
					Carroceria
				</Text>
				<Card>
					<View style={styles.containerPlate}>
						<View style={styles.plateText}>
							<Text style={[styles.titlePlate, { color: 'white', fontSize: 20 }]}>
								PLACA
							</Text>
						</View>
						<View style={styles.plate}>
							<ReactNativePicker
								selectedValue={this.state.truckBodyId}
								value={this.state.truckBodyId}
								useNativeAndroidPickerStyle={false}
								style={{
									inputAndroid: {
										textAlign: 'center',
										alignItems: 'center',
										width: (width / 1.1),
										fontSize: 30,
										borderRadius: 8,
										color: 'black',
										fontWeight: 'bold'
									},
									inputIOS: {
										textAlign: 'center',
										alignItems: 'center',
										width: (width / 1.1),
										fontSize: 30,
										borderRadius: 8,
										color: 'black',
										fontWeight: 'bold'
									},
								}}
								onValueChange={(itemValue) => {
									this.setState({
										truckBodyId: itemValue
									})
								}}
								placeholder={placeholderPickerTruckBodies}
								items={this.props.truckBodies}
							/>
						</View>
					</View>
				</Card>
			</View>
		);
	}

	renderForm = () => {
		return (
			<View style={styles.containerForm}>
				<Text style={styles.titleStyle}>
					Tipo carroceria
				</Text>
				<View style={styles.containerPicker}>
					<ReactNativePicker
						selectedValue={this.state.typeTruckBody}
						value={this.state.typeTruckBody}
						onValueChange={(itemValue, itemIndex) =>
							this.setState({ typeTruckBody: itemValue })
						}
						placeholder={placeholderPicker}
						items={this.props.truckBodyTypes}
					/>
				</View>
				<Text style={styles.titleStyle}>
					Rastreador
				</Text>
				<View style={styles.containerPicker}>
					<ReactNativePicker
						selectedValue={this.state.tracker}
						value={this.state.tracker}
						onValueChange={(itemValue, itemIndex) =>
							this.setState({ tracker: itemValue })
						}
						placeholder={placeholderPicker}
						items={this.props.trackerTypes}
					/>
				</View>
			</View>
		);
	}

	renderInfo = () => {
		return (
			<View style={styles.containerInfo}>
				<View style={styles.containerHorizontal}>
					<View style={styles.containerCapacity}>
						<Text style={styles.titleInfo}>
							Pallets
						</Text>
						<TextInputMask
							refInput={(ref) => this.pallets = ref}
							onSubmitEditing={() => this.ton.focus()}
							style={styles.textInputInfo}
							type={'only-numbers'}
							value={this.state.pallets}
							onChangeText={(pallets) => this.setState({ pallets })}
							returnKeyType='next'
						/>
					</View>
					<View style={styles.containerCapacity}>
						<Text style={styles.titleInfo}>
							TONs
						</Text>
						<TextInputMask
							refInput={(ref) => this.ton = ref}
							onSubmitEditing={() => this.m3.focus()}
							style={styles.textInputInfo}
							type={'only-numbers'}
							value={this.state.ton}
							onChangeText={(ton) => this.setState({ ton })}
							returnKeyType='next'
						/>
					</View>
					<View style={styles.containerCapacity}>
						<Text style={styles.titleInfo}>
							M³
						</Text>
						<TextInputMask
							refInput={(ref) => this.m3 = ref}
							style={styles.textInputInfo}
							type={'only-numbers'}
							value={this.state.m3}
							onChangeText={(m3) => this.setState({ m3 })}
						/>
					</View>
				</View>
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
				titleStyle={{
					fontWeight: 'bold',
					alignSelf: 'center',
					fontSize: 18,
					color: 'white'
				}}
			/>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Loading show={this.state.loading} />
				<ScrollView showsVerticalScrollIndicator={false}>
					{this.renderPlate()}
					{this.renderForm()}
					{this.renderInfo()}
					{this.renderModalSuccess()}
					{this.renderModalError()}
					{this.renderButton()}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cnh: cnhSelector(state),
		truckBodyTypes: truckBodyTypesSelector(state, true),
		truckBodies: truckBodiesSelector(state, true),
		trackerTypes: trackerTypesSelector(state, true)
	};
}

export default connect(mapStateToProps)(MyRegisterTruckBody);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: global.COLOR_BACKGROUND,
		alignItems: 'center'
	},
	containerForm: {
		marginVertical: 10,
		paddingBottom: 10
	},
	containerInfo: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderRadius: 20,
		marginBottom: 10
	},
	containerHorizontal: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	plateText: {
		width: (width / 1.1),
		backgroundColor: 'blue',
		borderTopEndRadius: 15,
		borderTopStartRadius: 15,
		marginTop: 3,
		paddingVertical: 5
	},
	titlePlate: {
		fontWeight: 'bold',
		textAlign: 'center'
	},
	buttonStyle: {
		backgroundColor: global.COLOR_MAIN,
		justifyContent: 'center',
		alignItems: 'center',
		height: 60,
		marginVertical: 10,
		borderRadius: 50
	},
	plate: {
		height: 60,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		width: (width / 1.1),
		borderBottomEndRadius: 15,
		borderBottomStartRadius: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	titleInfo: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 14
	},
	textInputInfo: {
		flex: 1,
		width: (width / 5),
		paddingBottom: 3,
		paddingTop: 3,
		textAlign: 'center'
	},
	containerPicker: {
		flex: 1,
		backgroundColor: 'white',
		height: 60,
		width: (width / 1.1),
		borderRadius: 50,
		marginTop: 10,
		paddingLeft: 20,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center'
	},
	titleStyle: {
		marginTop: 10,
		color: 'black',
		fontSize: 16
	},
	containerCapacity: {
		backgroundColor: 'white',
		borderRadius: 8,
		width: (width / 5),
		alignItems: 'center'
	},
	containerPlate: {
		borderWidth: 5,
		borderRadius: 15,
		backgroundColor: 'black',
		marginVertical: 10
	}
});