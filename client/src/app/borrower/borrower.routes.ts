import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { BorrowerLayoutComponent } from './borrower-layout.component';
import { ToolBorrowerComponent } from './tool-borrower/tool-borrower.component';
import { BorrowToolsComponent } from './borrow-tools/borrow-tools.component';

export const borrowerRoutes: Routes = [
  {
    path: 'borrower',
    component: BorrowerLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'borrow-tools',
        component: BorrowToolsComponent,
      },
      {
        path: 'borrow-tools/:tooluuid',
        component: BorrowToolsComponent,
      },
      {
        path: 'tools',
        component: ToolBorrowerComponent,
      },
      {
        path: 'tools/:borrowuuid',
        component: ToolBorrowerComponent,
      },
      {
        path: '',
        redirectTo: 'borrow-tools',
        pathMatch: 'full',
      },
    ],
  },
];
