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

/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';
import { catchError }                                        from 'rxjs/operators';

import { ApiProcessingPerformanceRequest } from '../model/apiProcessingPerformanceRequest';
import { ApiResponseApiDeliveriesTotal } from '../model/apiResponseApiDeliveriesTotal';
import { ApiResponseApiProcessingPerformanceTotal } from '../model/apiResponseApiProcessingPerformanceTotal';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for calculateProcessingPerformanceData.
 */
export namespace CalculateProcessingPerformanceData {
    /**
     * Parameter map for calculateProcessingPerformanceData.
     */
    export interface PartialParamMap {
      ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest;
    }

    /**
     * Enumeration of all parameters for calculateProcessingPerformanceData.
     */
    export enum Parameters {
      ApiProcessingPerformanceRequest = 'ApiProcessingPerformanceRequest'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of calculateProcessingPerformanceData
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof CalculateProcessingPerformanceData.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for exportDeliveriesData.
 */
export namespace ExportDeliveriesData {
    /**
     * Parameter map for exportDeliveriesData.
     */
    export interface PartialParamMap {
      /**
       * Company ID
       */
      companyId: number;
      /**
       * Aggregation type
       */
      aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
      /**
       * Export type
       */
      exportType: 'EXCEL' | 'PDF' | 'CSV';
      /**
       * Facility IDs
       */
      facilityIds?: Array<number>;
      /**
       * Semi-product ID
       */
      semiProductId?: number;
      /**
       * Farmer (UserCustomer) ID
       */
      farmerId?: number;
      /**
       * Collector (Representative of producer UserCustomer) ID
       */
      collectorId?: number;
      /**
       * Is women share
       */
      isWomenShare?: boolean;
      /**
       * Organic only
       */
      organicOnly?: boolean;
      /**
       * Price determined later
       */
      priceDeterminedLater?: boolean;
      /**
       * Production date range start
       */
      productionDateStart?: string;
      /**
       * Production date range end
       */
      productionDateEnd?: string;
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for exportDeliveriesData.
     */
    export enum Parameters {
      /**
       * Company ID
       */
      companyId = 'companyId',
      /**
       * Aggregation type
       */
      aggregationType = 'aggregationType',
      /**
       * Export type
       */
      exportType = 'exportType',
      /**
       * Facility IDs
       */
      facilityIds = 'facilityIds',
      /**
       * Semi-product ID
       */
      semiProductId = 'semiProductId',
      /**
       * Farmer (UserCustomer) ID
       */
      farmerId = 'farmerId',
      /**
       * Collector (Representative of producer UserCustomer) ID
       */
      collectorId = 'collectorId',
      /**
       * Is women share
       */
      isWomenShare = 'isWomenShare',
      /**
       * Organic only
       */
      organicOnly = 'organicOnly',
      /**
       * Price determined later
       */
      priceDeterminedLater = 'priceDeterminedLater',
      /**
       * Production date range start
       */
      productionDateStart = 'productionDateStart',
      /**
       * Production date range end
       */
      productionDateEnd = 'productionDateEnd',
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of exportDeliveriesData
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ExportDeliveriesData.PartialParamMap]?: [string, ValidatorFn][]} = {
      companyId: [
              ['required', Validators.required],
      ],
      aggregationType: [
              ['required', Validators.required],
      ],
      exportType: [
              ['required', Validators.required],
      ],
      facilityIds: [
      ],
      semiProductId: [
      ],
      farmerId: [
      ],
      collectorId: [
      ],
      isWomenShare: [
      ],
      organicOnly: [
      ],
      priceDeterminedLater: [
      ],
      productionDateStart: [
      ],
      productionDateEnd: [
      ],
      language: [
      ],
    };
}

/**
 * Namespace for exportProcessingPerformanceData.
 */
export namespace ExportProcessingPerformanceData {
    /**
     * Parameter map for exportProcessingPerformanceData.
     */
    export interface PartialParamMap {
      ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest;
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for exportProcessingPerformanceData.
     */
    export enum Parameters {
      ApiProcessingPerformanceRequest = 'ApiProcessingPerformanceRequest',
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of exportProcessingPerformanceData
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ExportProcessingPerformanceData.PartialParamMap]?: [string, ValidatorFn][]} = {
      language: [
      ],
    };
}

/**
 * Namespace for getDeliveriesAggregatedData.
 */
export namespace GetDeliveriesAggregatedData {
    /**
     * Parameter map for getDeliveriesAggregatedData.
     */
    export interface PartialParamMap {
      /**
       * Company ID
       */
      companyId: number;
      /**
       * Aggregation type
       */
      aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
      /**
       * Facility IDs
       */
      facilityIds?: Array<number>;
      /**
       * Semi-product ID
       */
      semiProductId?: number;
      /**
       * Farmer (UserCustomer) ID
       */
      farmerId?: number;
      /**
       * Collector (Representative of producer UserCustomer) ID
       */
      collectorId?: number;
      /**
       * Is women share
       */
      isWomenShare?: boolean;
      /**
       * Organic only
       */
      organicOnly?: boolean;
      /**
       * Price determined later
       */
      priceDeterminedLater?: boolean;
      /**
       * Production date range start
       */
      productionDateStart?: string;
      /**
       * Production date range end
       */
      productionDateEnd?: string;
    }

