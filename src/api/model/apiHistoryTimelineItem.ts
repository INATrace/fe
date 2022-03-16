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





export interface ApiHistoryTimelineItem { 
    date?: Date;
    iconType?: ApiHistoryTimelineItem.IconTypeEnum;
    location?: string;
    name?: string;
    type?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiHistoryTimelineItem.
 */
export namespace ApiHistoryTimelineItem {
    /**
     * All properties of ApiHistoryTimelineItem.
     */
    export enum Properties {
        date = 'date',
        iconType = 'iconType',
        location = 'location',
        name = 'name',
        type = 'type'
    }

    /**
     * All possible values of iconType.
     */
    export enum IconTypeEnum {
        SHIP = 'SHIP',
        LEAF = 'LEAF',
        WAREHOUSE = 'WAREHOUSE',
        QRCODE = 'QRCODE',
        OTHER = 'OTHER'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiHistoryTimelineItem',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'date',
                    classname: 'ApiHistoryTimelineItem',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiHistoryTimelineItem.IconTypeEnum',
                    required: false,
                    name: 'iconType',
                    classname: 'ApiHistoryTimelineItem',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'location',
                    classname: 'ApiHistoryTimelineItem',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiHistoryTimelineItem',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'type',
                    classname: 'ApiHistoryTimelineItem',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                date: [
                ],
                iconType: [
                ],
                location: [
                ],
                name: [
                ],
                type: [
                ],
            }
        }
    }

  // export const ApiHistoryTimelineItemValidationScheme = {
  //     validators: [],
  //     fields: {
  //               date: {
  //                   validators: []
  //               },
  //               iconType: {
  //                   validators: []
  //               },
  //               location: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               type: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiHistoryTimelineItem>;


}

