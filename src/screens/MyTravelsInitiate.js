import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, FlatList, Dimensions} from 'react-native';
import {loginSelector} from '../reducers/selectors';
import {Empty, Card} from '../components';
import {getTravelsInitiate} from '../actions/transport';
import moment from 'moment';

const {width} = Dimensions.get('window');

import {withTranslation} from 'react-i18next';
import i18n from '../locales';

class MyTravelsInitiateClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => this.getTravels());
  }

  getTravels = () => {
    getTravelsInitiate(this.props.login.moto_id).then((data) => {
      this.setState({data});
    });
  };

  renderItems = ({item}) => {
    console.log('75550822')
    const {} = this.props;
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.containerTitle}>
          <View style={styles.containerIconTitle}>
            <Text style={styles.title}>{item.rom_id}</Text>
          </View>
        </View>
        <View style={styles.containerBody}>
          <View style={styles.body}>
            <Text style={styles.label}>{t('my-travel-initiate.manifest')}</Text>
            <Text style={styles.item}>{item.rom_manifesto}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.label}>
              {t('my-travel-initiate.start-init')}
            </Text>
            <Text style={styles.item}>
              {item.rom_inicio_transp &&
                moment(item.rom_inicio_transp).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
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
            text={t('my-travel-initiate.no-trip-started')}
          />
        )}
      />
    );
  };

  render() {
    return <View style={styles.container}>{this.renderList()}</View>;
  }
}

const mapStateToProps = (state, props) => {
  return {
    login: loginSelector(state, props),
  };
};

const MyTravelsInitiate = withTranslation('screens')(MyTravelsInitiateClass);
export default connect(mapStateToProps)(MyTravelsInitiate);

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
});
