import api from '../services/apiTorreControl';

export const getRoute = (travel) =>
  new Promise(async (resolve, reject) => {
    api
      .post('route', {
        origen_id: '',
        destino_id: '',
        costumer_id: '',
        travel_id: travel,
      })
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
