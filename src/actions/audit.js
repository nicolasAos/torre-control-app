//import api from '../services/apiAudit';
import {setSendAudit} from '../database/models/audit';
import {AuditService} from '../services/AuditServices';
//import Audit from '../screens/AuditScreen';



export const sendAudit = (moto_id, audit) =>
  new Promise((resolve, reject) => {

      if (audit.superName === '') {
        reject(new Error('actions.audit.superName'));
      }

    //   if (audit.photos === '') {
    //     reject(new Error('actions.ocurrence.photo-required'));
    //     return;
    //   }


      const auditService = new AuditService();
      audit.moto_id = moto_id;
      auditService
        .sendAudit(audit)
        .then((data) => {
          const success = data.data.success ? 1 : 0; 
         
          setSendAudit(moto_id, audit, success);
          resolve();
        })
        .catch((error) => {
          setSendAudit(moto_id, audit, 0);
          resolve();
        });
  });

  