import React from 'react';
import {Text, View, Dimensions, Image} from 'react-native';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const Empty = (props) => {
  const {styleContainer, text, textStyle, heightImage} = props;

  const [t, i18n] = useTranslation('empty');

  return (
    <View style={styleContainer}>
      <Text style={textStyle}>{t(text)}</Text>
      <Image
        resizeMode={'contain'}
        style={{width: '100%'}}
        source={require('../imgs/sem-viagens.png')}
      />
    </View>
  );
};

Empty.propTypes = {
  styleContainer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  text: PropTypes.string.isRequired,
  heightImage: PropTypes.number,
};

Empty.defaultProps = {
  styleContainer: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: global.COLOR_MAIN,
    textAlign: 'center',
  },
  heightImage: 125,
};

export {Empty};
