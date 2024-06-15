/**
 * ColSDTDesMovCaj data to be send
 */
export interface ColSDTDesMovCaj {
  ColSDTDesMovCaj: [
    {
      movilidadId: number; // 10725009;

      MovCajSec: string; // 'd8761b8c-5677-4ee3-8728-be55695aa2f1';

      MovCajRem: string; // '111090567364';

      MovCajNro: string; // '1';

      MovCajLoc: string; // '7.1126733,-73.1164317';

      MovCajCod: string; // '111090567364U001U003UC';

      MovCajTem: string; // '3';

      MovCajFecReg: string; // '09/02/23 16:15';

      MovCajCedReg: string; // '15438391';

      MovCajObs: string; // '';
    },
  ];
}

/**
 * ColSDTDesMovCaj response from server
 */
export interface ColSDTDesMovCajResponse {
  FecHorReg: string;
  Error: string;
}
