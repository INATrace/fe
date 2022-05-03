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


import { ApiDocument } from './apiDocument';



export interface ApiBusinessToCustomerSettings { 
    creationTimestamp?: Date;
    font?: ApiDocument;
    footerImage?: ApiDocument;
    headerBackgroundImage?: ApiDocument;
    headerImage?: ApiDocument;
    headingColor?: string;
    /**
     * Entity id
     */
    id?: number;
    primaryColor?: string;
    quaternaryColor?: string;
    secondaryColor?: string;
    tabFairPrices?: boolean;
    tabFeedback?: boolean;
    tabProducers?: boolean;
    tabQuality?: boolean;
    tertiaryColor?: string;
    textColor?: string;
    updateTimestamp?: Date;
}

/**
 * Namespace for property- and property-value-enumerations of ApiBusinessToCustomerSettings.
 */
export namespace ApiBusinessToCustomerSettings {
    /**
     * All properties of ApiBusinessToCustomerSettings.
     */
    export enum Properties {
        creationTimestamp = 'creationTimestamp',
        font = 'font',
        footerImage = 'footerImage',
        headerBackgroundImage = 'headerBackgroundImage',
        headerImage = 'headerImage',
        headingColor = 'headingColor',
        /**
         * Entity id
         */
        id = 'id',
        primaryColor = 'primaryColor',
        quaternaryColor = 'quaternaryColor',
        secondaryColor = 'secondaryColor',
        tabFairPrices = 'tabFairPrices',
        tabFeedback = 'tabFeedback',
        tabProducers = 'tabProducers',
        tabQuality = 'tabQuality',
        tertiaryColor = 'tertiaryColor',
        textColor = 'textColor',
        updateTimestamp = 'updateTimestamp'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiBusinessToCustomerSettings',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'creationTimestamp',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'font',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'footerImage',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'headerBackgroundImage',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'headerImage',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'headingColor',
                    classname: 'ApiBusinessToCustomerSettings',
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
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'primaryColor',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'quaternaryColor',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'secondaryColor',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'tabFairPrices',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'tabFeedback',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'tabProducers',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'tabQuality',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'tertiaryColor',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'textColor',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'updateTimestamp',
                    classname: 'ApiBusinessToCustomerSettings',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                creationTimestamp: [
                ],
                font: [
                ],
                footerImage: [
                ],
                headerBackgroundImage: [
                ],
                headerImage: [
                ],
                headingColor: [
                ],
                id: [
                ],
                primaryColor: [
                ],
                quaternaryColor: [
                ],
                secondaryColor: [
                ],
                tabFairPrices: [
                ],
                tabFeedback: [
                ],
                tabProducers: [
                ],
                tabQuality: [
                ],
                tertiaryColor: [
                ],
                textColor: [
                ],
                updateTimestamp: [
                ],
            }
        }
    }

  // export const ApiBusinessToCustomerSettingsValidationScheme = {
  //     validators: [],
  //     fields: {
  //               creationTimestamp: {
  //                   validators: []
  //               },
  //               font: {
  //                   validators: []
  //               },
  //               footerImage: {
  //                   validators: []
  //               },
  //               headerBackgroundImage: {
  //                   validators: []
  //               },
  //               headerImage: {
  //                   validators: []
  //               },
  //               headingColor: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               primaryColor: {
  //                   validators: []
  //               },
  //               quaternaryColor: {
  //                   validators: []
  //               },
  //               secondaryColor: {
  //                   validators: []
  //               },
  //               tabFairPrices: {
  //                   validators: []
  //               },
  //               tabFeedback: {
  //                   validators: []
  //               },
  //               tabProducers: {
  //                   validators: []
  //               },
  //               tabQuality: {
  //                   validators: []
  //               },
  //               tertiaryColor: {
  //                   validators: []
  //               },
  //               textColor: {
  //                   validators: []
  //               },
  //               updateTimestamp: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiBusinessToCustomerSettings>;


}


