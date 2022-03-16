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



export interface ApiStockOrderHistoryTimelineItem { 
    /**
     * Depth of aggregation history
     */
    depth?: number;
    /**
     * Entity id
     */
    id?: number;
    processingOrder?: ApiProcessingOrder;
    /**
     * Aggregated Purchase orders
     */
    purchaseOrders?: Array<ApiStockOrder>;
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
        processingOrder = 'processingOrder',
        /**
         * Aggregated Purchase orders
         */
        purchaseOrders = 'purchaseOrders',
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
                processingOrder: [
                ],
                purchaseOrders: [
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
  //               processingOrder: {
  //                   validators: []
  //               },
  //               purchaseOrders: {
  //                   validators: []
  //               },
  //               stockOrder: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiStockOrderHistoryTimelineItem>;


}

