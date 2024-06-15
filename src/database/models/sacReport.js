import Realm from 'realm';
import {SendSACReportSchema, Photos} from '../schemas';

export const setSendSACReport = (moto_id, sacReport, sync) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [SendSACReportSchema, Photos],
    })
      .then((realm) => {
        realm.write(() => {
          const lastSACReport = realm
            .objects('envio_sacReports')
            .sorted('id', true)[0];

          const highestId = lastSACReport == null ? 0 : lastSACReport.id;

          realm.create('envio_sacReports', {
            id: highestId + 1,
            moto_id: moto_id,
            photos: sacReport.photos,
            update_or_end: sacReport.update_or_end,
            sync,
          });
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error.message));
  });
