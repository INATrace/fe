/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * INATrace Services API
 * INATrace Services API OpenAPI documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the openapi-typescript-angular-generator.
 * https://github.com/alenabelium/openapi-typescript-angular-generator
 * Do not edit the class manually.
 */


import { ApiDeliveriesTotalItem } from './apiDeliveriesTotalItem';


/**
 * Response body for successful responses.
 */

export interface ApiDeliveriesTotal { 
    unitType?: ApiDeliveriesTotal.UnitTypeEnum;
    totals?: Array<ApiDeliveriesTotalItem>;
}

/**
 * Namespace for property- and property-value-enumerations of ApiDeliveriesTotal.
 */
export namespace ApiDeliveriesTotal {
    /**
     * All properties of ApiDeliveriesTotal.
     */
    export enum Properties {
        unitType = 'unitType',
        totals = 'totals'
    }

    /**
     * All possible values of unitType.
     */
    export enum UnitTypeEnum {
        DAY = 'DAY',
        WEEK = 'WEEK',
        MONTH = 'MONTH',
        YEAR = 'YEAR'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiDeliveriesTotal',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiDeliveriesTotal.UnitTypeEnum',
                    required: false,
                    name: 'unitType',
                    classname: 'ApiDeliveriesTotal',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiDeliveriesTotalItem.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'totals',
                    classname: 'ApiDeliveriesTotal',
                    dataType: 'Array&lt;ApiDeliveriesTotalItem&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiDeliveriesTotalItem'
                },
            ],
            validators: {
                unitType: [
                ],
                totals: [
                ],
            }
        }
    }

  // export const ApiDeliveriesTotalValidationScheme = {
  //     validators: [],
  //     fields: {
  //               unitType: {
  //                   validators: []
  //               },
  //               totals: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiDeliveriesTotal>;


}


