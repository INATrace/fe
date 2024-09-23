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


import { ApiPaginatedListApiValueChain } from './apiPaginatedListApiValueChain';
import { ApiValidationErrorDetails } from './apiValidationErrorDetails';



export interface ApiPaginatedResponseApiValueChain { 
    /**
     * Response status. OK for successful reponses.
     */
    status: ApiPaginatedResponseApiValueChain.StatusEnum;
    /**
     * Simple message to explain client developers the reason for error.
     */
    errorMessage?: string;
    data?: ApiPaginatedListApiValueChain;
    /**
     * Optional details for unexpected error responses.
     */
    errorDetails?: string;
    validationErrorDetails?: ApiValidationErrorDetails;
}

/**
 * Namespace for property- and property-value-enumerations of ApiPaginatedResponseApiValueChain.
 */
export namespace ApiPaginatedResponseApiValueChain {
    /**
     * All properties of ApiPaginatedResponseApiValueChain.
     */
    export enum Properties {
        /**
         * Response status. OK for successful reponses.
         */
        status = 'status',
        /**
         * Simple message to explain client developers the reason for error.
         */
        errorMessage = 'errorMessage',
        data = 'data',
        /**
         * Optional details for unexpected error responses.
         */
        errorDetails = 'errorDetails',
        validationErrorDetails = 'validationErrorDetails'
    }

    /**
     * All possible values of status.
     */
    export enum StatusEnum {
        OK = 'OK',
        ERROR = 'ERROR',
        REQUESTBODYERROR = 'REQUEST_BODY_ERROR',
        VALIDATIONERROR = 'VALIDATION_ERROR',
        TOOMANYREQUESTS = 'TOO_MANY_REQUESTS',
        UNAUTHORIZED = 'UNAUTHORIZED',
        AUTHERROR = 'AUTH_ERROR',
        UPSTREAMHTTPERROR = 'UPSTREAM_HTTP_ERROR',
        INVALIDREQUEST = 'INVALID_REQUEST',
        INVALIDOREXPIREDSTORAGEKEY = 'INVALID_OR_EXPIRED_STORAGE_KEY',
        NOTIMPLEMENTED = 'NOT_IMPLEMENTED',
        NOTFOUND = 'NOT_FOUND'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiPaginatedResponseApiValueChain',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiPaginatedResponseApiValueChain.StatusEnum',
                    required: true,
                    name: 'status',
                    classname: 'ApiPaginatedResponseApiValueChain',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'errorMessage',
                    classname: 'ApiPaginatedResponseApiValueChain',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiPaginatedListApiValueChain.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'data',
                    classname: 'ApiPaginatedResponseApiValueChain',
                    dataType: 'ApiPaginatedListApiValueChain',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiPaginatedListApiValueChain'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'errorDetails',
                    classname: 'ApiPaginatedResponseApiValueChain',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiValidationErrorDetails.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'validationErrorDetails',
                    classname: 'ApiPaginatedResponseApiValueChain',
                    dataType: 'ApiValidationErrorDetails',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiValidationErrorDetails'
                },
            ],
            validators: {
                status: [
                        ['required'],
                ],
                errorMessage: [
                ],
                data: [
                ],
                errorDetails: [
                ],
                validationErrorDetails: [
                ],
            }
        }
    }

  // export const ApiPaginatedResponseApiValueChainValidationScheme = {
  //     validators: [],
  //     fields: {
  //               status: {
  //                   validators: []
  //               },
  //               errorMessage: {
  //                   validators: []
  //               },
  //               data: {
  //                   validators: []
  //               },
  //               errorDetails: {
  //                   validators: []
  //               },
  //               validationErrorDetails: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiPaginatedResponseApiValueChain>;


}


