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


import { ApiProductLabelFieldValue } from './apiProductLabelFieldValue';



export interface ApiProductLabelValues { 
    /**
     * Fields
     */
    fields?: Array<ApiProductLabelFieldValue>;
    /**
     * Entity id
     */
    id?: number;
    /**
     * Label language
     */
    language?: ApiProductLabelValues.LanguageEnum;
    /**
     * Product id
     */
    productId?: number;
    /**
     * Product label status
     */
    status?: ApiProductLabelValues.StatusEnum;
    /**
     * label title
     */
    title?: string;
    /**
     * Product label uuid (for url)
     */
    uuid?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProductLabelValues.
 */
export namespace ApiProductLabelValues {
    /**
     * All properties of ApiProductLabelValues.
     */
    export enum Properties {
        /**
         * Fields
         */
        fields = 'fields',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Label language
         */
        language = 'language',
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
         * Product label uuid (for url)
         */
        uuid = 'uuid'
    }

    /**
     * All possible values of language.
     */
    export enum LanguageEnum {
        EN = 'EN',
        DE = 'DE',
        RW = 'RW',
        ES = 'ES'
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
            classname: 'ApiProductLabelValues',
            vars: [
                {
                    metadata: ApiProductLabelFieldValue.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'fields',
                    classname: 'ApiProductLabelValues',
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
                    classname: 'ApiProductLabelValues',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProductLabelValues.LanguageEnum',
                    required: false,
                    name: 'language',
                    classname: 'ApiProductLabelValues',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'productId',
                    classname: 'ApiProductLabelValues',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProductLabelValues.StatusEnum',
                    required: false,
                    name: 'status',
                    classname: 'ApiProductLabelValues',
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
                    classname: 'ApiProductLabelValues',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'uuid',
                    classname: 'ApiProductLabelValues',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                fields: [
                ],
                id: [
                ],
                language: [
                ],
                productId: [
                ],
                status: [
                ],
                title: [
                ],
                uuid: [
                ],
            }
        }
    }

  // export const ApiProductLabelValuesValidationScheme = {
  //     validators: [],
  //     fields: {
  //               fields: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               language: {
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
  //               uuid: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProductLabelValues>;


}


