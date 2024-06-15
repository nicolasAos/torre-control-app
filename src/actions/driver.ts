import api from '../services/api';
import Validator from 'email-validator';
import {saveStoreAlterLogin} from '../configs/utils';
import {
  createInvoice,
  deleteInvoices,
  getSpreadSheets,
  getInvoices,
  getCtes,
  getNfs,
  getLow,
  deleteCtes,
  saveCtesSupervisorProfile,
  getCtesToSupervisorProfile,
  getNfsToSupervisorProfile,
  deleteCtesSupervisorProfile,
} from '../database/models/invoice';
import {
  saveCheckIn,
  getCheckInBD,
  saveCheckOut,
} from '../database/models/checkIn';
import {ALTER_LOGIN_SUCCESS} from './types';
import {sendLocationEvent} from './geolocation';
import {getDateBD} from '../configs/utils';
import globalApi from '../services/globalApi';
import moment from 'moment';
import {loginSelector} from '../reducers/selectors';
import {Alert} from 'react-native';
// utils
import {Logger, Offline} from '../utils';
// import { GOOGLE_MAPS_KEY } from "@env";
//import axios from 'axios';
const TAG = 'src/actions/driver';

export const getCTEsByDriver = (moto_id: any) =>
  new Promise((resolve) => {
    const uri = `motorista/lista-ctes/${moto_id}`;
    Logger.log(`API get => ${uri}`);
    api
      .get(uri)
      .then((response) => response.data)
      .then(async (data) => {
        if (data.success) {
          await deleteInvoices(moto_id);
          await createInvoice(data.data, moto_id);
          resolve(data.data);
          return;
        }
        resolve([]);
      })
      .finally(resolve);
  });

export const getCtesRemmitances = async (moto_id: any) => {
  return new Promise(async (resolve) => {
    Logger.log(`API get => motorista/lista-ctes/${moto_id}`);
    api
      .get('motorista/lista-ctes/' + moto_id)
      .then((response) => response.data)
      .then(async (data) => {
        if (data.success) {
          try {
            await deleteCtesSupervisorProfile();
            await saveCtesSupervisorProfile(data.data);
            resolve(data.data);
          } catch (e) {
            Logger.recordError(e, TAG);
            resolve([]);
          }
        }
      })
      .catch((err) => {
        Logger.recordError(err, TAG);
        resolve([]);
      });
  });
};
export const deleteDataCtes = () => {
  deleteCtes();
};

export const getCTEsByDriverOffline = async (moto_id: any) => {
  const g = await getInvoices(moto_id);
  return g;
};

export const getSpreadSheetsOffline = (moto_id: any) => {
  return new Promise(async (resolve, reject) => {
    // get smth from realm
    await getSpreadSheets(moto_id).then(resolve).catch(reject);
  });
};
export const getCtesOffline = (moto_id: any, rom_id: any) =>
  new Promise((resolve, reject) => {
    getCtes(moto_id, rom_id).then(resolve).catch(reject);
  });

export const getNfsOffline = (moto_id: any, cteId: any) =>
  new Promise((resolve, reject) => {
    getNfs(moto_id, cteId).then(resolve).catch(reject);
  });

export const getLowOffline = (nf_type_number: any) =>
  new Promise((resolve, reject) => {
    getLow(nf_type_number).then(resolve).catch(reject);
  });

export const getDrivers = () =>
  new Promise((resolve, reject) => {
    api
      .get('motorista')
      .then((response) => {
        const {data} = response;
        resolve(data);
      })
      .catch(reject);
  });

export const getDriverById = (id: any) =>
  new Promise((resolve, reject) => {
    api
      .get('motorista/' + id)
      .then((response) => {
        const {data} = response;
        resolve(data);
      })
      .catch(reject);
  });

