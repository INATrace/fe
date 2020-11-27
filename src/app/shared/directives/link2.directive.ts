import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[dir-link2]'
})
export class Link2Directive {
    constructor(public template: TemplateRef<any>) { }
}
