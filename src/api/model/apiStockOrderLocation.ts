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
 * Production location
 */

export interface ApiStockOrderLocation { 
    /**
     * Entity id
     */
    id?: number;
    address?: ApiAddress;
    /**
     * Location latitude
     */
    latitude?: number;
    /**
     * Location longitude
     */
    longitude?: number;
    /**
     * Number of frames
     */
    numberOfFarmers?: number;
    /**
     * Pin name
     */
    pinName?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiStockOrderLocation.
 */
export namespace ApiStockOrderLocation {
    /**
     * All properties of ApiStockOrderLocation.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        address = 'address',
        /**
         * Location latitude
         */
        latitude = 'latitude',
        /**
         * Location longitude
         */
        longitude = 'longitude',
        /**
         * Number of frames
         */
        numberOfFarmers = 'numberOfFarmers',
        /**
         * Pin name
         */
        pinName = 'pinName'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiStockOrderLocation',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiStockOrderLocation',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiAddress.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'address',
                    classname: 'ApiStockOrderLocation',
                    dataType: 'ApiAddress',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiAddress'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'latitude',
                    classname: 'ApiStockOrderLocation',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'longitude',
                    classname: 'ApiStockOrderLocation',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'numberOfFarmers',
                    classname: 'ApiStockOrderLocation',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'pinName',
                    classname: 'ApiStockOrderLocation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                id: [
                ],
                address: [
                ],
                latitude: [
                ],
                longitude: [
                ],
                numberOfFarmers: [
                ],
                pinName: [
                ],
            }
        }
    }

  // export const ApiStockOrderLocationValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               address: {
  //                   validators: []
  //               },
  //               latitude: {
  //                   validators: []
  //               },
  //               longitude: {
  //                   validators: []
  //               },
  //               numberOfFarmers: {
  //                   validators: []
  //               },
  //               pinName: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiStockOrderLocation>;


}


