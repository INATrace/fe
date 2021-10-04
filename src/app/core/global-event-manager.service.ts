import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageResultType } from './message-modal/message-modal-labels.service';
import { MessageModalDefinition, MessageModalService } from './message-modal/message-modal.service';
import { map, shareReplay } from 'rxjs/operators';

export interface NotificationData {
    action?: 'success' | 'error',
    notificationType: 'success' | 'warning' | 'error',
    title: string,
    message: string
}

@Injectable({
    providedIn: 'root'
})
export class GlobalEventManagerService {
    private _showSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public showSidebarEmitter: Observable<boolean> = this._showSidebar.asObservable();

    private _sidebarNavigationChoice: BehaviorSubject<string> = new BehaviorSubject<string>("domov");
    public sidebarNavigationChoiceEmitter: Observable<string> = this._sidebarNavigationChoice.asObservable();

    private _showLoadingSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public showLoadingSpinnerEmitter: Observable<boolean> = this._showLoadingSpinner.asObservable();

  private _areGoogleMapsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public areGoogleMapsLoadedEmmiter: Observable<boolean> = this._areGoogleMapsLoaded.asObservable();

  private _isProductLabelUnpublished: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public isProductLabelPublishedEmitter: Observable<string> = this._isProductLabelUnpublished.asObservable();

  private _selectedUserCompany: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public selectedUserCompanyEmitter: Observable<string> = this._selectedUserCompany.asObservable();

  productLabelIsUnpublished(val: string) {
    this._isProductLabelUnpublished.next(val)
  }

  loadedGoogleMaps(val: boolean) {
    this._areGoogleMapsLoaded.next(val)
  }

  selectedUserCompany(val: string) {
    this._selectedUserCompany.next(val)
  }

    public notLoading$ = this._showLoadingSpinner.pipe(
        map(x => !x),
        shareReplay(2)
    )

    constructor(
        private toastr: ToastrService,
        private messageModalService: MessageModalService
    ) { }

    showSidebar(ifShow: boolean) {
        this._showSidebar.next(ifShow);
    }

    setSidebarNavigationChoice(choice: string) {
        this._sidebarNavigationChoice.next(choice);
    }

    showLoading(ifShow: boolean) {
        setTimeout(() => this._showLoadingSpinner.next(ifShow), 0);
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

                            // // staro
                            // tapToDismiss: true,
                            // enableHtml: true,
                            // disableTimeOut: true
                        }
                    );
                    return;
                default:
                    throw Error("Napačen tip notifikacije")

            }
        }
    }

    defaultListingPageSize() {
        return 5;
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
        ]
    }


    globalSettingsKeys(key) {
      if (key === "PRODUCT_LABELS_HELPER_LINK") return "PRODUCT_LABELS_HELPER_LINK";
      if (key === "UNPUBLISHED_PRODUCT_LABEL_TEXT") return "UNPUBLISHED_PRODUCT_LABEL_TEXT";
    }


}
