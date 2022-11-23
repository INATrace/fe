import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiPaginatedResponseApiGroupStockOrder} from '../../../../../api/model/apiPaginatedResponseApiGroupStockOrder';
import StatusEnum = ApiPaginatedResponseApiGroupStockOrder.StatusEnum;
import {ApiBeycoCoffeeVariety} from '../../../../../api/model/apiBeycoCoffeeVariety';
import {ApiBeycoCoffeeQuality} from '../../../../../api/model/apiBeycoCoffeeQuality';
import {ApiBeycoCoffeeGrade} from '../../../../../api/model/apiBeycoCoffeeGrade';
import {ApiBeycoCoffeeCertificate} from '../../../../../api/model/apiBeycoCoffeeCertificate';
import {ApiBeycoOrderCoffees} from '../../../../../api/model/apiBeycoOrderCoffees';
import {ApiBeycoCoffee} from '../../../../../api/model/apiBeycoCoffee';
import {ApiBeycoOrderFields} from '../../../../../api/model/apiBeycoOrderFields';
import {BeycoOrderControllerService} from '../../../../../api/api/beycoOrderController.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiBeycoPortOfExport} from '../../../../../api/model/apiBeycoPortOfExport';
import {GlobalEventManagerService} from '../../../../core/global-event-manager.service';
import {BeycoTokenService} from '../../../../shared-services/beyco-token.service';

@Component({
  selector: 'app-beyco-order-list',
  templateUrl: './beyco-order-list.component.html',
  styleUrls: ['./beyco-order-list.component.scss']
})
export class BeycoOrderListComponent implements OnInit {

  constructor(
      private fb: FormBuilder,
      private beycoOrderService: BeycoOrderControllerService,
      private route: ActivatedRoute,
      private router: Router,
      private globalEventManager: GlobalEventManagerService,
      private beycoTokenService: BeycoTokenService
  ) { }

  generalForm: FormGroup;
  coffeeInfoForms: FormGroup[] = [];

  readonly Status = StatusEnum;
  readonly Variety = ApiBeycoCoffeeVariety.TypeEnum;
  readonly QualitySegment = ApiBeycoCoffeeQuality.TypeEnum;
  readonly Grade = ApiBeycoCoffeeGrade.TypeEnum;
  readonly Certificate = ApiBeycoCoffeeCertificate.TypeEnum;
  readonly Currency = ApiBeycoOrderCoffees.CurrencyEnum;
  readonly PriceUnit = ApiBeycoOrderCoffees.PriceUnitEnum;
  readonly Process = ApiBeycoCoffee.ProcessEnum;
  readonly Species = ApiBeycoCoffee.SpeciesEnum;
  readonly Incoterms = ApiBeycoOrderCoffees.IncotermsEnum;

  fc(form: FormGroup, fieldName: string): FormControl {
    return form.get(fieldName) as FormControl;
  }

  ngOnInit(): void {
    if (!this.beycoTokenService.beycoToken) {
      this.router.navigate(['my-stock', 'orders', 'tab']);
      return;
    }

    this.route.queryParams.subscribe(query => {
      if (!query || !query['id']) {
        this.router.navigate(['my-stock', 'orders', 'tab']);
        return;
      }

      this.globalEventManager.showLoading(true);
      this.beycoOrderService.getBeycoOrderFieldsForSelectedStockOrdersUsingGET([query['id']])
          .subscribe(
              res => {
                this.generalForm = this.buildGeneralForm(res.data);
                for (const coffeeOrder of res.data.offerCoffees) {
                  this.coffeeInfoForms.push(this.buildCoffeeInfoForm(coffeeOrder));
                }
              },
              () => this.router.navigate(['my-stock', 'orders', 'tab']),
              () => this.globalEventManager.showLoading(false)
          );
    });
  }

  submit() {
    let isInvalid = false;
    this.generalForm.markAllAsTouched();
    if (this.generalForm.invalid) { isInvalid = true; }
    for (const form of this.coffeeInfoForms) {
      form.markAllAsTouched();
      if (form.invalid) { isInvalid = true; }
    }

    if (isInvalid) {
      this.globalEventManager.push({
        action: 'error',
        notificationType: 'error',
        title: 'Invalidated fields',
        message: 'Please, check fields!'
      });
      return;
    }

    console.log(this.buildApiBeycoOrderFields());
    this.globalEventManager.showLoading(true);
    this.beycoOrderService.sendBeycoOrderUsingPOST(this.beycoTokenService.beycoToken.accessToken, this.buildApiBeycoOrderFields())
        .subscribe(
            () => {
              this.globalEventManager.push({
                action: 'success',
                notificationType: 'success',
                title: 'Beyco order created',
                message: 'You successfuly created Beyco order!'
              });
              this.router.navigate(['my-stock', 'orders', 'tab']);
            },
            (error) => {
              this.globalEventManager.push({
                action: 'error',
                notificationType: 'error',
                title: 'Beyco order unsuccessful',
                message: error.error ?? 'There was an error when creating Beyco order! Please, try again!'
              });
            },
            () => this.globalEventManager.showLoading(false)
        );
  }

