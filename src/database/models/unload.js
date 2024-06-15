import Realm from 'realm';
import {unloadDeliveries} from '../schemas';

export const setUnload = (moto_id, low, sync, invoices) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [unloadDeliveries],
    })
      .then((realm) => {
        realm.write(() => {
          invoices.map((item) => {
            low.nf_chave = item.nf.nf_chave;
            realm.create('baixas', {
              id: highestId + 1,
              moto_id,
              status: '',
              cte_type_delivery: '',
              nf_lat_long_entrega: '',
              dt_start: '',
              dt_data: '',
            });
          });
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });
