import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Dimensions,
	FlatList,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import {
	loginSelector,
	truckBodiesSelector,
	vehiclesSelector,
	cnhSelector
} from '../../reducers/selectors';
import {
	Card,
	ButtonIcon,
	Loading
} from '../../components';
import {
	getVehiclesByCnhId
} from '../../actions/vehicles';
import {
	getTruckBodiesByCnhId
} from '../../actions/truckBody';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {
	width
} = Dimensions.get('window');

class MyCars extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			incompleteVehicle: false,
			incompleteBodyTruck: false
		}
	}

	async componentDidMount() {
		await this.props.dispatch(getVehiclesByCnhId(this.props.cnh.id));
		await this.props.dispatch(getTruckBodiesByCnhId(this.props.cnh.id));
		this.setState({ loading: false });
		this.props.navigation.addListener(
			'didFocus',
			() => {
				this.setState({ incompleteVehicle: false, incompleteBodyTruck: false }, () => {
					this.props.vehicles.map((item) => {
						if ((item.tipo_veiculo.requer_carreta == 0
							&& (!item.tipo_carroceria
								|| !item.rastreador_id
								|| !item.metros_cubicos
								|| !item.toneladas
								|| !item.pallets
								|| !item.tipo_combustivel_id) ||
							item.tipo_veiculo.requer_carreta == 1
							&& (!item.tipo_carroceria
								|| !item.rastreador_id
								|| !item.tipo_combustivel_id)) && !this.state.incompleteVehicle) {
							this.setState({ incompleteVehicle: true })
						}
					});
					this.props.truckBodies.map((item) => {
						if ((!item.tipo_carrocerias_id
							|| !item.rastreador_id
							|| !item.metros_cubicos
							|| !item.toneladas
							|| !item.pallets) && !this.state.incompleteBodyTruck) {
							this.setState({ incompleteBodyTruck: true })
						}
					});
				})
			}
		);
	}

	renderListCars = () => {
		if (this.props.vehicles.length > 0) {
			return (
				<Card containerStyle={styles.card}>
					<View
						style={styles.containerTitle}
					>
						<View style={styles.containerIconTitle}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={styles.title}>
									Veículos
								</Text>
								{this.state.incompleteVehicle &&
									<FontAwesome5
										name='exclamation-triangle'
										color='orange'
										size={26}
									/>
								}
							</View>
						</View>
					</View>
					<FlatList
						data={this.props.vehicles}
						renderItem={this.renderItemsCar}
						keyExtractor={(item) => item.placa}
						horizontal={true}
					/>
					{/* {this.renderButtonCar()} */}
				</Card>
			);
		}
	}

	renderItemsCar = ({ item }) => {
		if ((item.tipo_veiculo.requer_carreta == 0
			&& (!item.tipo_carroceria
				|| !item.rastreador_id
				|| !item.metros_cubicos
				|| !item.toneladas
				|| !item.pallets
				|| !item.tipo_combustivel_id) ||
			item.tipo_veiculo.requer_carreta == 1
			&& (!item.tipo_carroceria
				|| !item.rastreador_id
				|| !item.tipo_combustivel_id)) && !this.state.incompleteVehicle) {
			this.setState({ incompleteVehicle: true });
		}
		return (
			<TouchableOpacity
				onPress={() => this.props.navigation.navigate('myRegisterCarStack', { id: item.id })}
				key={item}
			>
				<Card containerStyle={styles.containerItems}>
					<View style={styles.containerPlate}>
						<View style={[styles.plateText, {
							backgroundColor: (item.tipo_veiculo.requer_carreta == 0
								&& (!item.tipo_carroceria || !item.rastreador_id || !item.metros_cubicos || !item.toneladas || !item.pallets || !item.tipo_combustivel_id)) ? 'red'
								: (item.tipo_veiculo.requer_carreta == 1
									&& (!item.tipo_carroceria || !item.rastreador_id || !item.tipo_combustivel_id)) ? 'red' : 'blue'
						}]}>
							<Text style={[styles.titlePlate, { color: 'white', fontSize: 20 }]}>
								{(item.tipo_veiculo.descricao) ? item.tipo_veiculo.descricao : 'Placa'.toUpperCase()}
							</Text>
						</View>
						<View style={styles.plate}>
							<Text style={[styles.titlePlate, { color: 'black', fontSize: 30 }]}>
								{item.placa}
							</Text>
						</View>
					</View>
				</Card>
			</TouchableOpacity>
		);
	}

	renderButtonCar = () => {
		return (
			<ButtonIcon
				onPress={() => this.props.navigation.navigate('myRegisterCarStack')}
				buttonStyle={styles.buttonIconStyle}
				nameIcon='plus'
				colorIcon='white'
			/>
		);
	}

	renderListTruckBodies = () => {
		if (this.props.truckBodies.length > 0) {
			return (
				<Card containerStyle={styles.card}>
					<View
						style={styles.containerTitle}
					>
						<View style={styles.containerIconTitle}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={styles.title}>
									Carrocerias
							</Text>
								{this.state.incompleteBodyTruck &&
									<FontAwesome5
										name='exclamation-triangle'
										color='orange'
										size={26}
									/>
								}
							</View>
						</View>
					</View>
					<FlatList
						data={this.props.truckBodies}
						renderItem={this.renderItemsTruckBody}
						keyExtractor={(item) => item.placa}
						horizontal={true}
					/>
					{/* {this.renderButtonTruckBody()} */}
				</Card>
			);
		}
	}

	renderItemsTruckBody = ({ item }) => {
		if ((!item.tipo_carrocerias_id
			|| !item.rastreador_id
			|| !item.metros_cubicos
			|| !item.toneladas
			|| !item.pallets) && !this.state.incompleteBodyTruck) {
			this.setState({ incompleteBodyTruck: true })
		}
		return (
			<TouchableOpacity
				onPress={() => this.props.navigation.navigate('myRegisterTruckBodyStack', { id: item.id })}
				key={item}
			>
				<Card containerStyle={styles.containerItems}>
					<View style={styles.containerPlate}>
						<View style={[styles.plateText, {
							backgroundColor:
								(!item.tipo_carrocerias_id || !item.rastreador_id || !item.metros_cubicos || !item.toneladas || !item.pallets) ? 'red' : 'blue'
						}]}>
							<Text style={[styles.titlePlate, { color: 'white', fontSize: 20 }]}>
								{'Placa'.toUpperCase()}
							</Text>
						</View>
						<View style={styles.plate}>
							<Text style={[styles.titlePlate, { color: 'black', fontSize: 30 }]}>
								{item.placa}
							</Text>
						</View>
					</View>
				</Card>
			</TouchableOpacity>
		);
	}

	renderButtonTruckBody = () => {
		//if (this.props.vehicles.length > 0) {
		return (
			<ButtonIcon
				onPress={() => this.props.navigation.navigate('myRegisterTruckBodyStack')}
				buttonStyle={styles.buttonIconStyle}
				nameIcon='plus'
				colorIcon='white'
			/>
		);
		// } else {
		// 	return (
		// 		<View style={{ height: 60 }} />
		// 	);
		// }
	}

	render() {
		return (
			<View style={styles.container}>
				<Loading show={this.state.loading} />
				<ScrollView showsVerticalScrollIndicator={false}>
					{this.renderListCars()}
					{this.renderListTruckBodies()}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		login: loginSelector(state),
		cnh: cnhSelector(state),
		truckBodies: truckBodiesSelector(state),
		vehicles: vehiclesSelector(state)
	};
};

