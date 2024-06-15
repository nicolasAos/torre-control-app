import BackgroundService from 'react-native-background-actions';
import {Logger} from '.';
import { Mixpanel } from '../analitycs';

const TAG = 'src/utils/backgroundService';

const options = {
  taskName: 'Enviar ubicación',
  taskTitle: 'En transito',
  taskDesc: '[*_*]',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#0000',
  linkingURI: 'yourSchemeHere://chat/jane',
  parameters: {
    delay: 60000, // 1 min
  },
};

/**
 * Start a background task
 * @param task
 */
async function start(task: (taskDataArguments: any) => Promise<void>) {
  try {
    Logger.log('BACKGROUND: start task');
    Mixpanel.log('Start Background Task')
    await BackgroundService.start(task, options);
  } catch (error) {
    Logger.recordError(error, TAG);
  }
}

/**
 * Stop a background task
 */
async function stop() {
  try {
    Mixpanel.log('Stop Background Task')
    Logger.log('BACKGROUND: stop task');
    await BackgroundService.stop();
  } catch (error) {
    Logger.recordError(error, TAG);
  }
}

export default {
  start,
  stop,
};
