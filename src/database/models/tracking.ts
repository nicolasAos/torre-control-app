import Realm from 'realm';
import {TrackingSchema, TrackingGoSchema} from '../schemas';
// utils
import {Logger} from '../../utils';

export const setTracking = (params: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm create => setTracking`);
    Realm.open({
      schema: [TrackingSchema],
    })
      .then((realm) => {
        realm.write(() => {
          var lastTracking = realm.objects('tracking').sorted('id', true)[0];
          var highestId = lastTracking == null ? 0 : lastTracking.id;
          realm.create(
            'tracking',
            {
              id: highestId + 1,
              moto_id: params.moto_id,
              latitude: params.latitude,
              longitude: params.longitude,
              device_data: params.device_data,
              device_id: params.device_id,
              evento: params.evento,
              id_geo: params.id_geo ? params.id_geo.toString() : '',
              sync: params.sync,
            },
            'modified',
          );
        });
        realm.close();
        resolve();
      })
      .catch((error) => {
        console.log('error', error);
        resolve();
      });
  });

export const setTrackingGo = (params) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TrackingGoSchema],
    })
      .then((realm) => {
        realm.write(() => {
          var lastTrackingGo = realm
            .objects('tracking_go')
            .sorted('id', true)[0];
          var highestId = lastTrackingGo == null ? 0 : lastTrackingGo.id;
          realm.create(
            'tracking_go',
            {
              id: highestId + 1,
              moto_id: params.moto_id,
              latitude: params.latitude,
              longitude: params.longitude,
              device_data: params.device_data,
              device_id: params.device_id,
              evento: params.evento,
              id_geo: params.id_geo ? params.id_geo.toString() : '',
              monitoramento_preventivos_id: params.monitoramento_preventivos_id,
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
