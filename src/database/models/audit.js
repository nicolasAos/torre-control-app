import Realm from 'realm';
import {SendAuditSchema, Photos} from '../schemas';

export const setSendAudit = (moto_id, audit, sync) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [SendAuditSchema, Photos],
    })
      .then((realm) => {
        realm.write(() => {
          const lastAudit = realm.objects('envio_audit').sorted('id', true)[0];

          const highestId = lastAudit == null ? 0 : lastAudit.id;

          realm.create('envio_audit', {
            id: highestId + 1,
            moto_id: moto_id,
            travelId: audit.travelId,
            license: audit.license,
            superName: audit.superName,
            totalOrders: audit.totalOrders,
            totalOrdersDelivered: audit.totalOrdersDelivered,
            orderIssues: audit.orderIssues,
            observations: audit.observations,
            totalOrdersDelivered: audit.totalOrdersDelivered,
            dateDone: audit.dateDone,
            photos: occurrence.photos,
            update_or_end: occurrence.update_or_end,
            sync,
          });
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error.message));
  });
