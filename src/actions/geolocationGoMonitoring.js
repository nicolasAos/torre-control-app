import api from '../services/apiGo';
import {getDateBD, isObjectEmpty} from '../configs/utils';
import {setTrackingGo} from '../database/models/tracking';
import {store} from '../store';
import {
  motoIdSelector,
  deviceIdSelector,
  pushPreventiveMonitoringSelector,
  isTravelSelector,
} from '../reducers/selectors';

export const sendLocationGoMonitoring = (location) =>
  new Promise(async (resolve) => {
    const moto_id = motoIdSelector(store.getState());
    const travel = isTravelSelector(store.getState());
    if (travel) {
      return;
    }
    const device_id = deviceIdSelector(store.getState());
    const monitoring = pushPreventiveMonitoringSelector(store.getState());
    const evento = `actions.geolocation-go-monitoring.preventive-monitoring (${getDateBD()})`;
    const id_geo = moto_id;
    if (!isObjectEmpty(monitoring)) {
      const monitoramento_preventivos_id = monitoring.id;
      api
        .post('location-device', {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          device_data: getDateBD(),
          monitoramento_preventivos_id,
          device_id,
          id_geo,
          evento,
        })
        .then((response) => response.data)
        .then((data) => {
          if (!data.success) {
            setTrackingGo({
              moto_id,
              device_id,
              latitude: location.latitude.toString(),
              longitude: location.longitude.toString(),
              device_data: getDateBD(),
              id_geo,
              evento,
              monitoramento_preventivos_id,
              sync: 0,
            });
          }
          resolve();
        })
        .catch(() => {
          setTrackingGo({
            moto_id,
            device_id,
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString(),
            device_data: getDateBD(),
            id_geo,
            evento,
            monitoramento_preventivos_id,
            sync: 0,
          });
          resolve();
        });
    } else {
      resolve();
    }
  });

export const sendLocationGoMonitoringBackground = () =>
  new Promise(async (resolve) => {
    const location = {latitude: '', longitude: ''};
    const moto_id = motoIdSelector(store.getState());
    const travel = isTravelSelector(store.getState());
    if (travel) {
      return;
    }
    const device_id = deviceIdSelector(store.getState());
    const monitoring = pushPreventiveMonitoringSelector(store.getState());

    if (!isObjectEmpty(monitoring)) {
      if (!location.latitude) {
        return;
      }
      const monitoramento_preventivos_id = monitoring.id;
      const evento = `actions.geolocation-go-monitoring.preventive-monitoring (${getDateBD()})`;
      const id_geo = moto_id;
      try {
        await api.post('location-device', {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          device_data: getDateBD(),
          monitoramento_preventivos_id,
          device_id,
          id_geo,
          evento,
        });
      } catch (e) {
        await setTrackingGo({
          moto_id,
          device_id,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          device_data: getDateBD(),
          id_geo,
          evento,
          monitoramento_preventivos_id,
          sync: 0,
        });
      }
    }
    resolve();
  });
