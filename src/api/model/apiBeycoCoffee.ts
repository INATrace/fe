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


import { ApiBeycoCoffeeCertificate } from './apiBeycoCoffeeCertificate';
import { ApiBeycoCoffeeGrade } from './apiBeycoCoffeeGrade';
import { ApiBeycoCoffeeQuality } from './apiBeycoCoffeeQuality';
import { ApiBeycoCoffeeVariety } from './apiBeycoCoffeeVariety';



export interface ApiBeycoCoffee { 
    /**
     * Additional grade, if selected 'Other' in grades
     */
    additionalQualityDescriptors?: string;
    /**
     * Certificates of coffee beans
     */
    certificates?: Array<ApiBeycoCoffeeCertificate>;
    /**
     * Country of coffee beans
     */
    country?: string;
    /**
     * Cupping score
     */
    cuppingScore?: number;
    /**
     * Grades of coffee beans
     */
    grades?: Array<ApiBeycoCoffeeGrade>;
    /**
     * Harvest date
     */
    harvestAt?: Date;
    /**
     * Is bulk
     */
    isBulk?: boolean;
    /**
     * Maximum screen size
     */
    maxScreenSize?: number;
    /**
     * Minimal screen size
     */
    minScreenSize?: number;
    /**
     * Internal LOT number or name of coffee
     */
    name?: string;
    /**
     * Coffee process
     */
    process?: ApiBeycoCoffee.ProcessEnum;
    /**
     * Quality of coffee beans
     */
    qualitySegments?: Array<ApiBeycoCoffeeQuality>;
    /**
     * Quantity of beans
     */
    quantity?: number;
    /**
     * Region of coffee beans
     */
    region?: string;
    /**
     * Coffee species
     */
    species?: ApiBeycoCoffee.SpeciesEnum;
    /**
     * Unit of order
     */
    unit?: ApiBeycoCoffee.UnitEnum;
    /**
     * Varieties of coffee beans
     */
    varieties?: Array<ApiBeycoCoffeeVariety>;
}

/**
 * Namespace for property- and property-value-enumerations of ApiBeycoCoffee.
 */
export namespace ApiBeycoCoffee {
    /**
     * All properties of ApiBeycoCoffee.
     */
    export enum Properties {
        /**
         * Additional grade, if selected 'Other' in grades
         */
        additionalQualityDescriptors = 'additionalQualityDescriptors',
        /**
         * Certificates of coffee beans
         */
        certificates = 'certificates',
        /**
         * Country of coffee beans
         */
        country = 'country',
        /**
         * Cupping score
         */
        cuppingScore = 'cuppingScore',
        /**
         * Grades of coffee beans
         */
        grades = 'grades',
        /**
         * Harvest date
         */
        harvestAt = 'harvestAt',
        /**
         * Is bulk
         */
        isBulk = 'isBulk',
        /**
         * Maximum screen size
         */
        maxScreenSize = 'maxScreenSize',
        /**
         * Minimal screen size
         */
        minScreenSize = 'minScreenSize',
        /**
         * Internal LOT number or name of coffee
         */
        name = 'name',
        /**
         * Coffee process
         */
        process = 'process',
        /**
         * Quality of coffee beans
         */
        qualitySegments = 'qualitySegments',
        /**
         * Quantity of beans
         */
        quantity = 'quantity',
        /**
         * Region of coffee beans
         */
        region = 'region',
        /**
         * Coffee species
         */
        species = 'species',
        /**
         * Unit of order
         */
        unit = 'unit',
        /**
         * Varieties of coffee beans
         */
        varieties = 'varieties'
    }

    /**
     * All possible values of process.
     */
    export enum ProcessEnum {
        FullyWashed = 'FullyWashed',
        SemiWashedHoney = 'SemiWashedHoney',
        Natural = 'Natural',
        Other = 'Other'
    }

    /**
     * All possible values of species.
     */
    export enum SpeciesEnum {
        Arabica = 'Arabica',
        Robusta = 'Robusta'
    }

    /**
     * All possible values of unit.
     */
    export enum UnitEnum {
        Kg = 'Kg',
        Mg = 'Mg',
        Bag25 = 'Bag25',
        Bag30 = 'Bag30',
        Bag35 = 'Bag35',
        Bag46 = 'Bag46',
        Bag50 = 'Bag50',
        Bag59 = 'Bag59',
        Bag60 = 'Bag60',
        Bag69 = 'Bag69',
        Bag70 = 'Bag70',
        Bag1000 = 'Bag1000'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiBeycoCoffee',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'additionalQualityDescriptors',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiBeycoCoffeeCertificate.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'certificates',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'Array&lt;ApiBeycoCoffeeCertificate&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiBeycoCoffeeCertificate'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'country',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'cuppingScore',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiBeycoCoffeeGrade.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'grades',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'Array&lt;ApiBeycoCoffeeGrade&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiBeycoCoffeeGrade'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'harvestAt',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'Date',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'isBulk',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'maxScreenSize',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'minScreenSize',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiBeycoCoffee.ProcessEnum',
                    required: false,
                    name: 'process',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiBeycoCoffeeQuality.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'qualitySegments',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'Array&lt;ApiBeycoCoffeeQuality&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiBeycoCoffeeQuality'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'quantity',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'region',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiBeycoCoffee.SpeciesEnum',
                    required: false,
                    name: 'species',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiBeycoCoffee.UnitEnum',
                    required: false,
                    name: 'unit',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiBeycoCoffeeVariety.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'varieties',
                    classname: 'ApiBeycoCoffee',
                    dataType: 'Array&lt;ApiBeycoCoffeeVariety&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiBeycoCoffeeVariety'
                },
            ],
            validators: {
                additionalQualityDescriptors: [
                ],
                certificates: [
                ],
                country: [
                ],
                cuppingScore: [
                ],
                grades: [
                ],
                harvestAt: [
                ],
                isBulk: [
                ],
                maxScreenSize: [
                ],
                minScreenSize: [
                ],
                name: [
                ],
                process: [
                ],
                qualitySegments: [
                ],
                quantity: [
                ],
                region: [
                ],
                species: [
                ],
                unit: [
                ],
                varieties: [
                ],
            }
        }
    }

  // export const ApiBeycoCoffeeValidationScheme = {
  //     validators: [],
  //     fields: {
  //               additionalQualityDescriptors: {
  //                   validators: []
  //               },
  //               certificates: {
  //                   validators: []
  //               },
  //               country: {
  //                   validators: []
  //               },
  //               cuppingScore: {
  //                   validators: []
  //               },
  //               grades: {
  //                   validators: []
  //               },
  //               harvestAt: {
  //                   validators: []
  //               },
  //               isBulk: {
  //                   validators: []
  //               },
  //               maxScreenSize: {
  //                   validators: []
  //               },
  //               minScreenSize: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               process: {
  //                   validators: []
  //               },
  //               qualitySegments: {
  //                   validators: []
  //               },
  //               quantity: {
  //                   validators: []
  //               },
  //               region: {
  //                   validators: []
  //               },
  //               species: {
  //                   validators: []
  //               },
  //               unit: {
  //                   validators: []
  //               },
  //               varieties: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiBeycoCoffee>;


}


