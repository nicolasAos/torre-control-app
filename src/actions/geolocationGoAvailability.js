import api from '../services/apiGo';
import {getDateBD, isObjectEmpty} from '../configs/utils';
import {setTrackingGo} from '../database/models/tracking';
import {store} from '../store';
import {
  motoIdSelector,
  deviceIdSelector,
  freightWishSelector,
  pushPreventiveMonitoringSelector,
  isTravelSelector,
} from '../reducers/selectors';

export const sendLocationGoAvailability = (location) =>
  new Promise(async (resolve) => {
    const moto_id = motoIdSelector(store.getState());
    const travel = isTravelSelector(store.getState());
    const monitoring = pushPreventiveMonitoringSelector(store.getState());
    if (travel || !isObjectEmpty(monitoring)) {
      return;
    }
    const device_id = deviceIdSelector(store.getState());
    const available = freightWishSelector(store.getState());
    const evento = `actions.geolocation-go-avaibility.driver-available (${getDateBD()})`;

    const id_geo = moto_id;
    if (available !== null && available.length > 0 && available[0].ativo == 1) {
      api
        .post('location-device', {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          device_data: getDateBD(),
          device_id: device_id,
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
            sync: 0,
          });
          resolve();
        });
    } else {
      resolve();
    }
  });

export const sendLocationGoAvailabilityBackground = () =>
  new Promise(async (resolve) => {
    const location = {latitude: '', longitude: ''};
    const moto_id = motoIdSelector(store.getState());
    const travel = isTravelSelector(store.getState());
    const monitoring = pushPreventiveMonitoringSelector(store.getState());
    if (travel || !isObjectEmpty(monitoring)) {
      return;
    }
    const device_id = deviceIdSelector(store.getState());
    const available = freightWishSelector(store.getState());
    if (available !== null && available.length > 0 && available[0].ativo == 1) {
      if (!location.latitude) {
        return;
      }
      const evento = `actions.geolocation-go-avaibility.driver-available (${getDateBD()})`;
      const id_geo = moto_id;
      try {
        await api.post('location-device', {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          device_data: getDateBD(),
          device_id: device_id,
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
          sync: 0,
        });
      }
    }
    resolve();
  });
