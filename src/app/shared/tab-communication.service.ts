import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabCommunicationService {

  constructor() { }


  private tabTitles = new Subject<string[]>();
  private activeTab = new Subject<number>();
  private _rootTab: number;
  private _lockedTabs: string[];
  private _tabTitles: string[];
  private _tabNames: string[];

  announceTabTitles$ = this.tabTitles.asObservable();
  confirmActiveTab$ = this.activeTab.asObservable();

  announceTabTitles(tabTitles: string[]) {
    this.tabTitles.next(tabTitles);
    this._tabTitles = tabTitles;
  }

  confirmActiveTab(tab: number) {
    this.activeTab.next(tab);
  }

  setRootTab(tab: number) {
    this._rootTab = tab;
  }

  setTabNames(tabNames: string[]) {
    this._tabNames = tabNames;
  }

  setLockedTabs(lockedTabs: string[]) {
    this._lockedTabs = lockedTabs || [];
  }

  public get rootTab() {
    return this._rootTab;
  }

  getTabNameForId(id: number) {
    if (id >= this._tabNames.length || id < 0) { return null; }
    return this._tabNames[id];
  }

  subscribe(tabs: string[], tabNames: string[], rootTab: number, targetRoute: (segment: string) => null, lockedTabs?: string[]): Subscription {
    this.announceTabTitles(tabs);
    this.setTabNames(tabNames);
    this.setRootTab(rootTab);
    this.setLockedTabs(lockedTabs);
    return this.confirmActiveTab$.subscribe(
      tab => {
        if (tab === this.rootTab) { return; }
        targetRoute(this.getTabNameForId(tab));
      });
  }

  isLocked(tab: string) {
    return this._lockedTabs.indexOf(tab) >= 0;
  }

  isLockedIndex(index: number) {
    return this._lockedTabs.indexOf(this._tabNames[index]) >= 0;
  }

}
