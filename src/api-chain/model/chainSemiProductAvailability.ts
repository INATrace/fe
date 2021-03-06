/*
 * Copyright(c) 2009 - 2019 Abelium d.o.o.
 * Kajuhova 90, 1000 Ljubljana, Slovenia
 * All rights reserved
 * Copyright(c) 1995 - 2018 T-Systems Multimedia Solutions GmbH
 * Riesaer Str. 5, 01129 Dresden
 * All rights reserved.
 *
 * coffee-be
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the openapi-typescript-angular-generator.
 * https://github.com/alenabelium/openapi-typescript-angular-generator
 * Do not edit the class manually.
 */





export interface ChainSemiProductAvailability { 
    facilityId: string;
    semiProductId: string;
    availableQuantity: number;
}

/**
 * Namespace for property- and property-value-enumerations of ChainSemiProductAvailability.
 */
export namespace ChainSemiProductAvailability {
    /**
     * All properties of ChainSemiProductAvailability.
     */
    export enum Properties {
        facilityId = 'facilityId',
        semiProductId = 'semiProductId',
        availableQuantity = 'availableQuantity'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ChainSemiProductAvailability',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'facilityId',
                    classname: 'ChainSemiProductAvailability',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'semiProductId',
                    classname: 'ChainSemiProductAvailability',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'availableQuantity',
                    classname: 'ChainSemiProductAvailability',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                facilityId: [
                        ['required'],
                ],
                semiProductId: [
                        ['required'],
                ],
                availableQuantity: [
                        ['required'],
                ],
            }
        }
    }

  // export const ChainSemiProductAvailabilityValidationScheme = {
  //     validators: [],
  //     fields: {
  //               facilityId: {
  //                   validators: []
  //               },
  //               semiProductId: {
  //                   validators: []
  //               },
  //               availableQuantity: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ChainSemiProductAvailability>;


}


