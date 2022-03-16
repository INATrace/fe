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



export interface ApiFacilityLocation { 
    address?: ApiAddress;
    /**
     * location latitude
     */
    latitude?: number;
    /**
     * location longitude
     */
    longitude?: number;
    /**
     * number of farmers at this location
     */
    numberOfFarmers?: number;
    /**
     * pin (location) name
     */
    pinName?: string;
    publiclyVisible?: boolean;
}

/**
 * Namespace for property- and property-value-enumerations of ApiFacilityLocation.
 */
export namespace ApiFacilityLocation {
    /**
     * All properties of ApiFacilityLocation.
     */
    export enum Properties {
        address = 'address',
        /**
         * location latitude
         */
        latitude = 'latitude',
        /**
         * location longitude
         */
        longitude = 'longitude',
        /**
         * number of farmers at this location
         */
        numberOfFarmers = 'numberOfFarmers',
        /**
         * pin (location) name
         */
        pinName = 'pinName',
        publiclyVisible = 'publiclyVisible'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiFacilityLocation',
            vars: [
                {
                    metadata: ApiAddress.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'address',
                    classname: 'ApiFacilityLocation',
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
                    classname: 'ApiFacilityLocation',
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
                    classname: 'ApiFacilityLocation',
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
                    classname: 'ApiFacilityLocation',
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
                    classname: 'ApiFacilityLocation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'publiclyVisible',
                    classname: 'ApiFacilityLocation',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
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
                publiclyVisible: [
                ],
            }
        }
    }

  // export const ApiFacilityLocationValidationScheme = {
  //     validators: [],
  //     fields: {
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
  //               publiclyVisible: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiFacilityLocation>;


}

