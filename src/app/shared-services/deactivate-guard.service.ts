import { Injectable } from '@angular/core';
import { ComponentCanDeactivate } from './component-can-deactivate';
import { CanDeactivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuardService implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    if(!component.canDeactivate()){
      let message = $localize`:@@deactivateGuard.message:Changes you made so far will not be saved. Do you want to continue?`
        if (confirm(message)) {
            return true;
        } else {
            return false;
        }
    }
    return true;
  }
}
