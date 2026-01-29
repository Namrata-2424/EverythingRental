import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowToolsComponent } from './borrow-tools.component';

describe('BorrowToolsComponent', () => {
  let component: BorrowToolsComponent;
  let fixture: ComponentFixture<BorrowToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowToolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BorrowToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
