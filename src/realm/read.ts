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

const TAG = 'src/realm/read';
const schemaVersion = SCHEMA_VERSION;

async function getRemesaBoxes(
  id: string,
): Promise<undefined | {boxes: RemesaBox[]; remesaID: string}> {
  Logger.log('Realm read => getRemesaBoxes');
  try {
    const realm = await Realm.open({
      schemaVersion,
      path: REMESAS_PATH,
      schema: [RemesaBoxesSchema, RemesaBoxSchema],
    });

    const remesaBoxes = realm.objectForPrimaryKey('RemesaBoxes', id);
    //realm.close();
    return remesaBoxes;
  } catch (err) {
    Logger.recordError(err, TAG);
    return undefined;
  }
}

export {getRemesaBoxes};
