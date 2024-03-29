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


import { ApiMeasureUnitType } from './apiMeasureUnitType';
import { ApiSemiProductTranslation } from './apiSemiProductTranslation';



export interface ApiSemiProduct { 
    buyable?: boolean;
    description?: string;
    /**
     * Entity id
     */
    id?: number;
    measurementUnitType?: ApiMeasureUnitType;
    name?: string;
    sku?: boolean;
    skuendCustomer?: boolean;
    translations?: Array<ApiSemiProductTranslation>;
}

/**
 * Namespace for property- and property-value-enumerations of ApiSemiProduct.
 */
export namespace ApiSemiProduct {
    /**
     * All properties of ApiSemiProduct.
     */
    export enum Properties {
        buyable = 'buyable',
        description = 'description',
        /**
         * Entity id
         */
        id = 'id',
        measurementUnitType = 'measurementUnitType',
        name = 'name',
        sku = 'sku',
        skuendCustomer = 'skuendCustomer',
        translations = 'translations'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiSemiProduct',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'buyable',
                    classname: 'ApiSemiProduct',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'description',
                    classname: 'ApiSemiProduct',
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
                    classname: 'ApiSemiProduct',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiMeasureUnitType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'measurementUnitType',
                    classname: 'ApiSemiProduct',
                    dataType: 'ApiMeasureUnitType',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiMeasureUnitType'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiSemiProduct',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'sku',
                    classname: 'ApiSemiProduct',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'skuendCustomer',
                    classname: 'ApiSemiProduct',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiSemiProductTranslation.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'translations',
                    classname: 'ApiSemiProduct',
                    dataType: 'Array&lt;ApiSemiProductTranslation&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiSemiProductTranslation'
                },
            ],
            validators: {
                buyable: [
                ],
                description: [
                ],
                id: [
                ],
                measurementUnitType: [
                ],
                name: [
                ],
                sku: [
                ],
                skuendCustomer: [
                ],
                translations: [
                ],
            }
        }
    }

  // export const ApiSemiProductValidationScheme = {
  //     validators: [],
  //     fields: {
  //               buyable: {
  //                   validators: []
  //               },
  //               description: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               measurementUnitType: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               sku: {
  //                   validators: []
  //               },
  //               skuendCustomer: {
  //                   validators: []
  //               },
  //               translations: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiSemiProduct>;


}


