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
import { PaginatedListChainMeasureUnitType } from './paginatedListChainMeasureUnitType';



export interface ApiResponsePaginatedListChainMeasureUnitType { 
    data?: PaginatedListChainMeasureUnitType;
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
    status: ApiResponsePaginatedListChainMeasureUnitType.StatusEnum;
    validationErrorDetails?: ApiValidationErrorDetails;
}

/**
 * Namespace for property- and property-value-enumerations of ApiResponsePaginatedListChainMeasureUnitType.
 */
export namespace ApiResponsePaginatedListChainMeasureUnitType {
    /**
     * All properties of ApiResponsePaginatedListChainMeasureUnitType.
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
            classname: 'ApiResponsePaginatedListChainMeasureUnitType',
            vars: [
                {
                    metadata: PaginatedListChainMeasureUnitType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'data',
                    classname: 'ApiResponsePaginatedListChainMeasureUnitType',
                    dataType: 'PaginatedListChainMeasureUnitType',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'PaginatedListChainMeasureUnitType'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'errorDetails',
                    classname: 'ApiResponsePaginatedListChainMeasureUnitType',
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
                    classname: 'ApiResponsePaginatedListChainMeasureUnitType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiResponsePaginatedListChainMeasureUnitType.StatusEnum',
                    required: true,
                    name: 'status',
                    classname: 'ApiResponsePaginatedListChainMeasureUnitType',
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
                    classname: 'ApiResponsePaginatedListChainMeasureUnitType',
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

  // export const ApiResponsePaginatedListChainMeasureUnitTypeValidationScheme = {
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
  // } as SimpleValidationScheme<ApiResponsePaginatedListChainMeasureUnitType>;


}


