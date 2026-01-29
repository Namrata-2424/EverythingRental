import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BorrowerService } from '../borrower.service';

@Component({
  selector: 'app-tool-borrower',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tool-borrower.component.html',
})
export class ToolBorrowerComponent implements OnInit {
  borrows: any[] = [];
  borrow: any | null = null;
  borrowuuid: string | null = null;
  loading = false;

  constructor(
    private borrowerService: BorrowerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.borrowuuid = params.get('borrowuuid');

      if (this.borrowuuid) {
        this.loadBorrow(this.borrowuuid);
      } else {
        this.borrow = null;
        this.loadBorrows();
      }
    });
  }

  loadBorrows(): void {
    this.borrowerService.getAll().subscribe({
      next: (res) => (this.borrows = res),
      error: () => alert('Failed to load borrowed tools'),
    });
  }

  loadBorrow(borrowuuid: string): void {
    this.borrowerService.getOne(borrowuuid).subscribe({
      next: (res) => (this.borrow = res),
      error: () => this.router.navigate(['/borrower/tools']),
    });
  }

  view(borrowuuid: string): void {
    if (!borrowuuid) {
      alert('Invalid borrow record');
      return;
    }
    this.router.navigate(['/borrower/tools', borrowuuid]);
  }

  returnTool(borrowuuid: string): void {
    if (!confirm('Return this tool?')) return;

    this.loading = true;
    this.borrowerService.returnTool(borrowuuid).subscribe({
      next: () => {
        alert('Tool returned successfully');
        this.loading = false;
        this.loadBorrows();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Return failed');
      },
    });
  }

  back(): void {
    this.router.navigate(['/borrower/tools']);
  }
}
