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





export interface ApiScoreTarget { 
    /**
     * Fairness goal
     */
    fairness?: number;
    /**
     * Entity id
     */
    id?: number;
    /**
     * Order
     */
    order?: number;
    /**
     * Payment
     */
    payment?: number;
    /**
     * Provenance goal
     */
    provenance?: number;
    /**
     * Quality goal
     */
    quality?: number;
    /**
     * Quality level
     */
    qualityLevel?: string;
    /**
     * Is women's share
     */
    womenShare?: boolean;
}

/**
 * Namespace for property- and property-value-enumerations of ApiScoreTarget.
 */
export namespace ApiScoreTarget {
    /**
     * All properties of ApiScoreTarget.
     */
    export enum Properties {
        /**
         * Fairness goal
         */
        fairness = 'fairness',
        /**
         * Entity id
         */
        id = 'id',
        /**
         * Order
         */
        order = 'order',
        /**
         * Payment
         */
        payment = 'payment',
        /**
         * Provenance goal
         */
        provenance = 'provenance',
        /**
         * Quality goal
         */
        quality = 'quality',
        /**
         * Quality level
         */
        qualityLevel = 'qualityLevel',
        /**
         * Is women's share
         */
        womenShare = 'womenShare'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiScoreTarget',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'fairness',
                    classname: 'ApiScoreTarget',
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
                    classname: 'ApiScoreTarget',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'order',
                    classname: 'ApiScoreTarget',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'payment',
                    classname: 'ApiScoreTarget',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'provenance',
                    classname: 'ApiScoreTarget',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'quality',
                    classname: 'ApiScoreTarget',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'qualityLevel',
                    classname: 'ApiScoreTarget',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'womenShare',
                    classname: 'ApiScoreTarget',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                fairness: [
                ],
                id: [
                ],
                order: [
                ],
                payment: [
                ],
                provenance: [
                ],
                quality: [
                ],
                qualityLevel: [
                ],
                womenShare: [
                ],
            }
        }
    }

  // export const ApiScoreTargetValidationScheme = {
  //     validators: [],
  //     fields: {
  //               fairness: {
  //                   validators: []
  //               },
  //               id: {
  //                   validators: []
  //               },
  //               order: {
  //                   validators: []
  //               },
  //               payment: {
  //                   validators: []
  //               },
  //               provenance: {
  //                   validators: []
  //               },
  //               quality: {
  //                   validators: []
  //               },
  //               qualityLevel: {
  //                   validators: []
  //               },
  //               womenShare: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiScoreTarget>;


}


