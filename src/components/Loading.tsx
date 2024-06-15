import React, {useEffect} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

// utils
import {Logger} from '../utils';

const Loading = (props: any) => {
  const {show, text, size, color, animation, overlayColor, textStyle} = props;

  useEffect(() => {
    Logger.log('mount LoadingOverlay');
    return () => {
      Logger.log('unmount LoadingOverlay');
    };
  }, []);

  useEffect(() => {
    if (show) {
      Logger.log('LoadingOverlay loading..');
    } else {
      Logger.log('LoadingOverlay loading finished');
    }
  }, [show]);

  const [t] = useTranslation('loading');

  return (
    <Spinner
      visible={show}
      textContent={t(text)}
      textStyle={textStyle}
      size={size}
      color={color}
      animation={animation}
      overlayColor={overlayColor}
    />
  );
}

Loading.propTypes = {
  show: PropTypes.bool,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  text: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  animation: PropTypes.string,
};

Loading.defaultProps = {
  show: false,
  text: 'text',
  textStyle: {
    color: 'white',
  },
  size: 'large',
  color: 'white',
  animation: 'fade',
  overlayColor: '#000000AA',
};

export {Loading};
