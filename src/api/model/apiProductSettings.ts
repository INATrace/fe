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


import { ApiDocument } from './apiDocument';


/**
 * settings
 */

export interface ApiProductSettings { 
    /**
     * cost breakdown
     */
    costBreakdown?: boolean;
    /**
     * pricing transparency - string-number map
     */
    pricingTransparency?: { [key: string]: number; };
    incomeIncreaseDocument?: ApiDocument;
    /**
     * increase in income - description
     */
    incomeIncreaseDescription?: string;
    /**
     * language
     */
    language?: ApiProductSettings.LanguageEnum;
    /**
     * GDPR text
     */
    gdprText?: string;
    /**
     * Privacy policy text
     */
    privacyPolicyText?: string;
    /**
     * Terms of use text
     */
    termsOfUseText?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProductSettings.
 */
export namespace ApiProductSettings {
    /**
     * All properties of ApiProductSettings.
     */
    export enum Properties {
        /**
         * cost breakdown
         */
        costBreakdown = 'costBreakdown',
        /**
         * pricing transparency - string-number map
         */
        pricingTransparency = 'pricingTransparency',
        incomeIncreaseDocument = 'incomeIncreaseDocument',
        /**
         * increase in income - description
         */
        incomeIncreaseDescription = 'incomeIncreaseDescription',
        /**
         * language
         */
        language = 'language',
        /**
         * GDPR text
         */
        gdprText = 'gdprText',
        /**
         * Privacy policy text
         */
        privacyPolicyText = 'privacyPolicyText',
        /**
         * Terms of use text
         */
        termsOfUseText = 'termsOfUseText'
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
            classname: 'ApiProductSettings',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'costBreakdown',
                    classname: 'ApiProductSettings',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'pricingTransparency',
                    classname: 'ApiProductSettings',
                    dataType: '{ [key: string]: number; }',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'incomeIncreaseDocument',
                    classname: 'ApiProductSettings',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'incomeIncreaseDescription',
                    classname: 'ApiProductSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProductSettings.LanguageEnum',
                    required: false,
                    name: 'language',
                    classname: 'ApiProductSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'gdprText',
                    classname: 'ApiProductSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'privacyPolicyText',
                    classname: 'ApiProductSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'termsOfUseText',
                    classname: 'ApiProductSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                costBreakdown: [
                ],
                pricingTransparency: [
                ],
                incomeIncreaseDocument: [
                ],
                incomeIncreaseDescription: [
                        ['minlength', 0],
                        ['maxlength', 2000],
                ],
                language: [
                ],
                gdprText: [
                        ['minlength', 0],
                        ['maxlength', 2000],
                ],
                privacyPolicyText: [
                        ['minlength', 0],
                        ['maxlength', 50000],
                ],
                termsOfUseText: [
                        ['minlength', 0],
                        ['maxlength', 50000],
                ],
            }
        }
    }

  // export const ApiProductSettingsValidationScheme = {
  //     validators: [],
  //     fields: {
  //               costBreakdown: {
  //                   validators: []
  //               },
  //               pricingTransparency: {
  //                   validators: []
  //               },
  //               incomeIncreaseDocument: {
  //                   validators: []
  //               },
  //               incomeIncreaseDescription: {
  //                   validators: []
  //               },
  //               language: {
  //                   validators: []
  //               },
  //               gdprText: {
  //                   validators: []
  //               },
  //               privacyPolicyText: {
  //                   validators: []
  //               },
  //               termsOfUseText: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProductSettings>;


}


