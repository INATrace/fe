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

/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';
import { catchError }                                        from 'rxjs/operators';


import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/**
 * Namespace for errorUsingDELETE.
 */
export namespace ErrorUsingDELETE {
    /**
     * Parameter map for errorUsingDELETE.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingDELETE.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingDELETE
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingDELETE.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for errorUsingGET.
 */
export namespace ErrorUsingGET {
    /**
     * Parameter map for errorUsingGET.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingGET.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingGET
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingGET.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for errorUsingHEAD.
 */
export namespace ErrorUsingHEAD {
    /**
     * Parameter map for errorUsingHEAD.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingHEAD.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingHEAD
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingHEAD.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for errorUsingOPTIONS.
 */
export namespace ErrorUsingOPTIONS {
    /**
     * Parameter map for errorUsingOPTIONS.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingOPTIONS.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingOPTIONS
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingOPTIONS.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for errorUsingPATCH.
 */
export namespace ErrorUsingPATCH {
    /**
     * Parameter map for errorUsingPATCH.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingPATCH.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingPATCH
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingPATCH.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for errorUsingPOST.
 */
export namespace ErrorUsingPOST {
    /**
     * Parameter map for errorUsingPOST.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingPOST.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingPOST
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingPOST.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}

/**
 * Namespace for errorUsingPUT.
 */
export namespace ErrorUsingPUT {
    /**
     * Parameter map for errorUsingPUT.
     */
    export interface PartialParamMap {
    }

    /**
     * Enumeration of all parameters for errorUsingPUT.
     */
    export enum Parameters {
    }

    /**
     * A map of tuples with error name and `ValidatorFn` for each parameter of errorUsingPUT
     * that does not have an own model.
     */
    export const ParamValidators: {[K in keyof ErrorUsingPUT.PartialParamMap]?: [string, ValidatorFn][]} = {
    };
}



@Injectable({
  providedIn: 'root'
})
export class BasicErrorControllerService {

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
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingDELETEByMap(
    map: ErrorUsingDELETE.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingDELETEByMap(
    map: ErrorUsingDELETE.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingDELETEByMap(
    map: ErrorUsingDELETE.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingDELETEByMap(
    map: ErrorUsingDELETE.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingDELETE(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingDELETE(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingDELETE(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingDELETE(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingDELETE(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.delete<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingDELETE')));
        }
        return handle;
    }


  /**
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingGETByMap(
    map: ErrorUsingGET.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingGETByMap(
    map: ErrorUsingGET.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingGETByMap(
    map: ErrorUsingGET.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingGETByMap(
    map: ErrorUsingGET.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingGET(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingGET(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingGET(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingGET(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingGET(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.get<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingGET')));
        }
        return handle;
    }


  /**
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingHEADByMap(
    map: ErrorUsingHEAD.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingHEADByMap(
    map: ErrorUsingHEAD.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingHEADByMap(
    map: ErrorUsingHEAD.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingHEADByMap(
    map: ErrorUsingHEAD.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingHEAD(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingHEAD(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingHEAD(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingHEAD(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingHEAD(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.head<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingHEAD')));
        }
        return handle;
    }


  /**
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingOPTIONSByMap(
    map: ErrorUsingOPTIONS.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingOPTIONSByMap(
    map: ErrorUsingOPTIONS.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingOPTIONSByMap(
    map: ErrorUsingOPTIONS.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingOPTIONSByMap(
    map: ErrorUsingOPTIONS.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingOPTIONS(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingOPTIONS(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingOPTIONS(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingOPTIONS(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingOPTIONS(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.options<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingOPTIONS')));
        }
        return handle;
    }


  /**
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingPATCHByMap(
    map: ErrorUsingPATCH.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingPATCHByMap(
    map: ErrorUsingPATCH.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingPATCHByMap(
    map: ErrorUsingPATCH.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingPATCHByMap(
    map: ErrorUsingPATCH.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingPATCH(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingPATCH(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingPATCH(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingPATCH(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingPATCH(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.patch<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingPATCH')));
        }
        return handle;
    }


  /**
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingPOSTByMap(
    map: ErrorUsingPOST.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingPOSTByMap(
    map: ErrorUsingPOST.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingPOSTByMap(
    map: ErrorUsingPOST.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingPOSTByMap(
    map: ErrorUsingPOST.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingPOST(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingPOST(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingPOST(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingPOST(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingPOST(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.post<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingPOST')));
        }
        return handle;
    }


  /**
   * error by map.
   * 
   * @param map parameters map to set partial amount of parameters easily
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public errorUsingPUTByMap(
    map: ErrorUsingPUT.PartialParamMap,
    observe?: 'body',
    reportProgress?: boolean): Observable<{ [key: string]: any; }>;
  public errorUsingPUTByMap(
    map: ErrorUsingPUT.PartialParamMap,
    observe?: 'response',
    reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: any; }>>;
  public errorUsingPUTByMap(
    map: ErrorUsingPUT.PartialParamMap,
    observe?: 'events',
    reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: any; }>>;
  public errorUsingPUTByMap(
    map: ErrorUsingPUT.PartialParamMap,
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {
    return this.errorUsingPUT(
      observe,
      reportProgress
    );
  }


    /**
     * error
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public errorUsingPUT(observe?: 'body', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<{ [key: string]: any; }>;
    public errorUsingPUT(observe?: 'response', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpResponse<{ [key: string]: any; }>>;
    public errorUsingPUT(observe?: 'events', reportProgress?: boolean, additionalHeaders?: Array<Array<string>>): Observable<HttpEvent<{ [key: string]: any; }>>;
    public errorUsingPUT(observe: any = 'body', reportProgress: boolean = false, additionalHeaders?: Array<Array<string>>): Observable<any> {

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

        const handle = this.httpClient.put<{ [key: string]: any; }>(`${this.configuration.basePath}/error`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
        if(typeof this.configuration.errorHandler === 'function') {
          return handle.pipe(catchError(err => this.configuration.errorHandler(err, 'errorUsingPUT')));
        }
        return handle;
    }

}
