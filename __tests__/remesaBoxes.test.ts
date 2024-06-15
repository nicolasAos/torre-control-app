import {createBoxMatrixID, appendZero} from '../src/utils';

describe('Remesa Boxes', () => {
  it('should append 00 to a number 003', () => {
    const numberIthZeros = appendZero('3');
    expect(numberIthZeros).toBe('003');
  });

  it('should append 0 to a number 033', () => {
    const numberIthZeros = appendZero('33');
    expect(numberIthZeros).toBe('033');
  });

  it('should append no-0 to a number 333', () => {
    const numberIthZeros = appendZero('333');
    expect(numberIthZeros).toBe('333');
  });

  it('should create a data-matrix ID', () => {
    const dataMatixIDCase1 = createBoxMatrixID('276321001675', '1', '3');
    const dataMatixIDCase2 = createBoxMatrixID('276321001675', '10', '128');

    expect(dataMatixIDCase1).toBe('276321001675U001U003UC');
    expect(dataMatixIDCase2).toBe('276321001675U010U128UC');
  });
});
