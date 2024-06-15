import axios from 'axios';
import moment from 'moment';
import {getDateBD} from '../configs/utils';
import api from '../services/api';

export const travelTranfer = (
  planilla,
  remessa,
  conductorDestino,
  currentTravel,
) =>
  new Promise(async (resolve, reject) => {
    let data = getDateBD();
    let dtFormated = moment(data).format('YYYY-MM-DD');
    let hrFormated = moment(data).format('HH:mm');
    api
      .post('transferencia-planillas', {
        planilla: planilla,
        remesa: remessa,
        viajeDestino: currentTravel,
        conductorDestino: conductorDestino,
        fechaReg: dtFormated,
        horaReg: hrFormated,
        placa: '',
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve(data.data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });
