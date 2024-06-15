import {Mixpanel as MixpanelNative} from 'mixpanel-react-native';
import {MIXPANEL_TOKEN} from '../config';
import {
  MixpanelEvents,
  MixpanelTimeTrackingEvents,
  MixpanelUserProperties,
} from './mixpanelEvents';

import {Logger} from '../utils';

const trackAutomaticEvents = true;
const mixpanel = new MixpanelNative(MIXPANEL_TOKEN, trackAutomaticEvents);

/**
 * Init mixpanel
 */
const init = async () => {
  try {
    Logger.log('mixpanel init');
    await mixpanel.init();
    log('App Open');
    Logger.log('mixpanel init successfully');
  } catch (error: any) {
    Logger.log('mixpanel init error');
    Logger.recordError(error);
  }
};

/**
 * Identify an user
 * @param userID
 * @returns
 */
const identify = (userID: string) => {
  Logger.log(`mixpanel identify user: ${userID}`);
  mixpanel.identify(userID);
};

/**
 * Logs an event
 * @param event
 * @param props
 */
const log = (event: MixpanelEvents, props?: object) => {
  if (props === undefined) {
    Logger.log(`mixpanel track: ${event}`);
    mixpanel.track(event);
  } else {
    Logger.log(`mixpanel track: ${event} with props`);
    mixpanel.track(event, {...props});
  }
};

/**
 * Start a timer for a event
 * @param timeEvent
 */
const logTimeEvent = (timeEvent: MixpanelTimeTrackingEvents) => {
  Logger.log(`mixpanel track time: ${timeEvent}`);
  mixpanel.timeEvent(timeEvent);
};

/**
 * Set a property to the current user
 * @param property
 * @param value
 */
const setProperty = (
  property: MixpanelUserProperties,
  value: string | number | boolean,
) => {
  Logger.log(`mixpanel set property ${property}: ${value}`);
  mixpanel.getPeople().set(property, value);
};

/**
 * Send stored events
 */
const flush = () => {
  Logger.log(`mixpanel flush events`);
  mixpanel.flush();
};

export default {
  init,
  flush,
  log,
  logTimeEvent,
  identify,
  setProperty,
};
