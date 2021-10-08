import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSpaceDetailSheetComponent } from './parking-space-detail-sheet.component';

describe('ParkingSpaceDetailDialogComponent', () => {
  let component: ParkingSpaceDetailSheetComponent;
  let fixture: ComponentFixture<ParkingSpaceDetailSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingSpaceDetailSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingSpaceDetailSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
