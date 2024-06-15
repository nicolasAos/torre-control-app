import {setLow,} from '../database/models/low';
import {InvoiceService} from '../services/InvoicesServices';
// utils
import {Logger, Offline, Location} from '../utils';

const TAG = 'src/actions/low';

export const sendLow = (moto_id: any, low: any, user_id: any) => {
  return new Promise(async (resolve, reject) => {
    Logger.log('send low');
    if (low.nf_resp_receber == '' || low.nf_resp_receber == null) {
      reject(new Error('Porfavor rellene el nombre'));
      return;
    }

    const invoiceService = new InvoiceService();
    const uri = 'nota-fiscal/entrega';
    const headers = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    const coords = await Location.getCurrentPosition();

    if (!coords) return;

    low.nf_lat_long_entrega = `${coords.latitude}, ${coords.longitude}`;
    const data = {
      photos: low.photos,
      cte_numero: low.cte_numero,
      nf_resp_receber: low.nf_resp_receber,
      nf_ocorrencia: '0',
      nf_obs: 'App Torre de Control',
      nf_dt_entrega: low.nf_dt_entrega,
      nf_dt_llegada: low.nf_dt_llegada,
      nf_dt_descargando: low.nf_dt_descargando,
      nf_dt_inicio_viaje_p: low.nf_dt_inicio_viaje_p,
      nf_lat_long_entrega: low.nf_lat_long_entrega,
      nf_dt_canhoto: low.nf_dt_canhoto,
      nf_chave: low.nf_chave,
      cte_info_controle: low.cte_chave,
      rom_id: low.rom_id,
      update_or_end: low.update_or_end,
      start_travel: low.start_travel,
    };
    try {
      // send smth to the API
      await invoiceService.sendDelivery(uri, data, headers);
      await lowInfo(moto_id, low, 0);
      Logger.log('send low sucessfull ✅');
      resolve(true);
      return;
    } catch (e) {
      Logger.log(`[${TAG}] send low error ❌`);
      Offline.catchEvent(uri, data, headers);
      await lowInfo(moto_id, low, 0);
      resolve(false);
      return;
    }
  });
};

const lowInfo = async (moto_id: any, low: any, status: any) => {
  if (
    low.nf_dt_llegada !== null &&
    low.nf_dt_descargando !== null &&
    low.nf_dt_entrega !== null
  ) {
    if (low.photos.length !== 0 && low.cte_type_delivery !== 'P') {
      for (const lowPhoto of low.photos) {
        if (lowPhoto.type == 'offline') {
          //await RNFS.unlink(lowPhoto.path);
        }
      }
      low.photos = [];
    }
  }
  if (low.photos.length > 0) {
    let endPhotos = [];
    for (const oPhotos of low.photos) {
      if (oPhotos.type == 'offline') {
        endPhotos.push(oPhotos);
      }
    }
    low.photos = endPhotos;
  }
  await setLow(moto_id, low, status);
};
