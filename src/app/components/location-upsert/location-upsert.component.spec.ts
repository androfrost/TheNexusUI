import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationUpsertComponent } from './location-upsert.component';

describe('LocationUpsertComponent', () => {
  let component: LocationUpsertComponent;
  let fixture: ComponentFixture<LocationUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
