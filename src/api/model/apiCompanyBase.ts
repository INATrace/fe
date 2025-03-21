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


import { ApiAddress } from './apiAddress';


/**
 * Company that receives the payment
 */

export interface ApiCompanyBase { 
    /**
     * Entity id
     */
    id?: number;
    /**
     * company name
     */
    name?: string;
    /**
     * company abbreviation
     */
    abbreviation?: string;
    headquarters?: ApiAddress;
    /**
     * about the company
     */
    about?: string;
    /**
     * name of manager / CEO
     */
    manager?: string;
    /**
     * webpage
     */
    webPage?: string;
    /**
     * Display preferred way of payment on purchase order form
     */
    displayPrefferedWayOfPayment?: boolean;
    /**
     * Enable adding multiple farmers for one proof document on purchase order form
     */
    purchaseProofDocumentMultipleFarmers?: boolean;
    /**
     * email
     */
    email?: string;
    /**
     * webpage
     */
    phone?: string;
    /**
     * social media URL links (Facebook, Instagram, Twitter, YouTube, ...)
     */
    mediaLinks?: { [key: string]: string; };
}

/**
 * Namespace for property- and property-value-enumerations of ApiCompanyBase.
 */
export namespace ApiCompanyBase {
    /**
     * All properties of ApiCompanyBase.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        /**
         * company name
         */
        name = 'name',
        /**
         * company abbreviation
         */
        abbreviation = 'abbreviation',
        headquarters = 'headquarters',
        /**
         * about the company
         */
        about = 'about',
        /**
         * name of manager / CEO
         */
        manager = 'manager',
        /**
         * webpage
         */
        webPage = 'webPage',
        /**
         * Display preferred way of payment on purchase order form
         */
        displayPrefferedWayOfPayment = 'displayPrefferedWayOfPayment',
        /**
         * Enable adding multiple farmers for one proof document on purchase order form
         */
        purchaseProofDocumentMultipleFarmers = 'purchaseProofDocumentMultipleFarmers',
        /**
         * email
         */
        email = 'email',
        /**
         * webpage
         */
        phone = 'phone',
        /**
         * social media URL links (Facebook, Instagram, Twitter, YouTube, ...)
         */
        mediaLinks = 'mediaLinks'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiCompanyBase',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiCompanyBase',
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
                    classname: 'ApiCompanyBase',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'abbreviation',
                    classname: 'ApiCompanyBase',
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
                    classname: 'ApiCompanyBase',
                    dataType: 'ApiAddress',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiAddress'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'about',
                    classname: 'ApiCompanyBase',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'manager',
                    classname: 'ApiCompanyBase',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'webPage',
                    classname: 'ApiCompanyBase',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'displayPrefferedWayOfPayment',
                    classname: 'ApiCompanyBase',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'purchaseProofDocumentMultipleFarmers',
                    classname: 'ApiCompanyBase',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'email',
                    classname: 'ApiCompanyBase',
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
                    classname: 'ApiCompanyBase',
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
                    classname: 'ApiCompanyBase',
                    dataType: '{ [key: string]: string; }',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                id: [
                ],
                name: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                abbreviation: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                headquarters: [
                ],
                about: [
                        ['minlength', 0],
                        ['maxlength', 2000],
                ],
                manager: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                webPage: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                displayPrefferedWayOfPayment: [
                ],
                purchaseProofDocumentMultipleFarmers: [
                ],
                email: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                phone: [
                        ['minlength', 0],
                        ['maxlength', 20],
                ],
                mediaLinks: [
                ],
            }
        }
    }

  // export const ApiCompanyBaseValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               abbreviation: {
  //                   validators: []
  //               },
  //               headquarters: {
  //                   validators: []
  //               },
  //               about: {
  //                   validators: []
  //               },
  //               manager: {
  //                   validators: []
  //               },
  //               webPage: {
  //                   validators: []
  //               },
  //               displayPrefferedWayOfPayment: {
  //                   validators: []
  //               },
  //               purchaseProofDocumentMultipleFarmers: {
  //                   validators: []
  //               },
  //               email: {
  //                   validators: []
  //               },
  //               phone: {
  //                   validators: []
  //               },
  //               mediaLinks: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiCompanyBase>;


}


