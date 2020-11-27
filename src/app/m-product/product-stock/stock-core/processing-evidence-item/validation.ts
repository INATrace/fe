import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { SimpleValidationScheme } from 'src/interfaces/Validation';

export const ChainActivityProofValidationScheme = {
  validators: [],
  fields: {
    docType: {
      validators: []
    },
    _id: {
      validators: []
    },
    _rev: {
      validators: []
    },
    created: {
      validators: []
    },
    lastChange: {
      validators: []
    },
    userCreatedId: {
      validators: []
    },
    userChangedId: {
      validators: []
    },
    formalCreationDate: {
      validators: []
    },
    validUntil: {
      validators: []
    },
    type: {
      validators: []
    },
    document: {
      validators: []
    },
  }
} as SimpleValidationScheme<ChainActivityProof>;
