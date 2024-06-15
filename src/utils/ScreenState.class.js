export default class ScreenState {
  constructor() {
    this.init();
  }

  init() {
    this.firma = '';
    this.sacReport = false;
    this.rotulos = false;
    this.redType = '';
  }

  getType = () => {
    return this.redType;
  };

  addType = (value) => {
    this.redType = value;
  };

  getFirma = () => {
    return this.firma;
  };

  addFirma = (value) => {
    this.firma = value;
  };

  deleteType = () => {
    this.redType = '';
  };

  deleteFirma = () => {
    this.firma = '';
  };

  getSendSac = () => {
    return this.sacReport;
  };

  addSendSac = () => {
    this.sacReport = true;
  };

  deleteSendSaC = () => {
    this.sacReport = false;
  };

  getRotulos = () => {
    return this.rotulos;
  };

  addRotulos = () => {
    this.rotulos = true;
  };

  deleteRotulos = () => {
    this.rotulos = false;
  };
}
