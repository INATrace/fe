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





export interface ApiFileInfo { 
    /**
     * File info content type
     */
    contentType?: string;
    /**
     * Entity id
     */
    id?: number;
    /**
     * File info name
     */
    name?: string;
    /**
     * File info size
     */
    size?: number;
    /**
     * File info storage key
     */
    storageKey?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiFileInfo.
 */
export namespace ApiFileInfo {
    /**
     * All properties of ApiFileInfo.
     */
    export enum Properties {
        /**
         * File info content type
         */
        contentType = 'contentType',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * File info name
         */
        name = 'name',
        /**
         * File info size
         */
        size = 'size',
        /**
         * File info storage key
         */
        storageKey = 'storageKey'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiFileInfo',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'contentType',
                    classname: 'ApiFileInfo',
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
                    classname: 'ApiFileInfo',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiFileInfo',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'size',
                    classname: 'ApiFileInfo',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'storageKey',
                    classname: 'ApiFileInfo',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                contentType: [
                ],
                id: [
                ],
                name: [
                ],
                size: [
                ],
                storageKey: [
                ],
            }
        }
    }

  // export const ApiFileInfoValidationScheme = {
  //     validators: [],
  //     fields: {
  //               contentType: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               size: {
  //                   validators: []
  //               },
  //               storageKey: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiFileInfo>;


}

