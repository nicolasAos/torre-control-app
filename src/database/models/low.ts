import Realm from 'realm';
import {LowSchema, Photos} from '../schemas';
// utils
import {Logger} from '../../utils';

export const getLowsToSync = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const realm = await Realm.open({schema: [LowSchema, Photos]});
      let allLows = realm.objects('baixas');
      resolve(allLows.filtered('sync = 0'));
    } catch (e) {
      console.log(e);
      reject([]);
    }
  });
};

export const setLow = (moto_id: any, low: any, sync: any) =>
  new Promise((resolve) => {
    Logger.log('Realm create => setLow');
    Realm.open({
      schema: [LowSchema, Photos],
    })
      .then((realm) => {
        realm.write(async () => {
          let id = low.idBanco;
          if (!id) {
            const lastLow = realm.objects('baixas').sorted('id', true)[0];
            const highestId = lastLow == null ? 0 : lastLow.id;
            id = highestId + 1;
          }
          await realm.create(
            'baixas',
            {
              id,
              moto_id,
              rom_id: low.rom_id,
              nf_chave: low.nf_chave,
              nf_dt_entrega: low.nf_dt_entrega,
              nf_dt_descargando: low.nf_dt_descargando,
              nf_dt_llegada: low.nf_dt_llegada,
              inicio_viaje_p: low.nf_dt_inicio_viaje_p,
              nf_dt_canhoto: low.nf_dt_canhoto,
              nf_resp_receber: low.nf_resp_receber,
              nf_ocorrencia: 0,
              nf_obs: 'Baixa realizada via Celular',
              cte_numero: low.cte_numero,
              cte_info_controle: low.cte_chave,
              cte_id: low.cte_id,
              nf_lat_long_entrega: low.nf_lat_long_entrega,
              cte_type_delivery: low.cte_type_delivery,
              nf_type_number: low.nf_type_number,
              photos: low.photos,
              update_or_end: low.update_or_end,
              sync,
              estado_pedido: 'C',
              cadena_frio: 'N',
            },
            true,
          );
        });
        Logger.log('Realm create => setLow successfull');
        realm.close();
        resolve(true);
      })
      .catch((error) => {
        Logger.log('Realm create => setLow fail');
        Logger.recordError(error);
      });
  });

// export const setLowByCte = (moto_id, low, sync, invoices) =>
//   new Promise((resolve) => {
//     Realm.open({
//       schema: [LowSchema],
//     })
//       .then((realm) => {
//         realm.write(() => {
//           invoices.map((item) => {
//             low.nf_chave = item.nf.nf_chave;

//             const lastLow = realm.objects('baixas').sorted('id', true)[0];
//             const highestId = lastLow == null ? 0 : lastLow.id;
//             realm.create('baixas', {
//               id: highestId + 1,
//               moto_id,
//               rom_id: low.rom_id,
//               nf_chave: low.nf_chave,
//               //nf_dt_entrega: low.nf_dt_entrega,
//               nf_dt_arrived: low.nf_dt_llegada,
//               nf_dt_start: low.nf_dt_descargando,
//               nf_dt_end: low.nf_dt_entrega,
//               nf_dt_canhoto: low.nf_dt_canhoto,
//               nf_resp_receber: low.nf_resp_receber,
//               nf_ocorrencia: 0,
//               nf_obs: 'Baixa realizada via Celular',
//               canhoto_img: low.canhoto_img.path,
//               file_name_cachoto: low.canhoto_img.fileName,
//               cte_numero: low.cte_numero,
//               cte_info_controle: 'M',
//               cte_id: low.cte_id,
//               nf_lat_long_entrega: low.nf_lat_long_entrega,
//               cte_type_delivery: low.cte_type_delivery,
//               sync,
//             });
//           });
//         });
//         realm.close();
//         resolve();
//       })
//       .catch((error) => console.log('error', error));
//   });
