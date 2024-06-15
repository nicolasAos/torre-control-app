import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeModal from 'react-native-modal';
import {Button} from './';
import {useTranslation} from 'react-i18next';

const {height, width} = Dimensions.get('window');

const Modal = (props) => {
  const [keyboardSpace, setKeyboardSpace] = useState(0);

  const [t] = useTranslation('modal');

  useEffect(() => {
    //for get keyboard height
    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      (frames) => {
        if (!frames.endCoordinates) {
          return;
        }
        setKeyboardSpace(frames.endCoordinates.height);
      },
    );
    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      (frames) => {
        setKeyboardSpace(0);
      },
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  return (
    <ReactNativeModal
      isVisible={props.isVisible}
      onBackdropPress={props.onBackdropPress}
      onBackButtonPress={props.onBackdropPress}
      avoidKeyboard={Platform.OS === 'ios'}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={{
        top: keyboardSpace ? -30 : 0,
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={props.containerStyle}>
          {props.onPressClosed && renderButtonClose(props.onPressClosed)}
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </View>
      </TouchableWithoutFeedback>
    </ReactNativeModal>
  );

  function renderButtonClose(onPressClosed) {
    return (
      <TouchableOpacity onPress={onPressClosed} style={styles.buttonClose}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>X</Text>
      </TouchableOpacity>
    );
  }

  function renderHeader() {
    const {title, titleElement, textTitleStyle} = props;

    if (title || titleElement) {
      return (
        <View style={styles.containerHeader}>
          {!title && titleElement ? (
            titleElement
          ) : (
            <Text style={textTitleStyle}>{t(title)}</Text>
          )}
        </View>
      );
    }
  }

  function renderBody() {
    const {body, bodyText, containerBody, bodyStyle, textBodyStyle, complementBody, observacion} = props;

    if (bodyText) {
      if(observacion) {
        return (
          <View style={[containerBody, bodyStyle]}>
            <Text style={[textBodyStyle, {fontSize: 17}]}>{t(bodyText)}</Text>
            <TextInput
              style={{
                height: 40,
                margin: 12,
                borderBottomWidth: 1,
                padding: 10,
              }}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholder="..."
            />
            {
              complementBody &&
                <Text style={textBodyStyle}>{complementBody}</Text>
            }
          </View>
        );  
      }
      return (
        <View style={[containerBody, bodyStyle]}>
          <Text style={[textBodyStyle, {fontSize: 17}]}>{t(bodyText)}</Text>
          {
            complementBody &&
              <Text style={textBodyStyle}>{complementBody}</Text>
          }
        </View>
      );
    }

    if (body) {
      return <View style={[styles.containerBody, bodyStyle]}>{body}</View>;
    }
  }

  function renderFooter() {
    if (props.buttons) {
      return <View style={styles.containerFooter}>{renderButtons()}</View>;
    }
  }

  function renderButtons() {
    return props.buttons.map((button, index) => {
      if (!button.onPress instanceof Function) {
        throw new Exception('onPress button is undefined!');
      } else if (
        !typeof button.backgroundColor === 'string' ||
        !button.backgroundColor instanceof String
      ) {
        throw new Exception('BackgroundColor button is not defined!');
      } else if (
        !typeof button.text === 'string' ||
        !button.text instanceof String
      ) {
        throw new Exception('Text button is not defined!');
      }

      return (
        <Button
          key={index.toString()}
          title={button.text}
          titleStyle={{
            fontWeight: 'bold',
            alignSelf: 'center',
            fontSize: 14,
            color: 'white',
          }}
          onPress={button.onPress}
          buttonStyle={{
            backgroundColor: button.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: width / (props.buttons.length == 1 ? 1.6 : 3),
            borderRadius: 40,
            margin: props.buttons.length == 1 ? 0 : 5,
          }}
          disabled={button.disabled}
        />
      );
    });
  }
};

Modal.defaultProps = {
  bodyStyle: {
    marginVertical: 2,
    marginHorizontal: 3,
  },
  textBodyStyle: {
    margin: 20,
    textAlign: 'center',
  },
  onBackdropPress: () => {},
  containerStyle: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: width / 1.3,
    alignItems: 'center',
    alignSelf: 'center',
  },
  textTitleStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

Modal.propTypes = {
  title: PropTypes.string,
  titleElement: PropTypes.element,
  buttons: PropTypes.array,
  body: PropTypes.element,
  bodyText: PropTypes.string,
  textTitleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPressClosed: PropTypes.func,
};

export {Modal};

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderColor: '#e9e9e9',
    backgroundColor: global.COLOR_MAIN,
    width: width / 1.3,
    borderTopStartRadius: 40,
    borderTopRightRadius: 40,
  },
  containerBody: {
    maxHeight: height * 0.8,
    marginBottom: 20,
  },
  containerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingBottom: 20,
  },
  buttonClose: {
    position: 'absolute',
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});