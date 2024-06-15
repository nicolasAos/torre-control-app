import Realm from 'realm';
// config
import {SCHEMA_VERSION, REMESAS_PATH} from './config';
// schemas
import {RemesaBoxSchema, RemesaBoxesSchema} from './shemas';
// types
import type {RemesaBox} from '../components/RemesaBox';
// utils
import {Logger} from '../utils';

const schemaVersion = SCHEMA_VERSION;
const TAG = 'src/realm/write';

async function setRemesaBoxes(remesaID: string, boxes: RemesaBox[]) {
  Logger.log('Realm write => setRemesaBoxes');
  try {
    const realm = await Realm.open({
      schemaVersion,
      path: REMESAS_PATH,
      schema: [RemesaBoxesSchema, RemesaBoxSchema],
    });
    realm.write(() => {
      realm.create('RemesaBoxes', {remesaID, boxes});
    });

    realm.close();
  } catch (err) {
    Logger.recordError(err, TAG);
  }
}

export {setRemesaBoxes};
