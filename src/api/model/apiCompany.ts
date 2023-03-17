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


import { ApiAddress } from './apiAddress';
import { ApiCertification } from './apiCertification';
import { ApiCompanyDocument } from './apiCompanyDocument';
import { ApiCurrencyType } from './apiCurrencyType';
import { ApiDocument } from './apiDocument';
import { ApiValueChain } from './apiValueChain';



export interface ApiCompany { 
    /**
     * company abbreviation
     */
    abbreviation?: string;
    /**
     * about the company
     */
    about?: string;
    /**
     * Is company allowed to export orders to Beyco platform
     */
    allowBeycoIntegration?: boolean;
    /**
     * company certifications
     */
    certifications?: Array<ApiCertification>;
    currency?: ApiCurrencyType;
    /**
     * Display preferred way of payment on purchase order form
     */
    displayPrefferedWayOfPayment?: boolean;
    /**
     * company documents
     */
    documents?: Array<ApiCompanyDocument>;
    /**
     * email
     */
    email?: string;
    headquarters?: ApiAddress;
    /**
     * Entity id
     */
    id?: number;
    /**
     * interview
     */
    interview?: string;
    logo?: ApiDocument;
    /**
     * name of manager / CEO
     */
    manager?: string;
    /**
     * social media URL links (Facebook, Instagram, Twitter, YouTube, ...)
     */
    mediaLinks?: { [key: string]: string; };
    /**
     * company name
     */
    name?: string;
    /**
     * webpage
     */
    phone?: string;
    /**
     * Enable adding multiple farmers for one proof document on purchase order form
     */
    purchaseProofDocumentMultipleFarmers?: boolean;
    /**
     * company value chains
     */
    valueChains?: Array<ApiValueChain>;
    /**
     * webpage
     */
    webPage?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiCompany.
 */
export namespace ApiCompany {
    /**
     * All properties of ApiCompany.
     */
    export enum Properties {
        /**
         * company abbreviation
         */
        abbreviation = 'abbreviation',
        /**
         * about the company
         */
        about = 'about',
        /**
         * Is company allowed to export orders to Beyco platform
         */
        allowBeycoIntegration = 'allowBeycoIntegration',
        /**
         * company certifications
         */
        certifications = 'certifications',
        currency = 'currency',
        /**
         * Display preferred way of payment on purchase order form
         */
        displayPrefferedWayOfPayment = 'displayPrefferedWayOfPayment',
        /**
         * company documents
         */
        documents = 'documents',
        /**
         * email
         */
        email = 'email',
        headquarters = 'headquarters',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * interview
         */
        interview = 'interview',
        logo = 'logo',
        /**
         * name of manager / CEO
         */
        manager = 'manager',
        /**
         * social media URL links (Facebook, Instagram, Twitter, YouTube, ...)
         */
        mediaLinks = 'mediaLinks',
        /**
         * company name
         */
        name = 'name',
        /**
         * webpage
         */
        phone = 'phone',
        /**
         * Enable adding multiple farmers for one proof document on purchase order form
         */
        purchaseProofDocumentMultipleFarmers = 'purchaseProofDocumentMultipleFarmers',
        /**
         * company value chains
         */
        valueChains = 'valueChains',
        /**
         * webpage
         */
        webPage = 'webPage'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiCompany',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'abbreviation',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'about',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'allowBeycoIntegration',
                    classname: 'ApiCompany',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiCertification.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'certifications',
                    classname: 'ApiCompany',
                    dataType: 'Array&lt;ApiCertification&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiCertification'
                },
                {
                    metadata: ApiCurrencyType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'currency',
                    classname: 'ApiCompany',
                    dataType: 'ApiCurrencyType',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiCurrencyType'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'displayPrefferedWayOfPayment',
                    classname: 'ApiCompany',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiCompanyDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'documents',
                    classname: 'ApiCompany',
                    dataType: 'Array&lt;ApiCompanyDocument&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiCompanyDocument'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'email',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiAddress.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'headquarters',
                    classname: 'ApiCompany',
                    dataType: 'ApiAddress',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiAddress'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiCompany',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'interview',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiDocument.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'logo',
                    classname: 'ApiCompany',
                    dataType: 'ApiDocument',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiDocument'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'manager',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'mediaLinks',
                    classname: 'ApiCompany',
                    dataType: '{ [key: string]: string; }',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'phone',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'purchaseProofDocumentMultipleFarmers',
                    classname: 'ApiCompany',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiValueChain.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'valueChains',
                    classname: 'ApiCompany',
                    dataType: 'Array&lt;ApiValueChain&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiValueChain'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'webPage',
                    classname: 'ApiCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                abbreviation: [
                ],
                about: [
                ],
                allowBeycoIntegration: [
                ],
                certifications: [
                ],
                currency: [
                ],
                displayPrefferedWayOfPayment: [
                ],
                documents: [
                ],
                email: [
                ],
                headquarters: [
                ],
                id: [
                ],
                interview: [
                ],
                logo: [
                ],
                manager: [
                ],
                mediaLinks: [
                ],
                name: [
                ],
                phone: [
                ],
                purchaseProofDocumentMultipleFarmers: [
                ],
                valueChains: [
                ],
                webPage: [
                ],
            }
        }
    }

  // export const ApiCompanyValidationScheme = {
  //     validators: [],
  //     fields: {
  //               abbreviation: {
  //                   validators: []
  //               },
  //               about: {
  //                   validators: []
  //               },
  //               allowBeycoIntegration: {
  //                   validators: []
  //               },
  //               certifications: {
  //                   validators: []
  //               },
  //               currency: {
  //                   validators: []
  //               },
  //               displayPrefferedWayOfPayment: {
  //                   validators: []
  //               },
  //               documents: {
  //                   validators: []
  //               },
  //               email: {
  //                   validators: []
  //               },
  //               headquarters: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               interview: {
  //                   validators: []
  //               },
  //               logo: {
  //                   validators: []
  //               },
  //               manager: {
  //                   validators: []
  //               },
  //               mediaLinks: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               phone: {
  //                   validators: []
  //               },
  //               purchaseProofDocumentMultipleFarmers: {
  //                   validators: []
  //               },
  //               valueChains: {
  //                   validators: []
  //               },
  //               webPage: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiCompany>;


}


