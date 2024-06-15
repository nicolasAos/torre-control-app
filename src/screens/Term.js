import React, {useState, useContext} from 'react';
import {StyleSheet, ScrollView, Dimensions, View} from 'react-native';
import HTML from 'react-native-render-html';
import CheckBox from 'react-native-check-box';
import {Button, Loading, Modal} from '../components';
import {StackActions, NavigationContext} from 'react-navigation';
import {setTerm} from '../actions/term';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Term = () => {
  const navigation = useContext(NavigationContext);

  const termHtml = navigation.getParam('termo', '');
  const empresa = navigation.getParam('empresa', '');
  const moto_id = navigation.getParam('id', '');
  const termId = navigation.getParam('termId', '');

  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const [t, i18n] = useTranslation('screens');

  function setTermAccept() {
    setTerm(moto_id, empresa, termId)
      .then(() => {
        navigation.dispatch(StackActions.pop());

        navigation.navigate('spreadSheetStack', {
          empresa: empresa,
        });
      })
      .catch((error) => {
        setLoading(false);
        setMessage(error.message);
        setTimeout(() => setShow(true), 500);
      });
  }

  function renderButtons() {
    return (
      <View style={styles.containerButton}>
        <Button
          onPress={() => navigation.dispatch(StackActions.pop())}
          title="cancel"
          buttonStyle={[styles.buttonStyle, {backgroundColor: 'red'}]}
        />
        <Button
          onPress={() => {
            setLoading(true);
            setTermAccept();
          }}
          title="ok-got-it"
          buttonStyle={[
            styles.buttonStyle,
            {backgroundColor: !check ? 'grey' : global.COLOR_MAIN},
          ]}
          disabled={!check}
        />
      </View>
    );
  }

  function renderModalMessage() {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => setShow(false),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderModalMessage()}
      <Loading show={loading} />
      <ScrollView>
        <HTML html={termHtml} />
        <CheckBox
          style={styles.checkboxStyle}
          onClick={() => {
            setCheck(!check);
          }}
          isChecked={check}
          rightText={t('term.agree-term')}
        />
      </ScrollView>
      {renderButtons()}
    </View>
  );
};

export default Term;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  containerButton: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonStyle: {
    width: width / 2.7,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 50,
  },
  checkboxStyle: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
  },
});
