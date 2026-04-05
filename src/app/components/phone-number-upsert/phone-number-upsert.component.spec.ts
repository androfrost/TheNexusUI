import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberUpsertComponent } from './phone-number-upsert.component';

describe('PhoneNumberUpsertComponent', () => {
  let component: PhoneNumberUpsertComponent;
  let fixture: ComponentFixture<PhoneNumberUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneNumberUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNumberUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
