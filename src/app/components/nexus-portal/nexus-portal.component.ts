import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndividualUpsertComponent } from "../individual-upsert/individual-upsert.component";
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { FamilyUpsertComponent } from "../family-upsert/family-upsert.component";
import { IndividualLookupComponent } from "../individual-lookup/individual-lookup.component";
import { LookupDto } from '../../models/dto/lookup-dto'; // Update the path as needed
import { IndividualService } from '../../services/individual.service';
import { FamilyService } from '../../services/family.service';
import { LocationService } from '../../services/location.service';
import { LocationUpsertComponent } from '../location-upsert/location-upsert.component';
import { OptionsComponent } from '../options/options.component';

import { Individual } from '../../models/individual';
import { Subject, interval, Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Family } from '../../models/family';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { SortState } from '../../enum/sort-state';
import { Location } from '../../models/location';
import { IndividualLocation } from '../../models/individual-location';
import { IndividualTypeService } from '../../services/individual-type.service';
@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IndividualUpsertComponent,
    FamilyUpsertComponent, IndividualLookupComponent,
    LocationUpsertComponent, OptionsComponent],
  templateUrl: './nexus-portal.component.html',
  styleUrl: './nexus-portal.component.css',
  providers: [IndividualService]
})
export class NexusPortalComponent implements OnInit, OnDestroy {
  [x: string]: any;

  portal = portal;
  portalState: number = 0;
  previousPortalState: number = 0; //portal.IndividualUpsert;
  allPortalStates: number[] = [];
  private intervalId: any;
  private destroyed$ = new Subject<void>();
  private pollingSubscription?: Subscription;
  private pollingSubscription2?: Subscription = new Subscription();
  private pollingSubscription3?: Subscription = new Subscription();
  private pollingSubscription4?: Subscription = new Subscription();
  loadingLookup: boolean = false;
  loadingFamily: boolean = false;
  loadingLocation: boolean = false;

  status = status;
  private currentSort?: SortState;

  lookupDtoMain: LookupDto[] = [];
  individualsMain: Individual[] = [];
  individualMain: Individual = new Individual();
  familiesMain: Family[] = [];
  familyMain: Family = new Family();
  locationsMain: Location[] = [];
  locationMain: Location = new Location();
  individualLocationsMain: IndividualLocation[] = [];
  individualLocationMain: IndividualLocation = new IndividualLocation();

  dropdownDtoMain: DropdownDto[] = [];
  dropdownDtoLocationMain: DropdownDto[] = [];
  dropdownDtoIndividualTypeMain: DropdownDto[] = [];

  constructor(private cdr: ChangeDetectorRef, private individualService: IndividualService,
    private familyService: FamilyService, private locationService: LocationService,
    private individualTypeService: IndividualTypeService)
  {
  }

  ngOnInit(): void {
    // Polling was removed; we fetch data once when the portal is activated.

  }

  activatePortal(portalId: number) : void{
    this.setPortalStates(portalId);
    // Start polling when entering the IndividualLookup or FamilyLookup portal, stop when leaving
    if (portalId === portal.IndividualLookup || portalId === portal.FamilyLookup || portalId === portal.IndividualUpsert
      || portalId === portal.LocationLookup || portalId === portal.LocationUpsert
    ) {
      this.startPolling(portalId);
    } else {
      this.stopPolling();
    }
  }

