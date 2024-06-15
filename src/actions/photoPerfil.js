import {getPhotoPerfil} from '../database/models/photoPerfil';

export const getPhoto = (motorista_id) =>
  new Promise((resolve) => {
    getPhotoPerfil(motorista_id).then(resolve);
  });
