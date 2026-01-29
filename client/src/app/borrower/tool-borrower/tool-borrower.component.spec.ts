import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBorrowerComponent } from './tool-borrower.component';

describe('ToolBorrowerComponent', () => {
  let component: ToolBorrowerComponent;
  let fixture: ComponentFixture<ToolBorrowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolBorrowerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