export const createDriver = ({name, email, password, cpf, phone}: any) =>
  new Promise((resolve, reject) => {
    api
      .post('motorista', {
        moto_nome: name,
        moto_email: email,
        moto_senha: password,
        moto_cpf: cpf,
        moto_tel: phone,
        moto_ativo: '1',
      })
      .then((response) => {
        const {data} = response;
        resolve(data);
      })
      .catch(reject);
  });

export const alterPasswordDriverById =
  (
    id: any,
    moto_senha: any,
    moto_senha_atual: any,
    newPassword: any,
    confirmNewPassword: any,
  ) =>
  (dispatch: any) =>
    new Promise((resolve, reject) => {
      if (!moto_senha_atual || !newPassword || !confirmNewPassword) {
        reject(new Error('actions.driver.fill-in-all-fields'));
        return;
      }

      if (moto_senha !== moto_senha_atual) {
        reject(new Error('actions.driver.password-not-match'));
        return;
      }

      if (newPassword !== confirmNewPassword) {
        reject(new Error('actions.driver.password-confirmation'));
        return;
      }

      if (moto_senha_atual === newPassword) {
        reject(new Error('actions.driver.equal-password'));
        return;
      }

      api
        .put(`motorista/change-password/${id}`, {
          moto_senha: newPassword,
        })
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            data.data.moto_senha = newPassword;
            saveStoreAlterLogin(data, reject);
            dispatch({type: ALTER_LOGIN_SUCCESS, payload: data.data});
            resolve(data);
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(reject);
    });

export const alterPasswordTemporary =
  (id: any, newPassword: any, confirmNewPassword: any, senha_temporaria: any) =>
  (dispatch: any) =>
    new Promise((resolve, reject) => {
      if (!newPassword || !confirmNewPassword) {
        reject(new Error('actions.driver.fill-in-all-fields'));
        return;
      }

      if (newPassword !== confirmNewPassword) {
        reject(new Error('actions.driver.password-confirmation'));
        return;
      }

      api
        .put(`motorista/change-password/${id}`, {
          moto_senha: newPassword,
          senha_temporaria,
        })
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            data.data.moto_senha = newPassword;
            data.data.senha_temporaria = senha_temporaria;
            saveStoreAlterLogin(data, reject);
            dispatch({type: ALTER_LOGIN_SUCCESS, payload: data.data});
            resolve(data);
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(reject);
    });

/**
 * Update driver profile
 * @param id
 * @param apelido
 * @param moto_nome
 * @param moto_email
 * @param moto_cpf
 * @param moto_tel
 * @param moto_senha
 * @param foto
 * @param prevObj
 * @returns
 */
export const alterDriverById =
  (
    id,
    apelido,
    moto_nome,
    moto_email,
    moto_cpf,
    moto_tel,
    moto_senha,
    foto = null,
    prevObj,
  ) =>
  (dispatch: any) =>
    new Promise((resolve, reject) => {
      /**
       * TODO:
       * [ ]: Catch this request
       */

      if (!moto_email || !moto_tel) {
        Logger.log('fill all the fiels');
        reject(new Error('actions.driver.fill-in-all-fields'));
        return;
      }

      // if (moto_tel.length != 11) {
      //   reject(new Error('actions.driver.cell-phone-incomplete'));
      //   return;
      // }

      if (!Validator.validate(moto_email)) {
        reject(new Error('actions.driver.valid-email'));
        return;
      }

      if (
        moto_email.includes('@agv.com.br') ||
        moto_email.includes('@3pl.com.br')
      ) {
        reject(new Error('actions.driver.corporate-email'));
        return;
      }
      const dataToSend = {
        moto_nome,
        moto_email,
        moto_tel,
        moto_id: id,
        moto_login: 1,
      };

      const formSend = new FormData();
      for (let key in dataToSend) {
        formSend.append(key, dataToSend[key]);
      }
      if (foto) {
        formSend.append('foto', foto, foto.name);
      } else {
        prevObj.foto
          ? formSend.append(
              'foto',
              {
                name: prevObj.foto.substr(41),
                uri: prevObj.foto,
                type: 'image/jpeg',
              },
              prevObj.foto.substr(41),
            )
          : formSend.append(
              'foto',
              {
                name: 'default.png',
                uri: 'https://res.cloudinary.com/scute/image/upload/v1640820941/placeholder_l4yjsq.png',
                type: 'image/png',
              },
              'default.png',
            );
      }

      const uri = `motorista-update/${id}`;
      Logger.log(`API post => ${uri}`);

      api
        .post(uri, formSend)
        .then((response) => response.data)
        .then((dataToSend) => {
          if (dataToSend.success) {
            let newData = dataToSend.data;
            newData.moto_senha = moto_senha;
            saveStoreAlterLogin(newData, reject);
            let newUserObj = {
              ...prevObj,
              moto_nome: newData.moto_nome,
              moto_email: newData.moto_email,
              moto_cpf: newData.moto_cpf,
              moto_tel: newData.moto_tel,
              moto_id: id,
              moto_login: 1,
              foto: newData.foto,
              moto_senha: moto_senha,
            };
            dispatch({type: ALTER_LOGIN_SUCCESS, payload: newUserObj});
            resolve({message: 'Datos actualizados con exito'});
          }
        })
        .catch((error) => {
          Logger.recordError(error);
          reject(error);
        });
    });

