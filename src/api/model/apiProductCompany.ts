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


import { ApiCompanyListResponse } from './apiCompanyListResponse';


/**
 * associated companies
 */

export interface ApiProductCompany { 
    company?: ApiCompanyListResponse;
    /**
     * associated company type
     */
    type?: ApiProductCompany.TypeEnum;
}

/**
 * Namespace for property- and property-value-enumerations of ApiProductCompany.
 */
export namespace ApiProductCompany {
    /**
     * All properties of ApiProductCompany.
     */
    export enum Properties {
        company = 'company',
        /**
         * associated company type
         */
        type = 'type'
    }

    /**
     * All possible values of type.
     */
    export enum TypeEnum {
        BUYER = 'BUYER',
        IMPORTER = 'IMPORTER',
        EXPORTER = 'EXPORTER',
        OWNER = 'OWNER',
        PRODUCER = 'PRODUCER',
        ASSOCIATION = 'ASSOCIATION',
        PROCESSOR = 'PROCESSOR',
        TRADER = 'TRADER',
        ROASTER = 'ROASTER'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiProductCompany',
            vars: [
                {
                    metadata: ApiCompanyListResponse.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'company',
                    classname: 'ApiProductCompany',
                    dataType: 'ApiCompanyListResponse',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiCompanyListResponse'
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ApiProductCompany.TypeEnum',
                    required: false,
                    name: 'type',
                    classname: 'ApiProductCompany',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                company: [
                ],
                type: [
                ],
            }
        }
    }

  // export const ApiProductCompanyValidationScheme = {
  //     validators: [],
  //     fields: {
  //               company: {
  //                   validators: []
  //               },
  //               type: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiProductCompany>;


}


