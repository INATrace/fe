import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SelfOnboardingService {

    public addProductCurrentStep$: Subject<number | string | null> = new BehaviorSubject<number | string | null>(null);
    public addFacilityCurrentStep$: Subject<number | string | null> = new BehaviorSubject<number | string | null>(null);
    public addProcessingActionCurrentStep$: Subject<number | string | null> = new BehaviorSubject<number | string | null>(null);
    public addFarmersCurrentStep$: Subject<number | string | null> = new BehaviorSubject<number | string | null>(null);

    public guidedTourStep$: Subject<number | string | null> = new BehaviorSubject<number | string | null>(null);

    constructor() { }

    public setAddProductCurrentStep(currentStep: number | string): void {
        this.addProductCurrentStep$.next(currentStep);
    }

    public clearAddProductCurrentStep(): void {
        this.addProductCurrentStep$.next(null);
    }

    public setAddFacilityCurrentStep(currentStep: number | string): void {
        this.addFacilityCurrentStep$.next(currentStep);
    }

    public clearAddFacilityCurrentStep(): void {
        this.addFacilityCurrentStep$.next(null);
    }

    public setAddProcessingActionCurrentStep(currentStep: number | string): void {
        this.addProcessingActionCurrentStep$.next(currentStep);
    }

    public clearAddProcessingActionCurrentStep(): void {
        this.addProcessingActionCurrentStep$.next(null);
    }

    public setAddFarmersCurrentStep(currentStep: number | string): void {
        this.addFarmersCurrentStep$.next(currentStep);
    }

    public clearAddFarmersCurrentStep(): void {
        this.addFarmersCurrentStep$.next(null);
    }

    public startGuidedTourStep(): void {
        this.guidedTourStep$.next(1);
    }

    public guidedTourNextStep(currentStep: number | string): void {
        this.guidedTourStep$.next(currentStep);
    }

    public endGuidedTour(): void {
        this.guidedTourStep$.next(null);
    }

}
