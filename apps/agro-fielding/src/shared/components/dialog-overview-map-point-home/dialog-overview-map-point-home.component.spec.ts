import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOverviewMapPointHomeComponent } from './dialog-overview-map-point-home.component';

describe('DialogOverviewMapPointHomeComponent', () => {
  let component: DialogOverviewMapPointHomeComponent;
  let fixture: ComponentFixture<DialogOverviewMapPointHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOverviewMapPointHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOverviewMapPointHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
