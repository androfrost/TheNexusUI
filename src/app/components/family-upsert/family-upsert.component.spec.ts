import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyUpsertComponent } from './family-upsert.component';

describe('FamilyUpsertComponent', () => {
  let component: FamilyUpsertComponent;
  let fixture: ComponentFixture<FamilyUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
