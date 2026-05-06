import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUpsertComponent } from './group-upsert.component';

describe('GroupUpsertComponent', () => {
  let component: GroupUpsertComponent;
  let fixture: ComponentFixture<GroupUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