export default connect(mapStateToProps)(MyCars);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: global.COLOR_BACKGROUND,
		alignItems: 'center'
	},
	card: {
		width: (width / 1.1),
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: 'white',
		elevation: 2,
		borderTopWidth: 0,
		borderRadius: 20,
		alignItems: 'center'
	},
	containerTitle: {
		borderTopStartRadius: 15,
		borderTopEndRadius: 15,
		width: (width / 1.1),
		backgroundColor: global.COLOR_LIGHT,
		height: 60,
		paddingHorizontal: 20,
		justifyContent: 'center'
	},
	title: {
		flex: 1,
		color: 'black',
		fontSize: 26,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	plateText: {
		width: (width / 1.4),
		borderTopEndRadius: 15,
		borderTopStartRadius: 15,
		marginTop: 3,
		paddingVertical: 5
	},
	plate: {
		height: 50,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		width: (width / 1.4),
		borderBottomEndRadius: 15,
		borderBottomStartRadius: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerPlate: {
		borderWidth: 5,
		borderRadius: 15,
		backgroundColor: 'black',
		marginVertical: 10
	},
	containerItems: {
		marginHorizontal: 15
	},
	titlePlate: {
		fontWeight: 'bold',
		textAlign: 'center'
	},
	buttonIconStyle: {
		height: 40,
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'blue',
		borderRadius: 20,
		margin: 10
	}
});