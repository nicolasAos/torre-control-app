import Realm from 'realm';
import {
  CTEsSchema,
  TransportSchema,
  LowSchema,
  SendOccurrenceSchema,
  Photos,
  CTEsSchemaSupervisor,
} from '../schemas';
//import moment from 'moment';
// utils
import {Logger} from '../../utils';

/**
 * Delete invoices from local DB
 * @param moto_id
 */
export const deleteInvoices = (moto_id: any) => {
  Logger.log(`Realm delete => deleteInvoices`);
  Realm.open({
    schema: [CTEsSchema, TransportSchema],
  })
    .then((realm) => {
      realm.write(() => {
        const ctes = realm
          .objects('notas_fiscais')
          .filtered('moto_id = $0', moto_id);
        if (ctes.length > 0) {
          realm.delete(ctes);
        }
        const travels = realm
          .objects('transporte')
          .filtered(
            'moto_id = $0 && sync = $1 && sync_fim = $2',
            moto_id,
            1,
            0,
          );
        if (travels.length > 0) {
          realm.delete(travels);
        }
      });
      realm.close();
    })
    .catch((error) => Logger.recordError(error));
};

/**
 * Create invoice in local DB
 * @param ctes
 * @param moto_id
 * @returns
 */
export const createInvoice = (ctes: any, moto_id: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm create => createInvoice`);
    Realm.open({
      schema: [CTEsSchema],
    })
      .then((realm) => {
        realm.write(() => {
          for (const cte of ctes) {
            const invoice = realm
              .objects('notas_fiscais')
              .filtered(
                'nf_type_number = $0 AND moto_id = $1',
                cte.nf_type_number,
                moto_id,
              );
            if (invoice.length < 1) {
              const lastInvoice = realm
                .objects('notas_fiscais')
                .sorted('id', true)[0];
              const highestId = lastInvoice == null ? 0 : lastInvoice.id;
              realm.create('notas_fiscais', {
                id: highestId == null ? 1 : highestId + 1,
                moto_id,
                rom_id_controle: cte.rom_id_controle,
                rom_id: cte.rom_id.toString(),
                rom_km_total: cte.rom_km_total,
                rom_origem: cte.rom_origem,
                rom_destino: cte.rom_destino,
                rom_manifesto: cte.rom_manifesto,
                rom_dt_manifesto: cte.rom_dt_manifesto,
                cte_id: cte.cte_id,
                cte_data: cte.cte_data,
                cte_chave: cte.cte_type_delivery + cte.cte_ordem.toString(),
                cte_numero: cte.rom_id + cte.cte_ordem.toString(),
                cte_tipo_produto: cte.cte_tipo_produto,
                cte_previsao: cte.cte_previsao,
                cte_status: cte.cte_status.toString(),
                cte_ordem: cte.cte_ordem.toString(),
                cte_data_agenda: cte.cte_data_agenda,
                cte_local_entrega: cte.cte_local_entrega,
                cte_tel_destinatario: cte.cte_tel_destinatario,
                nf_id: cte.nf_id,
                nf_data: cte.nf_data,
                nf_chave: cte.nf_chave,
                nf_valor: cte.nf_valor,
                nf_volume: cte.nf_volume,
                nf_peso: cte.nf_peso,
                nf_cli_vip: cte.nf_cli_vip,
                nf_dt_entrega: cte.nf_dt_entrega,
                nf_dt_llegada: cte.dt_llegada,
                nf_dt_descargando: cte.dt_descargando_carg,
                inicio_viaje_p: cte.inicio_viaje_p,
                nf_empresa: cte.nf_empresa,
                codigo: cte.codigo,
                origem: cte.origem,
                remetente: cte.remetente ? cte.remetente.toString() : null,
                destinatario: cte.destinatario,
                destino_cidade: cte.destino_cidade,
                destino_uf: cte.destino_uf,
                transp_codigo: cte.transp_codigo,
                nf_resp_receber: cte.nf_resp_receber,
                nf_ocorrencia: cte.nf_ocorrencia,
                nf_type_number:
                  cte.cte_type_delivery + cte.rom_id_controle + cte.cte_ordem,
                parametro_checkin:
                  cte.parametro_checkin !== null ? true : false,
                nf_obs: cte.nf_obs,
                cte_type_delivery: cte.cte_type_delivery,
                update_or_end: cte.update_or_end,
                no_planilla: cte.no_planilla,
                placa: cte.placa,
                date_eta: cte.date_eta,
                estado_pedido: cte.estado_pedido,
                movilidad_kilos: cte.movilidad_kilos,
                movilidad_ciudad: cte.movilidad_ciudad,
                desc_nit: cte.desc_nit,
                colaborador: cte.colaborador,
                zona_distribucion: cte.zona_distribucion,
                nit: cte.nit,
                fecha_actual: cte.fecha_actual,
                neveras_recogidas: cte.neveras_recogidas,
                cadena_frio: cte.cadena_frio,
                movilidad_cargue_paso: cte.movilidad_cargue_paso,
                sucursal_origen: cte.origen,
                movilidad_cita: cte.movilidad_cita,
                destino: cte.destino,
                entrega: cte.entrega,
                factura: cte.factura,
                recibo: cte.recibo,
                fin_carga: cte.fin_carga,
                photos: !cte.evidence
                  ? '[]'
                  : JSON.stringify(
                      JSON.parse(cte.evidence).map((photo, index) => {
                        return {
                          fileName: `${
                            cte.cte_type_delivery == 'P' ? 'pickup' : 'delivery'
                          }_${cte.nf_id ? cte.nf_id : 0}_${index}.JPEG`,
                          uri: photo,
                          id: `${
                            cte.cte_type_delivery == 'P' ? 'pickup' : 'delivery'
                          }_${cte.nf_id ? cte.nf_id : 0}_${index}`,
                          path: '',
                          type: 'online',
                        };
                      }),
                    ),
                url_stardeliveries: cte.url_stardeliveries,
                codigo_zip: cte.codigo_zip,
                barrio: cte.barrio,
                zona: cte.zona,
                ruta: cte.ruta,
                documento: cte.documento,
                observaciones: cte.observaciones,
                fecha_creacion_remesa: cte.fecha_creacion_remesa,
                llegada_recogida: cte.llegada_recogida,
                cargando: cte.cargando,
                direccion: cte.direccion,
              });
            }
          }
        });
        realm.close();
        resolve();
      })
      .catch((error) => Logger.recordError(error));
  });

export const getInvoices = (moto_id) =>
  new Promise(async (resolve) => {
    Logger.log(`Realm get => getInvoices`);
    await Realm.open({
      schema: [CTEsSchema, TransportSchema],
      deleteRealmIfMigrationNeeded: true,
    })
      .then((realm) => {
        const dataAgv = {};
        const dataAgv2 = {};

        dataAgv.invoices = realm
          .objects('notas_fiscais')
          .filtered('moto_id = $0', moto_id);
        if (dataAgv.invoices.length > 0) {
          const rom = dataAgv.invoices.filtered(
            'TRUEPREDICATE SORT(rom_id ASC) DISTINCT(rom_id)',
          );
          dataAgv.romaneio = rom
            .map((rom) => {
              const travelFinished =
                realm
                  .objects('transporte')
                  .filtered(
                    'moto_id = $0 AND rom_id = $1 AND (sync_fim = $2 OR sync_fim = $3)',
                    moto_id,
                    rom.rom_id,
                    1,
                    2,
                  ).length > 0;
              if (!travelFinished) {
                return rom;
              }
            })
            .filter((notUndefined) => notUndefined);
        }
        dataAgv.qtdTravels =
          dataAgv.invoices.length > 0 ? dataAgv.romaneio.length : 0;

        dataAgv2.invoices = realm
          .objects('notas_fiscais')
          .filtered('moto_id = $0', moto_id);
        if (dataAgv2.invoices.length > 0) {
          const rom = dataAgv2.invoices.filtered(
            'TRUEPREDICATE SORT(rom_id ASC) DISTINCT(rom_id)',
          );

          dataAgv2.romaneio = rom
            .map((rom) => {
              const travelFinished =
                realm
                  .objects('transporte')
                  .filtered(
                    'moto_id = $0 AND rom_id = $1 AND (sync_fim = $2 OR sync_fim = $3)',
                    moto_id,
                    rom.rom_id,
                    1,
                    2,
                  ).length > 0;
              if (!travelFinished) {
                return rom;
              }
            })
            .filter((notUndefined) => notUndefined);
        }
        dataAgv2.qtdTravels =
          dataAgv2.invoices.length > 0 ? dataAgv2.romaneio.length : 0;
        const data = JSON.parse(JSON.stringify(dataAgv));
        const data2 = JSON.parse(JSON.stringify(dataAgv2));
        realm.close();
        resolve({data, data2});
      })
      .catch((error) => console.log('error', error));
  });

export const getSpreadSheets = (moto_id: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm get => getSpreadSheets`);
    Realm.open({
      schema: [
        CTEsSchema,
        TransportSchema,
        LowSchema,
        Photos,
        SendOccurrenceSchema,
      ],
    })
      .then((realm) => {
        const dataAgv = {};
        const invoices = realm
          .objects('notas_fiscais')
          .filtered('moto_id = $0', moto_id);

        if (invoices.length > 0) {
          const rom = invoices.filtered(
            'TRUEPREDICATE SORT(rom_id ASC) DISTINCT(rom_id)',
          );

          dataAgv.romaneio = rom
            .map((rom) => {
              const travelFinished =
                realm
                  .objects('transporte')
                  .filtered(
                    'moto_id = $0 AND rom_id = $1 AND (sync_fim = $2 OR sync_fim = $3)',
                    moto_id,
                    rom.rom_id,
                    1,
                    2,
                  ).length > 0;
              if (!travelFinished) {
                const ctes = realm
                  .objects('notas_fiscais')
                  .filtered(
                    'moto_id = $0 AND rom_id = $1',
                    moto_id,
                    rom.rom_id,
                  );
                const cteKeys = ctes.filtered(
                  'TRUEPREDICATE SORT(cte_numero ASC) DISTINCT(cte_numero)',
                );
                const nfsKeys = ctes.filtered(
                  'TRUEPREDICATE SORT(nf_type_number ASC) DISTINCT(nf_type_number)',
                );
                const nfsQtdRom = nfsKeys.length;
                var cteVolTotal = 0;
                const travel = realm
                  .objects('transporte')
                  .filtered(
                    'moto_id = $0 AND rom_id = $1 AND (sync = $2 OR sync = $3) AND sync_fim = $4',
                    moto_id,
                    rom.rom_id,
                    0,
                    1,
                    0,
                  );
                const startedTravel = travel.length > 0;
                const travels =
                  travel.length > 0 ||
                  realm
                    .objects('transporte')
                    .filtered(
                      'moto_id = $0 AND (sync = $1 OR sync = $2) AND sync_fim = $3',
                      moto_id,
                      0,
                      1,
                      0,
                    ).length > 0;
                var qtdTotalClosed = 0;

                const ctesKeys = cteKeys.map((ctes) => {
                  const nfs = realm
                    .objects('notas_fiscais')
                    .filtered(
                      'moto_id = $0 AND cte_numero = $1',
                      moto_id,
                      ctes.cte_numero,
                    );
                  const nfsKey = nfs.filtered(
                    'TRUEPREDICATE SORT(nf_type_number ASC) DISTINCT(nf_type_number)',
                  );
                  const volTotal = nfsKey.reduce((sum, nf) => {
                    return sum + parseFloat(nf.nf_volume);
                  }, 0);

                  nfsKey.map((nf) => {
                    const low = realm
                      .objects('baixas')
                      .filtered(
                        'moto_id = $0 AND nf_type_number = $1',
                        moto_id,
                        nf.nf_type_number,
                      );
                    const occurrence = realm
                      .objects('envio_ocorrencias')
                      .filtered(
                        'moto_id = $0 AND nf_type_number = $1',
                        moto_id,
                        nf.nf_type_number,
                      );
                    qtdTotalClosed += lowClosed || occurrenceClosed ? 1 : 0;
                    let lowClosed = false;
                    let occurrenceClosed = false;

                    if (low.length > 0) {
                      lowClosed = low[0].update_or_end;
                    }

                    if (occurrence.length > 0) {
                      occurrenceClosed = occurrence[0].update_or_end;
                    }
                  });
                  cteVolTotal += volTotal;
                });
                const cteQtd = ctesKeys.length;
                const close = qtdTotalClosed >= nfsQtdRom;
                return {
                  rom,
                  cteQtd,
                  nfsQtdRom,
                  cteVolTotal,
                  travel,
                  travels,
                  startedTravel,
                  close,
                };
              }
            })
            .filter((notUndefined) => notUndefined)
            .sort(
              (a, b) =>
                new Date(
                  a.rom.rom_dt_manifesto.substring(0, 10) +
                    `T${a.rom.rom_dt_manifesto.substring(11)}.000Z`,
                ) -
                new Date(
                  b.rom.rom_dt_manifesto.substring(0, 10) +
                    `T${a.rom.rom_dt_manifesto.substring(11)}.000Z`,
                ),
            )
            .reverse();
        }
        const data = JSON.parse(JSON.stringify(dataAgv));
        realm.close();
        resolve(data);
      })
      .catch((error) => console.log('error', error));
  });

