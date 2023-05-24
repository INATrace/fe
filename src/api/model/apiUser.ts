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





export interface ApiUser { 
    /**
     * Email/username
     */
    email?: string;
    /**
     * Entity id
     */
    id?: number;
    /**
     * language
     */
    language?: ApiUser.LanguageEnum;
    /**
     * Name
     */
    name?: string;
    /**
     * User role
     */
    role?: ApiUser.RoleEnum;
    /**
     * Status
     */
    status?: ApiUser.StatusEnum;
    /**
     * Surname
     */
    surname?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiUser.
 */
export namespace ApiUser {
    /**
     * All properties of ApiUser.
     */
    export enum Properties {
        /**
         * Email/username
         */
        email = 'email',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * language
         */
        language = 'language',
        /**
         * Name
         */
        name = 'name',
        /**
         * User role
         */
        role = 'role',
        /**
         * Status
         */
        status = 'status',
        /**
         * Surname
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

    /**
     * All possible values of role.
     */
    export enum RoleEnum {
        USER = 'USER',
        ADMIN = 'ADMIN'
    }

    /**
     * All possible values of status.
     */
    export enum StatusEnum {
        UNCONFIRMED = 'UNCONFIRMED',
        CONFIRMEDEMAIL = 'CONFIRMED_EMAIL',
        ACTIVE = 'ACTIVE',
        DEACTIVATED = 'DEACTIVATED'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiUser',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'email',
                    classname: 'ApiUser',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiUser',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiUser.LanguageEnum',
                    required: false,
                    name: 'language',
                    classname: 'ApiUser',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiUser',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiUser.RoleEnum',
                    required: false,
                    name: 'role',
                    classname: 'ApiUser',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiUser.StatusEnum',
                    required: false,
                    name: 'status',
                    classname: 'ApiUser',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'surname',
                    classname: 'ApiUser',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                email: [
                ],
                id: [
                ],
                language: [
                ],
                name: [
                ],
                role: [
                ],
                status: [
                ],
                surname: [
                ],
            }
        }
    }

  // export const ApiUserValidationScheme = {
  //     validators: [],
  //     fields: {
  //               email: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               language: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               role: {
  //                   validators: []
  //               },
  //               status: {
  //                   validators: []
  //               },
  //               surname: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiUser>;


}


