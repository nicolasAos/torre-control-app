import api from './apiGo';
import moment from 'moment';

/* Utils */
import SnackBarHandler from '../utils/SnackBarHandler';

export const getShippingCompanies = async (driverCnhId) => {
  try {
    const response = await api.get(`/carrier/driver/${driverCnhId}`);

    return response.data.data;
  } catch (err) {
    SnackBarHandler.error(err);
  }
};
