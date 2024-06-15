import React, {useContext, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {
  loginSelector,
  cnhSelector,
  vehiclesSelector,
  freightPreferencesSelector,
} from '../../reducers/selectors';
import {Modal} from '../../components';
import {isObjectEmpty} from '../../configs/utils';

const {width} = Dimensions.get('window');

import {useTranslation} from 'react-i18next';
import {NavigationContext} from 'react-navigation';

const MenuFreightOffers = () => {
  const navigation = useContext(NavigationContext);

  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {cnh, vehicles, preferences} = useSelector((state) => ({
    cnh: cnhSelector(state),
    vehicles: vehiclesSelector(state),
    preferences: freightPreferencesSelector(state),
  }));

  const [t] = useTranslation('screens');

  function renderColorMenu(id) {
    if (
      (id !== 0 && id !== 1) ||
      (!isObjectEmpty(cnh) && vehicles.length > 0)
    ) {
      return global.COLOR_MAIN;
    }

    return 'grey';
  }

  function optionsMenus(id, stack) {
    switch (true) {
      case (id === 0 || id === 1) &&
        (isObjectEmpty(cnh) || vehicles.length < 1):
        setShowAlert(true);
        break;
      default:
        navigation.navigate(stack);
        break;
    }
  }

  function renderItems(item) {
    const {id, stack, image, nameMenu} = item.item;

    return (
      <TouchableOpacity onPress={() => optionsMenus(id, stack)}>
        <View style={styles.containerItem}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={image} style={{height: 70, width: 70}} />
          </View>
          <View style={{flex: 3}}>
            <Text style={[styles.textMenu, {color: renderColorMenu(id)}]}>
              {t(nameMenu)}
            </Text>
          </View>
          {id == 0 &&
            (isObjectEmpty(preferences) || preferences.ativo == 0) && (
              <FontAwesome5
                name="exclamation-triangle"
                color="orange"
                size={26}
              />
            )}
          <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
            <FontAwesome5 name={'angle-right'} color={'black'} size={22} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderMenus() {
    return (
      <FlatList
        data={menus}
        renderItem={renderItems}
        keyExtractor={(item) => item.nameMenu}
        showsVerticalScrollIndicator={false}
        extraData={preferences}
      />
    );
  }

  function renderModal() {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => {
              setShow(false);
              setMessage('');
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalAlert() {
    return (
      <Modal
        isVisible={showAlert}
        title="attention"
        bodyText="access-denied"
        buttons={[
          {
            onPress: () => setShowAlert(false),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderModal()}
      {renderModalAlert()}
      {renderMenus()}
    </View>
  );
};

export const menus = [
  {
    id: 0,
    nameMenu: 'menu.offers.title.freight-preferences',
    image: require('../../imgs/preferencias.png'),
    stack: 'freightPreferencesStack',
  },
  {
    id: 1,
    nameMenu: 'menu.offers.title.wanna-freight',
    image: require('../../imgs/querofrete.png'),
    stack: 'freightWishStack',
  },
  {
    id: 2,
    nameMenu: 'menu.offers.title.offers',
    image: require('../../imgs/em-transito-active.png'),
    stack: 'freightOffersStack',
  },
];

export default MenuFreightOffers;

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
