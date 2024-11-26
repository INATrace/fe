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


import { ApiProcessingAction } from './apiProcessingAction';


/**
 * Response body for successful responses.
 */

export interface ApiPaginatedListApiProcessingAction { 
    /**
     * Response items.
     */
    items?: Array<ApiProcessingAction>;
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
 * Namespace for property- and property-value-enumerations of ApiPaginatedListApiProcessingAction.
 */
export namespace ApiPaginatedListApiProcessingAction {
    /**
     * All properties of ApiPaginatedListApiProcessingAction.
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
            classname: 'ApiPaginatedListApiProcessingAction',
            vars: [
                {
                    metadata: ApiProcessingAction.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'items',
                    classname: 'ApiPaginatedListApiProcessingAction',
                    dataType: 'Array&lt;ApiProcessingAction&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiProcessingAction'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'count',
                    classname: 'ApiPaginatedListApiProcessingAction',
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
                    classname: 'ApiPaginatedListApiProcessingAction',
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
                    classname: 'ApiPaginatedListApiProcessingAction',
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

  // export const ApiPaginatedListApiProcessingActionValidationScheme = {
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
  // } as SimpleValidationScheme<ApiPaginatedListApiProcessingAction>;


}


