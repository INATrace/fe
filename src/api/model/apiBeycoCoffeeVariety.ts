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
 * Varieties of coffee beans
 */

export interface ApiBeycoCoffeeVariety { 
    /**
     * Variety of coffee beans
     */
    type?: ApiBeycoCoffeeVariety.TypeEnum;
    /**
     * Optional custom variety of coffee beans
     */
    customVariety?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiBeycoCoffeeVariety.
 */
export namespace ApiBeycoCoffeeVariety {
    /**
     * All properties of ApiBeycoCoffeeVariety.
     */
    export enum Properties {
        /**
         * Variety of coffee beans
         */
        type = 'type',
        /**
         * Optional custom variety of coffee beans
         */
        customVariety = 'customVariety'
    }

    /**
     * All possible values of type.
     */
    export enum TypeEnum {
        Bourbon = 'Bourbon',
        Castillo = 'Castillo',
        Catimor = 'Catimor',
        Catuai = 'Catuai',
        Caturra = 'Caturra',
        Geisha = 'Geisha',
        Heirloom = 'Heirloom',
        Ih90 = 'Ih90',
        Jackson = 'Jackson',
        Java = 'Java',
        Lempira = 'Lempira',
        MundoNovo = 'MundoNovo',
        Sl14 = 'Sl14',
        Sl28 = 'Sl28',
        Sl34 = 'Sl34',
        Typica = 'Typica',
        Other = 'Other'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiBeycoCoffeeVariety',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiBeycoCoffeeVariety.TypeEnum',
                    required: false,
                    name: 'type',
                    classname: 'ApiBeycoCoffeeVariety',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'customVariety',
                    classname: 'ApiBeycoCoffeeVariety',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                type: [
                ],
                customVariety: [
                ],
            }
        }
    }

  // export const ApiBeycoCoffeeVarietyValidationScheme = {
  //     validators: [],
  //     fields: {
  //               type: {
  //                   validators: []
  //               },
  //               customVariety: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiBeycoCoffeeVariety>;


}


