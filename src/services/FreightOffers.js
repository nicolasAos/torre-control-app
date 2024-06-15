import api from './apiGo';

/* Utils */
import SnackBarHandler from '../utils/SnackBarHandler';

export const acceptOffer = async (data) => {
  try {
    const response = await api.post('demanda-frete/service-go-tms', data);

    return response.data;
  } catch (err) {
    SnackBarHandler.error(err);
  }
};
