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




/**
 * Response items.
 */

export interface ApiGroupStockOrder { 
    /**
     * Entity id
     */
    id?: number;
    /**
     * List of stock order ID's, belonging to this group
     */
    groupedIds?: Array<number>;
    /**
     * Production date
     */
    productionDate?: string;
    /**
     * Timestamp indicates when process order have been updated
     */
    updateTimestamp?: Date;
    /**
     * Internal LOT number
     */
    internalLotNumber?: string;
    /**
     * Number of sacs (if the order was repackaged)
     */
    noOfSacs?: number;
    /**
     * Order type
     */
    orderType?: ApiGroupStockOrder.OrderTypeEnum;
    /**
     * Semi product name
     */
    semiProductName?: string;
    /**
     * Final product name
     */
    finalProductName?: string;
    /**
     * Total quantity
     */
    totalQuantity?: number;
    /**
     * Fulfilled quantity
     */
    fulfilledQuantity?: number;
    /**
     * Available quantity
     */
    availableQuantity?: number;
    /**
     * Measurement unit
     */
    unitLabel?: string;
    /**
     * Delivery time
     */
    deliveryTime?: string;
    available?: boolean;
}

/**
 * Namespace for property- and property-value-enumerations of ApiGroupStockOrder.
 */
export namespace ApiGroupStockOrder {
    /**
     * All properties of ApiGroupStockOrder.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        /**
         * List of stock order ID's, belonging to this group
         */
        groupedIds = 'groupedIds',
        /**
         * Production date
         */
        productionDate = 'productionDate',
        /**
         * Timestamp indicates when process order have been updated
         */
        updateTimestamp = 'updateTimestamp',
        /**
         * Internal LOT number
         */
        internalLotNumber = 'internalLotNumber',
        /**
         * Number of sacs (if the order was repackaged)
         */
        noOfSacs = 'noOfSacs',
        /**
         * Order type
         */
        orderType = 'orderType',
        /**
         * Semi product name
         */
        semiProductName = 'semiProductName',
        /**
         * Final product name
         */
        finalProductName = 'finalProductName',
        /**
         * Total quantity
         */
        totalQuantity = 'totalQuantity',
        /**
         * Fulfilled quantity
         */
        fulfilledQuantity = 'fulfilledQuantity',
        /**
         * Available quantity
         */
        availableQuantity = 'availableQuantity',
        /**
         * Measurement unit
         */
        unitLabel = 'unitLabel',
        /**
         * Delivery time
         */
        deliveryTime = 'deliveryTime',
        available = 'available'
    }

    /**
     * All possible values of orderType.
     */
    export enum OrderTypeEnum {
        PURCHASEORDER = 'PURCHASE_ORDER',
        PROCESSINGORDER = 'PROCESSING_ORDER',
        GENERALORDER = 'GENERAL_ORDER',
        TRANSFERORDER = 'TRANSFER_ORDER'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiGroupStockOrder',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'groupedIds',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'Array&lt;number&gt;',
                    isPrimitiveType: true,
                    isListContainer: true,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'productionDate',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'updateTimestamp',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'internalLotNumber',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'noOfSacs',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiGroupStockOrder.OrderTypeEnum',
                    required: false,
                    name: 'orderType',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'semiProductName',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'finalProductName',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'totalQuantity',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'fulfilledQuantity',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'availableQuantity',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'unitLabel',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'deliveryTime',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'available',
                    classname: 'ApiGroupStockOrder',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                id: [
                ],
                groupedIds: [
                ],
                productionDate: [
                ],
                updateTimestamp: [
                ],
                internalLotNumber: [
                ],
                noOfSacs: [
                ],
                orderType: [
                ],
                semiProductName: [
                ],
                finalProductName: [
                ],
                totalQuantity: [
                ],
                fulfilledQuantity: [
                ],
                availableQuantity: [
                ],
                unitLabel: [
                ],
                deliveryTime: [
                ],
                available: [
                ],
            }
        }
    }

  // export const ApiGroupStockOrderValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               groupedIds: {
  //                   validators: []
  //               },
  //               productionDate: {
  //                   validators: []
  //               },
  //               updateTimestamp: {
  //                   validators: []
  //               },
  //               internalLotNumber: {
  //                   validators: []
  //               },
  //               noOfSacs: {
  //                   validators: []
  //               },
  //               orderType: {
  //                   validators: []
  //               },
  //               semiProductName: {
  //                   validators: []
  //               },
  //               finalProductName: {
  //                   validators: []
  //               },
  //               totalQuantity: {
  //                   validators: []
  //               },
  //               fulfilledQuantity: {
  //                   validators: []
  //               },
  //               availableQuantity: {
  //                   validators: []
  //               },
  //               unitLabel: {
  //                   validators: []
  //               },
  //               deliveryTime: {
  //                   validators: []
  //               },
  //               available: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiGroupStockOrder>;


}


