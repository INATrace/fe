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





export interface GrantedAuthority { 
    authority?: string;
}

/**
 * Namespace for property- and property-value-enumerations of GrantedAuthority.
 */
export namespace GrantedAuthority {
    /**
     * All properties of GrantedAuthority.
     */
    export enum Properties {
        authority = 'authority'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'GrantedAuthority',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'authority',
                    classname: 'GrantedAuthority',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                authority: [
                ],
            }
        }
    }

  // export const GrantedAuthorityValidationScheme = {
  //     validators: [],
  //     fields: {
  //               authority: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<GrantedAuthority>;


}

