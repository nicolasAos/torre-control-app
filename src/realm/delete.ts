// //@ts-nocheck
import Realm from 'realm';
// config
import {SCHEMA_VERSION, REMESAS_PATH} from './config';
// types
import type {RemesaBox} from '../components/RemesaBox';
// schemas
import {RemesaBoxSchema, RemesaBoxesSchema} from './shemas';
// utils
import {Logger} from '../utils';

const TAG = 'src/realm/delete';
const schemaVersion = SCHEMA_VERSION;

/**
 * Delete remesa boxes [just for testing]
 * @param remesaID
 * @param boxes
 */
async function deleteRemesaBoxes() {
  Logger.log('Realm delete => deleteRemesaBoxes');
  try {
    const realm = await Realm.open({
      schemaVersion,
      path: REMESAS_PATH,
      schema: [ RemesaBoxesSchema],
    });

    realm.write(() => {
      // Delete all RemesaBoxes
      const remesas = realm.objects('RemesaBoxes');
      // Delete the collection from the realm.
      realm.delete(remesas);
    });

    //realm.close();
  } catch (err) {
    Logger.recordError(err, TAG);
  }
}

export {deleteRemesaBoxes};
