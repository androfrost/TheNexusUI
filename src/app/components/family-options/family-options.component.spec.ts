import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyOptionsComponent } from './family-options.component';

describe('FamilyOptionsComponent', () => {
  let component: FamilyOptionsComponent;
  let fixture: ComponentFixture<FamilyOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
