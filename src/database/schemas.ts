export const UserSchema = {
  name: 'usuario',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    moto_nome: 'string?',
    moto_cpf: 'string?',
    moto_tel: 'string?',
    moto_email: 'string?',
    moto_senha: 'string?',
    foto: {type: 'string?', default: null},
  },
};

export const MotoLoginSchema = {
  name: 'moto_login',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    moto_login: {type: 'int', default: 0},
    moto_versao_app: 'string',
    sync: {type: 'int', default: 0},
  },
};

export const TermSchema = {
  // /termo-motorista
  name: 'termo',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int?',
    empresa: 'string?',
    termo: 'string?',
    status: 'string?',
    versao: 'string?',
    termo_aceite: {type: 'int', default: 0},
  },
};

export const TermHistorySchema = {
  name: 'termo_historico',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    motorista_id: 'int',
    termo_id: 'int',
    latitude: 'string',
    longitude: 'string',
    empresa: 'string?',
    sync: {type: 'int', default: 0},
  },
};

export const CTEsSchema = {
  name: 'notas_fiscais',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    rom_id_controle: 'int',
    rom_id: 'string',
    rom_km_total: 'string?',
    rom_origem: 'string?',
    rom_destino: 'string?',
    rom_manifesto: 'string?',
    rom_dt_manifesto: 'string?',
    cte_id: 'string?',
    cte_data: 'string?',
    placa: 'string?',
    cte_numero: 'string?',
    cte_tipo_produto: 'string?',
    cte_previsao: 'string?',
    cte_status: 'string?',
    cte_ordem: 'string?',
    cte_data_agenda: {type: 'string?', default: null},
    cte_local_entrega: {type: 'string?', default: null},
    cte_tel_destinatario: {type: 'string?', default: null},
    nf_id: 'string?',
    nf_data: 'string?',
    nf_chave: 'string?',
    nf_valor: 'string?',
    nf_volume: 'string?',
    nf_peso: 'string?',
    nf_cli_vip: 'string?',
    nf_dt_entrega: 'string?',
    nf_dt_llegada: 'string?',
    nf_dt_descargando: 'string?',
    inicio_viaje_p: 'string?',
    nf_empresa: 'string?',
    codigo: 'string?',
    origem: 'string?',
    remetente: 'string?',
    destinatario: 'string?',
    destino_cidade: 'string?',
    destino_uf: 'string?',
    transp_codigo: 'string?',
    nf_resp_receber: 'string?',
    nf_ocorrencia: 'int?',
    parametro_checkin: 'bool?',
    nf_obs: 'string?',
    nf_type_number: 'string',
    cte_type_delivery: 'string',
    update_or_end: {type: 'bool', default: false},
    date_eta: 'string?',
    no_planilla: 'string?',
    cte_chave: 'string?',
    destino: 'string?',
    entrega: 'string?',
    factura: 'string?',
    photos: 'string',
    fin_carga: 'string?',
    url_stardeliveries: 'string?',
    codigo_zip: 'string?',
    barrio: 'string?',
    zona: 'string?',
    ruta: 'string?',
    documento: 'string?',
    observaciones: 'string?',
    fecha_creacion_remesa: 'string?',
    llegada_recogida: 'string?',
    cargando: 'string?',
    direccion: 'string?',
  },
};

export const TrackingSchema = {
  //sincroniza /location-device do Agv parceiro
  name: 'tracking',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    latitude: 'string?',
    longitude: 'string?',
    device_data: 'string?',
    device_id: 'string?',
    id_geo: 'string?',
    evento: 'string?',
    sync: {type: 'int', default: 0},
  },
};

export const TrackingGoSchema = {
  //sincroniza /location-device do market-place
  name: 'tracking_go',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    latitude: 'string?',
    longitude: 'string?',
    device_data: 'string?',
    device_id: 'string?',
    id_geo: 'string?',
    evento: 'string?',
    monitoramento_preventivos_id: 'int?',
    sync: {type: 'int', default: 0},
  },
};

export const TransportSchema = {
  //sincroniza /romaneio
  name: 'transporte',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    rom_id_controle: 'int',
    rom_id: 'string',
    empresa: 'string?',
    rom_motorista: 'string?',
    rom_km_total: 'string?',
    rom_origem: 'string?',
    rom_destino: 'string?',
    rom_manifesto: 'string?',
    rom_dt_manifesto: 'string?',
    rom_inicio_transp: 'string?',
    rom_fim_transp: 'string?',
    rom_empresa: 'string?',
    rom_chat_key: 'string?',
    rom_device_id: 'string?',
    rom_total_notas: 'string?',
    rom_notas_entregues: 'string?',
    rom_ocorrencias: 'string?',
    rom_notas_paradas: 'string?',
    rom_lat_long_inicio: 'string?',
    rom_lat_long_fim: 'string?',
    rom_resp_fim: 'string?',
    rom_gps_ativo: 'bool?',
    rom_dt_gps: 'string?',
    sync: {type: 'int', default: 0}, //0 - viagem iniciada; 1 - viagem iniciada sincronizado;
    sync_fim: {type: 'int', default: 0}, // 1 - finalizado; 2 - finalizado e sincronizado;
  },
};

