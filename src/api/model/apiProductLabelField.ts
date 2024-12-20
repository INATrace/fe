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
 * Fields
 */

export interface ApiProductLabelField { 
    /**
     * Field name in Product
     */
    name?: string;
    /**
     * Visible on FE
     */
    visible?: boolean;
    /**
     * Section on FE
     */
    section?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProductLabelField.
 */
export namespace ApiProductLabelField {
    /**
     * All properties of ApiProductLabelField.
     */
    export enum Properties {
        /**
         * Field name in Product
         */
        name = 'name',
        /**
         * Visible on FE
         */
        visible = 'visible',
        /**
         * Section on FE
         */
        section = 'section'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProductLabelField',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'name',
                    classname: 'ApiProductLabelField',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'visible',
                    classname: 'ApiProductLabelField',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'section',
                    classname: 'ApiProductLabelField',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                name: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
                visible: [
                ],
                section: [
                        ['minlength', 0],
                        ['maxlength', 255],
                ],
            }
        }
    }

  // export const ApiProductLabelFieldValidationScheme = {
  //     validators: [],
  //     fields: {
  //               name: {
  //                   validators: []
  //               },
  //               visible: {
  //                   validators: []
  //               },
  //               section: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProductLabelField>;


}


