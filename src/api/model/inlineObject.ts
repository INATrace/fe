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





export interface InlineObject { 
    file: Blob;
}

/**
 * Namespace for property- and property-value-enumerations of InlineObject.
 */
export namespace InlineObject {
    /**
     * All properties of InlineObject.
     */
    export enum Properties {
        file = 'file'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'InlineObject',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'file',
                    classname: 'InlineObject',
                    dataType: 'Blob',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                file: [
                        ['required'],
                ],
            }
        }
    }

  // export const InlineObjectValidationScheme = {
  //     validators: [],
  //     fields: {
  //               file: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<InlineObject>;


}


