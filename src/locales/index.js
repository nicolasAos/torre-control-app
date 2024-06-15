import {NativeModules, Platform} from 'react-native';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './translations/en.json';
import pt from './translations/pt.json';
import es from './translations/es.json';

const resources = {
  ['en']: en,
  ['pt']: pt,
  ['es']: es,
};

const getLanguageByDevice = () => {
  return Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    let phoneLanguage = null;
    phoneLanguage = getLanguageByDevice().replace('_', '-');

    return callback(phoneLanguage);
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    //
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
