import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Modal} from './';
import {Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import Snackbar from 'react-native-snackbar';
import {useTranslation} from 'react-i18next';

const VersionChecker = () => {
  const [show, setShow] = useState(false);

  const [t] = useTranslation('version-checker');

  useEffect(() => {
    // VersionCheck.getLatestVersion().then((latestVersion) => {
    //   if (latestVersion > VersionCheck.getCurrentVersion()) {
    //     setShow(true);
    //   } else {
    //     Snackbar.show({
    //       title: t('succes-message'),
    //       duration: Snackbar.LENGTH_LONG,
    //       backgroundColor: 'green',
    //       color: 'white',
    //     });
    //   }
    // });
  }, [t]);

  async function linkStore() {
    Linking.openURL(await VersionCheck.getStoreUrl());
  }

  function renderModal() {
    return (
      <Modal
        isVisible={show}
        title="attention"
        bodyText={'app-out-of-date'}
        buttons={[
          {
            onPress: () => {
              setShow(false);
              linkStore();
            },
            text: 'go-to-store',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
        onPressClosed={() => setShow(false)}
      />
    );
  }

  return <View>{renderModal()}</View>;
};

export {VersionChecker};
