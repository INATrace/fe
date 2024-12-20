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





export interface ApiResetPasswordRequest { 
    /**
     * Reset password token.
     */
    token: string;
    /**
     * Password.
     */
    password: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiResetPasswordRequest.
 */
export namespace ApiResetPasswordRequest {
    /**
     * All properties of ApiResetPasswordRequest.
     */
    export enum Properties {
        /**
         * Reset password token.
         */
        token = 'token',
        /**
         * Password.
         */
        password = 'password'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiResetPasswordRequest',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'token',
                    classname: 'ApiResetPasswordRequest',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'password',
                    classname: 'ApiResetPasswordRequest',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                token: [
                        ['required'],
                ],
                password: [
                        ['required'],
                ],
            }
        }
    }

  // export const ApiResetPasswordRequestValidationScheme = {
  //     validators: [],
  //     fields: {
  //               token: {
  //                   validators: []
  //               },
  //               password: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiResetPasswordRequest>;


}


