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

import { ApiDefaultResponse } from '../model/apiDefaultResponse';
import { ApiPaginatedResponseApiTransaction } from '../model/apiPaginatedResponseApiTransaction';
import { ApiTransaction } from '../model/apiTransaction';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for approveTransaction.
 */
export namespace ApproveTransaction {
    /**
     * Parameter map for approveTransaction.
     */
    export interface PartialParamMap {
      /**
       * Transaction ID
       */
      id: number;
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for approveTransaction.
     */
    export enum Parameters {
      /**
       * Transaction ID
       */
      id = 'id',
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of approveTransaction
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ApproveTransaction.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
      language: [
      ],
    };
}

/**
 * Namespace for getStockOrderInputTransactions.
 */
export namespace GetStockOrderInputTransactions {
    /**
     * Parameter map for getStockOrderInputTransactions.
     */
    export interface PartialParamMap {
      /**
       * Company ID
       */
      stockOrderId: number;
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for getStockOrderInputTransactions.
     */
    export enum Parameters {
      /**
       * Company ID
       */
      stockOrderId = 'stockOrderId',
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of getStockOrderInputTransactions
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof GetStockOrderInputTransactions.PartialParamMap]?: [string, ValidatorFn][]} = {
      stockOrderId: [
              ['required', Validators.required],
      ],
      language: [
      ],
    };
}

/**
 * Namespace for rejectTransaction.
 */
export namespace RejectTransaction {
    /**
     * Parameter map for rejectTransaction.
     */
    export interface PartialParamMap {
      /**
       * Transaction ID
       */
      id: number;
      ApiTransaction: ApiTransaction;
      language?: 'EN' | 'DE' | 'RW' | 'ES';
    }

    /**
     * Enumeration of all parameters for rejectTransaction.
     */
    export enum Parameters {
      /**
       * Transaction ID
       */
      id = 'id',
      ApiTransaction = 'ApiTransaction',
      language = 'language'
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of rejectTransaction
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof RejectTransaction.PartialParamMap]?: [string, ValidatorFn][]} = {
      id: [
              ['required', Validators.required],
      ],
      language: [
      ],
    };
}



@Injectable({
  providedIn: 'root'
})
export class TransactionControllerService {

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
   * Approves transaction with provided ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public approveTransactionByMap(
    map: ApproveTransaction.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public approveTransactionByMap(
    map: ApproveTransaction.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public approveTransactionByMap(
    map: ApproveTransaction.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public approveTransactionByMap(
    map: ApproveTransaction.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.approveTransaction(
      map.id,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Approves transaction with provided ID.
     * 
     * @param id Transaction ID
     * @param language 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public approveTransaction(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public approveTransaction(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public approveTransaction(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public approveTransaction(id: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling approveTransaction.');
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
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

        const handle = this.httpClient.put<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/transaction/${encodeURIComponent(String(id))}/approve`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'approveTransaction')));
        }
        return handle;
    }


  /**
   * Get a paginated list of input transactions for provided stock order ID. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getStockOrderInputTransactionsByMap(
    map: GetStockOrderInputTransactions.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiPaginatedResponseApiTransaction>;
  public getStockOrderInputTransactionsByMap(
    map: GetStockOrderInputTransactions.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiPaginatedResponseApiTransaction>>;
  public getStockOrderInputTransactionsByMap(
    map: GetStockOrderInputTransactions.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiPaginatedResponseApiTransaction>>;
  public getStockOrderInputTransactionsByMap(
    map: GetStockOrderInputTransactions.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.getStockOrderInputTransactions(
      map.stockOrderId,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Get a paginated list of input transactions for provided stock order ID.
     * 
     * @param stockOrderId Company ID
     * @param language 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getStockOrderInputTransactions(stockOrderId: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiPaginatedResponseApiTransaction>;
    public getStockOrderInputTransactions(stockOrderId: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiPaginatedResponseApiTransaction>>;
    public getStockOrderInputTransactions(stockOrderId: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiPaginatedResponseApiTransaction>>;
    public getStockOrderInputTransactions(stockOrderId: number, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (stockOrderId === null || stockOrderId === undefined) {
            throw new Error('Required parameter stockOrderId was null or undefined when calling getStockOrderInputTransactions.');
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
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

        const handle = this.httpClient.get<ApiPaginatedResponseApiTransaction>(`${this.configuration.basePath}/api/chain/transaction/list/input/stock-order/${encodeURIComponent(String(stockOrderId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'getStockOrderInputTransactions')));
        }
        return handle;
    }


  /**
   * Rejects transaction with provided ID and reverts it&#39;s quantities. by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public rejectTransactionByMap(
    map: RejectTransaction.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<ApiDefaultResponse>;
  public rejectTransactionByMap(
    map: RejectTransaction.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<ApiDefaultResponse>>;
  public rejectTransactionByMap(
    map: RejectTransaction.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<ApiDefaultResponse>>;
  public rejectTransactionByMap(
    map: RejectTransaction.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.rejectTransaction(
      map.id,
      map.ApiTransaction,
      map.language,
      observe,
      reportProgress
    );
  }


    /**
     * Rejects transaction with provided ID and reverts it&#39;s quantities.
     * 
     * @param id Transaction ID
     * @param ApiTransaction 
     * @param language 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public rejectTransaction(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<ApiDefaultResponse>;
    public rejectTransaction(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<ApiDefaultResponse>>;
    public rejectTransaction(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<ApiDefaultResponse>>;
    public rejectTransaction(id: number, ApiTransaction: ApiTransaction, language?: 'EN' | 'DE' | 'RW' | 'ES', observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling rejectTransaction.');
        }
        if (ApiTransaction === null || ApiTransaction === undefined) {
            throw new Error('Required parameter ApiTransaction was null or undefined when calling rejectTransaction.');
        }

        let headers = this.defaultHeaders;
        if (language !== undefined && language !== null) {
            headers = headers.set('language', String(language));
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
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

        const handle = this.httpClient.put<ApiDefaultResponse>(`${this.configuration.basePath}/api/chain/transaction/${encodeURIComponent(String(id))}/reject`,
            ApiTransaction,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'rejectTransaction')));
        }
        return handle;
    }

}
