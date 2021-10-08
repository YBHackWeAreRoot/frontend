import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSpaceDetailSheet } from './parking-space-detail-sheet.component';

describe('ParkingSpaceDetailDialogComponent', () => {
  let component: ParkingSpaceDetailSheet;
  let fixture: ComponentFixture<ParkingSpaceDetailSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingSpaceDetailSheet ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingSpaceDetailSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
