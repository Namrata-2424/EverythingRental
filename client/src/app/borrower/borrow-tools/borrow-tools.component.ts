import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BorrowerService } from '../borrower.service';

interface Lender {
  username: string;
  quantity: number;
  start_date: string;
  days?: number;
  lender_uuid?: string;
}

@Component({
  selector: 'app-borrow-tools',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './borrow-tools.component.html',
  styleUrls: ['./borrow-tools.component.scss'],
})
export class BorrowToolsComponent implements OnInit {
  currentUsername!: string;
  tools: any[] = [];
  tool: any | null = null;
  selectedLender: any | null = null;
  tooluuid: string | null = null;

  loading = false;

  borrowForm = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private borrowerService: BorrowerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.currentUsername = localStorage.getItem('username') || '';

    this.route.paramMap.subscribe((params) => {
      this.tooluuid = params.get('tooluuid');

      if (this.tooluuid) {
        this.loadTool(this.tooluuid);
      } else {
        this.resetDetailState();
        this.fetchTools();
      }
    });
  }

  fetchTools(): void {
    this.borrowerService.getAvailableTools().subscribe({
      next: (res) => (this.tools = res),
      error: (err) => alert(err.error?.message || 'Failed to load tools'),
    });
  }

  loadTool(tooluuid: string): void {
    this.borrowerService.getToolInfo(tooluuid).subscribe({
      next: (res) => (this.tool = res),
      error: () => {
        alert('Could not get Tool!');
        this.router.navigate(['/borrower/borrow-tools']);
      },
    });
  }

  getVisibleLenders(): Lender[] {
    if (!this.tool?.lenders) return [];

    const currentUser = this.currentUsername.trim().toLowerCase();

    return (this.tool.lenders as Lender[]).filter((lender: Lender) => {
      const lenderUsername = lender.username?.trim().toLowerCase();
      console.log('Current user:', this.currentUsername);
      console.log('All lenders:', this.tool.lenders);

      if (lenderUsername === currentUser) {
        return false;
      }

      const start = new Date(lender.start_date);
      const days = lender.days ?? 7;

      const due = new Date(start);
      due.setDate(due.getDate() + days);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return due >= today;
    });
  }

  hasOnlySelfAsLender(): boolean {
    if (!this.tool?.lenders || !this.currentUsername) return false;

    const currentUser = this.currentUsername.trim().toLowerCase();

    return this.tool.lenders.every(
      (l: any) => l.username?.trim().toLowerCase() === currentUser,
    );
  }

  hasAnyActiveLenders(): boolean {
    return this.getVisibleLenders().length > 0;
  }

  selectLender(lender: any): void {
    this.selectedLender = lender;
    this.borrowForm.reset({ quantity: 1 });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  calculateDueDate(startDate: string, days?: number): string {
    const borrowDays = days ?? 7; // default borrow limit

    const start = new Date(startDate);
    const due = new Date(start);
    due.setDate(due.getDate() + borrowDays);

    return due.toLocaleDateString();
  }

  borrow(): void {
    if (!this.tooluuid || !this.selectedLender || this.borrowForm.invalid) {
      return;
    }

    this.loading = true;

    this.borrowerService
      .borrowTool(this.tooluuid, {
        lenderuuid: this.selectedLender.lender_uuid,
        quantity: this.borrowForm.value.quantity!,
        startDate: this.selectedLender.start_date,
        dueDate: this.calculateDueDate(
          this.selectedLender.start_date,
          this.selectedLender.days,
        ),
      })
      .subscribe({
        next: () => {
          alert('Tool borrowed successfully');
          this.router.navigate(['/borrower/tools']);
        },
        error: (err) => {
          this.loading = false;
          alert(err.error?.message || 'Borrow failed');
        },
      });
  }

  back(): void {
    this.router.navigate(['/borrower/borrow-tools']);
  }

  resetDetailState(): void {
    this.tool = null;
    this.selectedLender = null;
    this.borrowForm.reset();
  }
}
