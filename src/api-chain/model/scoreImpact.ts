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





export interface ScoreImpact { 
    /**
     * Type of score
     */
    type: ScoreImpact.TypeEnum;
    /**
     * Score weight
     */
    score: number;
}

/**
 * Namespace for property- and property-value-enumerations of ScoreImpact.
 */
export namespace ScoreImpact {
    /**
     * All properties of ScoreImpact.
     */
    export enum Properties {
        /**
         * Type of score
         */
        type = 'type',
        /**
         * Score weight
         */
        score = 'score'
    }

    /**
     * All possible values of type.
     */
    export enum TypeEnum {
        PROVENANCE = 'PROVENANCE',
        FAIRNESS = 'FAIRNESS',
        QUALITY = 'QUALITY',
        ORDER = 'ORDER',
        PAYMENT = 'PAYMENT'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ScoreImpact',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ScoreImpact.TypeEnum',
                    required: true,
                    name: 'type',
                    classname: 'ScoreImpact',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'score',
                    classname: 'ScoreImpact',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                type: [
                        ['required'],
                ],
                score: [
                        ['required'],
                ],
            }
        }
    }

  // export const ScoreImpactValidationScheme = {
  //     validators: [],
  //     fields: {
  //               type: {
  //                   validators: []
  //               },
  //               score: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ScoreImpact>;


}


