import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderBorrowsComponent } from './lender-borrows.component';

describe('LenderBorrowsComponent', () => {
  let component: LenderBorrowsComponent;
  let fixture: ComponentFixture<LenderBorrowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LenderBorrowsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LenderBorrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