export const deleteDriverById = ({id}) =>
  new Promise((resolve, reject) => {
    api
      .delete('motorista/' + id)
      .then((response) => {
        const {data} = response;
        resolve(data);
      })
      .catch(reject);
  });

export const checkIn = (
  motorista_id,
  {chave_cte, cte, cte_id},
  device_id,
  location,
) =>
  new Promise(async (resolve) => {
    const position = {latitude: '', longitude: ''};
    // if (!!position && position.latitude) {
    position.latitude = location.latitude;
    position.longitude = location.longitude;
    // }
    const uri = 'checkin-app-parceiro';
    Logger.log('API post => checkIn');
    const bodyData = {
      motorista_id,
      user_id: 1,
      cte,
      cte_id,
      chave_cte,
      device_id,
      latitude_checkin: location.latitude,
      longitude_checkin: location.longitude,
    };

    api
      .post(uri, bodyData)
      .then((response) => response.data)
      .then(async (data) => {
        let check;
        if (data.success) {
          check = await saveCheckIn(
            motorista_id,
            chave_cte,
            data.data.cte,
            data.data.cte_id,
            device_id,
            location,
            data.data.id,
            1,
          );
        } else {
          check = await saveCheckIn(
            motorista_id,
            chave_cte,
            cte,
            cte_id,
            device_id,
            location,
            0,
            0,
          );
        }
        sendLocationEvent(
          position,
          cte_id,
          `actions.driver.check-in-cte ${chave_cte}(${getDateBD()})`,
        );
        resolve(check);
      })
      .catch(async () => {
        const check = await saveCheckIn(
          motorista_id,
          chave_cte,
          cte,
          cte_id,
          device_id,
          location,
          0,
          0,
        );
        sendLocationEvent(
          position,
          cte_id,
          `actions.driver.check-in-cte ${chave_cte}(${getDateBD()})`,
        );
        Offline.catchEvent(uri, bodyData);
        resolve(check);
      });
  });

export const checkOut = (check, location) =>
  new Promise(async (resolve) => {
    const position = {latitude: '', longitude: ''};
    // if (!!position && position.latitude) {
    position.latitude = location.latitude;
    position.longitude = location.longitude;
    // }
    if (check.sync === 1) {
      api
        .put(`checkin-app-parceiro/${check.id_api}`, {
          latitude_checkout: location.latitude,
          longitude_checkout: location.longitude,
        })
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            saveCheckOut(check, location, 4);
          } else {
            saveCheckOut(check, location, 3);
          }
          sendLocationEvent(
            position,
            check.cte_id,
            `actions.driver.check-out-cte ${check.chave_cte}(${getDateBD()})`,
          );
          resolve();
        })
        .catch(() => {
          saveCheckOut(check, location, 3);
          sendLocationEvent(
            position,
            check.cte_id,
            `actions.driver.check-out-cte ${check.chave_cte}(${getDateBD()})`,
          );
          resolve();
        });
    } else {
      saveCheckOut(check, location, 2);
      sendLocationEvent(
        position,
        check.cte_id,
        `actions.driver.check-out-cte ${check.chave_cte}(${getDateBD()})`,
      );
      resolve();
    }
  });