/**
 * get Ctes
 * @param moto_id
 * @param romId
 * @returns
 */
export const getCtes = (moto_id: any, romId: any) =>
  new Promise((resolve) => {
    Logger.log('Realm get => getCtes');
    Realm.open({
      schema: [CTEsSchema, LowSchema, Photos, SendOccurrenceSchema],
    })
      .then((realm) => {
        const dataAgv = {};
        const ctes = realm
          .objects('notas_fiscais')
          .filtered('moto_id = $0 AND rom_id = $1', moto_id, romId);
        const cteKeys = ctes.filtered(
          'TRUEPREDICATE SORT(cte_numero ASC) DISTINCT(cte_numero)',
        );
        dataAgv.rom = cteKeys[0];
        var closedCtes = 0;

        dataAgv.ctesKeys = cteKeys
          .map((ctes) => {
            const nfs = realm
              .objects('notas_fiscais')
              .filtered(
                'moto_id = $0 AND cte_numero = $1',
                moto_id,
                ctes.cte_numero,
              );
            const nfsKey = nfs.filtered(
              'TRUEPREDICATE SORT(nf_type_number ASC) DISTINCT(nf_type_number)',
            );
            const volTotal = nfsKey.reduce((sum, nf) => {
              return sum + parseFloat(nf.nf_volume);
            }, 0);
            var isOccurrence = false;
            var isStart = false;
            var totalClosedNfs = 0;

            nfsKey.map((nf) => {
              const low = realm
                .objects('baixas')
                .filtered(
                  'moto_id = $0 AND nf_type_number = $1',
                  moto_id,
                  nf.nf_type_number,
                );
              const occurrence = realm
                .objects('envio_ocorrencias')
                .filtered(
                  'moto_id = $0 AND nf_type_number = $1',
                  moto_id,
                  nf.nf_type_number,
                );
              let lowClosed = false;
              let occurrenceClosed = false;

              if (low.length > 0) {
                lowClosed = low[0].update_or_end;
              }

              if (occurrence.length > 0) {
                occurrenceClosed = occurrence[0].update_or_end;
              }
              totalClosedNfs += lowClosed || occurrenceClosed ? 1 : 0;
              isOccurrence = isOccurrence
                ? isOccurrence
                : occurrence.length > 0;
              isStart = totalClosedNfs > 0;
            });
            const isClosedCte = totalClosedNfs >= nfsKey.length;
            closedCtes += isClosedCte ? 1 : 0;

            return {
              ctes,
              volTotal,
              isOccurrence,
              isStart,
              isClosedCte,
            };
          })
          .sort((a, b) => a.ctes.cte_ordem - b.ctes.cte_ordem)
          .sort((a, b) => a.isClosedCte - b.isClosedCte);
        dataAgv.travelFinished = closedCtes >= dataAgv.ctesKeys.length;
        const data = JSON.parse(JSON.stringify(dataAgv));
        realm.close();
        resolve(data);
      })
      .catch((error) => console.log('error', error));
  });

