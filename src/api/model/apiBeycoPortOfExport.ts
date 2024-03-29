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





export interface ApiBeycoPortOfExport { 
    /**
     * Address of facility
     */
    address?: string;
    /**
     * Country of facility
     */
    country?: string;
    /**
     * Latitude of facility
     */
    latitude?: number;
    /**
     * Longitude of facility
     */
    longitude?: number;
}

/**
 * Namespace for property- and property-value-enumerations of ApiBeycoPortOfExport.
 */
export namespace ApiBeycoPortOfExport {
    /**
     * All properties of ApiBeycoPortOfExport.
     */
    export enum Properties {
        /**
         * Address of facility
         */
        address = 'address',
        /**
         * Country of facility
         */
        country = 'country',
        /**
         * Latitude of facility
         */
        latitude = 'latitude',
        /**
         * Longitude of facility
         */
        longitude = 'longitude'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiBeycoPortOfExport',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'address',
                    classname: 'ApiBeycoPortOfExport',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'country',
                    classname: 'ApiBeycoPortOfExport',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'latitude',
                    classname: 'ApiBeycoPortOfExport',
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
                    classname: 'ApiBeycoPortOfExport',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                address: [
                ],
                country: [
                ],
                latitude: [
                ],
                longitude: [
                ],
            }
        }
    }

  // export const ApiBeycoPortOfExportValidationScheme = {
  //     validators: [],
  //     fields: {
  //               address: {
  //                   validators: []
  //               },
  //               country: {
  //                   validators: []
  //               },
  //               latitude: {
  //                   validators: []
  //               },
  //               longitude: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiBeycoPortOfExport>;


}


