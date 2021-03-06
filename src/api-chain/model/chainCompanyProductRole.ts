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





export interface ChainCompanyProductRole { 
    companyId: number;
    role: string;
}

/**
 * Namespace for property- and property-value-enumerations of ChainCompanyProductRole.
 */
export namespace ChainCompanyProductRole {
    /**
     * All properties of ChainCompanyProductRole.
     */
    export enum Properties {
        companyId = 'companyId',
        role = 'role'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ChainCompanyProductRole',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'companyId',
                    classname: 'ChainCompanyProductRole',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'role',
                    classname: 'ChainCompanyProductRole',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                companyId: [
                        ['required'],
                ],
                role: [
                        ['required'],
                ],
            }
        }
    }

  // export const ChainCompanyProductRoleValidationScheme = {
  //     validators: [],
  //     fields: {
  //               companyId: {
  //                   validators: []
  //               },
  //               role: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ChainCompanyProductRole>;


}


