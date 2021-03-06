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


import { ChainMeasureUnitType } from './chainMeasureUnitType';
import { ChainProcessingAction } from './chainProcessingAction';



export interface WeightedAggregateAny { 
    fieldID: string;
    value: any;
    quantity: number;
    measurementUnit: ChainMeasureUnitType;
    stockOrderId?: string;
    identifier?: string;
    isDocument?: boolean;
    processingAction?: ChainProcessingAction;
    required?: boolean;
    mandatory?: boolean;
    requiredOnQuote?: boolean;
    requiredOnQuoteOneOk?: boolean;
    requiredOneOfGroupIdForQuote?: string;
}

/**
 * Namespace for property- and property-value-enumerations of WeightedAggregateAny.
 */
export namespace WeightedAggregateAny {
    /**
     * All properties of WeightedAggregateAny.
     */
    export enum Properties {
        fieldID = 'fieldID',
        value = 'value',
        quantity = 'quantity',
        measurementUnit = 'measurementUnit',
        stockOrderId = 'stockOrderId',
        identifier = 'identifier',
        isDocument = 'isDocument',
        processingAction = 'processingAction',
        required = 'required',
        mandatory = 'mandatory',
        requiredOnQuote = 'requiredOnQuote',
        requiredOnQuoteOneOk = 'requiredOnQuoteOneOk',
        requiredOneOfGroupIdForQuote = 'requiredOneOfGroupIdForQuote'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'WeightedAggregateAny',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'fieldID',
                    classname: 'WeightedAggregateAny',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'value',
                    classname: 'WeightedAggregateAny',
                    dataType: 'any',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'quantity',
                    classname: 'WeightedAggregateAny',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ChainMeasureUnitType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'measurementUnit',
                    classname: 'WeightedAggregateAny',
                    dataType: 'ChainMeasureUnitType',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ChainMeasureUnitType'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'stockOrderId',
                    classname: 'WeightedAggregateAny',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'identifier',
                    classname: 'WeightedAggregateAny',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'isDocument',
                    classname: 'WeightedAggregateAny',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ChainProcessingAction.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'processingAction',
                    classname: 'WeightedAggregateAny',
                    dataType: 'ChainProcessingAction',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ChainProcessingAction'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'required',
                    classname: 'WeightedAggregateAny',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'mandatory',
                    classname: 'WeightedAggregateAny',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredOnQuote',
                    classname: 'WeightedAggregateAny',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredOnQuoteOneOk',
                    classname: 'WeightedAggregateAny',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredOneOfGroupIdForQuote',
                    classname: 'WeightedAggregateAny',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                fieldID: [
                        ['required'],
                ],
                value: [
                        ['required'],
                ],
                quantity: [
                        ['required'],
                ],
                measurementUnit: [
                        ['required'],
                ],
                stockOrderId: [
                ],
                identifier: [
                ],
                isDocument: [
                ],
                processingAction: [
                ],
                required: [
                ],
                mandatory: [
                ],
                requiredOnQuote: [
                ],
                requiredOnQuoteOneOk: [
                ],
                requiredOneOfGroupIdForQuote: [
                ],
            }
        }
    }

  // export const WeightedAggregateAnyValidationScheme = {
  //     validators: [],
  //     fields: {
  //               fieldID: {
  //                   validators: []
  //               },
  //               value: {
  //                   validators: []
  //               },
  //               quantity: {
  //                   validators: []
  //               },
  //               measurementUnit: {
  //                   validators: []
  //               },
  //               stockOrderId: {
  //                   validators: []
  //               },
  //               identifier: {
  //                   validators: []
  //               },
  //               isDocument: {
  //                   validators: []
  //               },
  //               processingAction: {
  //                   validators: []
  //               },
  //               required: {
  //                   validators: []
  //               },
  //               mandatory: {
  //                   validators: []
  //               },
  //               requiredOnQuote: {
  //                   validators: []
  //               },
  //               requiredOnQuoteOneOk: {
  //                   validators: []
  //               },
  //               requiredOneOfGroupIdForQuote: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<WeightedAggregateAny>;


}


