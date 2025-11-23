import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAndDateComponent } from './time-and-date.component';

describe('TimeAndDateComponent', () => {
  let component: TimeAndDateComponent;
  let fixture: ComponentFixture<TimeAndDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeAndDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeAndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
