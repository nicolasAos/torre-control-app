import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	FlatList,
	Dimensions,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Image
} from 'react-native'
import { Loading, Card, Button, Modal } from '../../components'
import {
	getOffersFavorite,
	alterOfferFavorite
} from '../../actions/freightOffers'
import {
	loginSelector,
	vehiclesSelector,
	freightWishSelector,
	cnhSelector,
	shippingCompanieSelector
} from '../../reducers/selectors'
import Share from 'react-native-share'
import { captureRef } from 'react-native-view-shot'
import Snackbar from 'react-native-snackbar'

const { width } = Dimensions.get('window')

/* Components */
import LoadingTimer from '../../components/LoadingTimer'

/* Services */
import { acceptOffer } from '../../services/FreightOffers'

class FreightOffersSaved extends Component {
	constructor(props) {
		super(props)
		this.ref = {}
		this.state = {
			offers: [],
			loading: true,
			show: false,
			showApproved: false,
			showReproved: false,
			showPreference: false,
			showValidation: false,
			showRefresh: false,
			showError: false,
			vehicleId: null,
			activeId: 0,
			disabledActions: false
		}
	}

	componentDidMount() {
		this.getMyOffersSaved()
	}

	getMyOffersSaved = () => {
		getOffersFavorite(this.props.cnh.id)
			.then((data) =>
				this.setState({
					offers: data[0].demandas || [],
					loading: false
				})
			)
			.catch((error) =>
				this.setState({
					loading: false,
					showError: true,
					message: error.message
				})
			)
	}

	removeOfferFavorite = (item) => {
		alterOfferFavorite(this.props.cnh.id, item.id, false)
			.then(() =>
				this.setState(
					{
						loading: false,
						activeId: 0,
						offers: this.state.offers.filter(
							(offer) => offer.id != item.id
						)
					},
					() =>
						setTimeout(
							() =>
								Snackbar.show({
									title: 'Removido de "OFERTAS CURTIDAS"',
									duration: Snackbar.LENGTH_SHORT,
									backgroundColor: 'green'
								}),
							500
						)
				)
			)
			.catch(() => this.setState({ loading: false }))
	}

	onShare = (item) => {
		captureRef(this.ref[`${item.id}`], { format: 'jpg', quality: 0.9 })
			.then((uri) => {
				Share.open({
					title: 'Compartilhar via',
					message: `${item.cidade_origem} X ${
						item.cidade_destino
					} ${'\n'} E aí? Vamos nessa parceiro? ${'\n'} http://bit.ly/AGV_GO`,
					url: uri
				})
					.then((res) => {
						console.log(res)
					})
					.catch((err) => err && console.log(err.message))
			})
			.catch((error) => console.log(error.message))
	}

