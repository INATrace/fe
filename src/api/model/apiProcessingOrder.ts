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


import { ApiProcessingAction } from './apiProcessingAction';
import { ApiStockOrder } from './apiStockOrder';
import { ApiTransaction } from './apiTransaction';



export interface ApiProcessingOrder { 
    /**
     * Timestamp indicates when processing order have been created
     */
    creationTimestamp?: Date;
    /**
     * Entity id
     */
    id?: number;
    /**
     * Initiator user ID
     */
    initiatorUserId?: number;
    /**
     * Input transactions
     */
    inputTransactions?: Array<ApiTransaction>;
    /**
     * Output transactions
     */
    outputTransactions?: Array<ApiTransaction>;
    processingAction?: ApiProcessingAction;
    /**
     * Processing date
     */
    processingDate?: Date;
    /**
     * Target stock orders
     */
    targetStockOrders?: Array<ApiStockOrder>;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProcessingOrder.
 */
export namespace ApiProcessingOrder {
    /**
     * All properties of ApiProcessingOrder.
     */
    export enum Properties {
        /**
         * Timestamp indicates when processing order have been created
         */
        creationTimestamp = 'creationTimestamp',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Initiator user ID
         */
        initiatorUserId = 'initiatorUserId',
        /**
         * Input transactions
         */
        inputTransactions = 'inputTransactions',
        /**
         * Output transactions
         */
        outputTransactions = 'outputTransactions',
        processingAction = 'processingAction',
        /**
         * Processing date
         */
        processingDate = 'processingDate',
        /**
         * Target stock orders
         */
        targetStockOrders = 'targetStockOrders'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProcessingOrder',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'creationTimestamp',
                    classname: 'ApiProcessingOrder',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiProcessingOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'initiatorUserId',
                    classname: 'ApiProcessingOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiTransaction.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'inputTransactions',
                    classname: 'ApiProcessingOrder',
                    dataType: 'Array&lt;ApiTransaction&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiTransaction'
                },
                {
                    metadata: ApiTransaction.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'outputTransactions',
                    classname: 'ApiProcessingOrder',
                    dataType: 'Array&lt;ApiTransaction&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiTransaction'
                },
                {
                    metadata: ApiProcessingAction.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'processingAction',
                    classname: 'ApiProcessingOrder',
                    dataType: 'ApiProcessingAction',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiProcessingAction'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'processingDate',
                    classname: 'ApiProcessingOrder',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiStockOrder.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'targetStockOrders',
                    classname: 'ApiProcessingOrder',
                    dataType: 'Array&lt;ApiStockOrder&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiStockOrder'
                },
            ],
            validators: {
                creationTimestamp: [
                ],
                id: [
                ],
                initiatorUserId: [
                ],
                inputTransactions: [
                ],
                outputTransactions: [
                ],
                processingAction: [
                ],
                processingDate: [
                ],
                targetStockOrders: [
                ],
            }
        }
    }

  // export const ApiProcessingOrderValidationScheme = {
  //     validators: [],
  //     fields: {
  //               creationTimestamp: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               initiatorUserId: {
  //                   validators: []
  //               },
  //               inputTransactions: {
  //                   validators: []
  //               },
  //               outputTransactions: {
  //                   validators: []
  //               },
  //               processingAction: {
  //                   validators: []
  //               },
  //               processingDate: {
  //                   validators: []
  //               },
  //               targetStockOrders: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProcessingOrder>;


}