    /**
     * Enumeration of all parameters for getDeliveriesAggregatedData.
     */
    export enum Parameters {
      /**
       * Company ID
       */
      companyId = 'companyId',
      /**
       * Aggregation type
       */
      aggregationType = 'aggregationType',
      /**
       * Facility IDs
       */
      facilityIds = 'facilityIds',
      /**
       * Semi-product ID
       */
      semiProductId = 'semiProductId',
      /**
       * Farmer (UserCustomer) ID
       */
      farmerId = 'farmerId',
      /**
       * Collector (Representative of producer UserCustomer) ID
       */
      collectorId = 'collectorId',
      /**
       * Is women share
       */
      isWomenShare = 'isWomenShare',
      /**
       * Organic only
       */
      organicOnly = 'organicOnly',
      /**
       * Price determined later
       */
      priceDeterminedLater = 'priceDeterminedLater',
      /**
       * Production date range start
       */
      productionDateStart = 'productionDateStart',
      /**
       * Production date range end
       */
      productionDateEnd = 'productionDateEnd'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getDeliveriesAggregatedData
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetDeliveriesAggregatedData.PartialParamMap]?: [string, ValidatorFn][]} = {
      companyId: [
              ['required', Validators.required],
      ],
      aggregationType: [
              ['required', Validators.required],
      ],
      facilityIds: [
      ],
      semiProductId: [
      ],
      farmerId: [
      ],
      collectorId: [
      ],
      isWomenShare: [
      ],
      organicOnly: [
      ],
      priceDeterminedLater: [
      ],
      productionDateStart: [
      ],
      productionDateEnd: [
      ],
    };
}



@Injectable({
  providedIn: 'root'
})
export class DashboardControllerService {

    protected basePath = 'http://localhost:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {

        if (configuration) {
            this.configuration = configuration;
            this.configuration.basePath = configuration.basePath != null ? configuration.basePath : (basePath != null ? basePath : this.basePath);
        } else {
            this.configuration.basePath = basePath != null ? basePath : this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }



