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
 * Optional details for validation error responses.
 */

export interface ApiValidationErrorDetails { 
    className?: string;
    fieldErrors?: { [key: string]: string; };
}

/**
 * Namespace for property- and property-value-enumerations of ApiValidationErrorDetails.
 */
export namespace ApiValidationErrorDetails {
    /**
     * All properties of ApiValidationErrorDetails.
     */
    export enum Properties {
        className = 'className',
        fieldErrors = 'fieldErrors'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiValidationErrorDetails',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'className',
                    classname: 'ApiValidationErrorDetails',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'fieldErrors',
                    classname: 'ApiValidationErrorDetails',
                    dataType: '{ [key: string]: string; }',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                className: [
                ],
                fieldErrors: [
                ],
            }
        }
    }

  // export const ApiValidationErrorDetailsValidationScheme = {
  //     validators: [],
  //     fields: {
  //               className: {
  //                   validators: []
  //               },
  //               fieldErrors: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiValidationErrorDetails>;


}


