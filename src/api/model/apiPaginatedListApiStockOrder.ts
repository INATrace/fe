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


import { ApiStockOrder } from './apiStockOrder';


/**
 * Response body for successful responses.
 */

export interface ApiPaginatedListApiStockOrder { 
    /**
     * Response items.
     */
    items?: Array<ApiStockOrder>;
    /**
     * Count of all items satisfying 'paginatable' request.
     */
    count?: number;
    /**
     * Offset got from request
     */
    offset?: number;
    /**
     * Limit got from request
     */
    limit?: number;
}

/**
 * Namespace for property- and property-value-enumerations of ApiPaginatedListApiStockOrder.
 */
export namespace ApiPaginatedListApiStockOrder {
    /**
     * All properties of ApiPaginatedListApiStockOrder.
     */
    export enum Properties {
        /**
         * Response items.
         */
        items = 'items',
        /**
         * Count of all items satisfying 'paginatable' request.
         */
        count = 'count',
        /**
         * Offset got from request
         */
        offset = 'offset',
        /**
         * Limit got from request
         */
        limit = 'limit'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiPaginatedListApiStockOrder',
            vars: [
                {
                    metadata: ApiStockOrder.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'items',
                    classname: 'ApiPaginatedListApiStockOrder',
                    dataType: 'Array&lt;ApiStockOrder&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiStockOrder'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'count',
                    classname: 'ApiPaginatedListApiStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'offset',
                    classname: 'ApiPaginatedListApiStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'limit',
                    classname: 'ApiPaginatedListApiStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                items: [
                ],
                count: [
                ],
                offset: [
                ],
                limit: [
                ],
            }
        }
    }

  // export const ApiPaginatedListApiStockOrderValidationScheme = {
  //     validators: [],
  //     fields: {
  //               items: {
  //                   validators: []
  //               },
  //               count: {
  //                   validators: []
  //               },
  //               offset: {
  //                   validators: []
  //               },
  //               limit: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiPaginatedListApiStockOrder>;


}


