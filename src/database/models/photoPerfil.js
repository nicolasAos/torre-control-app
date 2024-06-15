import Realm from 'realm';
import {PhotoPerfilSchema} from '../schemas';

export const savePhotoPerfil = (motorista_id, photo) => {
  Realm.open({
    schema: [PhotoPerfilSchema],
  })
    .then(async (realm) => {
      realm.write(() => {
        const lastPhotoPerfil = realm
          .objects('photo_perfil')
          .sorted('id', true)[0];
        const highestId = lastPhotoPerfil == null ? 0 : lastPhotoPerfil.id;
        realm.create(
          'photo_perfil',
          {
            id: highestId == null ? 1 : highestId + 1,
            motorista_id,
            photo,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const getPhotoPerfil = (motorista_id) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [PhotoPerfilSchema],
    })
      .then((realm) => {
        var photoReturn = {};
        photoReturn.photoExists = false;
        const photo = realm
          .objects('photo_perfil')
          .filtered('motorista_id = $0', motorista_id);
        if (photo.length > 0) {
          photoReturn = JSON.parse(JSON.stringify(photo[0]));
          photoReturn.photoExists = true;
        }
        realm.close();
        resolve(photoReturn);
      })
      .catch((error) => console.log('error', error));
  });

export const deletePhotoPerfil = (motorista_id) => {
  Realm.open({
    schema: [PhotoPerfilSchema],
  })
    .then((realm) => {
      realm.write(() => {
        const photo = realm
          .objects('photo_perfil')
          .filtered('motorista_id = $0', motorista_id);
        if (photo.length > 0) {
          realm.delete(photo);
        }
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};
