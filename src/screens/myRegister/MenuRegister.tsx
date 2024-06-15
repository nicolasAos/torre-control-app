import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {cnhSelector, loginSelector} from '../../reducers/selectors';
import {Modal, PhotoPerfil, Button } from '../../components';

import {withTranslation} from 'react-i18next';
//import i18n from '../../locales';
// utils
import { Logger } from '../../utils';

const {width} = Dimensions.get('window');

class MenuRegisterClass extends Component {
  constructor(props:any) {
    super(props);
    this.state = {
      imagePerfil: '',
      message: '',
      show: false,
    };
  }

  componentDidMount(): void {
    Logger.log('mount MenuRegister screen')
  }

  componentWillUnmount(): void {
    Logger.log('unmount MenuRegister screen')
  }

  renderPhoto = () => {
    return <PhotoPerfil motoristaId={this.props.login.moto_id} />;
  };

  renderItems = (item:any) => {
 
    const {stack, image, nameMenu} = item.item;

    const {t} = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          if (
            stack !== 'myRegisterUserStack' &&
            stack !== 'myRegisterDriverStack'
          ) {
            if (Object.keys(this.props.cnh).length === 0) {
              this.setState({
                show: true,
                message: 'fill-driver-data',
              });
            } else {
              this.props.navigation.navigate(stack, {
                id: this.props.login.user_id
              });
            }
          } else {
            this.props.navigation.navigate(stack, {
              id: this.props.login.user_id
            });
          }
        }}>
        <View style={styles.containerItem}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <FontAwesome5 name={image} color={'black'} size={30} />
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.textMenu}>{t(nameMenu)}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
            <FontAwesome5 name={'angle-right'} color={'black'} size={22} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderMenus = () => {
    return (
      <FlatList
        data={menus}
        renderItem={this.renderItems}
        keyExtractor={(item) => item.nameMenu}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  renderModal = () => {
    const {t} = this.props;

    return (
      <Modal
        isVisible={this.state.show}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () => this.setState({show: false, message: ''}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderModal()}
        {this.renderPhoto()}
        {this.renderMenus()}
        {
          this.state.imagePerfil !== '' &&
            <View
              style={{ width: '100%', padding: 15 }}
            >
              <Button
                title="save"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 13,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onPress={() =>
                  console.log('lorem')
                }
                buttonStyle={{ 
                  width: '100%', 
                  padding: 8, 
                  backgroundColor: global.COLOR_MAIN,
                  borderRadius: 15
                }}
              />
            </View>
        }
      </View>
    );
  }
}

export const menus = [
  {
    nameMenu: 'menu.register.menu.user-data',
    image: 'user',
    stack: 'myRegisterUserStack',
  },
  // {
  // 	nameMenu: 'menu.register.menu.my-vehicles',
  // 	image: 'truck',
  // 	stack: 'myCarsStack'
  // },
  // {
  // 	nameMenu: 'menu.register.menu.security',
  // 	image: 'key',
  // 	stack: 'myRegisterSecurityStack'
  // }
  // {
  // 	nameMenu: 'Dados motorista',
  // 	image: 'id-card',
  // 	stack: 'myRegisterDriverStack'
  // },
  // {
  // 	nameMenu: 'Proprietários veículos/Carrocerias',
  // 	image: 'user-tie',
  // 	stack: 'myListOwnerStack'
  // },
  // {
  // 	nameMenu: 'Responsável frete',
  // 	image: 'wallet',
  // 	stack: 'myRegisterResponsibleFreightStack'
  // },
  // {
  // 	nameMenu: 'Meus veículos',
  // 	image: 'truck',
  // 	stack: 'myCarsStack'
  // }
];

const mapStateToProps = (state) => {
  return {
    cnh: cnhSelector(state),
    login: loginSelector(state),
  };
};

const MenuRegister = withTranslation('screens')(MenuRegisterClass);
export default connect(mapStateToProps)(MenuRegister);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR_BACKGROUND,
    alignItems: 'center',
  },
  photoContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerProfilePicture: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'white',
  },
  containerItem: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: width / 1.1,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textMenu: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
