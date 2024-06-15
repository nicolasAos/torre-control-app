import axios, {AxiosResponse} from 'axios';
// config
import {CREO_SERVICES_BASE_URL} from '../config';
// type
import type {ColSDTDesMovCaj, ColSDTDesMovCajResponse} from './types';
// utils
import {Logger, Offline} from '../utils';

const TAG = 'src/api/post';
const TIMEOUT = 4000; // 4 segs

/**
 * Send the remesa box by box
 * @param Box
 */
async function WSEntregaRemesa(
  box: ColSDTDesMovCaj,
): Promise<ColSDTDesMovCajResponse | undefined> {
  const endpoint = 'WSEntregaRemesa';
  Logger.log(`API post => ${endpoint}`);
  const url = `${CREO_SERVICES_BASE_URL}${endpoint}`;
  try {
    const response: AxiosResponse<ColSDTDesMovCajResponse> = await axios({
      method: 'POST',
      timeout: TIMEOUT,
      url,
      data: box,
    });
    Logger.log(`API post => ${endpoint} successful ✅`);
    return response.data;
  } catch (error) {
    Logger.log(`API post => ${endpoint} fail ❌`);
    Logger.recordError(error, TAG);
    Offline.catchEvent(endpoint, box);
    return undefined;
  }
}

export {WSEntregaRemesa};
