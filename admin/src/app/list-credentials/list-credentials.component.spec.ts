/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListCredentialsComponent } from './list-credentials.component';

describe('ListCredentialsComponent', () => {
  let component: ListCredentialsComponent;
  let fixture: ComponentFixture<ListCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