	renderItems = ({ item }, index) => {
		return (
			<View
				key={index}
				style={{
					paddingVertical: 10,
					alignItems: 'center',
					width,
					backgroundColor: 'transparent'
				}}
				ref={(shot) => (this.ref[`${item.id}`] = shot)}
			>
				{this.state.activeId == item.id && item.preferencia_moto && (
					<TouchableOpacity
						onPress={() => this.setState({ showPreference: true })}
						style={{
							position: 'absolute',
							marginLeft: 18,
							marginTop: 23,
							left: 1,
							zIndex: 1,
							elevation: 4
						}}
					>
						<Image
							source={require('../../imgs/quality_white.png')}
							style={{ height: 30, width: 30 }}
						/>
					</TouchableOpacity>
				)}
				<Card containerStyle={styles.card}>
					<TouchableOpacity
						onPress={() =>
							this.setState({
								activeId:
									this.state.activeId === item.id
										? 0
										: item.id
							})
						}
						style={styles.containerHeader}
					>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}
						>
							<View style={styles.containerTitle}>
								<Text style={styles.title}>
									<Text>
										{item.origem_uf}
										{'\n'}
									</Text>
									<Text>{item.destino_uf}</Text>
								</Text>
							</View>
							<Image
								source={require('../../imgs/points.png')}
								style={{ height: 40, width: 40 }}
							/>
						</View>
					</TouchableOpacity>
					<View style={styles.containerBody}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}
						>
							<View>
								{this.state.activeId === item.id && (
									<View>
										<Text style={styles.text}>
											<Text style={styles.label}>
												Origem:{' '}
											</Text>
											<Text>{item.origem}</Text>
										</Text>
										<Text style={styles.text}>
											<Text style={styles.label}>
												Destino:{' '}
											</Text>
											<Text>{item.destino}</Text>
										</Text>
									</View>
								)}
								<Text style={styles.text}>
									<Text style={styles.label}>Veículo: </Text>
									<Text>{item.veiculo}</Text>
								</Text>
								{this.state.activeId !== item.id ? (
									<Text style={styles.text}>
										<Text style={styles.label}>
											Valor frete:{' '}
										</Text>
										<Text>{item.valor_frete}</Text>
									</Text>
								) : (
									<Text style={styles.text}>
										<Text style={styles.label}>
											Distância:{' '}
										</Text>
										<Text>{item.distancia}</Text>
									</Text>
								)}
							</View>
							<TouchableOpacity
								onPress={() =>
									this.setState({ activeId: item.id }, () =>
										setTimeout(() => this.onShare(item), 0)
									)
								}
							>
								<Image
									source={require('../../imgs/share.png')}
									style={styles.imageShare}
								/>
							</TouchableOpacity>
						</View>
						{this.state.activeId === item.id && (
							<View>
								<Text style={styles.text}>
									<Text style={styles.label}>Peso: </Text>
									<Text>{item.peso}</Text>
								</Text>
								<Text style={styles.text}>
									<Text style={styles.label}>
										Tipo de carga:{' '}
									</Text>
									<Text>{item.tipo_carga}</Text>
								</Text>
								<Text style={styles.text}>
									<Text style={styles.label}>Coleta: </Text>
									<Text>{item.coleta}</Text>
								</Text>
								<Text style={styles.text}>
									<Text style={styles.label}>
										Data entrega:{' '}
									</Text>
									<Text>{item.entrega}</Text>
								</Text>
								<Text style={styles.text}>
									<Text style={styles.label}>
										Valor frete:{' '}
									</Text>
									<Text>{item.valor_frete}</Text>
								</Text>
								<Text style={styles.text}>
									<Text style={styles.label}>
										Meio pagamento:{' '}
									</Text>
									<Text>{item.meio_pag}</Text>
								</Text>
								{this.state.offers && (
									<View style={styles.containerButtons}>
										<View />
										<Button
											title={'Quero essa'}
											titleStyle={{
												fontWeight: 'bold',
												fontSize: 18,
												color: 'white'
											}}
											buttonStyle={[
												styles.button,
												{
													backgroundColor: '#A1A1A1',
													borderRadius: 50,
													height: 50
												}
											]}
											disabled={
												this.state.disabledActions
											}
											onPress={() =>
												this.setState({
													show: true,
													activeId: item.id
												})
											}
										/>
										<TouchableOpacity
											onPress={() =>
												this.setState(
													{ loading: true },
													() =>
														this.removeOfferFavorite(
															item
														)
												)
											}
										>
											<Image
												source={require('../../imgs/like_active.png')}
												style={{
													height: 40,
													width: 40
												}}
											/>
										</TouchableOpacity>
									</View>
								)}
							</View>
						)}
						{this.state.activeId != item.id &&
							item.preferencia_moto && (
								<TouchableOpacity
									onPress={() =>
										this.setState({ showPreference: true })
									}
									style={{
										position: 'absolute',
										marginTop: 70,
										marginLeft: 10,
										zIndex: 1
									}}
								>
									<Image
										source={require('../../imgs/quality_blue.png')}
										style={styles.imageShare}
									/>
								</TouchableOpacity>
							)}
					</View>
					{this.state.activeId !== item.id && (
						<View style={styles.containerFooter}>
							<Button
								title='Espiar'
								titleStyle={{
									fontWeight: 'bold',
									fontSize: 18,
									color: 'white'
								}}
								buttonStyle={[
									styles.button,
									{
										backgroundColor: '#A1A1A1',
										borderRadius: 50
									}
								]}
								onPress={() =>
									this.setState({ activeId: item.id })
								}
							/>
						</View>
					)}
				</Card>
			</View>
		)
	}

	renderList = () => {
		return (
			<FlatList
				data={this.state.offers}
				renderItem={this.renderItems}
				keyExtractor={(item) => String(item.id)}
				extraData={this.state.activeId}
			/>
		)
	}

	gambysAgv = () => {
		this.setState({ showValidation: true })
		setTimeout(() => {
			var min = 1
			var max = 10
			var rand = min + Math.random() * (max - min)

			this.setState({
				showValidation: false,
				showReproved: rand < 5,
				showApproved: rand >= 5
			})
		}, 2000)
	}

	renderModalValidation = () => {
		return (
			<Modal
				isVisible={this.state.showValidation}
				title='Validando o frete'
				body={
					<View
						style={{ alignItems: 'center', alignContent: 'center' }}
					>
						{/* <Image
                            source={require('../../imgs/gears.png')}
                            style={{ width: 100, height: 100 }}
                        /> */}
						<LoadingTimer />
					</View>
				}
				bodyStyle={styles.containerBody}
				containerStyle={styles.containerStyle}
			/>
		)
	}

	renderModalApproved = () => {
		return (
			<Modal
				isVisible={this.state.showApproved}
				title='Frete aprovado'
				body={
					<View
						style={{ alignItems: 'center', alignContent: 'center' }}
					>
						<Image
							source={require('../../imgs/approved.png')}
							style={{ width: 120, height: 100 }}
						/>
						<Text
							style={[
								styles.text,
								{
									textAlign: 'center',
									color: global.COLOR_MAIN
								}
							]}
						>
							Parabéns! Aguarde os dados da programação
						</Text>
					</View>
				}
				buttons={[
					{
						onPress: () => this.setState({ showApproved: false }),
						text: 'OK, entendi',
						backgroundColor: global.COLOR_MAIN
					}
				]}
				bodyStyle={styles.containerBody}
				containerStyle={styles.containerStyle}
			/>
		)
	}

	renderModalReproved = () => {
		return (
			<Modal
				isVisible={this.state.showReproved}
				title='Ops! Não foi dessa vez'
				body={
					<View
						style={{ alignItems: 'center', alignContent: 'center' }}
					>
						<Image
							source={require('../../imgs/reproved.png')}
							style={{ width: 100, height: 100 }}
						/>
						<Text
							style={[
								styles.text,
								{
									textAlign: 'center',
									color: global.COLOR_MAIN
								}
							]}
						>
							Essa rota já foi adicionada por outro parceiro...{' '}
							{'\n'}
							Mas fique por aqui, temos outras opções para você
						</Text>
					</View>
				}
				buttons={[
					{
						onPress: () => this.setState({ showReproved: false }),
						text: 'OK, entendi',
						backgroundColor: global.COLOR_MAIN
					}
				]}
				bodyStyle={styles.containerBody}
				containerStyle={styles.containerStyle}
			/>
		)
	}

	renderModalPreference = () => {
		return (
			<Modal
				isVisible={this.state.showPreference}
				title='Atenção'
				body={
					<View style={{ flexDirection: 'row', width: width / 1.4 }}>
						<View style={{ flex: 1 }}>
							<Image
								source={require('../../imgs/quality_blue.png')}
								style={{ width: 80, height: 80 }}
							/>
						</View>
						<View style={{ flex: 2 }}>
							<Text style={styles.text}>
								Essa viagem está de acordo com suas
								preferências, cadastradas em "Preferências de
								Frete"
							</Text>
						</View>
					</View>
				}
				buttons={[
					{
						onPress: () => this.setState({ showPreference: false }),
						text: 'OK, entendi',
						backgroundColor: global.COLOR_MAIN
					}
				]}
				bodyStyle={styles.containerBody}
				containerStyle={styles.containerStyle}
			/>
		)
	}

	renderModalRefresh = () => {
		return (
			<Modal
				isVisible={this.state.showRefresh}
				title='Atenção'
				body={
					<View style={{ flexDirection: 'row', width: width / 1.4 }}>
						<View style={{ flex: 1 }}>
							<Image
								source={require('../../imgs/reproved.png')}
								style={{ width: 80, height: 80 }}
							/>
						</View>
						<View style={{ flex: 2 }}>
							<Text style={styles.text}>
								Algumas ofertas que você curtiu já foram
								contratadas
							</Text>
						</View>
					</View>
				}
				buttons={[
					{
						onPress: () => this.setState({ showRefresh: false }),
						text: 'OK, entendi',
						backgroundColor: global.COLOR_MAIN
					}
				]}
				bodyStyle={styles.containerBody}
				containerStyle={styles.containerStyle}
			/>
		)
	}

	renderModal = () => {
		return (
			<Modal
				isVisible={this.state.show}
				title='Aceite de Frete'
				bodyText={`Boa amigo! ${'\n'} Após seu ok, vou validar o teu cadastro... ${'\n'} Aguarde aí que logo te aviso se tudo der certo`}
				buttons={[
					{
						onPress: () =>
							this.setState({
								show: false
							}),
						text: 'VOLTAR',
						backgroundColor: 'red'
					},
					{
						// onPress: () => this.setState({ show: false }, () => this.gambysAgv()),
						onPress: this.handleFreightAccepted,
						text: 'CONFIRMAR',
						backgroundColor: 'green'
					}
				]}
			/>
		)
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
						text: 'ok',
						backgroundColor: global.COLOR_MAIN
					}
				]}
			/>
		)
	}

	/*************************************************
	 * Métodos do ACEITE DO FRENTE
	 *************************************************/
	handleFreightAccepted = async () => {
		try {
			await this.setState({ show: false, disabledActions: true })

			const data = {
				driver_id: this.props.login.moto_id,
				vehicle_id: this.props.freightWish[0].veiculo_id,
				bodywork_id: this.props.freightWish[0].carroceria_id
					? this.props.freightWish[0].carroceria_id
					: '',
				offer_id: this.state.activeId,
				shipping_company_id: this.props.shippingCompanie.id
			}

			setTimeout(() => {
				this.setState({ showValidation: true })
			}, 1000)

			const returnAcceptOffer = await acceptOffer(data)
			const { accepted } = returnAcceptOffer

			this.setState({
				showValidation: false,
				disabledActions: false,
				activeId: 0
			})
			setTimeout(() => {
				this.setState({
					showReproved: !accepted,
					showApproved: accepted
				})
			}, 1000)
		} catch (err) {
			this.setState({ disabledActions: false, activeId: 0 })
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Loading show={this.state.loading} />
				{this.renderModalPreference()}
				{this.renderModal()}
				{this.renderModalValidation()}
				{this.renderModalApproved()}
				{this.renderModalReproved()}
				{this.renderModalRefresh()}
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{ marginBottom: 10 }}
				>
					{this.renderList()}
				</ScrollView>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		login: loginSelector(state),
		vehicles: vehiclesSelector(state, true),
		freightWish: freightWishSelector(state),
		cnh: cnhSelector(state),
		shippingCompanie: shippingCompanieSelector(state)
	}
}