  /**
   * Calculates processing performance data by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public calculateProcessingPerformanceDataByMap(
    map: CalculateProcessingPerformanceData.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiProcessingPerformanceTotal>;
  public calculateProcessingPerformanceDataByMap(
    map: CalculateProcessingPerformanceData.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiProcessingPerformanceTotal>>;
  public calculateProcessingPerformanceDataByMap(
    map: CalculateProcessingPerformanceData.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiProcessingPerformanceTotal>>;
  public calculateProcessingPerformanceDataByMap(
    map: CalculateProcessingPerformanceData.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.calculateProcessingPerformanceData(
      map.ApiProcessingPerformanceRequest,
      observe,
      reportProgress
    );
  }


    /**
     * Calculates processing performance data
     * 
     * @param ApiProcessingPerformanceRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public calculateProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiProcessingPerformanceTotal>;
    public calculateProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiProcessingPerformanceTotal>>;
    public calculateProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiProcessingPerformanceTotal>>;
    public calculateProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (ApiProcessingPerformanceRequest === null || ApiProcessingPerformanceRequest === undefined) {
            throw new Error('Required parameter ApiProcessingPerformanceRequest was null or undefined when calling calculateProcessingPerformanceData.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

            if (additionalHeaders) {
                for(let pair of additionalHeaders) {
                    headers = headers.set(pair[0], pair[1]);
                }
            }

        const handle = this.httpClient.post<ApiResponseApiProcessingPerformanceTotal>(`${this.configuration.basePath}/api/dashboard/processing-performance-data`,
            ApiProcessingPerformanceRequest,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'calculateProcessingPerformanceData')));
        }
        return handle;
    }


  /**
   *  by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public exportDeliveriesDataByMap(
    map: ExportDeliveriesData.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<string>;
  public exportDeliveriesDataByMap(
    map: ExportDeliveriesData.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<string>>;
  public exportDeliveriesDataByMap(
    map: ExportDeliveriesData.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<string>>;
  public exportDeliveriesDataByMap(
    map: ExportDeliveriesData.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.exportDeliveriesData(
      map.companyId,
      map.aggregationType,
      map.exportType,
      map.facilityIds,
      map.semiProductId,
      map.farmerId,
      map.collectorId,
      map.isWomenShare,
      map.organicOnly,
      map.priceDeterminedLater,
      map.productionDateStart,
      map.productionDateEnd,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * 
     * 
     * @param companyId Company ID
     * @param aggregationType Aggregation type
     * @param exportType Export type
     * @param facilityIds Facility IDs
     * @param semiProductId Semi-product ID
     * @param farmerId Farmer (UserCustomer) ID
     * @param collectorId Collector (Representative of producer UserCustomer) ID
     * @param isWomenShare Is women share
     * @param organicOnly Organic only
     * @param priceDeterminedLater Price determined later
     * @param productionDateStart Production date range start
     * @param productionDateEnd Production date range end
     * @param language 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public exportDeliveriesData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', exportType: 'EXCEL' | 'PDF' | 'CSV', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<string>;
    public exportDeliveriesData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', exportType: 'EXCEL' | 'PDF' | 'CSV', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<string>>;
    public exportDeliveriesData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', exportType: 'EXCEL' | 'PDF' | 'CSV', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<string>>;
    public exportDeliveriesData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', exportType: 'EXCEL' | 'PDF' | 'CSV', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling exportDeliveriesData.');
        }
        if (aggregationType === null || aggregationType === undefined) {
            throw new Error('Required parameter aggregationType was null or undefined when calling exportDeliveriesData.');
        }
        if (exportType === null || exportType === undefined) {
            throw new Error('Required parameter exportType was null or undefined when calling exportDeliveriesData.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (companyId !== undefined && companyId !== null) {
            queryParameters = queryParameters.set('companyId', <any>companyId);
        }
        if (facilityIds) {
            facilityIds.forEach((element) => {
                queryParameters = queryParameters.append('facilityIds', <any>element);
            })
        }
        if (semiProductId !== undefined && semiProductId !== null) {
            queryParameters = queryParameters.set('semiProductId', <any>semiProductId);
        }
        if (farmerId !== undefined && farmerId !== null) {
            queryParameters = queryParameters.set('farmerId', <any>farmerId);
        }
        if (collectorId !== undefined && collectorId !== null) {
            queryParameters = queryParameters.set('collectorId', <any>collectorId);
        }
        if (isWomenShare !== undefined && isWomenShare !== null) {
            queryParameters = queryParameters.set('isWomenShare', <any>isWomenShare);
        }
        if (organicOnly !== undefined && organicOnly !== null) {
            queryParameters = queryParameters.set('organicOnly', <any>organicOnly);
        }
        if (priceDeterminedLater !== undefined && priceDeterminedLater !== null) {
            queryParameters = queryParameters.set('priceDeterminedLater', <any>priceDeterminedLater);
        }
        if (productionDateStart !== undefined && productionDateStart !== null) {
            queryParameters = queryParameters.set('productionDateStart', <any>productionDateStart);
        }
        if (productionDateEnd !== undefined && productionDateEnd !== null) {
            queryParameters = queryParameters.set('productionDateEnd', <any>productionDateEnd);
        }
        if (aggregationType !== undefined && aggregationType !== null) {
            queryParameters = queryParameters.set('aggregationType', <any>aggregationType);
        }
        if (exportType !== undefined && exportType !== null) {
            queryParameters = queryParameters.set('exportType', <any>exportType);
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

            if (additionalHeaders) {
                for(let pair of additionalHeaders) {
                    headers = headers.set(pair[0], pair[1]);
                }
            }

        const handle = this.httpClient.get<string>(`${this.configuration.basePath}/api/dashboard/deliveries-aggregated-data/export`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'exportDeliveriesData')));
        }
        return handle;
    }


  /**
   * Exports processing performance data to the requested format by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public exportProcessingPerformanceDataByMap(
    map: ExportProcessingPerformanceData.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<string>;
  public exportProcessingPerformanceDataByMap(
    map: ExportProcessingPerformanceData.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<string>>;
  public exportProcessingPerformanceDataByMap(
    map: ExportProcessingPerformanceData.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<string>>;
  public exportProcessingPerformanceDataByMap(
    map: ExportProcessingPerformanceData.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.exportProcessingPerformanceData(
      map.ApiProcessingPerformanceRequest,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Exports processing performance data to the requested format
     * 
     * @param ApiProcessingPerformanceRequest 
     * @param language 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public exportProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<string>;
    public exportProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<string>>;
    public exportProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<string>>;
    public exportProcessingPerformanceData(ApiProcessingPerformanceRequest: ApiProcessingPerformanceRequest, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (ApiProcessingPerformanceRequest === null || ApiProcessingPerformanceRequest === undefined) {
            throw new Error('Required parameter ApiProcessingPerformanceRequest was null or undefined when calling exportProcessingPerformanceData.');
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

            if (additionalHeaders) {
                for(let pair of additionalHeaders) {
                    headers = headers.set(pair[0], pair[1]);
                }
            }

        const handle = this.httpClient.post<string>(`${this.configuration.basePath}/api/dashboard/processing-performance-data/export`,
            ApiProcessingPerformanceRequest,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'exportProcessingPerformanceData')));
        }
        return handle;
    }


  /**
   *  by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getDeliveriesAggregatedDataByMap(
    map: GetDeliveriesAggregatedData.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiResponseApiDeliveriesTotal>;
  public getDeliveriesAggregatedDataByMap(
    map: GetDeliveriesAggregatedData.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiResponseApiDeliveriesTotal>>;
  public getDeliveriesAggregatedDataByMap(
    map: GetDeliveriesAggregatedData.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiResponseApiDeliveriesTotal>>;
  public getDeliveriesAggregatedDataByMap(
    map: GetDeliveriesAggregatedData.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getDeliveriesAggregatedData(
      map.companyId,
      map.aggregationType,
      map.facilityIds,
      map.semiProductId,
      map.farmerId,
      map.collectorId,
      map.isWomenShare,
      map.organicOnly,
      map.priceDeterminedLater,
      map.productionDateStart,
      map.productionDateEnd,
      observe,
      reportProgress
    );
  }


    /**
     * 
     * 
     * @param companyId Company ID
     * @param aggregationType Aggregation type
     * @param facilityIds Facility IDs
     * @param semiProductId Semi-product ID
     * @param farmerId Farmer (UserCustomer) ID
     * @param collectorId Collector (Representative of producer UserCustomer) ID
     * @param isWomenShare Is women share
     * @param organicOnly Organic only
     * @param priceDeterminedLater Price determined later
     * @param productionDateStart Production date range start
     * @param productionDateEnd Production date range end
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDeliveriesAggregatedData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiResponseApiDeliveriesTotal>;
    public getDeliveriesAggregatedData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiResponseApiDeliveriesTotal>>;
    public getDeliveriesAggregatedData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiResponseApiDeliveriesTotal>>;
    public getDeliveriesAggregatedData(companyId: number, aggregationType: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR', facilityIds?: Array<number>, semiProductId?: number, farmerId?: number, collectorId?: number, isWomenShare?: boolean, organicOnly?: boolean, priceDeterminedLater?: boolean, productionDateStart?: string, productionDateEnd?: string, observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (companyId === null || companyId === undefined) {
            throw new Error('Required parameter companyId was null or undefined when calling getDeliveriesAggregatedData.');
        }
        if (aggregationType === null || aggregationType === undefined) {
            throw new Error('Required parameter aggregationType was null or undefined when calling getDeliveriesAggregatedData.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (companyId !== undefined && companyId !== null) {
            queryParameters = queryParameters.set('companyId', <any>companyId);
        }
        if (facilityIds) {
            facilityIds.forEach((element) => {
                queryParameters = queryParameters.append('facilityIds', <any>element);
            })
        }
        if (semiProductId !== undefined && semiProductId !== null) {
            queryParameters = queryParameters.set('semiProductId', <any>semiProductId);
        }
        if (farmerId !== undefined && farmerId !== null) {
            queryParameters = queryParameters.set('farmerId', <any>farmerId);
        }
        if (collectorId !== undefined && collectorId !== null) {
            queryParameters = queryParameters.set('collectorId', <any>collectorId);
        }
        if (isWomenShare !== undefined && isWomenShare !== null) {
            queryParameters = queryParameters.set('isWomenShare', <any>isWomenShare);
        }
        if (organicOnly !== undefined && organicOnly !== null) {
            queryParameters = queryParameters.set('organicOnly', <any>organicOnly);
        }
        if (priceDeterminedLater !== undefined && priceDeterminedLater !== null) {
            queryParameters = queryParameters.set('priceDeterminedLater', <any>priceDeterminedLater);
        }
        if (productionDateStart !== undefined && productionDateStart !== null) {
            queryParameters = queryParameters.set('productionDateStart', <any>productionDateStart);
        }
        if (productionDateEnd !== undefined && productionDateEnd !== null) {
            queryParameters = queryParameters.set('productionDateEnd', <any>productionDateEnd);
        }
        if (aggregationType !== undefined && aggregationType !== null) {
            queryParameters = queryParameters.set('aggregationType', <any>aggregationType);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

            if (additionalHeaders) {
                for(let pair of additionalHeaders) {
                    headers = headers.set(pair[0], pair[1]);
                }
            }

        const handle = this.httpClient.get<ApiResponseApiDeliveriesTotal>(`${this.configuration.basePath}/api/dashboard/deliveries-aggregated-data`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getDeliveriesAggregatedData')));
        }
        return handle;
    }

}
