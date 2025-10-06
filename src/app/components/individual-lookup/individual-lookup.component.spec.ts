import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualLookupComponent } from './individual-lookup.component';

describe('IndividualLookupComponent', () => {
  let component: IndividualLookupComponent;
  let fixture: ComponentFixture<IndividualLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualLookupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
