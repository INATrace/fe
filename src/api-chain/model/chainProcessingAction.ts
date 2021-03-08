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


import { ChainProcessingEvidenceType } from './chainProcessingEvidenceType';
import { ChainSemiProduct } from './chainSemiProduct';
import { DocTypeIdsWithRequired } from './docTypeIdsWithRequired';
import { FieldDefinition } from './fieldDefinition';



export interface ChainProcessingAction { 
    docType?: string;
    _id?: string;
    _rev?: string;
    dbKey?: string;
    mode__?: ChainProcessingAction.ModeEnum;
    /**
     * Timestamp of creation
     */
    created?: string;
    /**
     * Timestamp of last change
     */
    lastChange?: string;
    /**
     * Id of user that created the document.
     */
    userCreatedId?: string;
    /**
     * Id of user that changed the document.
     */
    userChangedId?: string;
    /**
     * id reference of the relevant ChainProduct
     */
    productId: string;
    /**
     * id reference of the relevant ChainOrganization
     */
    organizationId: string;
    /**
     * Name of the processing action
     */
    name: string;
    /**
     * Description of the processing action
     */
    description: string;
    /**
     * Input semi-product id
     */
    inputSemiProductId?: string;
    /**
     * Output semi-product id
     */
    outputSemiProductId?: string;
    /**
     * Required fields
     */
    requiredFields?: Array<FieldDefinition>;
    inputSemiProduct?: ChainSemiProduct;
    outputSemiProduct?: ChainSemiProduct;
    /**
     * List of required document types for processing ids
     */
    requiredDocTypeIds?: Array<string>;
    /**
     * List of required document types for processing ids
     */
    requiredDocTypeIdsWithRequired?: Array<DocTypeIdsWithRequired>;
    /**
     * List of required document types for processing ids
     */
    requiredDocTypes?: Array<ChainProcessingEvidenceType>;
    /**
     * If transaction output has multiple outputSemiProducts
     */
    repackedOutputs?: boolean;
    /**
     * Max weight of one of the multiple outputSemiProducts (required if repackedOutputs)
     */
    maxOutputWeight?: number;
    /**
     * Type of processing transaction. PROCESSING: many-to-many semi products, consumed and produced quantities not connected SHIPMENT: same semiproduct. Acts as an order of the same quantity from target facility
     */
    type?: ChainProcessingAction.TypeEnum;
    /**
     * Prefix. Used to build internal lot number names.
     */
    prefix?: string;
    /**
     * Public timeline name. If not null, the processing order with this action is shown on public timeline.
     */
    publicTimelineLabel?: string;
    /**
     * Public timeline location.
     */
    publicTimelineLocation?: string;
    /**
     * Icon type in public timeline
     */
    publicTimelineIcon?: ChainProcessingAction.PublicTimelineIconEnum;
}

/**
 * Namespace for property- and property-value-enumerations of ChainProcessingAction.
 */
export namespace ChainProcessingAction {
    /**
     * All properties of ChainProcessingAction.
     */
    export enum Properties {
        docType = 'docType',
        _id = '_id',
        _rev = '_rev',
        dbKey = 'dbKey',
        mode__ = 'mode__',
        /**
         * Timestamp of creation
         */
        created = 'created',
        /**
         * Timestamp of last change
         */
        lastChange = 'lastChange',
        /**
         * Id of user that created the document.
         */
        userCreatedId = 'userCreatedId',
        /**
         * Id of user that changed the document.
         */
        userChangedId = 'userChangedId',
        /**
         * id reference of the relevant ChainProduct
         */
        productId = 'productId',
        /**
         * id reference of the relevant ChainOrganization
         */
        organizationId = 'organizationId',
        /**
         * Name of the processing action
         */
        name = 'name',
        /**
         * Description of the processing action
         */
        description = 'description',
        /**
         * Input semi-product id
         */
        inputSemiProductId = 'inputSemiProductId',
        /**
         * Output semi-product id
         */
        outputSemiProductId = 'outputSemiProductId',
        /**
         * Required fields
         */
        requiredFields = 'requiredFields',
        inputSemiProduct = 'inputSemiProduct',
        outputSemiProduct = 'outputSemiProduct',
        /**
         * List of required document types for processing ids
         */
        requiredDocTypeIds = 'requiredDocTypeIds',
        /**
         * List of required document types for processing ids
         */
        requiredDocTypeIdsWithRequired = 'requiredDocTypeIdsWithRequired',
        /**
         * List of required document types for processing ids
         */
        requiredDocTypes = 'requiredDocTypes',
        /**
         * If transaction output has multiple outputSemiProducts
         */
        repackedOutputs = 'repackedOutputs',
        /**
         * Max weight of one of the multiple outputSemiProducts (required if repackedOutputs)
         */
        maxOutputWeight = 'maxOutputWeight',
        /**
         * Type of processing transaction. PROCESSING: many-to-many semi products, consumed and produced quantities not connected SHIPMENT: same semiproduct. Acts as an order of the same quantity from target facility
         */
        type = 'type',
        /**
         * Prefix. Used to build internal lot number names.
         */
        prefix = 'prefix',
        /**
         * Public timeline name. If not null, the processing order with this action is shown on public timeline.
         */
        publicTimelineLabel = 'publicTimelineLabel',
        /**
         * Public timeline location.
         */
        publicTimelineLocation = 'publicTimelineLocation',
        /**
         * Icon type in public timeline
         */
        publicTimelineIcon = 'publicTimelineIcon'
    }

    /**
     * All possible values of mode__.
     */
    export enum ModeEnum {
        Insert = 'insert',
        InsertAsIs = 'insert_as_is',
        Update = 'update'
    }