  buildGeneralForm(fieldValues: ApiBeycoOrderFields): FormGroup {
    return this.fb.group({
      title: [fieldValues?.title, Validators.required],
      availableAt: [fieldValues?.availableAt, Validators.required],
      address: [fieldValues?.portOfExport.address, Validators.required],
      country: [fieldValues?.portOfExport.country, Validators.required],
      latitude: [fieldValues?.portOfExport.latitude, Validators.required],
      longitude: [fieldValues?.portOfExport.longitude, Validators.required]
    });
  }

  buildCoffeeInfoForm(coffee: ApiBeycoOrderCoffees): FormGroup {
    return this.fb.group({
      title: [coffee?.coffee.name, { disabled: true }],
      name: [coffee?.coffee.name, Validators.required],
      quantity: [coffee?.coffee.quantity, Validators.required],
      price: [coffee?.price, Validators.required],
      priceUnit: [coffee?.priceUnit, Validators.required],
      currency: [coffee?.currency, Validators.required],
      harvestAt: [coffee?.coffee.harvestAt, Validators.required],
      region: [coffee?.coffee.region],
      country: [coffee?.coffee.country, Validators.required],
      incoterms: [coffee?.incoterms, Validators.required],
      species: [coffee?.coffee.species, Validators.required],
      process: [coffee?.coffee.process],
      minScreenSize: [
        coffee?.coffee.minScreenSize,
        [Validators.required, Validators.min(8), Validators.max(20)]
      ],
      maxScreenSize: [
        coffee?.coffee.maxScreenSize,
        [Validators.required, Validators.min(8), Validators.max(20)]
      ],
      cuppingScore: [
        coffee?.coffee.cuppingScore,
        [Validators.required, Validators.min(60), Validators.max(100)]
      ],
      varieties: [coffee?.coffee.varieties?.map(v => v.type), Validators.required],
      qualitySegments: [coffee?.coffee.qualitySegments?.map(v => v.type), Validators.required],
      grades: [coffee?.coffee.grades?.map(v => v.type), Validators.required],
      certificates: [coffee?.coffee.certificates?.map(v => v.type)]
    });
  }

  buildApiBeycoOrderFields(): ApiBeycoOrderFields {
    const apiObj: ApiBeycoOrderFields = {};
    apiObj.title = this.generalForm.get('title').value;
    apiObj.availableAt = this.generalForm.get('availableAt').value;
    apiObj.portOfExport = {
      address: this.generalForm.get('address').value,
      country: this.generalForm.get('country').value,
      longitude: this.generalForm.get('longitude').value,
      latitude: this.generalForm.get('latitude').value
    } as ApiBeycoPortOfExport;
    apiObj.offerCoffees = [];

    for (const form of this.coffeeInfoForms) {
      const apiCoffee: ApiBeycoOrderCoffees = {};
      apiCoffee.currency = form.get('currency').value;
      apiCoffee.price = Number(form.get('price').value);
      apiCoffee.priceUnit = form.get('priceUnit').value;
      apiCoffee.incoterms = form.get('incoterms').value;
      apiCoffee.coffee = {
        certificates: form.get('certificates').value?.map(c => ({ type: c }) as ApiBeycoCoffeeCertificate),
        grades: form.get('grades').value?.map(g => ({ type: g }) as ApiBeycoCoffeeGrade),
        qualitySegments: form.get('qualitySegments').value?.map(q => ({ type: q }) as ApiBeycoCoffeeQuality),
        varieties: form.get('varieties').value?.map(v => ({ type: v }) as ApiBeycoCoffeeVariety),
        name: form.get('name').value,
        cuppingScore: Number(form.get('cuppingScore').value),
        maxScreenSize: Number(form.get('maxScreenSize').value),
        minScreenSize: Number(form.get('minScreenSize').value),
        process: form.get('process').value,
        species: form.get('species').value,
        country: form.get('country').value,
        region: form.get('region').value,
        harvestAt: form.get('harvestAt').value,
        quantity: Number(form.get('quantity').value)
      } as ApiBeycoCoffee;
      apiObj.offerCoffees.push(apiCoffee);
    }

    return apiObj;
  }

}
