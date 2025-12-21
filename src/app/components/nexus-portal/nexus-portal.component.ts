import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndividualUpsertComponent } from "../individual-upsert/individual-upsert.component";
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { MainMenuComponent } from "../main-menu/main-menu.component";
import { FamilyUpsertComponent } from "../family-upsert/family-upsert.component";
import { FamilyOptionsComponent } from '../family-options/family-options.component';
import { IndividualOptionsComponent } from "../individual-options/individual-options.component";
import { IndividualLookupComponent } from "../individual-lookup/individual-lookup.component";
import { LookupDto } from '../../models/dto/lookup-dto'; // Update the path as needed
import { IndividualService } from '../../services/individual.service';
import { FamilyService } from '../../services/family.service';

import { Individual } from '../../models/individual';
import { Subject, interval, Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Optional } from '@angular/core';
import { Family } from '../../models/family';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { SortState } from '../../enum/sort-state';

@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IndividualOptionsComponent, IndividualUpsertComponent,
    MainMenuComponent, FamilyUpsertComponent, IndividualLookupComponent, FamilyOptionsComponent],
  templateUrl: './nexus-portal.component.html',
  styleUrl: './nexus-portal.component.css',
  providers: [IndividualService]
})
export class NexusPortalComponent implements OnInit, OnDestroy {

  portal = portal;
  portalState: number = 0;
  previousPortalState: number = 0; //portal.IndividualUpsert;
  allPortalStates: number[] = [];
  private intervalId: any;
  private destroyed$ = new Subject<void>();
  private pollingSubscription?: Subscription;
  private pollingSubscription2?: Subscription = new Subscription();
  loadingLookup: boolean = false;
  loadingFamily: boolean = false;

  status = status;
  private currentSort?: SortState;

  lookupDtoMain: LookupDto[] = [];
  individualsMain: Individual[] = [];
  individualMain: Individual = new Individual();
  familiesMain: Family[] = [];
  familyMain: Family = new Family();

  dropdownDtoMain: DropdownDto[] = [];

  constructor(private cdr: ChangeDetectorRef, private individualService: IndividualService,
    private familyService: FamilyService)
  {

  }

  ngOnInit(): void {
    // Polling was removed; we fetch data once when the portal is activated.
  }

  activatePortal(portalId: number) : void{
    this.setPortalStates(portalId);
    // Start polling when entering the IndividualLookup or FamilyLookup portal, stop when leaving
    if (portalId === portal.IndividualLookup || portalId === portal.FamilyLookup || portalId === portal.IndividualUpsert) {
      this.startPolling(portalId);
    } else {
      this.stopPolling();
    }
  }

  private startPolling(targetPortal: number): void {
    if (this.pollingSubscription) {
      this.stopPolling();
      return; // already polling for some portal
    }

    // decide fetch observable and initial loading flag depending on portal
    let fetchFn: () => any = () => of([]);
    let fetchFn2: () => any = () => of([]);
    let currentOrder: 'asc' | 'desc' | undefined;
    let orderField: 'id' | 'name' | undefined;

    if (targetPortal === portal.IndividualLookup) {
      this.loadingLookup = true;
      fetchFn = () => this.individualService.getIndividualsByStatusId(status.Active);
      fetchFn2 = () => this.familyService.getFamilies();
    } else if (targetPortal === portal.FamilyLookup) {
      // familyService is injected optionally; if not available log and stop
      if (!this.familyService || typeof this.familyService.getFamilies !== 'function') {
        console.warn('Family service not available. Cannot start family polling.');
        return;
      }
      this.loadingFamily = true;
      fetchFn = () => this.familyService.getFamilies();
      fetchFn2 = () => of([]);
    } else if (targetPortal === portal.IndividualUpsert || targetPortal === portal.FamilyUpsert) {
      fetchFn = () => of([]);
      fetchFn2 = () => this.familyService.getFamilies();
    } else {
      // unsupported portal for polling
      return;
    }

    const handleResult = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.lookupDtoMain = [];
      
      for (const item of result || []) {
        const id = item.individualId ?? item.familyId ?? item.id ?? 0;
        const secondId = item.familyId ?? item.secondId ?? 0;
        const name = item.firstName ? `${item.firstName} ${item.lastName ?? ''}`.trim()
                     : item.familyName ?? item.name ?? '';
        this.lookupDtoMain.push({ id, secondId, name });
      }

      if (orderField && currentOrder) {
        this.lookupDtoMain.sort((a, b) => {
          const compareResult = a[orderField!] > b[orderField!] ? 1 : -1;
          return currentOrder === 'asc' ? compareResult : -compareResult;
        });
      }

      // If items are individuals, preserve typed array used elsewhere
      if (targetPortal === portal.IndividualLookup) {
        this.individualsMain = result as Individual[];
        this.loadingLookup = false;
      } else if (targetPortal === portal.FamilyLookup) {
        this.familiesMain = result as Family[];
        this.loadingFamily = false;
      }
      
      // Apply current sort if exists
      if (this.currentSort) {
        this.lookupDtoMain.sort((a, b) => {
          const compareResult = a[this.currentSort!.field] > b[this.currentSort!.field] ? 1 : -1;
          return this.currentSort!.order === 'asc' ? compareResult : -compareResult;
        });
      }

      // trigger change detection if needed
      this.cdr.markForCheck?.();
    };
    
