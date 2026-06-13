import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {GroupOptionsComponent } from './group-options.component';

describe('GroupOptionsComponent', () => {
  let component: GroupOptionsComponent;
  let fixture: ComponentFixture<GroupOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupOptionsComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
