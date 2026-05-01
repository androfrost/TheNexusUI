import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrancePortalComponent } from './entrance-portal.component';

describe('EntrancePortalComponent', () => {
  let component: EntrancePortalComponent;
  let fixture: ComponentFixture<EntrancePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrancePortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrancePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
