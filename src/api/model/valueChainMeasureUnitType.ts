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


import { MeasureUnitType } from './measureUnitType';
import { ValueChain } from './valueChain';



export interface ValueChainMeasureUnitType { 
    id?: number;
    measureUnitType?: MeasureUnitType;
    valueChain?: ValueChain;
}

/**
 * Namespace for property- and property-value-enumerations of ValueChainMeasureUnitType.
 */
export namespace ValueChainMeasureUnitType {
    /**
     * All properties of ValueChainMeasureUnitType.
     */
    export enum Properties {
        id = 'id',
        measureUnitType = 'measureUnitType',
        valueChain = 'valueChain'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ValueChainMeasureUnitType',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ValueChainMeasureUnitType',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: MeasureUnitType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'measureUnitType',
                    classname: 'ValueChainMeasureUnitType',
                    dataType: 'MeasureUnitType',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'MeasureUnitType'
                },
                {
                    metadata: ValueChain.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'valueChain',
                    classname: 'ValueChainMeasureUnitType',
                    dataType: 'ValueChain',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ValueChain'
                },
            ],
            validators: {
                id: [
                ],
                measureUnitType: [
                ],
                valueChain: [
                ],
            }
        }
    }

  // export const ValueChainMeasureUnitTypeValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               measureUnitType: {
  //                   validators: []
  //               },
  //               valueChain: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ValueChainMeasureUnitType>;


}


