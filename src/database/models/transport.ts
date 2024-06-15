import Realm from 'realm';
import {
  TransportSchema,
  CTEsSchema,
  TransportStatusGpsSchema,
} from '../schemas';

// utils
import {Logger} from '../../utils';

export const getTravel = (motoId) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        var travelReturn = {};
        const travels = realm
          .objects('transporte')
          .filtered('moto_id = $0 AND sync_fim = $1', motoId, 0);
        if (travels.length > 0) {
          travelReturn = JSON.parse(JSON.stringify(travels));
        }
        realm.close();
        resolve(Object.values(travelReturn));
      })
      .catch((error) => console.log('error', error));
  });

export const setTransport = (moto_id: any, params: any, sync: any) =>
  new Promise((resolve) => {
    Logger.log('Realm create => setTransport');
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        realm.write(() => {
          const lastTransport = realm
            .objects('transporte')
            .sorted('id', true)[0];
          const highestId = lastTransport == null ? 0 : lastTransport.id;
          realm.create('transporte', {
            id: highestId + 1,
            moto_id,
            rom_id: params.rom.rom_id,
            rom_id_controle: params.rom.rom_id_controle,
            rom_motorista: moto_id.toString(),
            rom_km_total: params.rom.rom_km_total,
            rom_origem: params.rom.rom_origem,
            rom_destino: params.rom.rom_destino,
            rom_manifesto: params.rom.rom_manifesto,
            rom_dt_manifesto: params.rom.rom_dt_manifesto,
            rom_inicio_transp: params.rom.rom_inicio_transp,
            rom_empresa: params.rom.nf_empresa,
            rom_chat_key: params.rom.rom_chat_key,
            rom_device_id: params.rom.rom_device_id,
            rom_total_notas: params.nfsQtdRom.toString(),
            rom_lat_long_inicio: params.rom.rom_lat_long_inicio,
            rom_dt_gps: params.rom.rom_dt_gps,
            rom_gps_ativo: params.rom.rom_gps_ativo,
            sync,
            sync_fim: 0,
          });
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });

export const finishTransport = (moto_id, params, syncFinish) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        realm.write(async () => {
          const transport = realm
            .objects('transporte')
            .filtered(
              'moto_id = $0 && rom_id = $1',
              moto_id,
              params.rom.rom_id,
            )[0];
          console.log(transport, 'here');
          realm.create(
            'transporte',
            {
              id: transport.id,
              moto_id,
              rom_id: transport.rom_id,
              rom_id_controle: transport.rom_id_controle,
              rom_motorista: moto_id.toString(),
              rom_km_total: transport.rom_km_total,
              rom_origem: transport.rom_origem,
              rom_destino: transport.rom_destino,
              rom_manifesto: transport.rom_manifesto,
              rom_dt_manifesto: transport.rom_dt_manifesto,
              rom_inicio_transp: transport.rom_inicio_transp,
              rom_fim_transp: params.rom.rom_fim_transp,
              rom_empresa: transport.nf_empresa,
              rom_chat_key: transport.rom_chat_key,
              rom_device_id: transport.rom_device_id,
              rom_total_notas: transport.rom_total_notas,
              rom_notas_entregues: transport.rom_notas_entregues,
              rom_ocorrencias: transport.rom_ocorrencias,
              rom_notas_paradas: transport.rom_notas_paradas,
              rom_lat_long_inicio: transport.rom_lat_long_inicio,
              rom_lat_long_fim: params.rom.rom_lat_long_fim,
              rom_resp_fim: params.rom.rom_resp_fim,
              rom_dt_gps: params.rom.rom_dt_gps,
              rom_gps_ativo: params.rom.rom_gps_ativo,
              sync: transport.sync,
              sync_fim: syncFinish,
            },
            true,
          );
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error.message));
  });

