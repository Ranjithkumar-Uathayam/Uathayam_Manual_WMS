import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonMasterComponent } from './reason-master.component';

describe('ReasonMasterComponent', () => {
  let component: ReasonMasterComponent;
  let fixture: ComponentFixture<ReasonMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonMasterComponent]
    });
    fixture = TestBed.createComponent(ReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
