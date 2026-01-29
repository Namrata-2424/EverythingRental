import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { LenderLayoutComponent } from './lender-layout.component';
import { ToolsComponent } from './tools/tools.component';
import { LenderBorrowsComponent } from './lender-borrows/lender-borrows.component';

export const lenderRoutes: Routes = [
  {
    path: 'lender',
    component: LenderLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'tools',
        component: ToolsComponent,
      },
      {
        path: '',
        redirectTo: 'tools',
        pathMatch: 'full',
      },
      {
        path: 'lent',
        component: LenderBorrowsComponent
      },
    ],
  },
];