export const getNfs = (moto_id: any, cteId: any) =>
  new Promise((resolve) => {
    Logger.log(`Realm get => getNfs`);
    Realm.open({
      schema: [CTEsSchema, LowSchema, Photos, SendOccurrenceSchema],
    })
      .then((realm) => {
        const dataAgv = {};
        const nfs = realm
          .objects('notas_fiscais')
          .filtered('moto_id = $0 AND cte_numero = $1', moto_id, cteId);
        const nfsKey = nfs.filtered(
          'TRUEPREDICATE SORT(nf_type_number ASC) DISTINCT(nf_type_number)',
        );
        var isClosedCte = 0;
        dataAgv.ctes = nfsKey[0];

        dataAgv.nfsKeys = nfsKey
          .map((nf) => {
            const low = realm
              .objects('baixas')
              .filtered(
                'moto_id = $0 AND nf_type_number = $1',
                moto_id,
                nf.nf_type_number,
              );
            const occurrence = realm
              .objects('envio_ocorrencias')
              .filtered(
                'moto_id = $0 AND nf_type_number = $1',
                moto_id,
                nf.nf_type_number,
              );
            let lowClosed = false;
            let occurrenceClosed = false;

            if (low.length > 0) {
              lowClosed = low[0].update_or_end;
            }

            if (occurrence.length > 0) {
              occurrenceClosed = occurrence[0].update_or_end;
            }

            const closed = lowClosed || occurrenceClosed;
            isClosedCte += lowClosed || occurrenceClosed ? 1 : 0;

            return {nf, closed};
          })
          .sort((a, b) => a.closed - b.closed);
        dataAgv.isClosedCte = isClosedCte >= dataAgv.nfsKeys.length;
        const data = JSON.parse(JSON.stringify(dataAgv));
        realm.close();
        resolve(data);
      })
      .catch((error) => console.log('error', error));
  });