export const setTransportStatusGps = (params) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TransportStatusGpsSchema],
    })
      .then((realm) => {
        realm.write(() => {
          var lastTravelStatus = realm
            .objects('transporte_status_gps')
            .sorted('id', true)[0];
          var highestId = lastTravelStatus == null ? 0 : lastTravelStatus.id;
          realm.create(
            'transporte_status_gps',
            {
              id: highestId + 1,
              moto_id: params.moto_id,
              rom_id_controle: params.rom_id_controle,
              rom_gps_ativo: params.rom_gps_ativo,
              rom_dt_gps: params.rom_dt_gps,
              sync: params.sync,
            },
            'modified',
          );
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });

export const setTraveling = (moto_id, params, sync, sync_fim) => {
  Realm.open({
    schema: [TransportSchema, CTEsSchema],
  })
    .then((realm) => {
      realm.write(() => {
        if (params.legado == 1) {
          return;
        }
        const travels = realm
          .objects('transporte')
          .filtered(
            'moto_id = $0 AND (sync = $1 OR sync = $2) AND (sync_fim = $3 OR sync_fim = $4)',
            moto_id,
            0,
            1,
            0,
            1,
          );
        if (travels.length < 1) {
          const lastTransport = realm
            .objects('transporte')
            .sorted('id', true)[0];
          const highestId = lastTransport == null ? 0 : lastTransport.id;
          realm.create('transporte', {
            id: highestId + 1,
            moto_id,
            rom_id: params.rom_id,
            rom_id_controle: params.rom_id_controle,
            rom_motorista: moto_id.toString(),
            rom_km_total: params.rom_km_total,
            rom_origem: params.rom_origem,
            rom_destino: params.rom_destino,
            rom_manifesto: params.rom_manifesto,
            rom_dt_manifesto: params.rom_dt_manifesto,
            rom_inicio_transp: params.rom_inicio_transp,
            rom_empresa: params.nf_empresa,
            rom_chat_key: params.rom_chat_key,
            rom_device_id: params.rom_device_id,
            rom_lat_long_inicio: params.rom_lat_long_inicio,
            rom_dt_gps: params.rom_dt_gps,
            rom_gps_ativo: params.rom_gps_ativo == 1 ? true : false,
            sync,
            sync_fim,
          });

          const invoices = realm
            .objects('notas_fiscais')
            .filtered('moto_id = $0 AND rom_id = $1', moto_id, params.rom_id);

          if (invoices.length < 1) {
            const lastInvoice = realm
              .objects('notas_fiscais')
              .sorted('id', true)[0];
            const highestId = lastInvoice == null ? 0 : lastInvoice.id;
            realm.create('notas_fiscais', {
              id: highestId == null ? 1 : highestId + 1,
              moto_id,
              rom_id_controle: params.rom_id_controle,
              rom_id: params.rom_id,
              rom_km_total: params.rom_km_total,
              rom_origem: params.rom_origem,
              rom_destino: params.rom_destino,
              rom_manifesto: params.rom_manifesto,
              rom_dt_manifesto: params.rom_dt_manifesto,
              nf_empresa: params.rom_empresa,
            });
          }
        }
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const deleteTraveling = (moto_id) => {
  Realm.open({
    schema: [TransportSchema, CTEsSchema],
  })
    .then((realm) => {
      realm.write(() => {
        const travels = realm
          .objects('transporte')
          .filtered('moto_id = $0 AND sync_fim = $1', moto_id, 0);
        if (travels.length > 0) {
          const ctes = realm
            .objects('notas_fiscais')
            .filtered(
              'moto_id = $0 AND rom_id = $1',
              moto_id,
              travels[0].rom_id,
            );
          if (ctes.length > 0) {
            realm.delete(ctes);
          }
          realm.delete(travels);
        }
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const getTravelsInitiate = (motoId) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        var travelReturn = {};
        const travels = realm
          .objects('transporte')
          .filtered('moto_id = $0 AND sync_fim = $1', motoId, 0);
        if (travels.length > 0) {
          travelReturn = JSON.parse(JSON.stringify(travels));
        }
        realm.close();
        resolve(Object.values(travelReturn));
      })
      .catch((error) => console.log('error', error));
  });

export const getTravelsFinish = (motoId) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        var travelReturn = {};
        const travels = realm
          .objects('transporte')
          .filtered('moto_id = $0 AND sync_fim != $1', motoId, 0);
        const sortedTravels = travels.sorted('sync_fim');
        if (sortedTravels.length > 0) {
          travelReturn = JSON.parse(JSON.stringify(sortedTravels));
        }
        realm.close();
        resolve(Object.values(travelReturn));
      })
      .catch((error) => console.log('error', error));
  });

export const getTravelsToSync = (motoId: any) => {
  return new Promise((resolve) => {
    Logger.log('Realm get => getTravelsToSync');
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        var travelReturn = {};
        const travels = realm
          .objects('transporte')
          .filtered('moto_id = $0 AND sync_fim == $1', motoId, 1);
        if (travels.length > 0) {
          travelReturn = JSON.parse(JSON.stringify(travels));
        }
        realm.close();
        resolve(Object.values(travelReturn));
      })
      .catch((error) => Logger.recordError(error));
  });
};
