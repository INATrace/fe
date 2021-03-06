/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * INATrace Services API
 * INATrace Services API swagger documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the openapi-typescript-angular-generator.
 * https://github.com/alenabelium/openapi-typescript-angular-generator
 * Do not edit the class manually.
 */


import { ApiProductLabelFieldValue } from './apiProductLabelFieldValue';



export interface ApiProductLabelValuesExtended { 
    /**
     * Number of true 'checkAuthenticity' fields over all of batches
     */
    checkAuthenticityCount?: number;
    /**
     * Fields
     */
    fields?: Array<ApiProductLabelFieldValue>;
    /**
     * Entity id
     */
    id?: number;
    /**
     * Number of batches
     */
    numberOfBatches?: number;
    /**
     * Product id
     */
    productId?: number;
    /**
     * Product label status
     */
    status?: ApiProductLabelValuesExtended.StatusEnum;
    /**
     * label title
     */
    title?: string;
    /**
     * Number of true 'traceOrigin' fields over all of batches
     */
    traceOriginCount?: number;
    /**
     * Product label uuid (for url)
     */
    uuid?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProductLabelValuesExtended.
 */
export namespace ApiProductLabelValuesExtended {
    /**
     * All properties of ApiProductLabelValuesExtended.
     */
    export enum Properties {
        /**
         * Number of true 'checkAuthenticity' fields over all of batches
         */
        checkAuthenticityCount = 'checkAuthenticityCount',
        /**
         * Fields
         */
        fields = 'fields',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Number of batches
         */
        numberOfBatches = 'numberOfBatches',
        /**
         * Product id
         */
        productId = 'productId',
        /**
         * Product label status
         */
        status = 'status',
        /**
         * label title
         */
        title = 'title',
        /**
         * Number of true 'traceOrigin' fields over all of batches
         */
        traceOriginCount = 'traceOriginCount',
        /**
         * Product label uuid (for url)
         */
        uuid = 'uuid'
    }

    /**
     * All possible values of status.
     */
    export enum StatusEnum {
        UNPUBLISHED = 'UNPUBLISHED',
        PUBLISHED = 'PUBLISHED'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProductLabelValuesExtended',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'checkAuthenticityCount',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiProductLabelFieldValue.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'fields',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'Array&lt;ApiProductLabelFieldValue&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiProductLabelFieldValue'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'numberOfBatches',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'productId',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProductLabelValuesExtended.StatusEnum',
                    required: false,
                    name: 'status',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'title',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'traceOriginCount',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'uuid',
                    classname: 'ApiProductLabelValuesExtended',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                checkAuthenticityCount: [
                ],
                fields: [
                ],
                id: [
                ],
                numberOfBatches: [
                ],
                productId: [
                ],
                status: [
                ],
                title: [
                ],
                traceOriginCount: [
                ],
                uuid: [
                ],
            }
        }
    }

  // export const ApiProductLabelValuesExtendedValidationScheme = {
  //     validators: [],
  //     fields: {
  //               checkAuthenticityCount: {
  //                   validators: []
  //               },
  //               fields: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               numberOfBatches: {
  //                   validators: []
  //               },
  //               productId: {
  //                   validators: []
  //               },
  //               status: {
  //                   validators: []
  //               },
  //               title: {
  //                   validators: []
  //               },
  //               traceOriginCount: {
  //                   validators: []
  //               },
  //               uuid: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProductLabelValuesExtended>;


}


