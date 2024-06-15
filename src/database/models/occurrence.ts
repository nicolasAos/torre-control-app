import Realm from 'realm';
import {SendOccurrenceSchema, Photos} from '../schemas';
// utils
import {Logger} from '../../utils';

export const setSendOccurence = (moto_id: any, occurrence: any, sync: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm create => setSendOccurence`);

    Realm.open({
      schema: [SendOccurrenceSchema, Photos],
    })
      .then((realm) => {
        realm.write(() => {
          const lastOccurrence = realm
            .objects('envio_ocorrencias')
            .sorted('id', true)[0];

          const highestId = lastOccurrence == null ? 0 : lastOccurrence.id;

          realm.create('envio_ocorrencias', {
            id: highestId + 1,
            moto_id: moto_id,
            rom_id: occurrence.rom_id,
            cte_id: occurrence.cte_id,
            cte_numero: occurrence.cte_chave,
            nf_chave: occurrence.chave,
            nf_ocorrencia: occurrence.nf_ocorrencia,
            nf_dt_ocorrencia: occurrence.nf_dt_ocorrencia,
            nf_obs: occurrence.nf_obs,
            // nf_oco_foto_1: occurrence.nf_oco_foto_1.path
            //   ? occurrence.nf_oco_foto_1.path
            //   : occurrence.nf_oco_foto_1.data,
            // file_name_foto_1: occurrence.nf_oco_foto_1.fileName,
            // nf_oco_foto_2: occurrence.nf_oco_foto_2.path
            //   ? occurrence.nf_oco_foto_2.path
            //   : occurrence.nf_oco_foto_2.data,
            // file_name_foto_2: occurrence.nf_oco_foto_2.fileName,
            // nf_oco_foto_3: occurrence.nf_oco_foto_3.path
            //   ? occurrence.nf_oco_foto_3.path
            //   : occurrence.nf_oco_foto_3.data,
            //file_name_foto_3: occurrence.nf_oco_foto_3.fileName,
            photos: occurrence.photos,
            cte_obs: 'Ocorrência registrada via Celular',
            cte_info_controle: occurrence.cte_chave,
            nf_lat_long_ocorrencia: occurrence.nf_lat_long_ocorrencia,
            nf_type_number: occurrence.nf_type_number,
            update_or_end: false,
            sync,
            estado_pedido: '',
            cadena_frio: 'N',
          });
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('errori', error.message));
  });
