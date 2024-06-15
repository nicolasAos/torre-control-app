import FormData from 'form-data';
import {Platform} from 'react-native';
import api from './apiAudit';
export class AuditService {
  constructor() {
    this.apiService = api;
  }

  sendAudit(audit) {
    return this.apiService.post(
      'save',
      {
        auditorId: audit.moto_id,
        auditorName: audit.superName,
        dateDone: audit.dateDone,
        id: 0,
        totalOrder: audit.totalOrders,
        ordersDelivered: audit.totalOrdersDelivered,
        ordersWithIssues: audit.orderIssues,
        observations: audit.observations,
        travelId: audit.travelId,
        truckId: audit.license,
      },
      // this.prepareAuditFormData(audit),
      // {
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'multipart/form-data',
      //   },
      // },
    );
  }

  prepareAuditFormData(auditData) {
    const formData = new FormData();
    const lastPhotoAudit = auditData.photos[auditData.photos.length - 1];

    auditData.photos.map((photo) => {
      formData.append('nf_oco_foto_1[]', {
        name: photo.fileName,
        uri: Platform.OS === 'android' ? `file://${photo.path}` : photo.path,
        type: 'image/png',
      });
    });

    // if (auditData.photos.length > 1) {
    //   formData.append('nf_oco_foto_1[]', {
    //     name: lastPhotoAudit.fileName,
    //     uri:
    //       Platform.OS === 'android'
    //         ? `file://${lastPhotoAudit.path}`
    //         : lastPhotoAudit.path,
    //     type: 'image/png',
    //   });
    // }

    formData.append('auditorId', auditData.moto_id);
    formData.append('auditorName', auditData.superName);
    formData.append('dateDone', auditData.dateDone);
    formData.append('id', 0);
    formData.append('totalOrder', auditData.totalOrders);
    formData.append('ordersDelivered', auditData.totalOrdersDelivered);
    formData.append('ordersWithIssues', auditData.orderIssues);
    formData.append('observations', auditData.observations);
    formData.append('travelId', auditData.travelId);
    formData.append('truckId', auditData.license);

    return formData;
  }
}
