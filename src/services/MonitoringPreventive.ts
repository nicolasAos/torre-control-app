import api from './apiGo';

/* Utils */
import SnackBarHandler from '../utils/SnackBarHandler';
import {Logger} from '../utils';

export const getMonitoringPreventiveLog = async (preventiveId: any) => {
  try {
    const uri = `/monitoramento-preventivo/log/${preventiveId}`;
    Logger.log(`API get => ${uri}`);
    const response = await api.get(uri);
    return response.data.data;
  } catch (err) {
    SnackBarHandler.error(err);
  }
};
