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





export interface ApiCreateUserRequest { 
    /**
     * Email (username).
     */
    email: string;
    /**
     * Password.
     */
    password: string;
    /**
     * Name.
     */
    name: string;
    /**
     * Surname.
     */
    surname: string;
    /**
     * language
     */
    language?: ApiCreateUserRequest.LanguageEnum;
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
         * Password.
         */
        password = 'password',
        /**
         * Name.
         */
        name = 'name',
        /**
         * Surname.
         */
        surname = 'surname',
        /**
         * language
         */
        language = 'language'
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
                    name: 'surname',
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
            ],
            validators: {
                email: [
                        ['required'],
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                password: [
                        ['required'],
                        ['minlength', 0],
                        ['maxlength', 100],
                ],
                name: [
                        ['required'],
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                surname: [
                        ['required'],
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                language: [
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
  //               password: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               surname: {
  //                   validators: []
  //               },
  //               language: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiCreateUserRequest>;


}