export const getCheckIn = (motorista_id, {chave_cte, cte, cte_id}) =>
  new Promise(async (resolve) => {
    const checkInBd = await getCheckInBD(motorista_id, chave_cte, cte, cte_id);
    resolve(checkInBd);
  });

export const getCtesSupervisorOffline = () =>
  new Promise((resolve, reject) => {
    getCtesToSupervisorProfile().then(resolve).catch(reject);
  });

export const getNfsSupervisorOffline = (cteId: any) =>
  new Promise((resolve, reject) => {
    getNfsToSupervisorProfile(cteId).then(resolve).catch(reject);
  });

export const sendEmptyRemission = (
  op_id,
  nfs,
  estado = '',
  indiMercancia = '',
  lat = 0,
  lng = 0,
  novedad = '',
  descripcion = '',
  step = '',
  cajas = '',
  temperatura = '',
  operation_type = 'C',
  docPen = '',
  extData = null,
) => {
  return new Promise((resolve, reject) => {
    const dateCurrent = moment(new Date());
    const uri = 'recepcion-estados';
    Logger.log('API post => sendEmptyRemission recepcion-estados');
    nfs.nf_dt_llegada = nfs.nf_dt_llegada ? nfs.nf_dt_llegada : '';
    nfs.llegada_recogida = nfs.llegada_recogida ? nfs.llegada_recogida : '';
    nfs.Cargando = nfs.cargando ? nfs.cargando : '';
    nfs.nf_dt_descargando = nfs.nf_dt_descargando ? nfs.nf_dt_descargando : '';
    nfs.fin_carga = nfs.fin_carga ? nfs.fin_carga : '';
    nfs.inicio_viaje_p = nfs.inicio_viaje_p ? nfs.inicio_viaje_p : '';
    let newPrueba = {
      Llegada_Punto: new Date().toISOString(),
      Descargando: new Date().toISOString(),
      Fin_Carga: new Date().toISOString(),
      Inicio_Viaje: new Date().toISOString(),
      Llegada_Recogida: '',
      Cargando: '',
    };

    if (nfs.tipo_pedido == 'R') {
      let today = new Date();
      let date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
      let time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      let dateTime = date + ' ' + time;

      const cargando = nfs.cargando ? nfs.cargando : '';

      const bodyData = {
        data: [
          {
            Remesa: nfs.nf_id,
            Planilla: nfs.no_planilla,
            Travel_Id: nfs.rom_id,
            Destination_Order: parseInt(nfs.cte_ordem, 10),
            Fecha_Entrega:
              operation_type == 'C' ? dateCurrent.format('DD/MM/YYYY') : '',
            Hora_Entrega:
              operation_type == 'C' ? dateCurrent.format('HH:mm') : '',
            Estado: estado,
            Novedad: novedad,
            Fecha_Estado:
              operation_type == 'C' ? dateCurrent.format('DD/MM/YYYY') : '',
            Hora_Estado:
              operation_type == 'C' ? dateCurrent.format('HH:mm') : '',
            // Fecha_Transmision: operation_type == 'C' ? date.format('DD/MM/YYYY') : '',
            Fecha_Transmision: nfs.fecha_fin
              ? nfs.fecha_fin
              : dateCurrent.format('DD/MM/YY'),
            Hora_Transmision:
              operation_type == 'C' ? dateCurrent.format('HH:mm') : '',
            MoviliadEstadoGeneral: estado,
            MovLong: lng,
            MovLatitud: lat,
            MovilidadCarguePaso: step,
            MovilidadNovSacOtr: descripcion,
            IndiMercanciaInv: indiMercancia,
            MovilidadNroCajas: nfs.cajas,
            MovilidadTemp: temperatura,
            Tipo_Pedido: nfs.tipo_pedido,
            Nombre_Ejec: nfs.ejecutivo,
            Email_Eje: nfs.email_eje ? nfs.email_eje : '',
            Telefono_Eje: nfs.telefono_ejecutivo,
            Operado_Id: op_id,
            Llegada_Recogida:
              operation_type == 'L' ? dateTime : nfs.llegada_recogida,
            Cargando: operation_type == 'D' ? dateTime : cargando,
            Descargando: nfs.nf_dt_descargando,
            Fin_Carga: operation_type == 'E' ? dateTime : nfs.fin_carga,
            Inicio_Viaje: nfs.inicio_viaje_p,
            Documentacion: '',
            Llega_Punto:
              operation_type == 'L'
                ? newPrueba.Llegada_Punto
                : nfs.nf_dt_llegada,
            MoviDtoPend: docPen,
            MovilidadOffLine: '',
            Entregado: '',
          },
        ],
      };

      api
        .post(uri, bodyData)
        .then(() => {
          Logger.log(
            'API post => sendEmptyRemission recepcion-estados successful',
          );
          resolve(true);
        })
        .catch((err) => {
          Logger.log('API post => sendEmptyRemission recepcion-estados failed');
          Offline.catchEvent(uri, bodyData);
          Logger.recordError(err);
          reject(err);
        });
      return;
    }
    // Colectas

    //Remesas
    const bodyData2 = {
      data: [
        {
          Remesa: nfs.nf_id,
          Planilla: nfs.no_planilla,
          Travel_Id: nfs.rom_id,
          Destination_Order: parseInt(nfs.cte_ordem, 10),
          Fecha_Entrega:
            operation_type == 'C' ? dateCurrent.format('DD/MM/YYYY') : '',
          Hora_Entrega:
            operation_type == 'C' ? dateCurrent.format('HH:mm') : '',
          Estado: estado,
          Novedad: novedad,
          Fecha_Estado:
            operation_type == 'C' ? dateCurrent.format('DD/MM/YYYY') : '',
          Hora_Estado: operation_type == 'C' ? dateCurrent.format('HH:mm') : '',
          Fecha_Transmision:
            operation_type == 'C' ? dateCurrent.format('DD/MM/YYYY') : '',
          // Fecha_Transmision: nfs.fecha_fin ? nfs.fecha_fin : '',
          Hora_Transmision:
            operation_type == 'C' ? dateCurrent.format('HH:mm') : '',
          MoviliadEstadoGeneral: estado,
          MovLong: lng,
          MovLatitud: lat,
          MovilidadCarguePaso: step,
          MovilidadNovSacOtr: descripcion,
          IndiMercanciaInv: indiMercancia,
          MovilidadNroCajas: cajas,
          MovilidadTemp: temperatura,
          Tipo_Pedido: nfs.tipo_pedido,
          Nombre_Ejec: nfs.ejecutivo,
          Email_Eje: nfs.email_eje ? nfs.email_eje : '',
          Telefono_Eje: nfs.telefono_ejecutivo,
          Operado_Id: op_id,
          Llegada_Recogida:
            operation_type == 'L'
              ? newPrueba.Llegada_Recogida
              : nfs.llegada_recogida,
          Cargando: nfs.cargando,
          Descargando: nfs.nf_dt_descargando ? nfs.nf_dt_descargando : '',
          Fin_Carga: nfs.fin_carga,
          Inicio_Viaje: operation_type == 'S' ? newPrueba.Inicio_Viaje : '',
          Documentacion: '',
          Llega_Punto: nfs.inicio_viaje_p ? nfs.inicio_viaje_p : '',
          MoviDtoPend: docPen,
          MovilidadOffLine: '',
          Entregado: nfs.entregado ? nfs.entregado : '',
        },
      ],
    };

    api
      .post(uri, bodyData2)
      .then(() => {
        Logger.log(
          'API post => sendEmptyRemission recepcion-estados successful',
        );
        resolve(true);
      })
      .catch((err) => {
        Logger.log('API post => sendEmptyRemission recepcion-estados failed');
        Offline.catchEvent(uri, bodyData2);
        Logger.recordError(err);
        reject();
      });
  });
};

