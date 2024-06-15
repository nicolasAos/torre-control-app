import Realm from 'realm';
import {Logger} from '../../utils';
import {CheckInSchema} from '../schemas';

export const saveCheckIn = (
  motorista_id,
  chave_cte,
  cte,
  cte_id,
  device_id,
  location,
  id_api,
  sync,
) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [CheckInSchema],
    })
      .then(async (realm) => {
        realm.write(() => {
          const check = realm
            .objects('check')
            .filtered(
              'motorista_id = $0 && chave_cte = $1 && cte = $2 && cte_id = $3',
              motorista_id,
              chave_cte,
              cte,
              cte_id,
            );
          if (check.length < 1) {
            const lastCheck = realm.objects('check').sorted('id', true)[0];
            const highestId = lastCheck == null ? 0 : lastCheck.id;
            check.id = highestId == null ? 1 : highestId + 1;
          } else {
            check = check[0];
          }
          realm.create(
            'check',
            {
              id: check.id,
              id_api,
              motorista_id,
              chave_cte,
              cte_id,
              cte,
              device_id,
              latitude_checkIn: location.latitude.toString(),
              longitude_checkIn: location.longitude.toString(),
              latitude_checkOut: '',
              longitude_checkOut: '',
              sync,
            },
            true,
          );
        });
        const checkIn = await getCheckInBD(
          motorista_id,
          chave_cte,
          cte,
          cte_id,
        );
        realm.close();
        resolve(checkIn);
      })
      .catch((error) => console.log('error', error));
  });

export const getCheckInBD = (
  motorista_id: any,
  chave_cte: any,
  cte: any,
  cte_id: any,
) =>
  new Promise((resolve) => {
    Logger.log(`Realm get => getCheckInBD`);
    Realm.open({
      schema: [CheckInSchema],
    })
      .then((realm) => {
        let data = {};
        data.checkIn = false;
        const checkIn = realm
          .objects('check')
          .filtered(
            'motorista_id = $0 && chave_cte = $1 && cte = $2 && cte_id = $3',
            motorista_id,
            chave_cte,
            cte,
            cte_id,
          );
        if (checkIn.length > 0) {
          data = JSON.parse(JSON.stringify(checkIn));
          data.checkIn = true;
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => console.log('error', error));
  });

export const saveCheckOut = (checkIn, location, sync) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [CheckInSchema],
    })
      .then((realm) => {
        realm.write(() => {
          realm.create(
            'check',
            {
              id: checkIn.id,
              id_api: checkIn.id_api,
              motorista_id: checkIn.motorista_id,
              chave_cte: checkIn.chave_cte,
              cte: checkIn.cte,
              device_id: checkIn.device_id,
              latitude_checkIn: checkIn.latitude_checkIn,
              longitude_checkIn: checkIn.longitude_checkIn,
              latitude_checkOut: location.latitude.toString(),
              longitude_checkOut: location.longitude.toString(),
              sync,
            },
            true,
          );
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });
