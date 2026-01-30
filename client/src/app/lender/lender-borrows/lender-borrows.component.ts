import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { ToolsService } from '../tools.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lender-borrows',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './lender-borrows.component.html',
  styleUrls: ['./lender-borrows.component.scss'],
})
export class LenderBorrowsComponent implements OnInit {
  borrows: any[] = [];
  loading = false;

  constructor(private toolsService: ToolsService) {}

  ngOnInit(): void {
    this.fetchBorrows();
  }

  fetchBorrows(): void {
    this.loading = true;

    this.toolsService.getAllBorrows().subscribe({
      next: (res) => {
        this.borrows = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  approveReturn(borrowUuid: string): void {
    if (!confirm('Approve return for this tool?')) return;

    this.toolsService.approveReturn(borrowUuid).subscribe({
      next: () => this.fetchBorrows(),
      error: (err) => {
        alert(err.error?.message || 'Failed to approve return');
      },
    });
  }

  isReturnPending(borrow: any): boolean {
    return borrow.return_status === 'Initiated';
  }

  isReturned(borrow: any): boolean {
    return borrow.return_status === 'Returned';
  }

  isLateReturned(borrow: any): boolean {
    return borrow.return_status === 'Late Returned';
  }
}
