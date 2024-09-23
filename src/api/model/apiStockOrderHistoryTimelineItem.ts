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


import { ApiProcessingOrder } from './apiProcessingOrder';
import { ApiStockOrder } from './apiStockOrder';
import { ApiStockOrderEvidenceTypeValue } from './apiStockOrderEvidenceTypeValue';


/**
 * List of history timeline items
 */

export interface ApiStockOrderHistoryTimelineItem { 
    /**
     * Entity id
     */
    id?: number;
    processingOrder?: ApiProcessingOrder;
    /**
     * Processing evidence types stored values for this stock order
     */
    requiredEvidenceDocuments?: Array<ApiStockOrderEvidenceTypeValue>;
    /**
     * Other processing evidence documents - evidence types that can be provided but are not mandatory
     */
    otherEvidenceDocuments?: Array<ApiStockOrderEvidenceTypeValue>;
    stockOrder?: ApiStockOrder;
    /**
     * Aggregated Purchase orders
     */
    purchaseOrders?: Array<ApiStockOrder>;
    /**
     * Depth of aggregation history
     */
    depth?: number;
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
         * Entity id
         */
        id = 'id',
        processingOrder = 'processingOrder',
        /**
         * Processing evidence types stored values for this stock order
         */
        requiredEvidenceDocuments = 'requiredEvidenceDocuments',
        /**
         * Other processing evidence documents - evidence types that can be provided but are not mandatory
         */
        otherEvidenceDocuments = 'otherEvidenceDocuments',
        stockOrder = 'stockOrder',
        /**
         * Aggregated Purchase orders
         */
        purchaseOrders = 'purchaseOrders',
        /**
         * Depth of aggregation history
         */
        depth = 'depth'
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
                    name: 'id',
                    classname: 'ApiStockOrderHistoryTimelineItem',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
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
            ],
            validators: {
                id: [
                ],
                processingOrder: [
                ],
                requiredEvidenceDocuments: [
                ],
                otherEvidenceDocuments: [
                ],
                stockOrder: [
                ],
                purchaseOrders: [
                ],
                depth: [
                ],
            }
        }
    }

  // export const ApiStockOrderHistoryTimelineItemValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               processingOrder: {
  //                   validators: []
  //               },
  //               requiredEvidenceDocuments: {
  //                   validators: []
  //               },
  //               otherEvidenceDocuments: {
  //                   validators: []
  //               },
  //               stockOrder: {
  //                   validators: []
  //               },
  //               purchaseOrders: {
  //                   validators: []
  //               },
  //               depth: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiStockOrderHistoryTimelineItem>;


}


