import FormData from 'form-data';
import {Platform} from 'react-native';
import api from './api';
export class SACReportService {
  constructor() {
    this.apiService = api;
  }

  sendSACReport(sacReport, description) {
    return this.apiService.post(
      'recepcion-estados' /*'endpoint'*/,
      this.prepareSACReportFormData(sacReport, description),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  prepareSACReportFormData(sacReportData, description) {
    const formData = new FormData();
    // const lastPhotoSACReport =
    // sacReportData.photos[sacReportData.photos.length - 1];

    // sacReportData.photos.map((photo) => {
    //   formData.append('nf_oco_foto_1[]', {
    //     name: photo.fileName,
    //     uri: Platform.OS === 'android' ? `file://${photo.path}` : photo.path,
    //     type: 'image/png',
    //   });
    // });

    // if (sacReportData.photos.length > 1) {
    //   formData.append('nf_oco_foto_1[]', {
    //     name: lastPhotoSACReport.fileName,
    //     uri:
    //       Platform.OS === 'android'
    //         ? `file://${lastPhotoSACReport.path}`
    //         : lastPhotoSACReport.path,
    //     type: 'image/png',
    //   });
    // }

    /// formData.append('cte_numero', sacReportData.moto_id);
    formData.append('Remesa', sacReportData.nf_id);
    formData.append('Planilla', sacReportData.no_planilla);
    formData.append('Travel_id', sacReportData.rom_manifesto);
    formData.append('Distination_order', sacReportData.cte_ordem);
    formData.append('Fecha_Entrega', '');
    formData.append('Hora_Entrega', '');
    formData.append('Estado', '');
    formData.append('Novedad', '');
    formData.append('Fecha_Transmisiion', '');
    formData.append('Hora_Transmison', '');
    formData.append('MoviliadEstadoGeneral', '');
    formData.append('MovLong', 0);
    formData.append('MovLatitud', 0);
    formData.append('MovilidadCarguePaso', '');
    formData.append('MovilidadNovSacOtr', description);
    formData.append('IndiMercanciaInv', '');

    return formData;
  }
}