  private startPolling(targetPortal: number): void {
    // if (this.portalState !== targetPortal && this.pollingSubscription) {
    if (this.pollingSubscription) {
      this.stopPolling();
      // return; // already polling for some portal
    }

    // decide fetch observable and initial loading flag depending on portal
    let fetchFn: () => any = () => of([]);
    let fetchFn2: () => any = () => of([]);
    let fetchFn3: () => any = () => of([]);
    let fetchFn4: () => any = () => of([]);
    let currentOrder: 'asc' | 'desc' | undefined;
    let orderField: 'id' | 'name' | undefined;

    if (targetPortal === portal.IndividualLookup) {
      this.loadingLookup = true;
      fetchFn = () => this.individualService.getIndividualsByStatusId(status.Active);
      fetchFn2 = () => this.familyService.getFamilies();
      fetchFn3 = () => this.locationService.getLocations();
      fetchFn4 = () => this.individualTypeService.getIndividualTypes();
    } else if (targetPortal === portal.FamilyLookup) {
      // familyService is injected optionally; if not available log and stop
      if (!this.familyService || typeof this.familyService.getFamilies !== 'function') {
        console.warn('Family service not available. Cannot start family polling.');
        return;
      }
      this.loadingFamily = true;
      fetchFn = () => this.familyService.getFamilies();
      fetchFn2 = () => of([]);
    } else if (targetPortal === portal.LocationLookup) {
      // locationService is injected optionally; if not available log and stop
      if (!this.locationService || typeof this.locationService.getLocations !== 'function') {
        console.warn('Location service not available. Cannot start location polling.');
        return;
      }
      this.loadingLocation = true;
      fetchFn = () => this.locationService.getLocations();
      fetchFn2 = () => of([]);
    } else if (targetPortal === portal.IndividualUpsert || targetPortal === portal.FamilyUpsert || targetPortal === portal.LocationUpsert) {
      fetchFn = () => of([]);
      fetchFn2 = () => this.familyService.getFamilies();
      fetchFn3 = () => this.locationService.getLocationsByIndividualId(this.individualMain.individualId);
      fetchFn4 = () => this.individualTypeService.getIndividualTypes();
    } else {
      // unsupported portal for polling
      return;
    }

    const handleResult = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.lookupDtoMain = [];
      
      for (const item of result || []) {
        const id = item.individualId ?? item.familyId ?? item.id ?? item.locationId ?? 0;
        const secondId = item.familyId ?? item.secondId ?? 0;
        const name = item.firstName ? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()
                     : item.familyName ?? item.name ?? item.locationName ?? '';
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
      } else if (targetPortal === portal.LocationLookup) {
        this.locationsMain = result as Location[];
        this.loadingLocation = false;
      }
      
      // Apply current sort if exists
      if (this.currentSort) {
        this.lookupDtoMain.sort((a, b) => {
          const compareResult = a[this.currentSort!.field] > b[this.currentSort!.field] ? 1 : -1;
          return this.currentSort!.order === 'asc' ? compareResult : -compareResult;
        });
      };

      // trigger change detection if needed
      this.cdr.markForCheck?.();
    };
    
    const handleResult2 = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.dropdownDtoMain = [];

      for (const item of result || []) {
        const id = item.familyId ?? item.individualId ?? item.id ?? 0;
        const name = item.firstName ? `${item.firstName} ${item.lastName ?? ''}`.trim()
                     : item.familyName ?? item.name ?? '';
        this.dropdownDtoMain.push({ id, name });
      }
      // trigger change detection if needed
      this.cdr.markForCheck?.();
    };

    const handleResult3 = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.dropdownDtoLocationMain = [];

      for (const item of result || []) {
        const id = item.locationId ?? item.individualId ?? item.id ?? 0;
        const locationName = item.locationName ? `${item.locationName} - ` : '';
        const name = `${locationName} ${item.address ?? ''} ${item.city ?? ''}  ${item.state ?? ''} ${item.zip ?? ''}`.trim();
        this.dropdownDtoLocationMain.push({ id, name });
      }

      // trigger change detection if needed
      this.cdr.markForCheck?.();
    };

    const handleResult4 = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.dropdownDtoIndividualTypeMain = [];

      for (const item of result || []) {
        const id = item.individualTypeId ?? item.id ?? 0;
        const name = item.individualTypeName ?? item.name ?? '';
        this.dropdownDtoIndividualTypeMain.push({ id, name });
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
        if (targetPortal === portal.LocationLookup) this.loadingLocation = false;
      }
    );

    fetchFn2().subscribe(
      (res: any[]) => handleResult2(res), () =>{}
    );

    fetchFn3().subscribe(
      (res: any[]) => handleResult3(res), () =>{}
    );

    fetchFn4().subscribe(
      (res: any[]) => handleResult4(res), () =>{}
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

    // periodic polling for tertiary fetch function (fetchFn3)
    if (fetchFn3){
      this.pollingSubscription3 = interval(1000)
        .pipe(
          switchMap(() => fetchFn3())
        )
        .subscribe((value) => handleResult3(value as any[]), (err) => {
          console.error('Polling error for tertiary fetch', err);
        });
    }

    // periodic polling for quaternary fetch function (fetchFn4)
    if (fetchFn4){
      this.pollingSubscription4 = interval(1000)
        .pipe(
          switchMap(() => fetchFn4())
        )
        .subscribe((value) => handleResult4(value as any[]), (err) => {
          console.error('Polling error for quaternary fetch', err);
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
    if (this.pollingSubscription3) {
      this.pollingSubscription3.unsubscribe();
      this.pollingSubscription3 = undefined;
    }
    if (this.pollingSubscription4) {
      this.pollingSubscription4.unsubscribe();
      this.pollingSubscription4 = undefined;
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
    if (this.portalState === portal.LocationLookup)
      this.locationMain = this.locationsMain.find(loc => loc.locationId === $event.id) || new Location();

  }

  resetData() {
    this.individualMain = new Individual();
    this.familyMain = new Family();
    this.locationMain = new Location();
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

  returnIndividualTypes(): DropdownDto[] {
    return this.dropdownDtoIndividualTypeMain;
  }
}