export const sendEvidencias = (nfs: any, pdfDoc: any, clase_evidencia: any) => {
  return new Promise(async (resolve, reject) => {
    Logger.log('API post => sendEvidencias');
    const uri = 'recepcion-evidencias';
    const date = new Date();
    const formSend = new FormData();
    formSend.append('planilla', nfs.no_planilla);
    formSend.append('remesa', nfs.nf_id);
    formSend.append('travel_id', nfs.rom_id);
    formSend.append('destination_order', parseInt(nfs.cte_ordem, 10));
    formSend.append('nombre_archivo', `${nfs.nf_id}.pdf`);
    formSend.append('imagen', pdfDoc, `${nfs.nf_id}.pdf`);
    formSend.append('tipo_archivo', 'PDF');
    formSend.append('fecha_registro', date.toISOString());
    formSend.append('movilidad_tipo_evidencia', clase_evidencia);
    formSend.append('clase_evidencia', 'PDF');
    await api.post(uri, formSend);
    Logger.log('API post => sendEvidencias successful');
    resolve(true);
  }).catch((e) => {
    Logger.log('API post => sendEvidencias failed');
    Logger.recordError(e);
    resolve(true);
  });
};

export const sendSignature = (signature, nfs) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const formSend = new FormData();
    formSend.append('planilla', nfs.no_planilla);
    formSend.append('remesa', nfs.nf_id);
    formSend.append('travel_id', nfs.rom_id);
    formSend.append('destination_order', nfs.cte_ordem);
    formSend.append('nombre_archivo', `firma_electronica`);
    formSend.append('tipo_archivo', 'PNG');
    formSend.append('imagen', signature);
    formSend.append('fecha_registro', date.toISOString());
    formSend.append('movilidad_tipo_evidencia', 'REMESA');
    formSend.append('clase_evidencia', 'firma_electronica');

    api
      .post('recepcion-evidencias', formSend)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