export const TransportStatusGpsSchema = {
  name: 'transporte_status_gps',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    rom_id_controle: 'int',
    rom_gps_ativo: 'bool',
    rom_dt_gps: 'string?',
    sync: {type: 'int', default: 0},
  },
};
export const Photos = {
  name: 'photos',
  primaryKey: 'id',

  properties: {
    id: {type: 'string', indexed: true},
    fileName: 'string',
    path: 'string',
    uri: 'string',
    type: 'string',
  },
};

export const LowSchema = {
  //sincroniza /nota-fiscal/entrega
  name: 'baixas',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    rom_id: 'string',
    cte_id: 'string?',
    cte_info_controle: 'string?',
    nf_chave: 'string?',
    nf_resp_receber: 'string?',
    nf_dt_entrega: 'string?',
    nf_dt_llegada: 'string?',
    nf_dt_descargando: 'string?',
    inicio_viaje_p: 'string?',
    nf_dt_canhoto: 'string?',
    nf_ocorrencia: 'int?',
    nf_obs: 'string?',
    cte_numero: 'string?',
    nf_lat_long_entrega: 'string?',
    cte_type_delivery: 'string',
    nf_type_number: 'string',
    photos: {type: 'list', objectType: 'photos'},
    update_or_end: {type: 'bool', default: false},
    estado_pedido: 'string',
    movilidad_kilos: 'int?',
    movilidad_ciudad: 'string?',
    desc_nit: 'string?',
    colaborador: 'string?',
    zona_distribucion: 'string?',
    //{
    //type: 'string',
    //default: false,
    //} /* false: baixa por NF-e; true: baixa por CT-e */,
    sync: {type: 'int', default: 0}, //0 - a sincronizar; 1 - sincronizado
    nit: 'string?',
    fecha_actual: 'string?',
    neveras_recogidas: 'int?',
    cadena_frio: 'string',
    movilidad_cargue_paso: 'string?',
    sucursal_origen: 'string?',
    movilidad_cita: 'string?',
    destino: 'string?',
    entrega: 'string?',
    factura: 'string?',
    fin_carga: 'string?',
    url_stardeliveries: 'string?',
    codigo_zip: 'string?',
    barrio: 'string?',
    zona: 'string?',
    ruta: 'string?',
    documento: 'string?',
    observaciones: 'string?',
    fecha_creacion_remesa: 'string?',
    llegada_recogida: 'string?',
    cargando: 'string?',
  },
};

export const SendOccurrenceSchema = {
  //sincroniza /nota-fiscal/ocorrencia
  name: 'envio_ocorrencias',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    rom_id: 'string',
    cte_id: 'string?',
    cte_chave: 'string?',
    nf_chave: 'string?',
    cte_obs: 'string?',
    cte_info_controle: 'string?',
    cte_numero: 'string?',
    nf_lat_long_ocorrencia: 'string?',
    nf_obs: 'string?',
    nf_ocorrencia: 'int?',
    nf_dt_ocorrencia: 'string?',
    nf_oco_foto_1: 'string?',
    file_name_foto_1: 'string?',
    nf_oco_foto_2: 'string?',
    file_name_foto_2: 'string?',
    nf_oco_foto_3: 'string?',
    file_name_foto_3: 'string?',
    nf_type_number: 'string',
    photos: {type: 'list', objectType: 'photos'},
    update_or_end: {type: 'bool', default: false},
    sync: {type: 'int', default: 0}, //0 - a sincronizar; 1 - sincronizado
    estado_pedido: 'string',
    movilidad_kilos: 'int?',
    movilidad_ciudad: 'string?',
    desc_nit: 'string?',
    colaborador: 'string?',
    zona_distribucion: 'string?',
    nit: 'string?',
    fecha_actual: 'string?',
    neveras_recogidas: 'int?',
    cadena_frio: 'string?',
    movilidad_cargue_paso: 'string?',
    sucursal_origen: 'string?',
    movilidad_cita: 'string?',
    fin_carga: 'string?',
    url_stardeliveries: 'string?',
    codigo_zip: 'string?',
    barrio: 'string?',
    zona: 'string?',
    ruta: 'string?',
    documento: 'string?',
    observaciones: 'string?',
    fecha_creacion_remesa: 'string?',
    llegada_recogida: 'string?',
    cargando: 'string?',
  },
};

export const SendAuditSchema = {
  //sincroniza /inspect/audit
  name: 'envio_audit',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    travelId: 'string',
    license: 'string',
    superName: 'string',
    totalOrders: 'string',
    totalOrdersDelivered: 'string',
    orderIssues: 'string',
    observations: 'string',
    dateDone: 'string',
    photos: {type: 'list', objectType: 'photos'},
    update_or_end: {type: 'bool', default: false},
    sync: {type: 'int', default: 0}, //0 - a sincronizar; 1 - sincronizado
  },
};

