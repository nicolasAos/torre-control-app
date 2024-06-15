import React, {useState} from 'react';
import {Dimensions, ScrollView, View, StyleSheet} from 'react-native';
import {Modal} from '.';
import HTMLView from 'react-native-htmlview';
import CheckBox from 'react-native-check-box';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Term = (props) => {
  const [show, setShow] = useState(false);
  const [check, setCheck] = useState(false);

  const [t] = useTranslation('term');

  function renderModal() {
    return (
      <Modal
        isVisible={props.show}
        title="term"
        body={
          <ScrollView style={{flex: 1}}>
            <HTMLView value={props.term} />
            <CheckBox
              style={{flex: 1, padding: 10}}
              onClick={() => {
                setCheck(!check);
              }}
              isChecked={check}
              rightText={t('checkbox-agree')}
            />
          </ScrollView>
        }
        buttons={[
          {
            onPress: () => {
              setCheck(false);
              props.onPressCancel();
            },
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              setCheck(false);
              props.onPress();
            },
            text: 'ok',
            backgroundColor: !check ? 'grey' : global.COLOR_MAIN,
            disabled: !check,
          },
        ]}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  }

  return <View style={styles.container}>{renderModal()}</View>;
};

export {Term};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  containerStyle: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: width / 1.1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  containerBody: {
    marginVertical: 2,
    marginHorizontal: 3,
    height: 400,
  },
});
