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





export interface ApiSemiProductTranslation { 
    /**
     * Entity id
     */
    id?: number;
    /**
     * Semi product name
     */
    name?: string;
    /**
     * Semi product description
     */
    description?: string;
    /**
     * Semi product language
     */
    language?: ApiSemiProductTranslation.LanguageEnum;
}

/**
 * Namespace for property- and property-value-enumerations of ApiSemiProductTranslation.
 */
export namespace ApiSemiProductTranslation {
    /**
     * All properties of ApiSemiProductTranslation.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Semi product name
         */
        name = 'name',
        /**
         * Semi product description
         */
        description = 'description',
        /**
         * Semi product language
         */
        language = 'language'
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


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiSemiProductTranslation',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiSemiProductTranslation',
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
                    classname: 'ApiSemiProductTranslation',
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
                    classname: 'ApiSemiProductTranslation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiSemiProductTranslation.LanguageEnum',
                    required: false,
                    name: 'language',
                    classname: 'ApiSemiProductTranslation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                id: [
                ],
                name: [
                ],
                description: [
                ],
                language: [
                ],
            }
        }
    }

  // export const ApiSemiProductTranslationValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               description: {
  //                   validators: []
  //               },
  //               language: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiSemiProductTranslation>;


}