export const SendSACReportSchema = {
  //sincroniza /nota-fiscal/ocorrencia
  name: 'envio_sacReports',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    moto_id: 'int',
    photos: {type: 'list', objectType: 'photos'},
    update_or_end: {type: 'bool', default: false},
    sync: {type: 'int', default: 0}, //0 - a sincronizar; 1 - sincronizado
  },
};

export const CheckInSchema = {
  //sincroniza /nota-fiscal/ocorrencia
  name: 'check',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    id_api: {type: 'int?', default: 0},
    motorista_id: 'int',
    chave_cte: 'string?',
    cte: 'string?',
    cte_id: 'string?',
    device_id: 'string?',
    latitude_checkIn: 'string?',
    longitude_checkIn: 'string?',
    latitude_checkOut: 'string?',
    longitude_checkOut: 'string?',
    sync: {type: 'int', default: 0},
    /**
     * sync:
     * 0 - A sincronizar checkIn;
     * 1 - CheckIn sincronizado;
     * 2 - A sincronizar CheckIn e CheckOut;
     * 3 - A sincronizar CheckOut;
     * 4 - CheckIn e CheckOut sincronizado;
     */
  },
};

export const PhotoPerfilSchema = {
  name: 'photo_perfil',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    motorista_id: 'int',
    photo: 'string',
  },
};

export const unloadDeliveries = {
  name: 'descarregar',
  primaryKey: 'id',

  properties: {
    id: {type: 'int', indexed: true},
    motorista_id: 'int', //moto_id
    nf_type_number: 'string?', //numero da entrega
    status: 'string?',
    latitude_checkIn: 'string?',
    longitude_checkIn: 'string?',
  },
};

// New model for DataBase to save data of Remittences.
export const CTEsSchemaSupervisor = {
  name: 'ctes_supervisor',
  properties: {
    cte_status: 'int',
    rom_dt_manifesto: 'string',
    cte_previsao: 'string',
    tipo_pedido: 'string?',
    cte_tipo_produto: 'string?',
    nf_empresa: 'string?',
    doc_procesados: 'string?',
    cte_ordem: 'int?',
    estado_pedido: 'string?',
    codigo: 'string?',
    parametro_checkin: 'bool?',
    rom_motorista: 'string?',
    cte_id: 'string?',
    nf_dt_entrega: 'string?',
    rom_manifesto: 'string?',
    rom_destino: 'string?',
    cte_numero: 'string?',
    destinatario: 'string?',
    destino_uf: 'string?',
    cliente: 'string?',
    cte_local_entrega: 'string?',
    system: 'int?',
    punto_fijo: 'string?',
    nf_data: 'string?',
    nf_valor: 'string?',
    nf_chave: 'string?',
    nf_volume: 'string?',
    rom_id: 'string?',
    nf_id: 'string?',
    origem: 'string?',
    cte_data_agenda: {type: 'string?', default: null},
    nf_peso: 'string?',
    no_planilla: 'string?',
    legado: {type: 'string?', default: null},
    destino: 'string?',
    nf_cli_vip: 'string?',
    total_planilla: 'int',
    nf_emitente: {type: 'string?', default: null},
    cajas: 'int?',
    cte_data: 'string?',
    placa: 'string?',
    remetente: 'string?',
    date_eta: 'string?',
    ejecutivo: 'string?',
    rom_origem: 'string?',
    cajas_entregadas: 'string?',
    transp_codigo: 'string?',
    cte_type_delivery: 'string?',
    rom_id_controle: 'int?',
    rom_km_total: 'string?',
    cte_chave: 'string?',
    destino_cidade: 'string',
    cte_tel_destinatario: {type: 'string?', default: null},
    telefono_ejecutivo: 'string?',
    movilidad_kilos: 'int?',
    movilidadId: 'int',
    movilidad_ciudad: 'string?',
    desc_nit: 'string?',
    colaborador: 'string?',
    zona_distribucion: 'string?',
    nit: 'string?',
    fecha_actual: 'string?',
    neveras_recogidas: 'int?',
    cadena_frio: 'string?',
    movilidad_cargue_paso: 'string?',
    sucursal_origen: 'string?',
    movilidad_cita: 'string?',
    entrega: 'string?',
    factura: 'string?',
    photos: 'string',
    nf_dt_llegada: 'string?',
    nf_dt_descargando: 'string?',
    inicio_viaje_p: 'string?',
    fin_carga: 'string?',
    url_stardeliveries: 'string?',
    codigo_zip: 'string?',
    barrio: 'string?',
    zona: 'string?',
    ruta: 'string?',
    documento: 'string?',
    observaciones: 'string?',
    fecha_creacion_remesa: 'string?',
    llegada_recogida: 'string?',
    cargando: 'string?',
    direccion: 'string?',
    cajas_en_frio: 'string?',
    total_cajas: 'int?',
    indiMercanciaInv: 'string?',
    moviDtoPend: 'string?',
  },
};
