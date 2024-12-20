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




/**
 * Translations for processing evidence type
 */

export interface ApiProcessingEvidenceTypeTranslation { 
    /**
     * Entity id
     */
    id?: number;
    /**
     * Processing evidence type label
     */
    label?: string;
    /**
     * Processing evidence type language
     */
    language?: ApiProcessingEvidenceTypeTranslation.LanguageEnum;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProcessingEvidenceTypeTranslation.
 */
export namespace ApiProcessingEvidenceTypeTranslation {
    /**
     * All properties of ApiProcessingEvidenceTypeTranslation.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Processing evidence type label
         */
        label = 'label',
        /**
         * Processing evidence type language
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
            classname: 'ApiProcessingEvidenceTypeTranslation',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiProcessingEvidenceTypeTranslation',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'label',
                    classname: 'ApiProcessingEvidenceTypeTranslation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProcessingEvidenceTypeTranslation.LanguageEnum',
                    required: false,
                    name: 'language',
                    classname: 'ApiProcessingEvidenceTypeTranslation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                id: [
                ],
                label: [
                ],
                language: [
                ],
            }
        }
    }

  // export const ApiProcessingEvidenceTypeTranslationValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               label: {
  //                   validators: []
  //               },
  //               language: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProcessingEvidenceTypeTranslation>;


}