    /**
     * All possible values of type.
     */
    export enum TypeEnum {
        PROCESSING = 'PROCESSING',
        SHIPMENT = 'SHIPMENT',
        TRANSFER = 'TRANSFER'
    }

    /**
     * All possible values of publicTimelineIcon.
     */
    export enum PublicTimelineIconEnum {
        SHIP = 'SHIP',
        LEAF = 'LEAF',
        WAREHOUSE = 'WAREHOUSE',
        QRCODE = 'QRCODE',
        OTHER = 'OTHER'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ChainProcessingAction',
            vars: [
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'docType',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: '_id',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: '_rev',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'dbKey',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ChainProcessingAction.ModeEnum',
                    required: false,
                    name: 'mode__',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'created',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'lastChange',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'userCreatedId',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'userChangedId',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'productId',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'organizationId',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'name',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: true,
                    name: 'description',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'inputSemiProductId',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'outputSemiProductId',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: FieldDefinition.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredFields',
                    classname: 'ChainProcessingAction',
                    dataType: 'Array&lt;FieldDefinition&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'FieldDefinition'
                },
                {
                    metadata: ChainSemiProduct.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'inputSemiProduct',
                    classname: 'ChainProcessingAction',
                    dataType: 'ChainSemiProduct',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ChainSemiProduct'
                },
                {
                    metadata: ChainSemiProduct.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'outputSemiProduct',
                    classname: 'ChainProcessingAction',
                    dataType: 'ChainSemiProduct',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ChainSemiProduct'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredDocTypeIds',
                    classname: 'ChainProcessingAction',
                    dataType: 'Array&lt;string&gt;',
                    isPrimitiveType: true,
                    isListContainer: true,
                    complexType: ''
                },
                {
                    metadata: DocTypeIdsWithRequired.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredDocTypeIdsWithRequired',
                    classname: 'ChainProcessingAction',
                    dataType: 'Array&lt;DocTypeIdsWithRequired&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'DocTypeIdsWithRequired'
                },
                {
                    metadata: ChainProcessingEvidenceType.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'requiredDocTypes',
                    classname: 'ChainProcessingAction',
                    dataType: 'Array&lt;ChainProcessingEvidenceType&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ChainProcessingEvidenceType'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'repackedOutputs',
                    classname: 'ChainProcessingAction',
                    dataType: 'boolean',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'maxOutputWeight',
                    classname: 'ChainProcessingAction',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ChainProcessingAction.TypeEnum',
                    required: false,
                    name: 'type',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'prefix',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'publicTimelineLabel',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'publicTimelineLocation',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: true,
                    datatypeWithEnum: 'ChainProcessingAction.PublicTimelineIconEnum',
                    required: false,
                    name: 'publicTimelineIcon',
                    classname: 'ChainProcessingAction',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                docType: [
                ],
                _id: [
                ],
                _rev: [
                ],
                dbKey: [
                ],
                mode__: [
                ],
                created: [
                ],
                lastChange: [
                ],
                userCreatedId: [
                ],
                userChangedId: [
                ],
                productId: [
                        ['required'],
                ],
                organizationId: [
                        ['required'],
                ],
                name: [
                        ['required'],
                ],
                description: [
                        ['required'],
                ],
                inputSemiProductId: [
                ],
                outputSemiProductId: [
                ],
                requiredFields: [
                ],
                inputSemiProduct: [
                ],
                outputSemiProduct: [
                ],
                requiredDocTypeIds: [
                ],
                requiredDocTypeIdsWithRequired: [
                ],
                requiredDocTypes: [
                ],
                repackedOutputs: [
                ],
                maxOutputWeight: [
                ],
                type: [
                ],
                prefix: [
                ],
                publicTimelineLabel: [
                ],
                publicTimelineLocation: [
                ],
                publicTimelineIcon: [
                ],
            }
        }
    }

  // export const ChainProcessingActionValidationScheme = {
  //     validators: [],
  //     fields: {
  //               docType: {
  //                   validators: []
  //               },
  //               _id: {
  //                   validators: []
  //               },
  //               _rev: {
  //                   validators: []
  //               },
  //               dbKey: {
  //                   validators: []
  //               },
  //               mode__: {
  //                   validators: []
  //               },
  //               created: {
  //                   validators: []
  //               },
  //               lastChange: {
  //                   validators: []
  //               },
  //               userCreatedId: {
  //                   validators: []
  //               },
  //               userChangedId: {
  //                   validators: []
  //               },
  //               productId: {
  //                   validators: []
  //               },
  //               organizationId: {
  //                   validators: []
  //               },
  //               name: {
  //                   validators: []
  //               },
  //               description: {
  //                   validators: []
  //               },
  //               inputSemiProductId: {
  //                   validators: []
  //               },
  //               outputSemiProductId: {
  //                   validators: []
  //               },
  //               requiredFields: {
  //                   validators: []
  //               },
  //               inputSemiProduct: {
  //                   validators: []
  //               },
  //               outputSemiProduct: {
  //                   validators: []
  //               },
  //               requiredDocTypeIds: {
  //                   validators: []
  //               },
  //               requiredDocTypeIdsWithRequired: {
  //                   validators: []
  //               },
  //               requiredDocTypes: {
  //                   validators: []
  //               },
  //               repackedOutputs: {
  //                   validators: []
  //               },
  //               maxOutputWeight: {
  //                   validators: []
  //               },
  //               type: {
  //                   validators: []
  //               },
  //               prefix: {
  //                   validators: []
  //               },
  //               publicTimelineLabel: {
  //                   validators: []
  //               },
  //               publicTimelineLocation: {
  //                   validators: []
  //               },
  //               publicTimelineIcon: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ChainProcessingAction>;


}


