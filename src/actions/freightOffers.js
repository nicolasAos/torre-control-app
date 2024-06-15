import api from '../services/apiGo';
import NetInfo from '@react-native-community/netinfo';

export const getOffersMyVehicle = (cnh_id, pref_moto_ativo, veic_id) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.freigth-offers.check-connection'));
      return;
    }

    api
      .post('/demanda-frete/motor/meu-veiculo', {
        cnh_id,
        pref_moto_ativo,
        veic_id,
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

export const getOffersOthersVehicles = (cnh_id, pref_moto_ativo, veic_id) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.freigth-offers.check-connection'));
      return;
    }

    api
      .post('/demanda-frete/motor/outras-ofertas', {
        cnh_id,
        pref_moto_ativo,
        veic_id,
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

export const getOffersFavorite = (cnh_id) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.freigth-offers.check-connection'));
      return;
    }

    api
      .get(`/demanda-frete/user/${cnh_id}`)
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

export const setOfferFavorite = (cnh_id, id_demanda, veiculo_id, liked) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.freigth-offers.check-connection'));
      return;
    }

    api
      .post('/demanda-frete/user', {
        cnh_id,
        id_demanda,
        veiculo_id,
        liked,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve();
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });

export const alterOfferFavorite = (cnh_id, id_demanda, liked) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.freigth-offers.check-connection'));
      return;
    }

    api
      .put('/demanda-frete/user', {
        cnh_id,
        id_demanda,
        liked,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve();
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });
