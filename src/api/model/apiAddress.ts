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


import { ApiCountry } from './apiCountry';


/**
 * location address
 */

export interface ApiAddress { 
    /**
     * address
     */
    address?: string;
    /**
     * city
     */
    city?: string;
    /**
     * state / province / region
     */
    state?: string;
    /**
     * ZIP / postal code / p.p. box
     */
    zip?: string;
    /**
     * Village cell
     */
    cell?: string;
    /**
     * Village sector
     */
    sector?: string;
    /**
     * Village name
     */
    village?: string;
    /**
     * Other/additional address field
     */
    otherAddress?: string;
    /**
     * Honduras farm name
     */
    hondurasFarm?: string;
    /**
     * Honduras village name
     */
    hondurasVillage?: string;
    /**
     * Honduras municipality name
     */
    hondurasMunicipality?: string;
    /**
     * Honduras department name
     */
    hondurasDepartment?: string;
    country?: ApiCountry;
}

/**
 * Namespace for property- and property-value-enumerations of ApiAddress.
 */
export namespace ApiAddress {
    /**
     * All properties of ApiAddress.
     */
    export enum Properties {
        /**
         * address
         */
        address = 'address',
        /**
         * city
         */
        city = 'city',
        /**
         * state / province / region
         */
        state = 'state',
        /**
         * ZIP / postal code / p.p. box
         */
        zip = 'zip',
        /**
         * Village cell
         */
        cell = 'cell',
        /**
         * Village sector
         */
        sector = 'sector',
        /**
         * Village name
         */
        village = 'village',
        /**
         * Other/additional address field
         */
        otherAddress = 'otherAddress',
        /**
         * Honduras farm name
         */
        hondurasFarm = 'hondurasFarm',
        /**
         * Honduras village name
         */
        hondurasVillage = 'hondurasVillage',
        /**
         * Honduras municipality name
         */
        hondurasMunicipality = 'hondurasMunicipality',
        /**
         * Honduras department name
         */
        hondurasDepartment = 'hondurasDepartment',
        country = 'country'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiAddress',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'address',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'city',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'state',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'zip',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'cell',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'sector',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'village',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'otherAddress',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'hondurasFarm',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'hondurasVillage',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'hondurasMunicipality',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'hondurasDepartment',
                    classname: 'ApiAddress',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiCountry.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'country',
                    classname: 'ApiAddress',
                    dataType: 'ApiCountry',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiCountry'
                },
            ],
            validators: {
                address: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                city: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                state: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                zip: [
                        ['minlength', 0],
                        ['maxlength', 50],
                ],
                cell: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                sector: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                village: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                otherAddress: [
                        ['minlength', 0],
                        ['maxlength', 1000],
                ],
                hondurasFarm: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                hondurasVillage: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                hondurasMunicipality: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                hondurasDepartment: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                country: [
                ],
            }
        }
    }

  // export const ApiAddressValidationScheme = {
  //     validators: [],
  //     fields: {
  //               address: {
  //                   validators: []
  //               },
  //               city: {
  //                   validators: []
  //               },
  //               state: {
  //                   validators: []
  //               },
  //               zip: {
  //                   validators: []
  //               },
  //               cell: {
  //                   validators: []
  //               },
  //               sector: {
  //                   validators: []
  //               },
  //               village: {
  //                   validators: []
  //               },
  //               otherAddress: {
  //                   validators: []
  //               },
  //               hondurasFarm: {
  //                   validators: []
  //               },
  //               hondurasVillage: {
  //                   validators: []
  //               },
  //               hondurasMunicipality: {
  //                   validators: []
  //               },
  //               hondurasDepartment: {
  //                   validators: []
  //               },
  //               country: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiAddress>;


}


