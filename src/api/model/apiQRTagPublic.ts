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


import { ApiCertification } from './apiCertification';
import { ApiHistoryTimeline } from './apiHistoryTimeline';



export interface ApiQRTagPublic { 
    /**
     * List of certificates of the participating companies in this Stock order
     */
    certificates?: Array<ApiCertification>;
    /**
     * The cupping flavour entered during one of the processing actions
     */
    cuppingFlavour?: string;
    /**
     * The cupping score entered during one of the processing actions
     */
    cuppingScore?: number;
    historyTimeline?: ApiHistoryTimeline;
    /**
     * The global (product) order of the Stock order
     */
    orderId?: string;
    /**
     * Price paid to farmers in EUR/kg
     */
    priceToFarmer?: number;
    /**
     * Price paid to producer in EUR/kg
     */
    priceToProducer?: number;
    /**
     * The Producer name
     */
    producerName?: string;
    /**
     * The QR code tag
     */
    qrTag?: string;
    /**
     * The roasting profile entered during one of the processing actions
     */
    roastingProfile?: string;
}

/**
 * Namespace for property- and property-value-enumerations of ApiQRTagPublic.
 */
export namespace ApiQRTagPublic {
    /**
     * All properties of ApiQRTagPublic.
     */
    export enum Properties {
        /**
         * List of certificates of the participating companies in this Stock order
         */
        certificates = 'certificates',
        /**
         * The cupping flavour entered during one of the processing actions
         */
        cuppingFlavour = 'cuppingFlavour',
        /**
         * The cupping score entered during one of the processing actions
         */
        cuppingScore = 'cuppingScore',
        historyTimeline = 'historyTimeline',
        /**
         * The global (product) order of the Stock order
         */
        orderId = 'orderId',
        /**
         * Price paid to farmers in EUR/kg
         */
        priceToFarmer = 'priceToFarmer',
        /**
         * Price paid to producer in EUR/kg
         */
        priceToProducer = 'priceToProducer',
        /**
         * The Producer name
         */
        producerName = 'producerName',
        /**
         * The QR code tag
         */
        qrTag = 'qrTag',
        /**
         * The roasting profile entered during one of the processing actions
         */
        roastingProfile = 'roastingProfile'
    }


    export function formMetadata() {
        return  {
            metadata: formMetadata,
            classname: 'ApiQRTagPublic',
            vars: [
                {
                    metadata: ApiCertification.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'certificates',
                    classname: 'ApiQRTagPublic',
                    dataType: 'Array&lt;ApiCertification&gt;',
                    isPrimitiveType: false,
                    isListContainer: true,
                    complexType: 'ApiCertification'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'cuppingFlavour',
                    classname: 'ApiQRTagPublic',
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
                    classname: 'ApiQRTagPublic',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    metadata: ApiHistoryTimeline.formMetadata,
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'historyTimeline',
                    classname: 'ApiQRTagPublic',
                    dataType: 'ApiHistoryTimeline',
                    isPrimitiveType: false,
                    isListContainer: false,
                    complexType: 'ApiHistoryTimeline'
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'orderId',
                    classname: 'ApiQRTagPublic',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'priceToFarmer',
                    classname: 'ApiQRTagPublic',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'priceToProducer',
                    classname: 'ApiQRTagPublic',
                    dataType: 'number',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'producerName',
                    classname: 'ApiQRTagPublic',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'qrTag',
                    classname: 'ApiQRTagPublic',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
                {
                    isReadOnly: false,
                    isEnum: false,
                    required: false,
                    name: 'roastingProfile',
                    classname: 'ApiQRTagPublic',
                    dataType: 'string',
                    isPrimitiveType: true,
                    isListContainer: false,
                    complexType: ''
                },
            ],
            validators: {
                certificates: [
                ],
                cuppingFlavour: [
                ],
                cuppingScore: [
                ],
                historyTimeline: [
                ],
                orderId: [
                ],
                priceToFarmer: [
                ],
                priceToProducer: [
                ],
                producerName: [
                ],
                qrTag: [
                ],
                roastingProfile: [
                ],
            }
        }
    }

  // export const ApiQRTagPublicValidationScheme = {
  //     validators: [],
  //     fields: {
  //               certificates: {
  //                   validators: []
  //               },
  //               cuppingFlavour: {
  //                   validators: []
  //               },
  //               cuppingScore: {
  //                   validators: []
  //               },
  //               historyTimeline: {
  //                   validators: []
  //               },
  //               orderId: {
  //                   validators: []
  //               },
  //               priceToFarmer: {
  //                   validators: []
  //               },
  //               priceToProducer: {
  //                   validators: []
  //               },
  //               producerName: {
  //                   validators: []
  //               },
  //               qrTag: {
  //                   validators: []
  //               },
  //               roastingProfile: {
  //                   validators: []
  //               },
  //     }
  // } as SimpleValidationScheme<ApiQRTagPublic>;


}