    const handleResult2 = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.dropdownDtoMain = [];
      for (const item of result || []) {
        const id = item.individualId ?? item.familyId ?? item.id ?? 0;
        const name = item.firstName ? `${item.firstName} ${item.lastName ?? ''}`.trim()
                     : item.familyName ?? item.name ?? '';
        this.dropdownDtoMain.push({ id, name });
      }

      // trigger change detection if needed
      this.cdr.markForCheck?.();
    };

    // initial immediate fetch
    fetchFn().subscribe(
      (res: any[]) => handleResult(res),
      () => {
        if (targetPortal === portal.IndividualLookup) this.loadingLookup = false;
        if (targetPortal === portal.FamilyLookup) this.loadingFamily = false;
      }
    );

    fetchFn2().subscribe(
      (res: any[]) => handleResult2(res), () =>{}
    );

    // periodic polling (cancels previous in-flight via switchMap)
    this.pollingSubscription = interval(1000)
      .pipe(
        switchMap(() => fetchFn())
      )
      .subscribe((value) => handleResult(value as any[]), (err) => {
        // optionally handle polling errors (keep polling, or stop depending on desired behaviour)
        console.error('Polling error', err);
      });

  // periodic polling for secondary fetch function (fetchFn2)
  if (fetchFn2){
    this.pollingSubscription2 = interval(1000)
      .pipe(
        switchMap(() => fetchFn2())
      )
      .subscribe((value) => handleResult2(value as any[]), (err) => {
        console.error('Polling error for secondary fetch', err);
      });
    }

  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
    if (this.pollingSubscription2) {
      this.pollingSubscription2.unsubscribe();
      this.pollingSubscription2 = undefined;
    }
  }

  ngOnDestroy(): void {
    // complete destroyed$ for teardown
    this.destroyed$.next();
    this.destroyed$.complete();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.stopPolling();
  }

  onSelectedItemChange($event: LookupDto) {
    
    if (this.portalState === portal.IndividualLookup)
      this.individualMain = this.individualsMain.find(ind => ind.individualId === $event.id) || new Individual();
    if (this.portalState === portal.FamilyLookup)
      this.familyMain = this.familiesMain.find(fam => fam.familyId === $event.id) || new Family();

  }

  resetData() {
    this.individualMain = new Individual();
    this.familyMain = new Family();
    return true;
  }

  updateSort(sortState: SortState) {
    this.currentSort = sortState;
    // Re-apply sort to current data
    if (this.lookupDtoMain.length) {
      this.lookupDtoMain.sort((a, b) => {
        const compareResult = a[sortState.field] > b[sortState.field] ? 1 : -1;
        return sortState.order === 'asc' ? compareResult : -compareResult;
      });
    }
  }
  
  setPortalStates(portalId: number) : void {
    this.previousPortalState = this.portalState;
    this.portalState = portalId;
    this.allPortalStates.push(this.portalState);
  }
}
