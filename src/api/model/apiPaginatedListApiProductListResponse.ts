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


import { ApiProductListResponse } from './apiProductListResponse';


/**
 * Response body for successful responses.
 */

export interface ApiPaginatedListApiProductListResponse { 
    /**
     * Response items.
     */
    items?: Array<ApiProductListResponse>;
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
 * Namespace for property- and property-value-enumerations of ApiPaginatedListApiProductListResponse.
 */
export namespace ApiPaginatedListApiProductListResponse {
    /**
     * All properties of ApiPaginatedListApiProductListResponse.
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
            classname: 'ApiPaginatedListApiProductListResponse',
            vars: [
                {
                    metadata: ApiProductListResponse.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'items',
                    classname: 'ApiPaginatedListApiProductListResponse',
                    dataType: 'Array&lt;ApiProductListResponse&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiProductListResponse'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'count',
                    classname: 'ApiPaginatedListApiProductListResponse',
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
                    classname: 'ApiPaginatedListApiProductListResponse',
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
                    classname: 'ApiPaginatedListApiProductListResponse',
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

  // export const ApiPaginatedListApiProductListResponseValidationScheme = {
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
  // } as SimpleValidationScheme<ApiPaginatedListApiProductListResponse>;


}


