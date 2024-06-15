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
const TAG = 'src/realm/update';

async function updateRemesaBoxes(remesaID: string, boxes: RemesaBox[]) {
  Logger.log('Realm update => updateRemesaBoxes');
  try {
    const realm = await Realm.open({
      schemaVersion,
      path: REMESAS_PATH,
      schema: [RemesaBoxesSchema, RemesaBoxSchema],
    });
    realm.write(() => {
      const remesaBoxes: any = realm.objectForPrimaryKey(
        'RemesaBoxes',
        remesaID,
      );
      remesaBoxes.boxes = [...boxes];
    });

    //realm.close();
  } catch (err) {
    Logger.recordError(err, TAG);
  }
}

export {updateRemesaBoxes};
