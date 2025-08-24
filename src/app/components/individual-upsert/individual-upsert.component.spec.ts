import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualUpsertComponent } from './individual-upsert.component';

describe('IndividualUpsertComponent', () => {
  let component: IndividualUpsertComponent;
  let fixture: ComponentFixture<IndividualUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
