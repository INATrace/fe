// https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f

import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from "@angular/core";

// https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular
// glej lazy modules

@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();
    private lastToken = null;
    // allowRetriveCache = {
    //     '/': true,
    //     '/companies': true,
    //     '/users': true,
    //     '/product-labels': true,
    // };

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

    isCached(path) {
      // console.log("PATH:", path)
      if(!path) return false;
      for(let regEx of this.cachedPathsRegExList) {
          if(regEx.test(path)) return true;
      }
      return false;
    }

    clearStore() {
        this.storedRouteHandles.clear()
        // console.log("STORE:", this.storedRouteHandles)
    }

    tokenChanged() {
        let newToken = localStorage.token;
        let res = newToken != this.lastToken;
        // console.log("RR:", this.lastToken, newToken, res)
        this.lastToken = newToken;
        return res;
    }

    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // if (this.getPath(before) === 'detail' && this.getPath(curr) === 'search-result') {
        //     this.allowRetriveCache['search-results'] = true;
        // } else {
        //     this.allowRetriveCache['search-results'] = false;
        // }
        return before.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        // console.log("RETR:", this.getPath(route), this.storedRouteHandles, route)
        if (route.routeConfig.loadChildren) return null;
        return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        // console.log("shouldAttach   ", path, path)
        if(this.tokenChanged()) {
            this.clearStore();
            localStorage.setItem('token', null);
            this.lastToken = localStorage.getItem('token');
            // console.log("NOT ATTACHING:", path)
            return false;
        }
        // if (path != null && this.allowRetriveCache[path]) {
        if(this.isCached(path)) {
          // console.log("cache attach", this.getPath(route), this.storedRouteHandles.has(this.getPath(route)))
            return this.storedRouteHandles.has(this.getPath(route));
        }
        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        // console.log("shouldDetach :'" + path + "'", route)
        // if (path != null && this.allowRetriveCache.hasOwnProperty(path)) {
        if(this.isCached(path)) {
            return true;
        }
        return false;
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        // console.log("STORING:", this.getPath(route), route)
        this.storedRouteHandles.set(this.getPath(route), detachedTree);
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        // let pathFromParent = route.pathFromRoot.map(x => {
        //     if (x.routeConfig !== null && x.routeConfig.path !== null) {
        //         return x.routeConfig.path;
        //     }
        //     return ''
        // }).join('/')
        // console.log("RR:", route.pathFromRoot)
        let pathFromParent = route.pathFromRoot.map(x => {
            if(x.url.length > 0) {
                return x.url.map(y => y.path || '').join('/')
            }
            return ''
        }).join('/')
        return pathFromParent
        // if (route.routeConfig !== null && route.routeConfig.path !== null) {
        //     return route.routeConfig.path;
        // }
        // return null;
    }
}
