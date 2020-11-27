import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[dir-link]'
})
export class LinkDirective {
    constructor(public template: TemplateRef<any>) { }
}
