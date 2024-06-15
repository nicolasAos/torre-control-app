import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export const getDateAndHour = () => {
  return moment().format('DD/MM/YYYY HH:mm');
};

/**
 * Get a date in a x format
 * @returns 
 */
export const getDateBD = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

export const saveStoreLogin = (data: any, reject: any) => {
  try {
    AsyncStorage.setItem('LOGIN', JSON.stringify(data));
  } catch (error) {
    reject(new Error('Erro ao salvar login.'));
  }
};

export const saveStoreAlterLogin = async (data: any, reject: any) => {
  try {
    const value = await AsyncStorage.getItem('LOGIN');
    const dataLogin = await JSON.parse(value);
    if (dataLogin.data) {
      dataLogin.data = data;
      AsyncStorage.setItem('LOGIN', JSON.stringify(dataLogin));
    }
  } catch (error) {
    reject(new Error('Erro ao salvar login.'));
  }
};

export const getParsedDate = (date: any) => {
  return moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
};

export const isObjectEmpty = (obj: any) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const formatedPicker = (items: any, isFormated = false) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({
      ...item,
      value: item.id,
      label: item.descricao,
    }));
  }
  return items;
};

export const formatedPickerTracker = (items: any, isFormated = false) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({
      ...item,
      value: parseInt(item.id),
      label: item.descricao,
    }));
  }
  return items;
};

export const formatedPickerVehicles = (items: any, isFormated = false) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({...item, value: item.id, label: item.placa}));
  }
  return items;
};

export const formatedPickerVehicleTypes = (items: any, isFormated = false) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({
      ...item,
      value: item.id,
      label: item.descricao,
    }));
  }
  return items;
};

export const formatedPickerOccurrenceTypes = (
  items: any,
  isFormated = false,
) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({
      ...item,
      value: item.oco_id,
      label: item.oco_descricao,
    }));
  }
  return items;
};

export const formatedPickerSACReportTypes = (
  items: any,
  isFormated = false,
) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({
      ...item,
      value: item.ID_ESTATUS,
      label: item.ESTATUS,
    }));
  }
  return items;
};

export const formatedRegions = (items: any, isFormated = false) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({...item, ativo: 0}));
  }
  return items;
};

export const formatedPickerOwners = (items: any, isFormated = false) => {
  if (isFormated && Array.isArray(items)) {
    items = items.map((item) => ({...item, value: item.id, label: item.nome}));
  }
  return items;
};

export const formatedPickerjourneysOfOperatorPicker = (items: any) =>
  items.map((item: any) => ({
    ...item,
    value: item.oco_id,
    label: item.oco_descricao,
  }));

export const validateCPF = (cpf: any) => {
  if (
    !cpf ||
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  ) {
    return false;
  }
  var soma = 0;
  var resto;
  for (var i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto == 10 || resto == 11) {
    resto = 0;
  }
  if (resto != parseInt(cpf.substring(9, 10))) {
    return false;
  }
  soma = 0;
  for (var i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto == 10 || resto == 11) {
    resto = 0;
  }
  if (resto != parseInt(cpf.substring(10, 11))) {
    return false;
  }
  return true;
};
