import Realm from 'realm';
import {UserSchema, MotoLoginSchema} from '../schemas';

export const getUserByCPF = (cpf) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [UserSchema],
    })
      .then((realm) => {
        var userReturn = {};
        userReturn.userExists = false;
        const user = realm.objects('usuario').filtered('moto_cpf = $0', cpf);
        if (user.length > 0) {
          userReturn = JSON.parse(JSON.stringify(user[0]));
          userReturn.userExists = true;
        }
        realm.close();
        resolve(userReturn);
      })
      .catch((error) => console.log('error', error));
  });

export const createOrUpdateUser = (userParams) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [UserSchema],
    })
      .then((realm) => {
        const user = realm
          .objects('usuario')
          .filtered('moto_id = ' + userParams.moto_id);
        if (user.length > 0) {
          realm.write(() => {
            realm.create(
              'usuario',
              {
                id: user[0].id,
                moto_id: userParams.moto_id,
                moto_nome: userParams.moto_nome,
                moto_cpf: userParams.moto_cpf,
                moto_tel: userParams.moto_tel,
                moto_email: userParams.moto_email,
                foto: userParams.foto,
                moto_senha: userParams.moto_senha,
              },
              true,
            );
          });
        } else {
          realm.write(() => {
            const lastUser = realm.objects('usuario').sorted('id', true)[0];
            const highestId = lastUser == null ? 0 : lastUser.id;
            realm.create('usuario', {
              id: highestId + 1,
              moto_id: userParams.moto_id,
              moto_nome: userParams.moto_nome,
              moto_cpf: userParams.moto_cpf,
              moto_tel: userParams.moto_tel,
              moto_email: userParams.moto_email,
              foto: userParams.foto,
              moto_senha: userParams.moto_senha,
            });
          });
        }
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });

export const setMotoLogin = (params) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [MotoLoginSchema],
      deleteRealmIfMigrationNeeded: true,
    })
      .then((realm) => {
        realm.write(() => {
          var last = realm.objects('moto_login').sorted('id', true)[0];
          var highestId = last == null ? 0 : last.id;
          realm.create(
            'moto_login',
            {
              id: highestId + 1,
              moto_id: params.moto_id,
              moto_login: params.moto_login,
              moto_versao_app: params.moto_versao_app,
              sync: params.sync,
            },
            'modified',
          );
        });
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });
