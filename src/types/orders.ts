export enum DELIVERY_TYPES {
  remesas = 'E',
  red = 'R',
  colecta = 'O',
}

export type Orders = `${DELIVERY_TYPES}`;

export interface BaseOrderInterface {
  barrio: string;
  cadena_frio: 'N';
  cajas: number;
  cajas_en_frio: string; //'0';
  cajas_entregadas: string; // '0 DE -1';
  cargando: any; // null;
  cliente: string; // 'NOVARTIS DE COLOMBIA S.A';
  codigo: any; // null;
  codigo_zip: string;
  colaborador: string;
  cte_chave: any; // null;
  cte_data: any; // null;
  cte_data_agenda: string; // '2023-02-16 07:00:00.000 -05:00';
  cte_id: any; // null;
  cte_local_entrega: string; // '4.64074,-74.1046';
  cte_numero: any; // '913';
  cte_ordem: number;
  cte_previsao: string; // '2023-02-16 07:00:00';
  cte_status: number;
  cte_tel_destinatario: any; // null;
  cte_tipo_produto: any; // null;
  cte_type_delivery: 'D';
  date_eta: string; // '2023-02-16 07:00:00';
  desc_nit: string; // 'NOVARTIS DE COLOMBIA S.A';
  destinatario: string; // 'CIUDAD SALITRE ORIENTAL';
  destino: string; // '11001000';
  destino_cidade: string; //'';
  destino_uf: any; // null;
  direccion: string; // 'SUPPLA diag.22A # 56A-40';
  doc_procesados: string; // '0 DE 1';
  documento: string; // '';
  ejecutivo: string; // 'SARA JOHANNA QUIROGA MUÑOZ';
  entrega: '1';
  estado_pedido: 'T';
  factura: '1';
  fecha_actual: string; // '2023-02-21T17:33:34.310+00:00';
  fecha_creacion_remesa: string; // '1900-01-01 00:00:00.000 +00:00';
  fin_carga: any; // null;
  indiMercanciaInv: string; // '';
  inicio_viaje_p: string; // null;
  legado: any; // null;
  llegada_recogida: any; // null;
  moviDtoPend: string; // '';
  movilidad_cargue_paso: string; // '[0]';
  movilidad_cita: string; // '';
  movilidad_ciudad: string; // '11001000';
  movilidad_kilos: number;
  neveras_recogidas: number;
  nf_chave: any; // null;
  nf_cli_vip: any; // null;
  nf_data: any; // null;
  nf_dt_descargando: any; // null;
  nf_dt_entrega: string; // '';
  nf_dt_llegada: any; // null;
  nf_emitente: any; // null;
  nf_empresa: any; // null;
  nf_id: string; //'1100100002810310';
  nf_peso: any; // null;
  nf_valor: any; // null;
  nf_volume: any; // null;
  nit: string; // '8600025381';
  no_planilla: string; // '1100100002810310';
  observaciones: string; // ' ';
  origem: string;
  parametro_checkin: any; // null;
  photos: string; //'[]';
  placa: string; // 'UFT401';
  punto_fijo: string; // '';
  remetente: any; // null;
  rom_destino: string; // 'CIUDAD SALITRE ORIENTAL - SUPPLA diag.22A # 56A-40';
  rom_dt_manifesto: string; // '2023-02-16 14:08:00';
  rom_id: string; // '2993046';
  rom_id_controle: number;
  rom_km_total: any; // null;
  rom_manifesto: string; // '';
  rom_motorista: string; //'79564207';
  rom_origem: string;
  ruta: string; // '';
  sucursal_origen: string; //'4.62135, -74.0764';
  system: number;
  telefono_ejecutivo: string; //'7470000';
  tipo_pedido: Orders;
  total_cajas: number;
  total_planilla: number;
  transp_codigo: any; // null;
  url_stardeliveries: string;
  zona: string; // '';
  zona_distribucion: string; //'01';
  movilidadId: number;
}

export interface OrderTypeColecta extends BaseOrderInterface {}
export interface OrderTypeRemesa extends BaseOrderInterface {}
export interface OrderTypeRed extends BaseOrderInterface {}

export type OrdersArr = Array<BaseOrderInterface>;
