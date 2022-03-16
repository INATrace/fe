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





export interface ApiBankInformation { 
    /**
     * Account holder name
     */
    accountHolderName?: string;
    /**
     * Account number
     */
    accountNumber?: string;
    /**
     * Additional information
     */
    additionalInformation?: string;
    /**
     * Bank name
     */
    bankName?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiBankInformation.
 */
export namespace ApiBankInformation {
    /**
     * All properties of ApiBankInformation.
     */
    export enum Properties {
        /**
         * Account holder name
         */
        accountHolderName = 'accountHolderName',
        /**
         * Account number
         */
        accountNumber = 'accountNumber',
        /**
         * Additional information
         */
        additionalInformation = 'additionalInformation',
        /**
         * Bank name
         */
        bankName = 'bankName'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiBankInformation',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'accountHolderName',
                    classname: 'ApiBankInformation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'accountNumber',
                    classname: 'ApiBankInformation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'additionalInformation',
                    classname: 'ApiBankInformation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'bankName',
                    classname: 'ApiBankInformation',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                accountHolderName: [
                ],
                accountNumber: [
                ],
                additionalInformation: [
                ],
                bankName: [
                ],
            }
        }
    }

  // export const ApiBankInformationValidationScheme = {
  //     validators: [],
  //     fields: {
  //               accountHolderName: {
  //                   validators: []
  //               },
  //               accountNumber: {
  //                   validators: []
  //               },
  //               additionalInformation: {
  //                   validators: []
  //               },
  //               bankName: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiBankInformation>;


}

