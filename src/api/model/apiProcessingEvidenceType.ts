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


import { ApiProcessingEvidenceTypeTranslation } from './apiProcessingEvidenceTypeTranslation';


/**
 * list of supported processing evidence types
 */

export interface ApiProcessingEvidenceType { 
    /**
     * Entity id
     */
    id?: number;
    /**
     * code
     */
    code: string;
    /**
     * label
     */
    label: string;
    /**
     * type of evidence
     */
    type?: ApiProcessingEvidenceType.TypeEnum;
    /**
     * if evidence is of fairness type
     */
    fairness?: boolean;
    /**
     * if evidence is of provenance type
     */
    provenance?: boolean;
    /**
     * if evidence is of quality type
     */
    quality?: boolean;
    /**
     * whether the evidence is mandatory
     */
    mandatory?: boolean;
    /**
     * whether the evidence is required on quote
     */
    requiredOnQuote?: boolean;
    /**
     * a group in which at least one document has to be provided
     */
    requiredOneOfGroupIdForQuote?: string;
    /**
     * Translations for processing evidence type
     */
    translations?: Array<ApiProcessingEvidenceTypeTranslation>;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProcessingEvidenceType.
 */
export namespace ApiProcessingEvidenceType {
    /**
     * All properties of ApiProcessingEvidenceType.
     */
    export enum Properties {
        /**
         * Entity id
         */
        id = 'id',
        /**
         * code
         */
        code = 'code',
        /**
         * label
         */
        label = 'label',
        /**
         * type of evidence
         */
        type = 'type',
        /**
         * if evidence is of fairness type
         */
        fairness = 'fairness',
        /**
         * if evidence is of provenance type
         */
        provenance = 'provenance',
        /**
         * if evidence is of quality type
         */
        quality = 'quality',
        /**
         * whether the evidence is mandatory
         */
        mandatory = 'mandatory',
        /**
         * whether the evidence is required on quote
         */
        requiredOnQuote = 'requiredOnQuote',
        /**
         * a group in which at least one document has to be provided
         */
        requiredOneOfGroupIdForQuote = 'requiredOneOfGroupIdForQuote',
        /**
         * Translations for processing evidence type
         */
        translations = 'translations'
    }

    /**
     * All possible values of type.
     */
    export enum TypeEnum {
        DOCUMENT = 'DOCUMENT',
        FIELD = 'FIELD',
        CALCULATED = 'CALCULATED'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProcessingEvidenceType',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'id',
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'code',
                    classname: 'ApiProcessingEvidenceType',
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
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProcessingEvidenceType.TypeEnum',
                    required: false,
                    name: 'type',
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'fairness',
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'provenance',
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'quality',
                    classname: 'ApiProcessingEvidenceType',
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
                    classname: 'ApiProcessingEvidenceType',
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
                    classname: 'ApiProcessingEvidenceType',
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
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiProcessingEvidenceTypeTranslation.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'translations',
                    classname: 'ApiProcessingEvidenceType',
                    dataType: 'Array&lt;ApiProcessingEvidenceTypeTranslation&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiProcessingEvidenceTypeTranslation'
                },
            ],
            validators: {
                id: [
                ],
                code: [
                        ['required'],
                ],
                label: [
                        ['required'],
                ],
                type: [
                ],
                fairness: [
                ],
                provenance: [
                ],
                quality: [
                ],
                mandatory: [
                ],
                requiredOnQuote: [
                ],
                requiredOneOfGroupIdForQuote: [
                ],
                translations: [
                ],
            }
        }
    }

  // export const ApiProcessingEvidenceTypeValidationScheme = {
  //     validators: [],
  //     fields: {
  //               id: {
  //                   validators: []
  //               },
  //               code: {
  //                   validators: []
  //               },
  //               label: {
  //                   validators: []
  //               },
  //               type: {
  //                   validators: []
  //               },
  //               fairness: {
  //                   validators: []
  //               },
  //               provenance: {
  //                   validators: []
  //               },
  //               quality: {
  //                   validators: []
  //               },
  //               mandatory: {
  //                   validators: []
  //               },
  //               requiredOnQuote: {
  //                   validators: []
  //               },
  //               requiredOneOfGroupIdForQuote: {
  //                   validators: []
  //               },
  //               translations: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProcessingEvidenceType>;


}


