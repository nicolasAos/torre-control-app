import api from '../services/api';
import globalApi from '../services/globalApi'
import apiAudit from '../services/apiAudit';
import {DEVICE_ID_SUCCESS} from './types';

export const deviceId = (deviceId) => (dispatch) =>
  new Promise((resolve) => {
    dispatch({type: DEVICE_ID_SUCCESS, payload: deviceId});
    resolve();
  });

export const setDevices = (moto_id, device_id) => {
  api.post('devices/store', {
    moto_id,
    device_id,
  });
};



export const getRandomTruck = (latitude, longitude, user_id) =>
  new Promise(async (resolve, reject) => {
     apiAudit.get(`get-random-truck-in-radius`, {
        params : {
          latitude:latitude,
          longitude:longitude,
          user_id: user_id
        }})
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve(data.data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });


// export const getRandomTruck = (latitude, longitude, radius) => {

//   try {
//     console.log('get-random-truck-in-radius');
//    return apiAudit.get('get-random-truck-in-radius', {
//       params : {
//         latitude:latitude,
//         longitude:longitude,
//         radius:radius
//       }});
//   } catch (error) {
//     console.error(error);
//     // expected output: ReferenceError: nonExistentFunction is not defined
//     // Note - error messages will vary depending on browser
//   }
// //   let jsonT = '{"data": [{  "travelId": 210014822, "operatorId": 1811016, "clientId": 648, "latitude": 3.320612, "longitude": -76.524536,"operatorName": "N/A", "clientName": "Coca-Cola FEMSA Colombia", "truckId": "T20337" }  ],"success": true, "message": "Registro(s) recuperado(s) con exito" }';
// // return JSON.parse(jsonT);
// };
