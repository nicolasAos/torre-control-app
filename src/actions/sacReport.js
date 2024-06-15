import {setSendSACReport} from '../database/models/sacReport';
import {SACReportService} from '../services/SACReportServices';
import apiNovedadesSacReport from '../services/apiNovedadesSacReport';

export const getSACReportType = (dispatch, type) =>
  new Promise((resolve, reject) => {
    apiNovedadesSacReport
      // .get('ocorrencia')
      .get('get-cat-novedades/4')
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve(data.data);
          dispatch({type, payload: data.data});
        } else {
          reject(new Error(data.error));
        }
      })
      .catch(reject);
  });

export const sendSACReport = (sacReports, description, photos) =>
  new Promise((resolve, reject) => {
  
 
    /*if (sacReports[0].nf_obs === '') {
        reject(new Error('actions.ocurrence.descripition'));
      }*/

    const sacReportService = new SACReportService();
    sacReportService
      .sendSACReport(sacReports, description)
      .then((data) => {
        const success = data.data.success ? 1 : 0;
       
        //setSendSACReport(moto_id, sacReports[0], success);
        resolve();
      })
      .catch((error) => {
        setSendSACReport(moto_id, sacReports[0], 0);
        resolve();
      });

     
    
  });
