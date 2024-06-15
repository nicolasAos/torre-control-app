import './src/configs/constants';
import './src/configs/crashlytics';
import {AppRegistry, LogBox} from 'react-native';
import App from './src/app/App';
import BackgroundFetch from 'react-native-background-fetch';
import {syncData} from './src/actions/sync';
import {name as appName} from './app.json';
import {decode, encode} from 'base-64';
import { Logger } from './src/utils';

import ReactNativeForegroundService from "@supersami/rn-foreground-service";
ReactNativeForegroundService.register();

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
let MyHeadlessTask = async () => {
  Logger.log('HeadlessTask');
  await syncData();
  BackgroundFetch.finish();
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

if (__DEV__) {
  LogBox.ignoreLogs([
    'Require cycle:',
    'VirtualizedLists',
    'Remote debugger',
    'It appears that',
    'Warning:',
    'Deprecation warning:',
  ]);
  LogBox.ignoreAllLogs(true);
  /* eslint no-undef: 0 */
  XMLHttpRequest = GLOBAL.originalXMLHttpRequest
    ? GLOBAL.originalXMLHttpRequest
    : GLOBAL.XMLHttpRequest;
}

AppRegistry.registerComponent(appName, () => App);
