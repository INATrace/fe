import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageResultType } from './message-modal/message-modal-labels.service';
import { MessageModalDefinition, MessageModalService } from './message-modal/message-modal.service';

export interface NotificationData {
  action?: 'success' | 'error';
  notificationType: 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalEventManagerService {

  private showLoadingSpinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showLoadingSpinnerEmitter: Observable<boolean> = this.showLoadingSpinnerSubject.asObservable();

  private loadedGoogleMapsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadedGoogleMapsEmitter: Observable<boolean> = this.loadedGoogleMapsSubject.asObservable();

  loadedGoogleMaps(val: boolean) {
    this.loadedGoogleMapsSubject.next(val);
  }

  constructor(
    private toastr: ToastrService,
    private messageModalService: MessageModalService
  ) {
  }

  showLoading(ifShow: boolean) {
    setTimeout(() => this.showLoadingSpinnerSubject.next(ifShow), 0);
  }

  push(notification: NotificationData) {
    if (notification) {
      switch (notification.notificationType) {
        case 'success':
          this.toastr.success(
            notification.message,
            notification.title,
            {
              enableHtml: true
            }
          );
          return;
        case 'warning':
          this.toastr.warning(
            notification.message,
            notification.title,
            {
              tapToDismiss: true,
              enableHtml: true,
              timeOut: 5000,
              extendedTimeOut: 5000
            }
          );
          return;
        case 'error':
          this.toastr.error(
            notification.message,
            notification.title,
            {
              tapToDismiss: true,
              enableHtml: true,
              timeOut: 10000,
              extendedTimeOut: 5000
            }
          );
          return;
        default:
          throw Error('Napačen tip notifikacije');
      }
    }
  }

  openMessageModal(definition: MessageModalDefinition): Promise<MessageResultType> {
    return this.messageModalService.open(definition);
  }

  languages() {
    return [
      {
        id: 'sl',
        label: 'SL'
      },
      {
        id: 'en',
        label: 'EN'
      },
      {
        id: 'it',
        label: 'IT'
      },
      {
        id: 'hu',
        label: 'HU'
      }
    ];
  }


  globalSettingsKeys(key) {
    if (key === 'PRODUCT_LABELS_HELPER_LINK') {
      return 'PRODUCT_LABELS_HELPER_LINK';
    }
    if (key === 'UNPUBLISHED_PRODUCT_LABEL_TEXT') {
      return 'UNPUBLISHED_PRODUCT_LABEL_TEXT';
    }
  }


}