export const sendEvidenceArr = (
  nfs: any,
  evidenceArray: any,
  clase_evidencia?: any,
  evidenceType?: string,
) => {
  return new Promise(async (resolve, reject) => {
    Logger.log('API post => sendEvidenceArr');
    //let tempArr = [];
    const uri = 'recepcion-evidencias';
    const date = new Date();
    let ordenImage = 1;
    // const reference = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLon}&key=${GOOGLE_MAPS_KEY}`);
    for (const image of evidenceArray) {
      let imageType = '';
      if (image.evidence_type === 'firma_electronica') {
        imageType = image.uri.substr(image.uri.length - 3);
      } else {
        imageType = image.uri.substr(image.uri.length - 4);
      }
      //console.log(image?.evidence_type)
      const type_evidence = image?.evidence_type ?? '';
      //console.log(type_evidence)
      delete image.evidence_type;
      const formSend = new FormData();
      formSend.append('planilla', nfs.no_planilla);
      formSend.append('remesa', nfs.nf_id);
      formSend.append('travel_id', nfs.rom_id);
      formSend.append('destination_order', parseInt(nfs.cte_ordem, 10));
      formSend.append('nombre_archivo', image.name);
      formSend.append('imagen', image);
      formSend.append('tipo_archivo', imageType);
      formSend.append('fecha_registro', date.toISOString());
      formSend.append(
        'movilidad_tipo_evidencia',
        evidenceType ? evidenceType : '',
      );
      formSend.append('clase_evidencia', type_evidence.toUpperCase());
      formSend.append('order_imagen', ordenImage);
      formSend.append('referenciaFoto', '');
      try {
        const res = await api.post(uri, formSend);
        Logger.log('API post => sendEvidenceArr successful ✅');
        if (res.status !== 200) {
          throw new Error(res);
        }
      } catch (err) {
        Offline.catchEvent(uri, {
          dataCte: nfs,
          evidenceArr: evidenceArray,
          extra: '',
        });
        reject('sendEvidenceArr');
        Logger.log('API post => sendEvidenceArr successful ❌');
        Logger.recordError(err, TAG);
      }
      ordenImage += 1;
    }

    resolve(true);
  });
};
export const getNovedades = (novedades) => {
  return new Promise((resolve, reject) => {
    globalApi
      .get('api-agv/agv-parceiro/get-cat-novedades/' + novedades)
      .then((response) => {
        resolve(response.data);
      });
  }).catch(() => {
    reject('error');
  });
};

