import uuid from 'react-native-uuid';

/**
 * Create a unid id
 * @returns
 */
export function getRandomUUID() {
  return uuid.v4();
}

/**
 * Create a data matix ID
 * @param remesaID
 * @param currentBoxNumber
 * @param totalBoxes
 * @returns 111090567364U001U003UC
 */
export function createBoxMatrixID(
  remesaID: string,
  currentBoxNumber: number,
  totalBoxes: number,
) {
  const currenNumberFormatted = appendZero(String(currentBoxNumber));
  const totalBoxesFormatted = appendZero(String(totalBoxes));
  return `${remesaID}U${currenNumberFormatted}U${totalBoxesFormatted}UC`;
}

/**
 * Append zeros to the begining of a number
 * @param number
 * @returns 003
 */
export function appendZero(number: string) {
  return number.padStart(3, '0');
}
