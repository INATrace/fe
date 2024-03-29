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





export interface ApiSustainability { 
    /**
     * CO2 footprint - If you have calculated your company CO2 footprint, please add this information
     */
    co2Footprint?: string;
    /**
     * sustainable packaging - Describe the environmental sustainability of your packaging, max 1000 chars
     */
    packaging?: string;
    /**
     * environmentally friendly production, max 1000 chars
     */
    production?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiSustainability.
 */
export namespace ApiSustainability {
    /**
     * All properties of ApiSustainability.
     */
    export enum Properties {
        /**
         * CO2 footprint - If you have calculated your company CO2 footprint, please add this information
         */
        co2Footprint = 'co2Footprint',
        /**
         * sustainable packaging - Describe the environmental sustainability of your packaging, max 1000 chars
         */
        packaging = 'packaging',
        /**
         * environmentally friendly production, max 1000 chars
         */
        production = 'production'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiSustainability',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'co2Footprint',
                    classname: 'ApiSustainability',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'packaging',
                    classname: 'ApiSustainability',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'production',
                    classname: 'ApiSustainability',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                co2Footprint: [
                ],
                packaging: [
                ],
                production: [
                ],
            }
        }
    }

  // export const ApiSustainabilityValidationScheme = {
  //     validators: [],
  //     fields: {
  //               co2Footprint: {
  //                   validators: []
  //               },
  //               packaging: {
  //                   validators: []
  //               },
  //               production: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiSustainability>;


}


