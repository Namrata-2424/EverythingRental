import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToolsService } from '../tools.service';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  showForm = false;
  loading = false;
  editMode = false;

  tools: any[] = [];
  selectedTool: any = null;
  viewingToolUuid: string | null = null;

  categories = [
    { value: 'tools_diy', label: 'Tools & DIY' },
    { value: 'home_household', label: 'Home & Household' },
    { value: 'garden_outdoor', label: 'Garden & Outdoor' },
    { value: 'kitchen_appliances', label: 'Kitchen Appliances' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'events_party_supplies', label: 'Events & Party Supplies' },
    { value: 'mobility_transport', label: 'Mobility & Transport' },
    { value: 'kids_baby_items', label: 'Kids & Baby Items' },
    { value: 'storage_moving', label: 'Storage & Moving' },
    { value: 'hobbies_craft', label: 'Hobbies & Craft' },
    { value: 'safety_emergency', label: 'Safety & Emergency' },
    { value: 'pet_supplies', label: 'Pet Supplies' },
    { value: 'office_study', label: 'Office & Study' },
    { value: 'fitness_sports', label: 'Fitness & Sports' },
    { value: 'travel_camping', label: 'Travel & Camping' }
  ];

  toolForm = this.fb.group({
    title: ['', Validators.required],
    category: [null, Validators.required],
    description: [''],
    quantity: [null, [Validators.required, Validators.min(1)]],
    borrow_day_count: [null]
  });

  constructor(
    private fb: FormBuilder,
    private toolsService: ToolsService
  ) {}

  ngOnInit(): void {
    this.fetchTools();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.resetForm();
  }

  fetchTools(): void {
    this.toolsService.getAll().subscribe(res => {
      this.tools = res;
    });
  }

  viewTool(tool: any): void {
    this.viewingToolUuid =
      this.viewingToolUuid === tool.tool_uuid ? null : tool.tool_uuid;
  }

  editTool(tool: any): void {
    this.editMode = true;
    this.showForm = true;
    this.selectedTool = tool;

    this.toolForm.patchValue({
      title: tool.title,
      category: tool.category,
      description: tool.description,
      quantity: tool.quantity,
      borrow_day_count: tool.borrow_day_count
    });

    this.toolForm.get('title')?.disable();
    this.toolForm.get('category')?.disable();
    this.toolForm.get('description')?.disable();
  }

  submit(): void {
    if (this.toolForm.invalid) return;

    this.loading = true;

    const payload: any = {
      quantity: this.toolForm.value.quantity
    };

    if (this.toolForm.value.borrow_day_count != null) {
      payload.borrow_day_count = this.toolForm.value.borrow_day_count;
    }

    if (this.editMode && this.selectedTool) {
      this.toolsService.update(this.selectedTool.tool_uuid, payload).subscribe({
        next: () => this.afterSave(),
        error: err => this.handleError(err)
      });
    } else {
      this.toolsService.create({
        ...this.toolForm.getRawValue()
      }).subscribe({
        next: () => this.afterSave(),
        error: err => this.handleError(err)
      });
    }
  }

  afterSave(): void {
    this.loading = false;
    this.resetForm();
    this.fetchTools();
  }

  resetForm(): void {
    this.editMode = false;
    this.selectedTool = null;
    this.viewingToolUuid = null;
    this.toolForm.reset();
    this.toolForm.enable();
  }

  delete(toolUuid: string): void {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    this.toolsService.delete(toolUuid).subscribe({
      next: () => this.fetchTools(),
      error: err => alert(err.error?.message || 'Cannot delete tool')
    });
  }

  getCategoryLabel(value: string): string {
    return this.categories.find(c => c.value === value)?.label || value;
  }

  handleError(err: any): void {
    this.loading = false;
    alert(err.error?.message || 'Something went wrong');
  }
}
