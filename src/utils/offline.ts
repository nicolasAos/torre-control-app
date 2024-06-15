//
import NetInfo from '@react-native-community/netinfo';
// config
import {CREO_SERVICES_BASE_URL} from '../config';
// api
import api from '../services/api';
import apiTorre from '../services/apiTorreControl';
import {InvoiceService} from '../services/InvoicesServices';
// actions
import {sendEvidenceArr} from '../actions/driver';
// utils
import {Logger, AsyncStorage} from '.';
import axios from 'axios';
// analytics
import {Mixpanel} from '../analitycs';

const TAG = 'utils/offline';
type Event = {uri: string; data: object; headers?: object};
type CatchedEvents = Array<Event>;

/**
 * Catch a event in local storage
 * @param uri enpoint uri
 * @param data request body data
 * @returns
 */
async function catchEvent(
  uri: string,
  data: object,
  headers?: object,
): Promise<boolean> {
  try {
    const asyncStorageKey = 'catchedEvents';
    Logger.log(`offline => catch event: ${uri}`);
    const catchedEvents: CatchedEvents = await getEventsfromLocalStorage();
    // update catched events
    catchedEvents.push({uri, data, headers});
    // save catched events
    await AsyncStorage.storeData(asyncStorageKey, catchedEvents);
    Logger.log(`offline => catched events updated`);
    return true;
  } catch (error) {
    Logger.recordError(error, TAG);
    return false;
  }
}

/**
 * Send events to the API
 */
async function flushEvents(): Promise<void> {
  const asyncStorageKey = 'catchedEvents';
  Logger.log(`offline => flush events`);
  try {
    let events: any = []; // events not send to server
    const state = await NetInfo.fetch();
    /**
     * Check connection
     */
    if (!state.isConnected) {
      Logger.log(`offline => no connection impossible to flush`);
      return;
    }
    /**
     * Get events
     */
    const catchedEvents = await getEventsfromLocalStorage();
    if (!catchedEvents.length) {
      Logger.log(`offline => no events to flush`);
      return;
    }
    /**
     * Send events
     */
    for (let i = 0; i < catchedEvents.length; i++) {
      const event = catchedEvents[i];
      const eventSent = await sendEvent(event);
      if (!eventSent) events.push(event);
    }
    /**
     * Update events
     */
    Logger.log(`offline => didnt send ${events.length} events`);
    await AsyncStorage.storeData(asyncStorageKey, events);
    Logger.log(`offline => catched events updated`);
  } catch (error) {
    Logger.log(`offline => flush events failed`);
    Logger.recordError(error, TAG);
  }
}

/**
 * Send event to server
 * @param event
 * @returns
 */
async function sendEvent(event: Event): Promise<boolean> {
  const invoiceService = new InvoiceService();
  const {uri, data} = event;
  try {
    Logger.log(`offline => send event ${event.uri}`);
    /**
     * Send low [nacional]
     */
    if (uri === 'nota-fiscal/entrega') {
      await invoiceService.sendDelivery(uri, data, event.headers);
    } else if (uri === 'nota-fiscal/ocorrencia') {
      /**
       * Send ocurrence [nacional]
       */
      await invoiceService.sendOccurrence(uri, data, event.headers);
    } else if (uri === 'location-device') {
      await apiTorre.post(uri, data);
    } else if (uri === 'recepcion-evidencias') {
      // send photos to server
      if (data.dataCte) {
        await sendEvidenceArr(data.dataCte, data.evidenceArr, data.extra);
      } else {
        Logger.log(`offline => event ${uri} didnt send, incorrect format ❌`);
      }
    } else if (uri === 'WSEntregaRemesa') {
      // send box by box
      const url = `${CREO_SERVICES_BASE_URL}${uri}`;
      await axios({method: 'POST', timeout: 3000, url, data});
    } else {
      await api.post(uri, data);
    }
    Logger.log(`offline => event ${uri} sent successfully  ✅`);
    Mixpanel.log('Send Catched Request');
    return true;
  } catch (error) {
    Logger.log(`offline => event ${uri} didnt send ❌`);
    Logger.recordError(error, TAG);
    return false;
  }
}

/**
 * Get queued events from local storage
 */
async function getEventsfromLocalStorage(): Promise<[]> {
  try {
    Logger.log(`offline => get catched events`);
    const asyncStorageKey = 'catchedEvents';
    const response = (await AsyncStorage.getData(asyncStorageKey)) ?? [];
    Logger.log(`offline => ${response.length} catched events found`);
    return response;
  } catch (error) {
    Logger.recordError(error, TAG);
    return [];
  }
}

export default {
  catchEvent,
  flushEvents,
};
