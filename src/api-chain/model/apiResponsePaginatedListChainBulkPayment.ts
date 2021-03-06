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


import { ApiValidationErrorDetails } from './apiValidationErrorDetails';
import { PaginatedListChainBulkPayment } from './paginatedListChainBulkPayment';



export interface ApiResponsePaginatedListChainBulkPayment { 
    data?: PaginatedListChainBulkPayment;
    /**
     * Optional details for unexpected error responses.
     */
    errorDetails?: string;
    /**
     * Simple message to explain client developers the reason for error.
     */
    errorMessage?: string;
    /**
     * All possible values of status.
     */
    status: ApiResponsePaginatedListChainBulkPayment.StatusEnum;
    validationErrorDetails?: ApiValidationErrorDetails;
}

/**
 * Namespace for property- and property-value-enumerations of ApiResponsePaginatedListChainBulkPayment.
 */
export namespace ApiResponsePaginatedListChainBulkPayment {
    /**
     * All properties of ApiResponsePaginatedListChainBulkPayment.
     */
    export enum Properties {
        data = 'data',
        /**
         * Optional details for unexpected error responses.
         */
        errorDetails = 'errorDetails',
        /**
         * Simple message to explain client developers the reason for error.
         */
        errorMessage = 'errorMessage',
        /**
         * All possible values of status.
         */
        status = 'status',
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
        NOTIMPLEMENTED = 'NOT_IMPLEMENTED'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiResponsePaginatedListChainBulkPayment',
            vars: [
                {
                    metadata: PaginatedListChainBulkPayment.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'data',
                    classname: 'ApiResponsePaginatedListChainBulkPayment',
                    dataType: 'PaginatedListChainBulkPayment',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'PaginatedListChainBulkPayment'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'errorDetails',
                    classname: 'ApiResponsePaginatedListChainBulkPayment',
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
                    classname: 'ApiResponsePaginatedListChainBulkPayment',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiResponsePaginatedListChainBulkPayment.StatusEnum',
                    required: true,
                    name: 'status',
                    classname: 'ApiResponsePaginatedListChainBulkPayment',
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
                    classname: 'ApiResponsePaginatedListChainBulkPayment',
                    dataType: 'ApiValidationErrorDetails',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiValidationErrorDetails'
                },
            ],
            validators: {
                data: [
                ],
                errorDetails: [
                ],
                errorMessage: [
                ],
                status: [
                        ['required'],
                ],
                validationErrorDetails: [
                ],
            }
        }
    }

  // export const ApiResponsePaginatedListChainBulkPaymentValidationScheme = {
  //     validators: [],
  //     fields: {
  //               data: {
  //                   validators: []
  //               },
  //               errorDetails: {
  //                   validators: []
  //               },
  //               errorMessage: {
  //                   validators: []
  //               },
  //               status: {
  //                   validators: []
  //               },
  //               validationErrorDetails: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiResponsePaginatedListChainBulkPayment>;


}


