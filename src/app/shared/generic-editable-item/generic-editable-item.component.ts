import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SimpleValidationScheme } from 'src/interfaces/Validation';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';

@Component({
    template: ''
})
export class GenericEditableItemComponent<T> implements OnInit {

    originalFormControl: FormControl = null;
    tmpFormGroup: FormGroup = null;

    public submitted: boolean = false;

    @Input()
    title = null

    @Input() set formControlInput(value: FormControl) {
        if (!value || value.value == null) {
            throw Error("Možnost, da je Editable componenta null ni podprta.")
        }
        this.originalFormControl = value;
        this.submitted = false;
        this.tmpFormGroup = this.generateForm(value.value)
        this.onFormChanged()
    }

    onFormChanged() { }

    get formControlInput(): FormControl {
        return this.originalFormControl
    }

    get form(): FormGroup {
        return this.tmpFormGroup
    }

    @Input()
    rawObjectData?: any;

    @Input()
    listEditorManager = null;

    @Input()
    listEditorManagerPosition = null;

    @Output() onSave = new EventEmitter<boolean>();

    @Output() onCancel = new EventEmitter<any>();

    @Output() onDelete = new EventEmitter<any>();

    // _isOpen: boolean = false;

    @Input() isOpen: boolean = false

    @Output() onToggle = new EventEmitter<boolean>();


    constructor(protected globalEventsManager: GlobalEventManagerService) { }

    // should be set in the constructor of the extended class
    validationScheme: SimpleValidationScheme<T> = null;

    public stripResult(obj: any) {
        return obj
    }

    save() {
        if (this.form.invalid) {  // handlanje tudi prazne forme
            this.form.markAsTouched()
            this.form.markAsDirty()
            this.submitted = true
            this.globalEventsManager.push(
                {
                    action: 'error',
                    notificationType: 'error',
                    title: $localize`:@@genericEditableItem.save.error.title:Errors or incomplete entries!`,
                    message: $localize`:@@genericEditableItem.save.error.message:Check and correct data.`
                }
            )
            return
        }
        if (this.form.dirty) {   // predpostavka: če generiramo prazen objekt, ga moramo vsaj malo dopolniti (ni defaultov)
            let tmpval = this.stripResult(this.form.getRawValue())
            this.formControlInput.setValue(tmpval)
            this.formControlInput.markAsTouched()
            this.formControlInput.markAsDirty()
            this.formControlInput.updateValueAndValidity()
            this.onSave.next(true)
        } else {
            this.onSave.next(false)
        }
        if (this.listEditorManager && this.listEditorManagerPosition != null) {
            this.listEditorManager.save(this.listEditorManagerPosition)
        }
    }

    async cancel() {
        let okButtonText = $localize`:@@genericEditableItem.cancel.warning.okButtonText:Discard change`;
        let cancelButtonText = $localize`:@@genericEditableItem.cancel.warning.cancelButtonText:Go back`;
        if (this.form && this.form.dirty) {
            let result = await this.globalEventsManager.openMessageModal({
                type: 'warning',
                title: $localize`:@@genericEditableItem.cancel.warning.title:Changes not saved!`,
                message: $localize`:@@genericEditableItem.cancel.warning.title:The form contains unsaved changes that will be discarded.`,
                options: { centered: true },
                dismissable: false,
                buttonTitles: { ok: okButtonText, cancel: cancelButtonText}
            });
            if (result !== "ok") return;
        }

        this.submitted = false;
        this.tmpFormGroup = this.generateForm(this.originalFormControl.value)
        if (this.listEditorManager && this.listEditorManagerPosition != null) {
            this.listEditorManager.cancel(this.listEditorManagerPosition)
        }
        this.onCancel.next(true);
    }

    delete() {
        if (this.listEditorManager && this.listEditorManagerPosition != null) {
            this.listEditorManager.delete(this.listEditorManagerPosition)
        }
        this.onDelete.next(true)
    }

    toggle(returnFocusElement) {
        if (this.listEditorManager && this.listEditorManagerPosition != null) {
            this.listEditorManager.toggle(this.listEditorManagerPosition, returnFocusElement)
        }
        this.onToggle.next(true)
        // tukaj racunamo, da cancel resetira formo
        this.form.markAsPristine()
    }

    // should be overriden, takes care of
    public generateForm(value: any): FormGroup {
        throw Error("Not yet implemented")
    }

    public updateCustomFormControl(key: string, value: any) {
        if (!this.tmpFormGroup) throw Error("Cannot update custom form control '" + key + "'. FormGroup null.")
        if (!this.tmpFormGroup.controls[key]) throw Error("Missing custom form control '" + key + "'.")
        let fk = this.tmpFormGroup.controls[key]
        fk.setValue(value);
        // do not signal the change!
    }

    get contentObject() {
        if (this.formControlInput && this.rawObjectData) {
            throw Error("Ne smeš hkrati uporabljati inputa formControlInput in rawObjectData")
        }
        if (this.formControlInput) {
            return this.formControlInput.value
        }
        if (this.rawObjectData) {
            return this.rawObjectData
        }
    }

    ngOnInit() {
    }

}
