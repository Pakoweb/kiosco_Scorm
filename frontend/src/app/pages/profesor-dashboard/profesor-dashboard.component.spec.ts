import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorDashboardComponent } from './profesor-dashboard.component';

describe('ProfesorDashboardComponent', () => {
  let component: ProfesorDashboardComponent;
  let fixture: ComponentFixture<ProfesorDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorDashboardComponent]
    });
    fixture = TestBed.createComponent(ProfesorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
