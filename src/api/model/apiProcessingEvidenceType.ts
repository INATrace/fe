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





export interface ApiProcessingEvidenceType { 
    /**
     * code
     */
    code?: string;
    /**
     * if evidence is of fairness type
     */
    fairness?: boolean;
    /**
     * Entity id
     */
    id?: number;
    /**
     * label
     */
    label?: string;
    /**
     * if evidence is of provenance type
     */
    provenance?: boolean;
    /**
     * if evidence is of quality type
     */
    quality?: boolean;
    /**
     * whether the evidence is required
     */
    required?: boolean;
    /**
     * whether the evidence is required on quote
     */
    requiredOnQuote?: boolean;
    /**
     * a group in which at least one document has to be provided
     */
    requiredOneOfGroupIdForQuote?: string;
    /**
     * type of evidence
     */
    type?: ApiProcessingEvidenceType.TypeEnum;
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
         * code
         */
        code = 'code',
        /**
         * if evidence is of fairness type
         */
        fairness = 'fairness',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * label
         */
        label = 'label',
        /**
         * if evidence is of provenance type
         */
        provenance = 'provenance',
        /**
         * if evidence is of quality type
         */
        quality = 'quality',
        /**
         * whether the evidence is required
         */
        required = 'required',
        /**
         * whether the evidence is required on quote
         */
        requiredOnQuote = 'requiredOnQuote',
        /**
         * a group in which at least one document has to be provided
         */
        requiredOneOfGroupIdForQuote = 'requiredOneOfGroupIdForQuote',
        /**
         * type of evidence
         */
        type = 'type'
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
                    required: false,
                    name: 'label',
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
                    name: 'required',
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
            ],
            validators: {
                code: [
                ],
                fairness: [
                ],
                id: [
                ],
                label: [
                ],
                provenance: [
                ],
                quality: [
                ],
                required: [
                ],
                requiredOnQuote: [
                ],
                requiredOneOfGroupIdForQuote: [
                ],
                type: [
                ],
            }
        }
    }

  // export const ApiProcessingEvidenceTypeValidationScheme = {
  //     validators: [],
  //     fields: {
  //               code: {
  //                   validators: []
  //               },
  //               fairness: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               label: {
  //                   validators: []
  //               },
  //               provenance: {
  //                   validators: []
  //               },
  //               quality: {
  //                   validators: []
  //               },
  //               required: {
  //                   validators: []
  //               },
  //               requiredOnQuote: {
  //                   validators: []
  //               },
  //               requiredOneOfGroupIdForQuote: {
  //                   validators: []
  //               },
  //               type: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProcessingEvidenceType>;


}

