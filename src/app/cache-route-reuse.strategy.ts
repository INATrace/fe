// https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f

import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';

// https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular
// glej lazy modules

@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {

    storedRouteHandles = new Map<string, DetachedRouteHandle>();
    private lastToken = null;

    cachedPathsRegExList = [
      /^\/$/,
      /^\/companies$/,
      /^\/users$/,
      /^\/labels$/,
      /^\/product-labels\/\d+\/stock\/purchases\/tab$/,
      /^\/product-labels\/\d+\/stock\/processing\/tab$/,
      /^\/product-labels\/\d+\/stock\/payments\/tab$/,
      /^\/product-labels\/\d+\/stock\/configuration\/tab$/,
      /^\/product-labels\/\d+\/stock\/stock-orders\/tab$/,
      /^\/product-labels\/\d+\/stock\/transactions\/tab$/,
      /^\/product-labels\/\d+\/stakeholders\/value-chain$/,
      /^\/product-labels\/\d+\/stakeholders\/collectors$/,
      /^\/product-labels\/\d+\/stakeholders\/farmers$/,
      /^\/product-labels\/\d+\/stakeholders\/customers$/,
      /^\/product-labels\/\d+\/orders\/all-orders$/,
      /^\/product-labels\/\d+\/orders\/dashboard$/,
      /^\/product-labels\/\d+\/orders\/customer-orders$/,
    ] as RegExp[];

    private static getPath(route: ActivatedRouteSnapshot): string {

      return route.pathFromRoot.map(x => {
          if (x.url.length > 0) {
            return x.url.map(y => y.path || '').join('/');
          }
          return '';
        }).join('/');
    }

    isCached(path) {
      // console.log("PATH:", path)
      if (!path) { return false; }
      for (const regEx of this.cachedPathsRegExList) {
          if (regEx.test(path)) { return true; }
      }
      return false;
    }

    clearStore() {
        this.storedRouteHandles.clear();
        // console.log("STORE:", this.storedRouteHandles)
    }

    tokenChanged() {
        const newToken = localStorage.token;
        const res = newToken !== this.lastToken;
        // console.log("RR:", this.lastToken, newToken, res)
        this.lastToken = newToken;
        return res;
    }

    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return before.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (route.routeConfig.loadChildren) { return null; }
        return this.storedRouteHandles.get(CacheRouteReuseStrategy.getPath(route)) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = CacheRouteReuseStrategy.getPath(route);
        if (this.tokenChanged()) {
            this.clearStore();
            localStorage.setItem('token', null);
            this.lastToken = localStorage.getItem('token');
            return false;
        }

        if (this.isCached(path)) {
            return this.storedRouteHandles.has(CacheRouteReuseStrategy.getPath(route));
        }
        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = CacheRouteReuseStrategy.getPath(route);
        return this.isCached(path);
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        this.storedRouteHandles.set(CacheRouteReuseStrategy.getPath(route), detachedTree);
    }
}
