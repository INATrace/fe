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


import { ApiProcessingOrder } from './apiProcessingOrder';
import { ApiStockOrder } from './apiStockOrder';
import { ApiStockOrderEvidenceTypeValue } from './apiStockOrderEvidenceTypeValue';



export interface ApiStockOrderHistoryTimelineItem { 
    /**
     * Depth of aggregation history
     */
    depth?: number;
    /**
     * Entity id
     */
    id?: number;
    /**
     * Other processing evidence documents - evidence types that can be provided but are not mandatory
     */
    otherEvidenceDocuments?: Array<ApiStockOrderEvidenceTypeValue>;
    processingOrder?: ApiProcessingOrder;
    /**
     * Aggregated Purchase orders
     */
    purchaseOrders?: Array<ApiStockOrder>;
    /**
     * Processing evidence types stored values for this stock order
     */
    requiredEvidenceDocuments?: Array<ApiStockOrderEvidenceTypeValue>;
    stockOrder?: ApiStockOrder;
}

/**
 * Namespace for property- and property-value-enumerations of ApiStockOrderHistoryTimelineItem.
 */
export namespace ApiStockOrderHistoryTimelineItem {
    /**
     * All properties of ApiStockOrderHistoryTimelineItem.
     */
    export enum Properties {
        /**
         * Depth of aggregation history
         */
        depth = 'depth',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Other processing evidence documents - evidence types that can be provided but are not mandatory
         */
        otherEvidenceDocuments = 'otherEvidenceDocuments',
        processingOrder = 'processingOrder',
        /**
         * Aggregated Purchase orders
         */
        purchaseOrders = 'purchaseOrders',
        /**
         * Processing evidence types stored values for this stock order
         */
        requiredEvidenceDocuments = 'requiredEvidenceDocuments',
        stockOrder = 'stockOrder'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiStockOrderHistoryTimelineItem',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'depth',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiStockOrderEvidenceTypeValue.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'otherEvidenceDocuments',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'Array&lt;ApiStockOrderEvidenceTypeValue&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiStockOrderEvidenceTypeValue'
                },
                {
                    metadata: ApiProcessingOrder.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'processingOrder',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'ApiProcessingOrder',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiProcessingOrder'
                },
                {
                    metadata: ApiStockOrder.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'purchaseOrders',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'Array&lt;ApiStockOrder&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiStockOrder'
                },
                {
                    metadata: ApiStockOrderEvidenceTypeValue.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredEvidenceDocuments',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'Array&lt;ApiStockOrderEvidenceTypeValue&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiStockOrderEvidenceTypeValue'
                },
                {
                    metadata: ApiStockOrder.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'stockOrder',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'ApiStockOrder',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiStockOrder'
                },
            ],
            validators: {
                depth: [
                ],
                id: [
                ],
                otherEvidenceDocuments: [
                ],
                processingOrder: [
                ],
                purchaseOrders: [
                ],
                requiredEvidenceDocuments: [
                ],
                stockOrder: [
                ],
            }
        }
    }

  // export const ApiStockOrderHistoryTimelineItemValidationScheme = {
  //     validators: [],
  //     fields: {
  //               depth: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               otherEvidenceDocuments: {
  //                   validators: []
  //               },
  //               processingOrder: {
  //                   validators: []
  //               },
  //               purchaseOrders: {
  //                   validators: []
  //               },
  //               requiredEvidenceDocuments: {
  //                   validators: []
  //               },
  //               stockOrder: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiStockOrderHistoryTimelineItem>;


}


