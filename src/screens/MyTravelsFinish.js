import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, FlatList, Dimensions} from 'react-native';
import {loginSelector} from '../reducers/selectors';
import {Empty, Loading, Modal, Card} from '../components';
import {getTravelsFinish} from '../actions/transport';
import {syncTravelData, deleteData} from '../actions/syncTravelsManual';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';

import {withTranslation} from 'react-i18next';
import i18n from '../locales';

const {width} = Dimensions.get('window');

class MyTravelsFinishClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showSync: false,
      showDelete: false,
      showMessage: false,
      message: '',
      loading: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => this.getTravels());
  }

  getTravels = () => {
    getTravelsFinish(this.props.login.moto_id).then((data) => {
      this.setState({data});
    });
  };

  deleteTravels = async () => {
    await deleteData();
    await this.setState({
      loading: false,
      message: 'delet-trip',
    });
    setTimeout(() => this.setState({showMessage: true}), 500);
  };

  syncTravels = async () => {
    syncTravelData()
      .then(() => {
        this.setState({
          loading: false,
          message: 'sync-travels-sucess',
        });
        setTimeout(() => this.setState({showMessage: true}), 500);
      })
      .catch((error) => {
        this.setState({loading: false, message: error.message});
        setTimeout(() => this.setState({showMessage: true}), 500);
      });
  };

  renderItems = ({item}) => {
    const {t} = this.props;
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.containerTitle}>
          <View style={styles.containerIconTitle}>
            <Text style={styles.title}>{item.rom_id}</Text>
          </View>
        </View>
        <View style={styles.containerBody}>
          <View style={styles.body}>
            <Text style={styles.label}>Manifesto:</Text>
            <Text style={styles.item}>{item.rom_manifesto}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.label}>Data ínicio:</Text>
            <Text style={styles.item}>
              {item.rom_inicio_transp &&
                moment(item.rom_inicio_transp).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.label}>Data Fim:</Text>
            <Text style={styles.item}>
              {item.rom_fim_transp &&
                moment(item.rom_fim_transp).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
        </View>
        <View style={styles.bodyBottomCard}>
          <Text
            style={{
              fontSize: 14,
              color: item.sync_fim == 1 ? 'orange' : 'green',
              marginHorizontal: 5,
              fontWeight: 'bold',
            }}>
            {item.sync_fim == 1
              ? t('my-travels-finish.syncing')
              : t('my-travels-finish.Synced')}
          </Text>
        </View>
      </Card>
    );
  };

  renderList = () => {
    const {t} = this.props;
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItems}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Empty
            styleContainer={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100,
              marginHorizontal: 50,
            }}
            text={t('my-travels-finish.no-trip-completed!')}
          />
        )}
      />
    );
  };

  renderModalMessage = () => {
    return (
      <Modal
        isVisible={this.state.showMessage}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () =>
              this.setState({message: '', showMessage: false}, () =>
                this.getTravels(),
              ),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalSync = () => {
    return (
      <Modal
        isVisible={this.state.showSync}
        title="attention"
        bodyText="delete-complete-trips"
        buttons={[
          {
            onPress: () => this.setState({showSync: false}),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({showSync: false});
              setTimeout(
                () => this.setState({loading: true}, () => this.syncTravels()),
                500,
              );
            },
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalDelete = () => {
    return (
      <Modal
        isVisible={this.state.showDelete}
        title="attention"
        bodyText="synced-delete"
        buttons={[
          {
            onPress: () => this.setState({showDelete: false}),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({showDelete: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () => this.deleteTravels()),
                500,
              );
            },
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderFab = () => {
    const {t} = this.props;
    return (
      <ActionButton buttonColor="#283484">
        <ActionButton.Item
          buttonColor="#3498db"
          title={t('my-travels-finish.sync')}
          onPress={() => this.setState({showSync: true})}>
          <Icon name="sync-alt" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="red"
          title={t('my-travels-finish.delete')}
          onPress={() => this.setState({showDelete: true})}>
          <Icon name="trash" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        {this.renderModalMessage()}
        {this.renderModalDelete()}
        {this.renderModalSync()}
        {this.renderList()}
        {this.renderFab()}
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    login: loginSelector(state, props),
  };
};

const MyTravelsFinish = withTranslation('screens')(MyTravelsFinishClass);
export default connect(mapStateToProps)(MyTravelsFinish);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  containerItem: {
    height: 120,
    width: 120,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 5,
  },
  card: {
    width: width / 1.1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    borderRadius: 20,
    paddingBottom: 10,
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
  containerIconTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerBody: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  body: {
    flexDirection: 'row',
    marginTop: 3,
  },
  label: {
    fontWeight: 'bold',
  },
  item: {
    marginHorizontal: 5,
    width: width / 1.6,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  bodyBottomCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
