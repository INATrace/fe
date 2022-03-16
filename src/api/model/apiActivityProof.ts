/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * INATrace Services API
 * Abelium INATrace Services API swagger documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the openapi-typescript-angular-generator.
 * https://github.com/alenabelium/openapi-typescript-angular-generator
 * Do not edit the class manually.
 */


import { ApiDocument } from './apiDocument';



export interface ApiActivityProof { 
    document?: ApiDocument;
    /**
     * The formal creation date of the document
     */
    formalCreationDate?: Date;
    /**
     * Entity id
     */
    id?: number;
    /**
     * The type of the activity proof
     */
    type?: string;
    /**
     * Date until the document is valid
     */
    validUntil?: Date;
}

/**
 * Namespace for property- and property-value-enumerations of ApiActivityProof.
 */
export namespace ApiActivityProof {
    /**
     * All properties of ApiActivityProof.
     */
    export enum Properties {
        document = 'document',
        /**
         * The formal creation date of the document
         */
        formalCreationDate = 'formalCreationDate',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * The type of the activity proof
         */
        type = 'type',
        /**
         * Date until the document is valid
         */
        validUntil = 'validUntil'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiActivityProof',
            vars: [
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'document',
                    classname: 'ApiActivityProof',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'formalCreationDate',
                    classname: 'ApiActivityProof',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiActivityProof',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'type',
                    classname: 'ApiActivityProof',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'validUntil',
                    classname: 'ApiActivityProof',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                document: [
                ],
                formalCreationDate: [
                ],
                id: [
                ],
                type: [
                ],
                validUntil: [
                ],
            }
        }
    }

  // export const ApiActivityProofValidationScheme = {
  //     validators: [],
  //     fields: {
  //               document: {
  //                   validators: []
  //               },
  //               formalCreationDate: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               type: {
  //                   validators: []
  //               },
  //               validUntil: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiActivityProof>;


}

