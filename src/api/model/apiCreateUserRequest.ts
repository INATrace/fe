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





export interface ApiCreateUserRequest { 
    /**
     * Email (username).
     */
    email: string;
    /**
     * language
     */
    language?: ApiCreateUserRequest.LanguageEnum;
    /**
     * Name.
     */
    name: string;
    /**
     * Password.
     */
    password: string;
    /**
     * Surname.
     */
    surname: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiCreateUserRequest.
 */
export namespace ApiCreateUserRequest {
    /**
     * All properties of ApiCreateUserRequest.
     */
    export enum Properties {
        /**
         * Email (username).
         */
        email = 'email',
        /**
         * language
         */
        language = 'language',
        /**
         * Name.
         */
        name = 'name',
        /**
         * Password.
         */
        password = 'password',
        /**
         * Surname.
         */
        surname = 'surname'
    }

    /**
     * All possible values of language.
     */
    export enum LanguageEnum {
        EN = 'EN',
        DE = 'DE',
        RW = 'RW',
        ES = 'ES'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiCreateUserRequest',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'email',
                    classname: 'ApiCreateUserRequest',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiCreateUserRequest.LanguageEnum',
                    required: false,
                    name: 'language',
                    classname: 'ApiCreateUserRequest',
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
                    classname: 'ApiCreateUserRequest',
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
                    classname: 'ApiCreateUserRequest',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'surname',
                    classname: 'ApiCreateUserRequest',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                email: [
                        ['required'],
                ],
                language: [
                ],
                name: [
                        ['required'],
                ],
                password: [
                        ['required'],
                ],
                surname: [
                        ['required'],
                ],
            }
        }
    }

  // export const ApiCreateUserRequestValidationScheme = {
  //     validators: [],
  //     fields: {
  //               email: {
  //                   validators: []
  //               },
  //               language: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               password: {
  //                   validators: []
  //               },
  //               surname: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiCreateUserRequest>;


}


