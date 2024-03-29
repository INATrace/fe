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





export interface ApiProcessingPerformanceTotalItem { 
    inputQuantity?: number;
    outputQuantity?: number;
    ratio?: number;
    unit?: string;
    year?: number;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProcessingPerformanceTotalItem.
 */
export namespace ApiProcessingPerformanceTotalItem {
    /**
     * All properties of ApiProcessingPerformanceTotalItem.
     */
    export enum Properties {
        inputQuantity = 'inputQuantity',
        outputQuantity = 'outputQuantity',
        ratio = 'ratio',
        unit = 'unit',
        year = 'year'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProcessingPerformanceTotalItem',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'inputQuantity',
                    classname: 'ApiProcessingPerformanceTotalItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'outputQuantity',
                    classname: 'ApiProcessingPerformanceTotalItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'ratio',
                    classname: 'ApiProcessingPerformanceTotalItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'unit',
                    classname: 'ApiProcessingPerformanceTotalItem',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'year',
                    classname: 'ApiProcessingPerformanceTotalItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                inputQuantity: [
                ],
                outputQuantity: [
                ],
                ratio: [
                ],
                unit: [
                ],
                year: [
                ],
            }
        }
    }

  // export const ApiProcessingPerformanceTotalItemValidationScheme = {
  //     validators: [],
  //     fields: {
  //               inputQuantity: {
  //                   validators: []
  //               },
  //               outputQuantity: {
  //                   validators: []
  //               },
  //               ratio: {
  //                   validators: []
  //               },
  //               unit: {
  //                   validators: []
  //               },
  //               year: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProcessingPerformanceTotalItem>;


}


