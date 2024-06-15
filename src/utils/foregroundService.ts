import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {Logger, Location} from '.';
import {Mixpanel} from '../analitycs';
import {sendLocationPrime} from '../actions/geolocation';

const DELAY = 60000; // 1 min
const LOOP = true;
const TAG = 'src/utils/foregrounfService';

function start(userID: string, placa: string, romDeviceId: string) {
  Logger.log('ReactNativeForegroundService => start');
  Mixpanel.log('React Native Foreground Service Start');
  Logger.log(
    'ReactNativeForegroundService => is running ' +
      ReactNativeForegroundService.is_running(),
  );
  if (!ReactNativeForegroundService.is_running()) {
    ReactNativeForegroundService.add_task(
      async () => {
        Mixpanel.log('React Native Foreground Service Task');
        Logger.log('ReactNativeForegroundService => task');
        const coords = await Location.getCurrentPosition(false);
        if (coords) {
          sendLocationPrime(coords, userID, placa, romDeviceId);
        } else {
          Logger.log('location is undefined');
        }
      },
      {
        delay: DELAY, //DELAY,
        onLoop: LOOP, //LOOP,
        taskId: 'background_location_sniff',
        onError: (e: any) => {
          Mixpanel.log('React Native Foreground Service Task Error', {
            error: JSON.stringify(e, null, 2),
          });
          Logger.recordError(e, TAG);
        },
      },
    );

    ReactNativeForegroundService.start({
      id: 144,
      title: 'We use your location',
      message: 'Dont worry... everything is ok',
    });
  }
}

async function stop() {
  Mixpanel.log('React Native Foreground Service Stop');
  Logger.log('ReactNativeForegroundService => stop');
  try {
    await ReactNativeForegroundService.stop();
  } catch (error) {
    Logger.recordError(error, TAG);
  }
}

export default {
  start,
  stop,
};