export default connect(mapStateToProps)(FreightOffersSaved)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: global.COLOR_BACKGROUND
	},
	plate: {
		height: 40,
		backgroundColor: 'white',
		width,
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerItemsSwitch: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 100,
		width: width / 1.1
	},
	card: {
		marginBottom: 10,
		backgroundColor: 'white',
		elevation: 4,
		borderTopWidth: 0,
		borderRadius: 20
	},
	containerHeader: {
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		width: width / 1.1,
		backgroundColor: global.COLOR_TITLE_CARD,
		height: 60,
		paddingHorizontal: 20,
		justifyContent: 'center'
	},
	containerTitle: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 20
	},
	title: {
		width: width / 1.5,
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	containerBody: {
		paddingHorizontal: 10,
		marginVertical: 15
	},
	imageShare: {
		height: 50,
		width: 50
	},
	containerFooter: {
		alignItems: 'center',
		marginVertical: 10
	},
	containerButtons: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	buttonIcon: {
		height: 60,
		width: 60,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		width: width / 2.3
	},
	text: {
		margin: 2,
		fontSize: 15
	},
	label: {
		fontWeight: 'bold'
	},
	badgeStyle: {
		position: 'absolute',
		backgroundColor: 'red',
		borderRadius: 50,
		height: 20,
		width: 20,
		alignItems: 'center',
		justifyContent: 'center',
		top: 0,
		right: 0,
		zIndex: 1,
		marginRight: width / 3.4
	}
})
