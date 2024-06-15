import React, { Component } from 'react';
import { View, TextInput, Dimensions, ScrollView, Switch, StyleSheet, Text } from 'react-native';
import { Button, Photo, Loading, Modal } from '../../components';
import { StackActions } from 'react-navigation';
import { set as setCnh, get as getCnh } from '../../actions/cnh';
import { loginSelector, cnhSelector, cnhTypesSelector, deviceIdSelector } from '../../reducers/selectors';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment';
import ReactNativePicker from 'react-native-picker-select';

const {
	width
} = Dimensions.get('window');

const placeholderPicker = {
	label: 'Selecione...',
	value: '',
	color: '#9EA0A4'
};

class MyRegisterDriver extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			showError: false,
			showSuccess: false,
			error: '',
			message: ''
		};
	}

	componentDidMount() {
		this.setState({ loading: true }, () => {
			this.props.dispatch(getCnh()).then((data) => {
				const { categoria_id: cnhCategory, cnh: cnhNumber, cnh_validade: cnhDate, foto_motorista: pathYou, foto_cnh: pathFrontCnh, mopp, mopp_validade: moppDate } = data;

				let moppDateFormat = moment(moppDate, 'YYYY-MM-DD');
				let cnhDateFormat = moment(cnhDate, 'YYYY-MM-DD');

				if (moppDateFormat.isValid()) {
					moppDateFormat = moppDateFormat.format('DD/MM/YYYY');
				} else {
					moppDateFormat = '';
				}

				if (cnhDateFormat.isValid()) {
					cnhDateFormat = cnhDateFormat.format('DD/MM/YYYY');
				} else {
					cnhDateFormat = '';
				}

				this.setState({
					cnhCategory: parseInt(cnhCategory),
					cnhNumber,
					cnhDate: cnhDateFormat,
					pathFrontCnh,
					pathYou,
					mopp: mopp == 1,
					moppDate: moppDateFormat,
					loading: false
				});
			}).catch(() => this.setState({ loading: false }));
		});
	}

	handlePath = (ref, path) => {
		this.setState({ [ref]: path })
	}

	onPressSave = () => {
		this.setState({
			loading: true
		}, () => {
			const { cnh: { id } } = this.props;
			this.props.dispatch(setCnh({
				driverId: this.props.driver.moto_id,
				cnh: this.state.cnhNumber,
				cnhId: id,
				cnhDate: this.state.cnhDate,
				cnhCategory: this.state.cnhCategory,
				cnhPhoto: this.state.pathFrontCnh,
				driverPhoto: this.state.pathYou,
				mopp: this.state.mopp ? 1 : 0,
				moppDate: this.state.moppDate,
				deviceId: this.props.deviceId
			}))
				.then(({ message }) => {
					this.setState({ loading: false, message });
					setTimeout(() => this.setState({ showSuccess: true }), 500);
				})
				.catch((error) => {
					this.setState({ loading: false, error: error.message });
					setTimeout(() => this.setState({ showError: true }), 500);
				})
		})
	}

	renderForm = () => {
		return (
			<View style={styles.containerForm}>
				<View style={styles.textInputsPicker}>
					<ReactNativePicker
						selectedValue={this.state.cnhCategory}
						value={this.state.cnhCategory}
						onValueChange={(itemValue, itemIndex) =>
							this.setState({ cnhCategory: itemValue })
						}
						placeholder={placeholderPicker}
						items={this.props.cnhTypes}
					/>
				</View>
				<TextInput
					ref={(input) => this.cnhNumber = input}
					style={styles.textInputs}
					onChangeText={(cnhNumber) => this.setState({ cnhNumber })}
					value={this.state.cnhNumber}
					returnKeyType='next'
					keyboardType="number-pad"
					placeholder='Número de registro CNH'
				/>
				<Text style={styles.textObs}>
					Certifique-se que sua CNH esteja válida (se vencido será bloqueado)
				</Text>
				<DateTimePicker
					style={[styles.textInputs, { marginTop: 0 }]}
					placeholder='Data de validade CNH'
					date={this.state.cnhDate}
					mode="date"
					minDate={moment().subtract(30, 'day').format("DD/MM/YYYY")}
					format="DD/MM/YYYY"
					confirmBtnText="Confirmar"
					cancelBtnText="Cancelar"
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
					onDateChange={(cnhDate) => {
						this.setState({ cnhDate });
					}}
				/>
				<View style={styles.containerMopp}>
					<Text style={styles.moppText}>
						MOPP
					</Text>
					<Switch
						onValueChange={(mopp) => this.setState({ mopp })}
						value={this.state.mopp}
					/>
				</View>
				{this.state.mopp &&
					<View>
						<Text style={styles.textObs}>
							Certifique-se que sua MOPP esteja válida (se vencido será bloqueado)
						</Text>
						<DateTimePicker
							style={[styles.textInputs, { marginTop: 0 }]}
							placeholder='Data de validade Mopp'
							date={this.state.moppDate}
							mode="date"
							minDate={moment().subtract(30, 'day').format("DD/MM/YYYY")}
							format="DD/MM/YYYY"
							confirmBtnText="Confirmar"
							cancelBtnText="Cancelar"
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
							onDateChange={(moppDate) => {
								this.setState({ moppDate });
							}}
						/>
					</View>
				}
				<View style={{ height: 5 }} />
			</View>
		);
	}

	renderImages = () => {
		return (
			<View>
				<Photo
					title='Foto da CNH aberta'
					subTitle='Tire a CNH do plástico, abra, escolha local iluminado e capriche na foto'
					path={this.state.pathFrontCnh}
					delete={(value) => this.handlePath('pathFrontCnh', value)}
					setPath={(value) => this.handlePath('pathFrontCnh', value)}
				/>
				<Photo
					title='Tire uma foto sua segurando a CNH'
					subTitle='Na foto deve aparecer apenas a sua face'
					path={this.state.pathYou}
					delete={(value) => this.handlePath('pathYou', value)}
					setPath={(value) => this.handlePath('pathYou', value)}
				/>
				<Button
					title='GRAVAR'
					onPress={this.onPressSave}
					buttonStyle={styles.buttonStyle}
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

	render() {
		return (
			<View style={styles.container}>
				{this.renderModalError()}
				{this.renderModalSuccess()}
				<Loading show={this.state.loading} />
				<ScrollView showsVerticalScrollIndicator={false}>
					{this.renderForm()}
					{this.renderImages()}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		driver: loginSelector(state),
		cnh: cnhSelector(state),
		cnhTypes: cnhTypesSelector(state, true),
		deviceId: deviceIdSelector(state)
	};
};

export default connect(mapStateToProps)(MyRegisterDriver);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: global.COLOR_BACKGROUND,
		alignItems: 'center'
	},
	containerForm: {
		marginTop: 20,
		alignItems: 'center'
	},
	textInputs: {
		width: (width / 1.1),
		height: 40,
		backgroundColor: 'white',
		marginTop: 5
	},
	textObs: {
		width: (width / 1.1),
		backgroundColor: 'white',
		marginTop: 5,
		padding: 5,
		textAlign: 'center',
		fontSize: 12
	},
	textInputsPicker: {
		width: (width / 1.1),
		height: 40,
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	buttonStyle: {
		backgroundColor: global.COLOR_MAIN,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: (width / 1.1),
		marginVertical: 10,
		borderRadius: 50
	},
	moppText: {
		fontSize: 14
	},
	containerMopp: {
		flexDirection: 'row',
		backgroundColor: 'white',
		width: (width / 1.1),
		marginTop: 5,
		padding: 5,
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});