export const deleteCtes = () => {
  Realm.open({
    schema: [CTEsSchema],
  })
    .then((realm) => {
      realm.write(() => {
        const ctesDelete = realm.objects('notas_fiscais');
        if (ctesDelete.length > 0) {
          realm.delete(ctesDelete);
        }
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const getLow = (nf_type_number: any) =>
  new Promise((resolve) => {
    Logger.log('Realm get => getLow');
    Realm.open({
      schema: [LowSchema, Photos],
    })
      .then((realm) => {
        const invoices = realm
          .objects('baixas')
          .filtered('nf_type_number = $0', nf_type_number);

        if (invoices.length > 0) {
          const data = JSON.parse(JSON.stringify(invoices[0]));
          realm.close();
          resolve(data);
          return;
        }
        realm.close();
        resolve(null);
      })
      .catch((error) => console.log('error', error));
  });

// Function for delete data of api ctes.
export const deleteCtesSupervisorProfile = () => {
  return new Promise((resolve) => {
    Realm.open({
      schema: [CTEsSchemaSupervisor],
    })
      .then((realm) => {
        realm.write(async () => {
          let dataCtes = realm.objects('ctes_supervisor');
          if (dataCtes.length > 0) {
            realm.delete(dataCtes);
          }
        });
        realm.close();
        resolve('Data deleted successfully.');
      })
      .catch((err) =>
        console.log('Failed to delete data ctes from supervisor: ', err),
      );
  });
};

// Function to save supervisor profile data(Ctes).
export const saveCtesSupervisorProfile = (Ctes: any) => {
  return new Promise(async (resolve) => {
    for (const cte of Ctes) {
      await Realm.open({
        schema: [CTEsSchemaSupervisor],
      })
        .then(async (realm) => {
          realm.write(async () => {
            await realm.create('ctes_supervisor', {
              cte_status: cte.cte_status,
              rom_dt_manifesto: cte.rom_dt_manifesto,
              cte_previsao: cte.cte_previsao,
              tipo_pedido: cte.tipo_pedido,
              cte_tipo_produto: cte.cte_tipo_produto,
              nf_empresa: cte.nf_empresa,
              doc_procesados: cte.doc_procesados,
              cte_ordem: cte.cte_ordem,
              estado_pedido: cte.estado_pedido,
              codigo: cte.codigo,
              parametro_checkin: cte.parametro_checkin,
              rom_motorista: cte.rom_motorista,
              cte_id: cte.cte_id,
              nf_dt_entrega: cte.nf_dt_entrega,
              rom_manifesto: cte.rom_manifesto,
              rom_destino: cte.rom_destino,
              cte_numero: cte.cte_numero,
              destinatario: cte.destinatario,
              destino_uf: cte.destino_uf,
              cliente: cte.cliente,
              cte_local_entrega: cte.cte_local_entrega,
              system: cte.system,
              punto_fijo: cte.punto_fijo,
              nf_data: cte.nf_data,
              nf_valor: cte.nf_valor,
              nf_chave: cte.nf_chave,
              nf_volume: cte.nf_volume,
              rom_id: cte.rom_id,
              nf_id: cte.nf_id,
              origem: cte.origem,
              cte_data_agenda: cte.cte_data_agenda,
              nf_peso: cte.nf_peso,
              no_planilla: cte.no_planilla,
              legado: cte.legado,
              destino: cte.destino,
              nf_cli_vip: cte.nf_cli_vip,
              total_planilla: cte.total_planilla,
              nf_emitente: cte.nf_emitente,
              cajas: cte.cajas,
              cte_data: cte.cte_data,
              placa: cte.placa,
              remetente: cte.remetente,
              date_eta: cte.date_eta,
              ejecutivo: cte.ejecutivo,
              rom_origem: cte.rom_origem,
              cajas_entregadas: cte.cajas_entregadas,
              transp_codigo: cte.transp_codigo,
              cte_type_delivery: cte.cte_type_delivery,
              rom_id_controle: cte.rom_id_controle,
              rom_km_total: cte.rom_km_total,
              cte_chave: cte.cte_chave,
              destino_cidade: cte.destino_cidade,
              cte_tel_destinatario: cte.cte_tel_destinatario,
              telefono_ejecutivo: cte.telefono_ejecutivo,
              movilidad_kilos: cte.movilidad_kilos,
              movilidad_ciudad: cte.movilidad_ciudad,
              desc_nit: cte.desc_nit,
              colaborador: cte.colaborador,
              zona_distribucion: cte.zona_distribucion,
              nit: cte.nit,
              fecha_actual: cte.fecha_actual,
              neveras_recogidas: cte.neveras_recogidas,
              cadena_frio: cte.cadena_frio,
              movilidad_cargue_paso: cte.movilidad_cargue_paso,
              sucursal_origen: cte.sucursal_origen,
              movilidad_cita: cte.movilidad_cita,
              inicio_viaje_p: cte.inicio_viaje_p,
              entrega: cte.entrega,
              factura: cte.factura,
              nf_dt_llegada: cte.dt_llegada,
              nf_dt_descargando: cte.dt_descargando_carg,
              movilidadId: Number(cte.movilidadId),
              inicio_viaje_p: cte.inicio_viaje_p,
              recibo: cte.recibo,
              fin_carga: cte.fin_carga,
              photos: !cte.evidence
                ? '[]'
                : JSON.stringify(
                    JSON.parse(cte.evidence).map((photo, index) => {
                      return {
                        fileName: `${
                          cte.cte_type_delivery == 'P' ? 'pickup' : 'delivery'
                        }_${cte.nf_id ? cte.nf_id : 0}_${index}.JPEG`,
                        uri: photo,
                        id: `${
                          cte.cte_type_delivery == 'P' ? 'pickup' : 'delivery'
                        }_${cte.nf_id ? cte.nf_id : 0}_${index}`,
                        path: '',
                        type: 'online',
                      };
                    }),
                  ),
              url_stardeliveries: cte.url_stardeliveries,
              codigo_zip: cte.codigo_zip,
              barrio: cte.barrio,
              zona: cte.zona,
              ruta: cte.ruta,
              documento: cte.documento,
              observaciones: cte.observaciones,
              fecha_creacion_remesa: cte.fecha_creacion_remesa,
              llegada_recogida: cte.llegada_recogida,
              cargando: cte.cargando,
              direccion: cte.direccion,
              cajas_en_frio: cte.cajas_en_frio,
              total_cajas: cte.total_cajas,
              indiMercanciaInv: cte.indiMercanciaInv,
              moviDtoPend: cte.moviDtoPend,
            });
          });
          await realm.close();
        })
        .catch((err) =>
          console.log('Failed to save supervisor ctes data: ', err),
        );
    }
    resolve('Data saved successfully.');
  });
};
// Function to get ctes data for supervisor profile.
export const getCtesToSupervisorProfile = () =>
  new Promise((resolve) => {
    Realm.open({
      schema: [CTEsSchemaSupervisor],
      deleteRealmIfMigrationNeeded: true,
    })
      .then((realm) => {
        let dataCtes = realm.objects('ctes_supervisor');
        const result = JSON.parse(JSON.stringify(dataCtes));

        realm.close();
        resolve(result);
      })
      .catch((err) =>
        console.log('Failed to get ctes data for supervisor: ', err),
      );
  });

// Function to get specific ctes data for supervisor profile.
export const getNfsToSupervisorProfile = (nf_idparam: any) =>
  new Promise((resolve) => {
    Logger.log('Realm get => getNfsToSupervisorProfile');
    Realm.open({
      schema: [CTEsSchemaSupervisor],
      deleteRealmIfMigrationNeeded: true,
    })
      .then((realm) => {
        let dataCtes = realm
          .objects('ctes_supervisor')
          .filtered('nf_id = $0', nf_idparam);
        const result = JSON.parse(JSON.stringify(dataCtes));

        realm.close();
        resolve(result);
      })
      .catch((err) =>
        console.log('Failed to get specific ctes data for supervisor: ', err),
      );
  });
