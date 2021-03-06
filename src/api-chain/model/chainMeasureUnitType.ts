/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * coffee-be
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the openapi-typescript-angular-generator.
 * https://github.com/alenabelium/openapi-typescript-angular-generator
 * Do not edit the class manually.
 */




/**
 * Codebook for type of chain facility
 */

export interface ChainMeasureUnitType { 
    docType?: string;
    _id?: string;
    _rev?: string;
    dbKey?: string;
    mode__?: ChainMeasureUnitType.ModeEnum;
    id: string;
    label: string;
    weight?: number;
    underlyingMeasurementUnitTypeId?: string;
    underlyingMeasurementUnitType?: ChainMeasureUnitType;
}

/**
 * Namespace for property- and property-value-enumerations of ChainMeasureUnitType.
 */
export namespace ChainMeasureUnitType {
    /**
     * All properties of ChainMeasureUnitType.
     */
    export enum Properties {
        docType = 'docType',
        _id = '_id',
        _rev = '_rev',
        dbKey = 'dbKey',
        mode__ = 'mode__',
        id = 'id',
        label = 'label',
        weight = 'weight',
        underlyingMeasurementUnitTypeId = 'underlyingMeasurementUnitTypeId',
        underlyingMeasurementUnitType = 'underlyingMeasurementUnitType'
    }

    /**
     * All possible values of mode__.
     */
    export enum ModeEnum {
        Insert = 'insert',
        InsertAsIs = 'insert_as_is',
        Update = 'update'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ChainMeasureUnitType',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'docType',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: '_id',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: '_rev',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'dbKey',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ChainMeasureUnitType.ModeEnum',
                    required: false,
                    name: 'mode__',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'id',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'label',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'weight',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'underlyingMeasurementUnitTypeId',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ChainMeasureUnitType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'underlyingMeasurementUnitType',
                    classname: 'ChainMeasureUnitType',
                    dataType: 'ChainMeasureUnitType',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ChainMeasureUnitType'
                },
            ],
            validators: {
                docType: [
                ],
                _id: [
                ],
                _rev: [
                ],
                dbKey: [
                ],
                mode__: [
                ],
                id: [
                        ['required'],
                ],
                label: [
                        ['required'],
                ],
                weight: [
                ],
                underlyingMeasurementUnitTypeId: [
                ],
                underlyingMeasurementUnitType: [
                ],
            }
        }
    }

  // export const ChainMeasureUnitTypeValidationScheme = {
  //     validators: [],
  //     fields: {
  //               docType: {
  //                   validators: []
  //               },
  //               _id: {
  //                   validators: []
  //               },
  //               _rev: {
  //                   validators: []
  //               },
  //               dbKey: {
  //                   validators: []
  //               },
  //               mode__: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               label: {
  //                   validators: []
  //               },
  //               weight: {
  //                   validators: []
  //               },
  //               underlyingMeasurementUnitTypeId: {
  //                   validators: []
  //               },
  //               underlyingMeasurementUnitType: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ChainMeasureUnitType>;


}


