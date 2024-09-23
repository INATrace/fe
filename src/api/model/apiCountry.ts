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




/**
 * country
 */

export interface ApiCountry { 
    /**
     * Db id.
     */
    id: number;
    /**
     * Two letter country code of country (ISO 3166-1 alpha-2 code).
     */
    code: string;
    /**
     * Country name.
     */
    name: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiCountry.
 */
export namespace ApiCountry {
    /**
     * All properties of ApiCountry.
     */
    export enum Properties {
        /**
         * Db id.
         */
        id = 'id',
        /**
         * Two letter country code of country (ISO 3166-1 alpha-2 code).
         */
        code = 'code',
        /**
         * Country name.
         */
        name = 'name'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiCountry',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'id',
                    classname: 'ApiCountry',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'code',
                    classname: 'ApiCountry',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'name',
                    classname: 'ApiCountry',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                id: [
                        ['required'],
                ],
                code: [
                        ['required'],
                        ['minlength', 0],
                        ['maxlength', 3],
                ],
                name: [
                        ['required'],
                        ['minlength', 0],
                        ['maxlength', 100],
                ],
            }
        }
    }

  // export const ApiCountryValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               code: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiCountry>;


}


