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


import { ApiProductTypeTranslation } from './apiProductTypeTranslation';


/**
 * Selected product type
 */

export interface ApiProductType { 
    /**
     * Entity id
     */
    id?: number;
    creationTimestamp?: Date;
    updateTimestamp?: Date;
    name?: string;
    code?: string;
    description?: string;
    translations?: Array<ApiProductTypeTranslation>;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProductType.
 */
export namespace ApiProductType {
    /**
     * All properties of ApiProductType.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        creationTimestamp = 'creationTimestamp',
        updateTimestamp = 'updateTimestamp',
        name = 'name',
        code = 'code',
        description = 'description',
        translations = 'translations'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProductType',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiProductType',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'creationTimestamp',
                    classname: 'ApiProductType',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'updateTimestamp',
                    classname: 'ApiProductType',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiProductType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'code',
                    classname: 'ApiProductType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'description',
                    classname: 'ApiProductType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiProductTypeTranslation.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'translations',
                    classname: 'ApiProductType',
                    dataType: 'Array&lt;ApiProductTypeTranslation&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiProductTypeTranslation'
                },
            ],
            validators: {
                id: [
                ],
                creationTimestamp: [
                ],
                updateTimestamp: [
                ],
                name: [
                ],
                code: [
                ],
                description: [
                ],
                translations: [
                ],
            }
        }
    }

  // export const ApiProductTypeValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               creationTimestamp: {
  //                   validators: []
  //               },
  //               updateTimestamp: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               code: {
  //                   validators: []
  //               },
  //               description: {
  //                   validators: []
  //               },
  //               translations: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProductType>;


}