export const getMe = (id) => {
  return new Promise((resolve, reject) => {
    globalApi
      .get('api-agv/services/agv-parceiro/motorista/' + id)
      .then((response) => {
        resolve(response.data.data);
      })
      .catch(() => {
        reject(false);
      });
  });
};

export const getQuestions = (id) => {
  return new Promise((resolve, reject) => {
    globalApi
      .get('/api-agv/audit/get_questions?userId=' + id)
      .then((response) => {
        resolve(response.data.data);
      })
      .catch(() => {
        reject(false);
      });
  });
};

export const sendQuestionArray = (questionArr) => {
  return new Promise(async (resolve, reject) => {
    for (const question of questionArr) {
      const formSend = new FormData();
      formSend.append('idAsignacion', question.question_id);
      formSend.append('pregunta', question.question);
      formSend.append('respuesta', question.value ? 'CUMPLE' : 'NO_CUMPLE');
      formSend.append('comments', question.comments);
      question.photo.map((item, index) => {
        item.name = `${index}_${item.name}`;
        formSend.append('imagenes', item, item.uri);
      });
      await globalApi.post('/api-agv/audit/set_answer_audit', formSend);
    }

    resolve(true);
  });
};

export const getCurrentPosition = (truckId) => {
  return new Promise((resolve, reject) => {
    globalApi
      .get('/api-agv/audit/get_truck_location?truckId=' + truckId)
      .then(({data}) => {
        resolve({
          lat: parseFloat(data.data[0].latitude),
          lng: parseFloat(data.data[0].longitude),
        });
      })
      .catch(() => {
        reject({
          lat: 0,
          lng: 0,
        });
      });
  });
};

export const getRemission = () => {
  return new Promise((resolve, reject) => {
    globalApi
      .get('/api-agv/services/agv-parceiro/obtener-remesa')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

/**
 * Get smth from API
 * @param lowId
 * @param type
 * @param order
 * @returns
 */
export const getLowOnline = (lowId: any, type: any, order: any) => {
  return new Promise((resolve, reject) => {
    const uri = `api-agv/services/agv-parceiro/motorista/an-order/${lowId}/${type}/${order}`;
    Logger.log(`API get => getLowOnline`);
    let newObj = {
      evidence: [],
      dt_llegada: '',
      dt_descargando: '',
      endDate: '',
      nf_dt_inicio_viaje_p: '', 
      id: '',
      name: '',
      nf_resp_receber: '',
      cte_type_delivery: '',
      nf_id: '',
      dt_entrega: '',
    };
    setTimeout(() => {
      Logger.log(`API get => getLowOnline timeout`);
      reject(newObj);
    }, 60000);
    globalApi
      .get(uri)
      .then((response) => {
        Logger.log(`API get => getLowOnline successful`);
        let endCte = response.data.data[0];
        endCte.evidence = endCte.evidence ? JSON.parse(endCte.evidence) : [];
        resolve(endCte);
      })
      .catch((e) => {
        Logger.log(`API get => getLowOnline error`);
        Logger.recordError(e);
        reject(newObj);
      });
  });
};
