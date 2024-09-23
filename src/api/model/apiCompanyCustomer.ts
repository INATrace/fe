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


import { ApiGeoAddress } from './apiGeoAddress';



export interface ApiCompanyCustomer { 
    /**
     * Entity id
     */
    id?: number;
    /**
     * Company id
     */
    companyId?: number;
    /**
     * Name
     */
    name?: string;
    /**
     * Official company name
     */
    officialCompanyName?: string;
    /**
     * Vat id
     */
    vatId?: string;
    /**
     * Contact
     */
    contact?: string;
    /**
     * Phone
     */
    phone?: string;
    /**
     * Email
     */
    email?: string;
    location?: ApiGeoAddress;
}

/**
 * Namespace for property- and property-value-enumerations of ApiCompanyCustomer.
 */
export namespace ApiCompanyCustomer {
    /**
     * All properties of ApiCompanyCustomer.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Company id
         */
        companyId = 'companyId',
        /**
         * Name
         */
        name = 'name',
        /**
         * Official company name
         */
        officialCompanyName = 'officialCompanyName',
        /**
         * Vat id
         */
        vatId = 'vatId',
        /**
         * Contact
         */
        contact = 'contact',
        /**
         * Phone
         */
        phone = 'phone',
        /**
         * Email
         */
        email = 'email',
        location = 'location'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiCompanyCustomer',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiCompanyCustomer',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'companyId',
                    classname: 'ApiCompanyCustomer',
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
                    classname: 'ApiCompanyCustomer',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'officialCompanyName',
                    classname: 'ApiCompanyCustomer',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'vatId',
                    classname: 'ApiCompanyCustomer',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'contact',
                    classname: 'ApiCompanyCustomer',
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
                    classname: 'ApiCompanyCustomer',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'email',
                    classname: 'ApiCompanyCustomer',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiGeoAddress.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'location',
                    classname: 'ApiCompanyCustomer',
                    dataType: 'ApiGeoAddress',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiGeoAddress'
                },
            ],
            validators: {
                id: [
                ],
                companyId: [
                ],
                name: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                officialCompanyName: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                vatId: [
                        ['minlength', 0],
                        ['maxlength', 40],
                ],
                contact: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                phone: [
                        ['minlength', 0],
                        ['maxlength', 20],
                ],
                email: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                location: [
                ],
            }
        }
    }

  // export const ApiCompanyCustomerValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               companyId: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               officialCompanyName: {
  //                   validators: []
  //               },
  //               vatId: {
  //                   validators: []
  //               },
  //               contact: {
  //                   validators: []
  //               },
  //               phone: {
  //                   validators: []
  //               },
  //               email: {
  //                   validators: []
  //               },
  //               location: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiCompanyCustomer>;


}


