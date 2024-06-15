import FormData from 'form-data';
import {Logger} from '../utils';
import api from './api';
export class InvoiceService {
  constructor() {
    this.apiService = api;
  }

  sendDelivery(uri: any, data: any, headers: any) {
    Logger.log('API post => sendDelivery');
    // format data
    const deliveryData = this.prepareDeliveryFormData(data);
    return this.apiService.post(uri, deliveryData, headers);
  }

  sendOccurrence(uri: any, occurrence: any, headers: any) {
    const deliveryData = this.prepareOccurrenceFormData(occurrence);
    return this.apiService.post(uri, deliveryData, headers);
  }

  prepareDeliveryFormData(deliveryData: any) {
    const formData = new FormData();
    deliveryData.photos.forEach((photo) => {
      formData.append(
        'canhoto_img',
        {
          name: photo.fileName,
          uri: photo.uri,
          type: 'image/jpeg',
        },
        photo.fileName,
      );
    });
    // formData.append('canhoto_img', deliveryData.photos[0].base64);
    // formData.append('images_names', deliveryData.photos[0].fileName.replace('.', ':'));
    formData.append('nf_dt_llegada', deliveryData.nf_dt_llegada);
    formData.append('nf_dt_descargando', deliveryData.nf_dt_descargando);
    formData.append('nf_resp_receber', deliveryData.nf_resp_receber);
    formData.append('nf_dt_entrega', deliveryData.nf_dt_entrega);
    formData.append('nf_lat_long_entrega', deliveryData.nf_lat_long_entrega);
    formData.append('nf_dt_canhoto', deliveryData.nf_dt_canhoto);
    formData.append('cte_info_controle', deliveryData.cte_info_controle);
    formData.append('nf_obs', deliveryData.nf_dt_entrega);
    formData.append('nf_chave', deliveryData.rom_id);
    formData.append('nf_dt_inicio_viaje_p', deliveryData.nf_dt_inicio_viaje_p);

    // if (!byCte) {
    //   formData.append('nf_ocorrencia', '0');
    //   formData.append('nf_obs', 'App Torre de Control');
    //   formData.append('nf_chave', '0');
    //   //formData.append('cte_id', deliveryData.cte_id);
    // }
    return formData;
  }

  prepareOccurrenceFormData(occurrenceData: any) {
    const formData = new FormData();

    occurrenceData.photos.map((photo) => {
      formData.append(
        'nf_oco_foto_1',
        {
          name: photo.fileName,
          uri: photo.uri,
          type: 'image/jpeg',
        },
        photo.fileName,
      );
    });

    formData.append('cte_info_controle', occurrenceData.cte_chave);
    formData.append('nf_obs', occurrenceData.nf_obs);
    formData.append('nf_dt_entrega', occurrenceData.nf_dt_ocorrencia);
    formData.append('nf_ocorrencia', occurrenceData.nf_ocorrencia.toString());
    formData.append(
      'nf_lat_long_ocorrencia',
      occurrenceData.nf_lat_long_ocorrencia,
    );
    formData.append('nf_dt_ocorrencia', occurrenceData.nf_dt_ocorrencia);
    formData.append('nf_chave', null);
    formData.append('cte_numero', occurrenceData.rom_id);

    return formData;
  }
}

//comentei pois haviam pedido e depois não sabiam o como usar, aguardando novas diretrizes.
// formData.append('cte_obs', 'Ocorrência registrada via Celular');
// formData.append('viaje', occurrenceData.rom_id);
// formData.append('tracktor', 'Ocorrência registrada via Celular');
// formData.append('nombreOperador', occurrenceData.moto_nome);
// formData.append('destinatario', occurrenceData.destinatario);
// formData.append('direccion', occurrenceData.rom_destino);
// formData.append('telefonoOperador', occurrenceData.moto_tel);
// formData.append(
//   'idColeta',
//   occurrenceData.cte_type_delivery === 'P' ? 1 : 0,
// );
// formData.append(
//   'idDistribuiccion',
//   occurrenceData.cte_type_delivery === 'D' ? 1 : 0,
// );
// formData.append('idRed', 0);
// formData.append('userId', occurrenceData.rom_motorista);
