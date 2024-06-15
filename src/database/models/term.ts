import Realm from 'realm';
import {TermSchema, TermHistorySchema} from '../schemas';
// utils
import {Logger} from '../../utils';

export const createOrUpdateTerm = (moto_id: any, params: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm create => createOrUpdateTerm`);
    Realm.open({
      schema: [TermSchema],
    })
      .then((realm) => {
        params.map((param) => {
          console.log('IF', param);
          if (param.status == '0' || param.empresa == '0') {
            return;
          }

          const term = realm
            .objects('termo')
            .filtered('moto_id = $0', moto_id)
            .sorted('versao', true);
          if (term.length > 0) {
            console.log('2IF', term);
            if (param.versao > term[0].versao) {
              realm.write(() => {
                realm.create(
                  'termo',
                  {
                    id: term[0].id,
                    moto_id: moto_id,
                    termo: param.termo,
                    empresa: param.empresa,
                    status: param.status,
                    versao: param.versao,
                    termo_aceite: 0,
                  },
                  true,
                );
              });
            }
          } else {
            console.log('else');
            realm.write(() => {
              const lastTerm = realm.objects('termo').sorted('id', true)[0];
              const highestId = lastTerm == null ? 0 : lastTerm.id;
              realm.create('termo', {
                id: highestId + 1,
                moto_id: moto_id,
                termo: param.termo,
                empresa: param.empresa,
                status: param.status,
                versao: param.versao,
                termo_aceite: 0,
              });
            });
          }
        });
        realm.close();
        console.log('realme close');
        resolve();
      })
      .catch((error) => console.log('error', error));
  });

export const getTermOffline = (moto_id: any, empresa: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm get => getTermOffline`);
    Realm.open({
      schema: [TermSchema],
    })
      .then((realm) => {
        const term = realm.objects('termo');
        console.log('verifica term off', term);
        const data = {};
        if (term.length > 0) {
          data.term = JSON.parse(JSON.stringify(term[0]));
          if (term[0].termo_aceite === 1) {
            data.accept = 1;
          } else {
            data.accept = 0;
          }
        } else {
          data.accept = 2;
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => console.log('error', error));
  });

export const setTermOffline = (moto_id, empresa, termo_id) =>
  new Promise((resolve) => {
    Realm.open({
      schema: [TermSchema],
    })
      .then((realm) => {
        const term = realm
          .objects('termo')
          .filtered(
            'moto_id = $0 && empresa = $1 && id = $2',
            moto_id,
            empresa,
            termo_id,
          );
        if (term.length > 0) {
          realm.write(() => {
            realm.create(
              'termo',
              {
                id: term[0].id,
                moto_id: moto_id,
                termo: term[0].termo,
                empresa: empresa,
                status: term[0].status,
                versao: term[0].versao,
                termo_aceite: 1,
              },
              true,
            );
          });
        }
        const term2 = realm
          .objects('termo')
          .filtered(
            'moto_id = $0 && empresa = $1 && id = $2',
            moto_id,
            empresa,
            termo_id,
          );
        realm.close();
        resolve();
      })
      .catch((error) => console.log('error', error));
  });

export const setTermHistoryOffline = (params) => {
  Realm.open({
    schema: [TermHistorySchema],
  })
    .then((realm) => {
      realm.write(() => {
        var lastTermhistory = realm
          .objects('termo_historico')
          .sorted('id', true)[0];
        var highestId = lastTermhistory == null ? 0 : lastTermhistory.id;
        realm.create(
          'termo_historico',
          {
            id: highestId + 1,
            motorista_id: params.moto_id,
            termo_id: params.termo_id,
            latitude: params.latitude.toString(),
            longitude: params.longitude.toString(),
            empresa: params.empresa,
            sync: params.sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};
