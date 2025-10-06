import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualOptionsComponent } from './individual-options.component';

describe('IndividualOptionsComponent', () => {
  let component: IndividualOptionsComponent;
  let fixture: ComponentFixture<IndividualOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
