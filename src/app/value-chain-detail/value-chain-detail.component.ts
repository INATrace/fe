import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ValueChainControllerService } from '../../api/api/valueChainController.service';
import { finalize } from 'rxjs/operators';
import { GlobalEventManagerService } from '../system/global-event-manager.service';
import { generateFormFromMetadata } from '../../shared/utils';
import { ApiValueChain } from '../../api/model/apiValueChain';
import { ApiValueChainValidationScheme } from './validation';

@Component({
  selector: 'app-value-chain-detail',
  templateUrl: './value-chain-detail.component.html',
  styleUrls: ['./value-chain-detail.component.scss']
})
export class ValueChainDetailComponent implements OnInit {

  valueChainDetailForm: FormGroup;

  submitted = false;

  title: string;

  constructor(
    protected route: ActivatedRoute,
    private valueChainService: ValueChainControllerService,
    private globalEventsManager: GlobalEventManagerService
  ) { }

  get mode() {
    const id = this.route.snapshot.params.id;
    return id == null ? 'create' : 'update';
  }

  get changed() {
    return this.valueChainDetailForm.dirty;
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.title = $localize`:@@valueChainDetail.title.edit:Edit value chain`;
      this.getValueChain();
    } else {
      this.title = $localize`:@@valueChainDetail.title.add:Create new value chain`;
      this.newValueChain();
    }
  }

  public canDeactivate(): boolean {
    return !this.valueChainDetailForm || !this.valueChainDetailForm.dirty;
  }

  private getValueChain() {
    this.globalEventsManager.showLoading(true);
    const id = this.route.snapshot.paramMap.get('id');
    this.valueChainService.getValueChainUsingGET(Number(id))
      .pipe(
        finalize(() => this.globalEventsManager.showLoading(false))
      )
      .subscribe(
        valueChain => {
          this.valueChainDetailForm =
            generateFormFromMetadata(ApiValueChain.formMetadata(), valueChain.data, ApiValueChainValidationScheme);
        },
        error => {
          console.log('ERR: ', error);
        }
      );
  }

  private newValueChain() {
    this.valueChainDetailForm =
      generateFormFromMetadata(ApiValueChain.formMetadata(), {} as ApiValueChain, ApiValueChainValidationScheme);
  }

  validate() {
    this.submitted = true;
  }

  save() {

  }

  create() {

  }

}
