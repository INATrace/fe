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




/**
 * Codebook for grade abbreviation
 */

export interface ChainGradeAbbreviation { 
    docType?: string;
    _id?: string;
    _rev?: string;
    dbKey?: string;
    mode__?: ChainGradeAbbreviation.ModeEnum;
    id: string;
    label: string;
}

/**
 * Namespace for property- and property-value-enumerations of ChainGradeAbbreviation.
 */
export namespace ChainGradeAbbreviation {
    /**
     * All properties of ChainGradeAbbreviation.
     */
    export enum Properties {
        docType = 'docType',
        _id = '_id',
        _rev = '_rev',
        dbKey = 'dbKey',
        mode__ = 'mode__',
        id = 'id',
        label = 'label'
    }

    /**
     * All possible values of mode__.
     */
    export enum ModeEnum {
        Insert = 'insert',
        InsertAsIs = 'insert_as_is',
        Update = 'update'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ChainGradeAbbreviation',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'docType',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: '_id',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: '_rev',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'dbKey',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ChainGradeAbbreviation.ModeEnum',
                    required: false,
                    name: 'mode__',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'id',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'label',
                    classname: 'ChainGradeAbbreviation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                docType: [
                ],
                _id: [
                ],
                _rev: [
                ],
                dbKey: [
                ],
                mode__: [
                ],
                id: [
                        ['required'],
                ],
                label: [
                        ['required'],
                ],
            }
        }
    }

  // export const ChainGradeAbbreviationValidationScheme = {
  //     validators: [],
  //     fields: {
  //               docType: {
  //                   validators: []
  //               },
  //               _id: {
  //                   validators: []
  //               },
  //               _rev: {
  //                   validators: []
  //               },
  //               dbKey: {
  //                   validators: []
  //               },
  //               mode__: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               label: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ChainGradeAbbreviation>;


}


