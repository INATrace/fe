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


import { B2CHistoryItem } from './b2CHistoryItem';



export interface B2CHistoryTimeline { 
    items: Array<B2CHistoryItem>;
    shortItems: Array<B2CHistoryItem>;
    coopName?: string;
}

/**
 * Namespace for property- and property-value-enumerations of B2CHistoryTimeline.
 */
export namespace B2CHistoryTimeline {
    /**
     * All properties of B2CHistoryTimeline.
     */
    export enum Properties {
        items = 'items',
        shortItems = 'shortItems',
        coopName = 'coopName'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'B2CHistoryTimeline',
            vars: [
                {
                    metadata: B2CHistoryItem.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'items',
                    classname: 'B2CHistoryTimeline',
                    dataType: 'Array&lt;B2CHistoryItem&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'B2CHistoryItem'
                },
                {
                    metadata: B2CHistoryItem.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'shortItems',
                    classname: 'B2CHistoryTimeline',
                    dataType: 'Array&lt;B2CHistoryItem&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'B2CHistoryItem'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'coopName',
                    classname: 'B2CHistoryTimeline',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                items: [
                        ['required'],
                ],
                shortItems: [
                        ['required'],
                ],
                coopName: [
                ],
            }
        }
    }

  // export const B2CHistoryTimelineValidationScheme = {
  //     validators: [],
  //     fields: {
  //               items: {
  //                   validators: []
  //               },
  //               shortItems: {
  //                   validators: []
  //               },
  //               coopName: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<B2CHistoryTimeline>;


}


