import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {StackActions} from 'react-navigation';
import {Card, Loading, Modal, Button} from '../components';
import {getCtesOffline} from '../actions/driver';
import {finishedTransport} from '../actions/transport';
import {
  latlongSelector,
  loginSelector,
  cnhSelector,
  vehiclesSelector,
  occurrencedNotesSelector,
} from '../reducers/selectors';
import moment from 'moment';
import {getDateBD, isObjectEmpty} from '../configs/utils';

const {width} = Dimensions.get('window');

class OccurrenceNFsCte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        rom: props.navigation.getParam('cte', ''),
        nfeKeys: props.navigation.getParam('invoices', ''),
      },
      empresa: props.navigation.getParam('empresa', ''),
      romId: props.navigation.getParam('romId', ''),
      loading: false,
      show: false,
      showAvailable: false,
      showError: false,
      message: '',
      latlong: '',
      destinatario: '',
      selectedNotes: [],
    };
  }

  getCtes = () => {
    getCtesOffline(
      this.props.login.moto_id,
      this.state.empresa,
      this.state.romId,
    ).then((data) => {
      this.setState({data: data, loading: false});
      setTimeout(() => this.setState({show: data.travelFinished}), 500);
    });
  };

  submitFinishTravel = () => {
    const item = this.state.data;
    item.rom.rom_lat_long_fim = this.props.latlong;
    item.rom.rom_resp_fim = this.props.login.moto_nome;
    item.rom.rom_fim_transp = getDateBD();

    this.props.login.moto_id,
      this.state.empresa,
      this.state.romId.props
        .dispatch(finishedTransport(this.props.login.moto_id, item))
        .then(() => {
          if (
            !isObjectEmpty(this.props.cnh) &&
            this.props.veihicles.length > 0
          ) {
            this.setState({loading: false});
            setTimeout(() => this.setState({showAvailable: true}), 500);
          } else {
            this.setState({loading: false}, () =>
              this.props.navigation.dispatch(StackActions.pop({n: 2})),
            );
          }
        })
        .catch((error) => {
          this.setState({loading: false, message: error.message});
          setTimeout(() => this.setState({showError: true}), 500);
        });
  };

  renderHeader = () => {
    const {nf} = this.state.data.nfeKeys[0];
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>Planilha:</Text>
          <Text style={styles.headerItem}>{nf.rom_id}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>Manifesto:</Text>
          <Text style={styles.headerItem}>{nf.rom_manifesto}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>Data de saída:</Text>
          <Text style={styles.headerItem}>
            {moment(nf.rom_dt_manifesto).format('DD/MM/YYYY HH:mm')}
          </Text>
        </View>
      </View>
    );
  };

  handleSelectedNote = (note) => {
    const notes = this.state.selectedNotes;

    const index = this.state.selectedNotes.findIndex(
      (nt) => nt.nf_id === note.nf_id,
    );

    if (index >= 0) {
      notes.splice(index, 1);
    } else {
      notes.push(note);
    }

    this.setState({selectedNotes: [...notes]}, this.renderList);
  };

  renderNFeButtons = (nfes) => {
    const availableNotes = nfes.filter(
      ({nf}) => !this.props.occurrencedNotes.includes(nf.nf_id),
    );

    const buttons = availableNotes.map(({nf}) => {
      const selected = this.state.selectedNotes.find(
        (nt) => nt.nf_id === nf.nf_id,
      );
      return (
        <Button
          key={nf.nf_id}
          onPress={() => {
            this.handleSelectedNote(nf);
          }}
          title={nf.nf_id}
          titleStyle={{
            alignSelf: 'center',
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold',
          }}
          buttonStyle={[
            styles.nfButtonStyle,
            {
              backgroundColor: selected ? 'red' : 'grey',
              marginBottom: 3,
            },
          ]}
        />
      );
    });

    if (buttons.length % 2 != 0) {
      buttons.push(<Text style={{width: width / 3, height: 40}} />);
    }

    return buttons;
  };

  renderList = () => (
    <Card containerStyle={styles.card}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Selecione as NF-es que tiveram ocorrência
        </Text>
      </View>
      <View style={styles.containerBody}>
        {this.renderNFeButtons(this.state.data.nfeKeys)}
      </View>
    </Card>
  );

  renderButton = () => {
    return (
      <Button
        onPress={() => {
          const selectedNotes = [...this.state.selectedNotes];
          const routeData = {
            data: selectedNotes,
            cte: selectedNotes[0],
          };
          this.props.navigation.navigate('occurrenceCteStack', routeData);
          this.setState({selectedNotes: []});
        }}
        title="CONTINUAR"
        titleStyle={{
          alignSelf: 'center',
          fontSize: 18,
          color: 'white',
          fontWeight: 'bold',
        }}
        disabled={this.state.selectedNotes.length == 0}
        buttonStyle={styles.buttonStyle}
      />
    );
  };

  renderModalFinishTravel = () => {
    if (this.state.data && this.state.data.travelFinished) {
      return (
        <Modal
          isVisible={this.state.show}
          title="Atenção"
          bodyText={'all-ctes-completed'}
          buttons={[
            {
              onPress: () => {
                this.setState({show: false});
                setTimeout(
                  () =>
                    this.setState({loading: true}, () =>
                      this.submitFinishTravel(),
                    ),
                  500,
                );
              },
              text: 'Ok, entendi',
              backgroundColor: global.COLOR_MAIN,
            },
          ]}
        />
      );
    }
  };

  renderModalError = () => {
    return (
      <Modal
        isVisible={this.state.showError}
        title="Atenção"
        bodyText={`${this.state.message}. Quando ativar, aperte o botão`}
        buttons={[
          {
            onPress: () => {
              this.setState({showError: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () =>
                    this.submitFinishTravel(),
                  ),
                500,
              );
            },
            text: 'Ok, entendi',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalAvailable = () => {
    return (
      <Modal
        isVisible={this.state.showAvailable}
        title="Atenção"
        bodyText={
          'E aí Parceiro, que bom que deu certo a viagem! Me diz aí, já quer se colocar disponível para uma nova viagem?'
        }
        buttons={[
          {
            onPress: () =>
              this.setState({showAvailable: false}, () =>
                this.props.navigation.dispatch(StackActions.pop({n: 2})),
              ),
            text: 'NÃO',
            backgroundColor: 'red',
          },
          {
            onPress: () =>
              this.setState({showAvailable: false}, () => {
                this.props.navigation.dispatch(StackActions.popToTop());
                this.props.navigation.navigate('freightWishStack');
              }),
            text: 'SIM',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

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
          {this.renderButton()}
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
    veihicles: vehiclesSelector(state),
    occurrencedNotes: occurrencedNotesSelector(state),
  };
};

export default connect(mapStateToProps)(OccurrenceNFsCte);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    width: width / 1.1,
    borderRadius: 20,
  },
  containerTitle: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TITLE_CARD,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerBody: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  containerHeader: {
    height: 80,
    backgroundColor: global.COLOR_TOOLBAR,
    padding: 10,
    width,
  },
  containerHeaderItem: {
    flexDirection: 'row',
  },
  headerLabel: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerItem: {
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 5,
  },
  text: {
    margin: 2,
    fontSize: 15,
  },
  textBody: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  containerButton: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    backgroundColor: 'yellow',
  },
  buttonStyle: {
    width: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 60,
    borderRadius: 50,
    backgroundColor: global.COLOR_MAIN,
  },
  nfButtonStyle: {
    width: width / 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
    borderRadius: 50,
    backgroundColor: global.COLOR_MAIN,
  },
});
