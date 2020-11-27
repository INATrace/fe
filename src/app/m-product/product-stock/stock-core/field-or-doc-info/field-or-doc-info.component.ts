import { Component, Input, OnInit } from '@angular/core';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FileSaverService } from 'ngx-filesaver';
import { take } from 'rxjs/operators';
import { DocumentService } from 'src/api-chain/api/document.service';
import { ChainFileInfo } from 'src/api-chain/model/chainFileInfo';
import { WeightedAggregateAny } from 'src/api-chain/model/weightedAggregateAny';
import { DocumentTranslations } from 'src/app/shared-services/document-translations.service';

@Component({
  selector: 'app-field-or-doc-info',
  templateUrl: './field-or-doc-info.component.html',
  styleUrls: ['./field-or-doc-info.component.scss']
})
export class FieldOrDocInfoComponent implements OnInit {

  @Input()
  field;

  @Input()
  document

  constructor(
    private chainFileService: DocumentService,
    private fileSaverService: FileSaverService,
    private documentTranslations: DocumentTranslations
  ) {

  }

  stringValueForField(field: WeightedAggregateAny) {
    switch (field.fieldID) {
      case 'GRADE': return (field.value && field.value.label)  || ' - ';
      case 'CUSTOMER': return (field.value && field.value.name)  || ' - ';
      case 'REQUIRED_GRADE': return (field.value && field.value.label)  || ' - ';

      // case 'PRICE_PER_UNIT': return field.value + field.
      case 'CLIENT_NAME': return field.value && field.value.company && field.value.company.name
      default:
        return field.value || ' - '
    }
  }

  fieldName(field: WeightedAggregateAny) {
    return field.fieldID
  }

  isListAttribute(field: WeightedAggregateAny) {
    return ['CERTIFICATES_IDS'].indexOf(field.fieldID) >= 0
  }

  isObjectAttribute(field: WeightedAggregateAny) {
    return ['CLIENT_NAME'].indexOf(field.fieldID) >= 0
  }

  isOrdinary(field: WeightedAggregateAny) {
    return !(this.isListAttribute(field) || this.isObjectAttribute(field))
  }

  translations = {
    'GRADE': $localize`:@@stockOrderFieldTranslations.grade:Grade`,
    'LOT_EXPORT_NUMBER': $localize`:@@stockOrderFieldTranslations.lotExportNumber:Lot export number`,
    'PRICE_PER_UNIT': $localize`:@@stockOrderFieldTranslations.pricePerUnit:Price per unit`,
    'SCREEN_SIZE': $localize`:@@stockOrderFieldTranslations.screenSize:Screen size`,
    'LOT_LABEL': $localize`:@@stockOrderFieldTranslations.lotLabel:Lot label`,
    'START_OF_DRYING': $localize`:@@stockOrderFieldTranslations.startOfDrying:Start of drying`,
    'CLIENT_NAME': $localize`:@@stockOrderFieldTranslations.clientName:Client name`,
    'CERTIFICATES_IDS': $localize`:@@stockOrderFieldTranslations.certificates:Certificates`,
    'PREFILL_OUTPUT_FACILITY': $localize`:@@stockOrderFieldTranslations.prefillOutputFacility:Prefill output facility`,
    'TRANSACTION_TYPE': $localize`:@@stockOrderFieldTranslations.transactionType:Transaction type`,
    'FLAVOUR_PROFILE': $localize`:@@stockOrderFieldTranslations.flavourProfile:Flavour profile`,
  }

  labelForField(field: WeightedAggregateAny) {
    return this.documentTranslations.translate(field.fieldID)
    // let fieldInfo = codeToFieldInfo[field.fieldID]
    // if(!fieldInfo) return field.fieldID
    // return fieldInfo.label

    // let id = field.fieldID;
    // let res = this.translations[id]
    // return res ? res : field.fieldID
  }


  //   { id: , selected: false },
  // { id: 'LOT_EXPORT_NUMBER', selected: false },
  // { id: 'PRICE_PER_UNIT', selected: false },
  // { id: 'SCREEN_SIZE', selected: false },
  // { id: 'LOT_LABEL', selected: false },
  // { id: 'START_OF_DRYING', selected: false },
  // { id: 'CLIENT_NAME', selected: false },
  // { id: 'CERTIFICATES_IDS', selected: false },
  // { id: 'PREFILL_OUTPUT_FACILITY', selected: false },
  // { id: 'TRANSACTION_TYPE', selected: false },
  // { id: 'FLAVOUR_PROFILE', selected: false },

  async onDownload(fileInfo: ChainFileInfo) {
    console.log("ON DOWN:", fileInfo)
    if (fileInfo && fileInfo.storageKey) {
      let res = await this.chainFileService.getFile(fileInfo.storageKey).pipe(take(1)).toPromise()
      if (res) {
        this.fileSaverService.save(res, fileInfo.name)
      }
    }
  }


  requirementMask(info) {
    return `[${info.value ? 'o' : '-'}${info.required ? 'o' : '-'}${info.mandatory ? 'o' : '-'}${info.requiredOnQuote ? 'o' : '-'}]`
  }

  styleForRequired(info) {
    if(info.value) {
      if(info.required) return 'required-present'
      return 'non-required-present'
    }
    if(info.required) return 'required-missing'
    return ""
  }

  faCheckCircle = faCheckCircle
  faExclamationCircle = faExclamationCircle

  iconForQuoteRequired(info) {
    if(info.value) {
      if(info.requiredOnQuote) return faCheckCircle
      return null
    }
    if(info.requiredOnQuote) return faExclamationCircle
    return null;
  }

  iconClassForQuoteRequired(info) {
    if(info.value) {
      if(info.requiredOnQuote) return 'quote-required-present'
      return null
    }
    if(info.requiredOnQuote) return 'quote-required-missing'
    return null;
  }

  classForQuoteOneOfRequired(document) {
    if(!document.requiredOneOfGroupIdForQuote) return ""
    if(document.requiredOnQuoteOneOk) return "quote-required-one-of quote-required-one-of-present"
    return "quote-required-one-of quote-required-one-of-missing"
  }

  ngOnInit() {
  }
}
