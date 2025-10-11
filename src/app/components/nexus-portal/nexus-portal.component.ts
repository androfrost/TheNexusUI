import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndividualUpsertComponent } from "../individual-upsert/individual-upsert.component";
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { MainMenuComponent } from "../main-menu/main-menu.component";
import { FamilyUpsertComponent } from "../family-upsert/family-upsert.component";
import { IndividualOptionsComponent } from "../individual-options/individual-options.component";
import { IndividualLookupComponent } from "../individual-lookup/individual-lookup.component";
import { LookupDto } from '../../models/dto/lookup-dto'; // Update the path as needed
import { IndividualService } from '../../services/individual.service';

import { Individual } from '../../models/individual';
import { Subject, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IndividualOptionsComponent, IndividualUpsertComponent,
    MainMenuComponent, FamilyUpsertComponent, IndividualLookupComponent],
  templateUrl: './nexus-portal.component.html',
  styleUrl: './nexus-portal.component.css',
  providers: [IndividualService]
})
export class NexusPortalComponent implements OnInit, OnDestroy {

  portal = portal;
  portalState: number = 0;
  newPortalState: number = portal.IndividualUpsert;
  private intervalId: any;
  private destroyed$ = new Subject<void>();
  private pollingSubscription?: Subscription;
  loadingLookup: boolean = false;

  status = status;
  
  lookupDtoMain: LookupDto[] = [];
  individualsMain: Individual[] = [];
  individualMain: Individual = new Individual();

  constructor(private cdr: ChangeDetectorRef, private individualService: IndividualService) {

  }

  ngOnInit(): void {
    // Polling was removed; we fetch data once when the portal is activated.
  }

  activatePortal(portalId: number) : void{
    //this.IndividualsLookup(portalId);
    this.portalState = portalId;
    // Start polling when entering the IndividualLookup portal, stop when leaving
    if (portalId === portal.IndividualLookup) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  }

  IndividualsLookup(portalId: number) : void{
    if (portalId == portal.IndividualLookup){
      this.individualService.getIndividualsByStatusId(status.Active).subscribe((result: Individual[]) => {
        this.individualsMain = result;
        // rebuild lookup DTOs
        this.lookupDtoMain = [];
        for (const individual of this.individualsMain) {
          this.lookupDtoMain.push({ id: individual.individualId, secondId: individual.familyId, name: individual.firstName + ' ' + individual.lastName });
        }
      });
    }
  }

  private startPolling(): void {
    if (this.pollingSubscription) {
      return; // already polling
    }

    const handleResult = (result: Individual[]) => {
      this.individualsMain = result;
      this.lookupDtoMain = [];
      for (const individual of this.individualsMain) {
        this.lookupDtoMain.push({ id: individual.individualId, secondId: individual.familyId, name: individual.firstName + ' ' + individual.lastName });
      }
    };

    // immediate fetch
    this.loadingLookup = true;
    this.individualService.getIndividualsByStatusId(status.Active).subscribe((res) => {
      handleResult(res);
      this.loadingLookup = false;
    }, () => {
      // on error, stop loading so UI can react
      this.loadingLookup = false;
    });

    // periodic polling (cancels previous in-flight via switchMap)
    this.pollingSubscription = interval(1000)
      .pipe(
        switchMap(() => this.individualService.getIndividualsByStatusId(status.Active))
      )
      .subscribe(handleResult);
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  ngOnDestroy(): void {
    // complete destroyed$ for teardown
    this.destroyed$.next();
    this.destroyed$.complete();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onSelectedItemChange($event: LookupDto) {
    this.individualMain = this.individualsMain.find(ind => ind.individualId === $event.id) || new Individual();
    return this.individualMain;
  }

  resetData() {
    this.individualMain = new Individual();
    return true;
  }
}
