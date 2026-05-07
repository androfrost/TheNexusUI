import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndividualUpsertComponent } from "../individual-upsert/individual-upsert.component";
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { GroupUpsertComponent } from "../group-upsert/group-upsert.component";
import { IndividualLookupComponent } from "../individual-lookup/individual-lookup.component";
import { LookupDto } from '../../models/dto/lookup-dto'; // Update the path as needed
import { IndividualService } from '../../services/individual.service';
import { GroupService } from '../../services/group.service';
import { LocationService } from '../../services/location.service';
import { LocationUpsertComponent } from '../location-upsert/location-upsert.component';
import { PhoneNumberService } from '../../services/phone-number.service';
import { PhoneNumberUpsertComponent } from '../phone-number-upsert/phone-number-upsert.component';
import { OptionsComponent } from '../options/options.component';

import { Individual } from '../../models/individual';
import { Subject, interval, Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Group } from '../../models/group';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { SortState } from '../../enum/sort-state';
import { Location } from '../../models/location';
import { IndividualLocation } from '../../models/individual-location';
import { IndividualTypeService } from '../../services/individual-type.service';
import { IndividualLocationsDtoService } from '../../services/individual-locations-dto.service';
import { IndividualLocationsDto } from '../../models/dto/individual-locations-dto';
import { IndividualLocationService } from '../../services/individual-location.service';
import { PhoneNumber } from '../../models/phone-number';
import { IndividualPhoneNumber } from '../../models/individual-phone-number';
import { IndividualPhoneNumberService } from '../../services/individual-phone-number.service';
import { EntrancePortalComponent } from "../entrance-portal/entrance-portal.component";
@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IndividualUpsertComponent,
    IndividualLookupComponent, GroupUpsertComponent,
    LocationUpsertComponent, PhoneNumberUpsertComponent, OptionsComponent, EntrancePortalComponent],
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

  userName: string = "Guest";
  needToGetUserName: boolean = false;
  continueToPortal: boolean = false; // flag to control popup flow

  private intervalId: any;
  private destroyed$ = new Subject<void>();
  private pollingSubscription?: Subscription;
  private pollingSubscription2?: Subscription = new Subscription();
  private pollingSubscription3?: Subscription = new Subscription();
  private pollingSubscription4?: Subscription = new Subscription();
  private pollingSubscription5?: Subscription = new Subscription();
  loadingLookup: boolean = false;
  loadingGroup: boolean = false;
  loadingLocation: boolean = false;
  loadingPhoneNumber: boolean = false;

  status = status;
  private currentSort?: SortState;

  lookupDtoMain: LookupDto[] = [];
  individualLocationDtoMain: IndividualLocationsDto = new IndividualLocationsDto();

  individualsMain: Individual[] = [];
  individualMain: Individual = new Individual();
  groupsMain: Group[] = [];
  groupMain: Group = new Group();
  locationsMain: Location[] = [];
  locationMain: Location = new Location();
  individualLocationsMain: IndividualLocation[] = [];
  individualLocationMain: IndividualLocation = new IndividualLocation();
  phoneNumbersMain: PhoneNumber[] = [];
  phoneNumberMain: PhoneNumber = new PhoneNumber();
  individualPhoneNumbersMain: IndividualPhoneNumber[] = [];
  individualPhoneNumberMain: IndividualPhoneNumber = new IndividualPhoneNumber();

  dropdownDtoMain: DropdownDto[] = [];
  dropdownDtoLocationMain: DropdownDto[] = [];
  dropdownDtoIndividualTypeMain: DropdownDto[] = [];
  dropdownDtoPhoneNumberMain: DropdownDto[] = [];

  constructor(private cdr: ChangeDetectorRef, private individualService: IndividualService,
    private groupService: GroupService, private locationService: LocationService,
    private individualTypeService: IndividualTypeService, private individualLocationsDtoService: IndividualLocationsDtoService,
    private individualLocationService: IndividualLocationService, private phoneNumberService: PhoneNumberService,
    private individualPhoneNumberService: IndividualPhoneNumberService)
  {
  }

  ngOnInit(): void {
    this.setUserName("Guest"); // default value
  }

  ///////////////////////////
  // Used for main Nexus entrance portal only, if moved to own component then move this there instead
  // Sets popup and can be reused in other components that use popups
  setUserName(name: string) {
    this.userName = name;
  }

  setUserNameFlag(needToGetUserName: boolean) {
    this.needToGetUserName = needToGetUserName;
  }

  popupActivatePortal(continueToPortal: boolean) {
    if (continueToPortal) {
      this.activatePortal(portal.ChoosePortal);
    }
    this.setUserNameFlag(false);
  }
  //////////////////////////

  activatePortal(portalId: number) : void{
    this.setPortalStates(portalId);
    // Start polling when entering the IndividualLookup or GroupLookup portal, stop when leaving
    if (portalId === portal.IndividualLookup || portalId === portal.GroupLookup || portalId === portal.IndividualUpsert
      || portalId === portal.LocationLookup || portalId === portal.LocationUpsert || portalId === portal.PhoneNumberLookup
      || portalId === portal.PhoneNumberUpsert
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
    let fetchFn5: () => any = () => of([]);
    let currentOrder: 'asc' | 'desc' | undefined;
    let orderField: 'id' | 'name' | undefined;

    if (targetPortal === portal.IndividualLookup) {
      this.loadingLookup = true;
      fetchFn = () => this.individualService.getIndividualsByStatusId(status.Active);
      fetchFn2 = () => this.groupService.getGroups();
      fetchFn3 = () => this.locationService.getLocations();
      fetchFn4 = () => this.individualTypeService.getIndividualTypes();
      fetchFn5 = () => this.phoneNumberService.getPhoneNumbers();
    } else if (targetPortal === portal.GroupLookup) {
      // groupService is injected optionally; if not available log and stop
      if (!this.groupService || typeof this.groupService.getGroups !== 'function') {
        console.warn('Group service not available. Cannot start group polling.');
        return;
      }
      this.loadingGroup = true;
      fetchFn = () => this.groupService.getGroups();
      fetchFn2 = () => of([]);
    } else if (targetPortal === portal.LocationLookup) {
      // locationService is injected optionally; if not available log and stop
      if (!this.locationService || typeof this.locationService.getLocations !== 'function') {
        console.warn('Location service not available. Cannot start location polling.');
        return;
      }
      this.loadingLocation = true;
      if  (this.individualMain && this.individualMain.individualId > 0)
        fetchFn = () => this.locationService.getLocationsWithAssignedIndividualsByIndividualId(this.individualMain.individualId);
      else
        fetchFn = () => this.locationService.getLocations();
      fetchFn2 = () => of([]);
    } else if (targetPortal === portal.PhoneNumberLookup) {
      if (!this.phoneNumberService || typeof this.phoneNumberService.getPhoneNumbers !== 'function') {
        console.warn('PhoneNumber service not available. Cannot start phone number polling.');
        return;
      }
      this.loadingPhoneNumber = true;
      if  (this.individualMain && this.individualMain.individualId > 0)
        fetchFn = () => this.phoneNumberService.getPhoneNumbersWithAssignedIndividualsByIndividualId(this.individualMain.individualId);
      else
        fetchFn = () => this.phoneNumberService.getPhoneNumbers();
    } else if (targetPortal === portal.IndividualUpsert || targetPortal === portal.GroupUpsert || targetPortal === portal.LocationUpsert) {
      fetchFn = () => of([]);
      fetchFn2 = () => this.groupService.getGroups();
      fetchFn3 = () => this.locationService.getLocationsByIndividualId(this.individualMain.individualId);
      fetchFn4 = () => this.individualTypeService.getIndividualTypes();
      fetchFn5 = () => this.phoneNumberService.getPhoneNumbersByIndividualId(this.individualMain.individualId);
    } else {
      // unsupported portal for polling
      return;
    }

    const handleResult = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.lookupDtoMain = [];
      
      for (const item of result || []) {
        const id = item.individualId ?? item.groupId ?? item.id ?? item.locationId ?? item.phoneNumberId ?? item.phoneNumber?.[0]?.phoneNumberId ?? 0;
        const secondId = item.groupId ?? item.secondId ?? 0;
        const name = item.firstName ? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()
                     : item.groupName ?? item.name ?? item.locationName ?? item.phoneNumberValue ?? item.phoneNumber?.[0]?.phoneNumberValue ?? '';
        const isAssigned = item.isAssigned ?? false;
        this.lookupDtoMain.push({ id, secondId, name, isAssigned });
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
      } else if (targetPortal === portal.GroupLookup) {
        this.groupsMain = result as Group[];
        this.loadingGroup = false;
      } else if (targetPortal === portal.LocationLookup) {
        this.locationsMain = result as Location[];
        this.loadingLocation = false;
      } else if (targetPortal === portal.PhoneNumberLookup) {
        // Convert assigned-phone-number DTOs into real PhoneNumber objects for selection and upsert
        if (result.length && (result[0] as any).phoneNumber) {
          this.phoneNumbersMain = (result as any[]).map(item => (item.phoneNumber?.[0] ?? new PhoneNumber()) as PhoneNumber);
        } else {
          this.phoneNumbersMain = result as PhoneNumber[];
        }
        this.loadingPhoneNumber = false;
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
        const id = item.groupId ?? item.individualId ?? item.id ?? 0;
        const name = item.firstName ? `${item.firstName} ${item.lastName ?? ''}`.trim()
                     : item.groupName ?? item.name ?? '';
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

    const handleResult5 = (result: any[]) => {
      // Normalize results into LookupDto[]
      this.dropdownDtoPhoneNumberMain = [];

      for (const item of result || []) {
        const id = item.phoneNumberId ?? item.id ?? 0;
        const name = item.phoneNumberValue ?? '';
        this.dropdownDtoPhoneNumberMain.push({ id, name });
      }

      // trigger change detection if needed
      this.cdr.markForCheck?.();
    };

    // initial immediate fetch
    fetchFn().subscribe(
      (res: any[]) => handleResult(res),
      () => {
        if (targetPortal === portal.IndividualLookup) this.loadingLookup = false;
        if (targetPortal === portal.GroupLookup) this.loadingGroup = false;
        if (targetPortal === portal.LocationLookup) this.loadingLocation = false;
        if (targetPortal === portal.PhoneNumberLookup) this.loadingPhoneNumber = false;
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

    fetchFn5().subscribe(
      (res: any[]) => handleResult5(res), () =>{}
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

    // periodic polling for quinary fetch function (fetchFn5)
    if (fetchFn5){
      this.pollingSubscription5 = interval(1000)
        .pipe(
          switchMap(() => fetchFn5())
        )
        .subscribe((value) => handleResult5(value as any[]), (err) => {
          console.error('Polling error for quinary fetch', err);
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
    if (this.pollingSubscription5) {
      this.pollingSubscription5.unsubscribe();
      this.pollingSubscription5 = undefined;
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
    if (this.portalState === portal.GroupLookup)
      this.groupMain = this.groupsMain.find(fam => fam.groupId === $event.id) || new Group();
    if (this.portalState === portal.LocationLookup)
      this.locationMain = this.locationsMain.find(loc => loc.locationId === $event.id) || new Location();
    if (this.portalState === portal.PhoneNumberLookup)
      this.phoneNumberMain = this.phoneNumbersMain.find(phone => phone.phoneNumberId === $event.id) || new PhoneNumber();

  }

  resetData() {
    this.individualMain = new Individual();
    this.groupMain = new Group();
    this.locationMain = new Location();
    this.phoneNumberMain = new PhoneNumber();
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

  shouldUseAssignedFlag(individualId: number): boolean {
    return individualId > 0 ? true : false;
  }

  setAssignedFlagChanges(changes: { id: number, isAssigned: boolean }[]): void {
    for (const change of changes) {
      const item = this.lookupDtoMain.find(i => i.id === change.id);
      if (item) {
        item.isAssigned = change.isAssigned;

        if (this.individualMain.individualId > 0) {
          if (this.portalState === portal.LocationLookup) {
            if (change.isAssigned) {
              this.individualLocationService.addIndividualLocation({ individualId: this.individualMain.individualId, locationId: change.id }).subscribe(
                () => {
                  console.log(`Successfully linked Individual ${this.individualMain.individualId} to Location ${change.id}`);
                },
                (error) => {
                  console.error(`Failed to link Individual ${this.individualMain.individualId} to Location ${change.id}:`, error);
                }
              );
            } else {
              this.individualLocationService.deleteIndividualLocationByIndividualAndLocationId(this.individualMain.individualId, change.id).subscribe(
                () => {
                  console.log(`Successfully unlinked Individual ${this.individualMain.individualId} from Location ${change.id}`);
                },
                (error) => {
                  console.error(`Failed to unlink Individual ${this.individualMain.individualId} from Location ${change.id}:`, error);
                }
              );
            }
          } else if (this.portalState === portal.PhoneNumberLookup) {
            if (change.isAssigned) {
              this.individualPhoneNumberService.addIndividualPhoneNumber({ individualId: this.individualMain.individualId, phoneNumberId: change.id }).subscribe(
                () => {
                  console.log(`Successfully linked Individual ${this.individualMain.individualId} to PhoneNumber ${change.id}`);
                },
                (error) => {
                  console.error(`Failed to link Individual ${this.individualMain.individualId} to PhoneNumber ${change.id}:`, error);
                }
              );
            } else {
              this.individualPhoneNumberService.deleteIndividualPhoneNumberByIndividualAndPhoneNumberId(this.individualMain.individualId, change.id).subscribe(
                () => {
                  console.log(`Successfully unlinked Individual ${this.individualMain.individualId} from PhoneNumber ${change.id}`);
                },
                (error) => {
                  console.error(`Failed to unlink Individual ${this.individualMain.individualId} from PhoneNumber ${change.id}:`, error);
                }
              );
            }
          }
        }
      } else {
        console.warn(`Item with id ${change.id} not found in lookupDtoMain to update assigned flag.`);
      }
    }
  }
}
