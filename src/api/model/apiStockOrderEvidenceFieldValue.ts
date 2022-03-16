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





export interface ApiStockOrderEvidenceFieldValue { 
    /**
     * Value holder of type Boolean
     */
    booleanValue?: boolean;
    /**
     * Value holder of type Date
     */
    dateValue?: Date;
    /**
     * The id of the Processing evidence field from the codebook
     */
    evidenceFieldId?: number;
    /**
     * The field name of the Processing evidence field from the codebook
     */
    evidenceFieldName?: string;
    /**
     * The data type oof the Processing evidence field from the codebook
     */
    evidenceFieldType?: ApiStockOrderEvidenceFieldValue.EvidenceFieldTypeEnum;
    /**
     * Entity id
     */
    id?: number;
    /**
     * Value holder of type Number
     */
    numericValue?: number;
    /**
     * Value holder of type String
     */
    stringValue?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiStockOrderEvidenceFieldValue.
 */
export namespace ApiStockOrderEvidenceFieldValue {
    /**
     * All properties of ApiStockOrderEvidenceFieldValue.
     */
    export enum Properties {
        /**
         * Value holder of type Boolean
         */
        booleanValue = 'booleanValue',
        /**
         * Value holder of type Date
         */
        dateValue = 'dateValue',
        /**
         * The id of the Processing evidence field from the codebook
         */
        evidenceFieldId = 'evidenceFieldId',
        /**
         * The field name of the Processing evidence field from the codebook
         */
        evidenceFieldName = 'evidenceFieldName',
        /**
         * The data type oof the Processing evidence field from the codebook
         */
        evidenceFieldType = 'evidenceFieldType',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Value holder of type Number
         */
        numericValue = 'numericValue',
        /**
         * Value holder of type String
         */
        stringValue = 'stringValue'
    }

    /**
     * All possible values of evidenceFieldType.
     */
    export enum EvidenceFieldTypeEnum {
        STRING = 'STRING',
        TEXT = 'TEXT',
        NUMBER = 'NUMBER',
        INTEGER = 'INTEGER',
        DATE = 'DATE',
        OBJECT = 'OBJECT',
        PRICE = 'PRICE',
        EXCHANGERATE = 'EXCHANGE_RATE',
        TIMESTAMP = 'TIMESTAMP'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiStockOrderEvidenceFieldValue',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'booleanValue',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'dateValue',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'evidenceFieldId',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'evidenceFieldName',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiStockOrderEvidenceFieldValue.EvidenceFieldTypeEnum',
                    required: false,
                    name: 'evidenceFieldType',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'numericValue',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'stringValue',
                    classname: 'ApiStockOrderEvidenceFieldValue',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                booleanValue: [
                ],
                dateValue: [
                ],
                evidenceFieldId: [
                ],
                evidenceFieldName: [
                ],
                evidenceFieldType: [
                ],
                id: [
                ],
                numericValue: [
                ],
                stringValue: [
                ],
            }
        }
    }

  // export const ApiStockOrderEvidenceFieldValueValidationScheme = {
  //     validators: [],
  //     fields: {
  //               booleanValue: {
  //                   validators: []
  //               },
  //               dateValue: {
  //                   validators: []
  //               },
  //               evidenceFieldId: {
  //                   validators: []
  //               },
  //               evidenceFieldName: {
  //                   validators: []
  //               },
  //               evidenceFieldType: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               numericValue: {
  //                   validators: []
  //               },
  //               stringValue: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiStockOrderEvidenceFieldValue>;


}

