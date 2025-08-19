import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NexusPortalComponent } from './nexus-portal.component';

describe('NexusPortalComponent', () => {
  let component: NexusPortalComponent;
  let fixture: ComponentFixture<NexusPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NexusPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NexusPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
