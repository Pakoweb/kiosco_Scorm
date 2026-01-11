import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorScormComponent } from './visor-scorm.component';

describe('VisorScormComponent', () => {
  let component: VisorScormComponent;
  let fixture: ComponentFixture<VisorScormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisorScormComponent]
    });
    fixture = TestBed.createComponent(VisorScormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
