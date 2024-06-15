const RemesaBoxesSchema = {
  name: 'RemesaBoxes',
  properties: {
    remesaID: 'string',
    boxes: 'RemesaBox[]',
  },
  primaryKey: "remesaID"
};

const RemesaBoxSchema = {
  name: 'RemesaBox',
  properties: {
    sent: 'bool',
    remesaID: 'string',
    matrixID: 'string',
    boxNumber: 'int',
  },
};

export {RemesaBoxSchema, RemesaBoxesSchema};
