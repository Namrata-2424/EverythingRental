import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'register',
        pathMatch:'full'
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'login',
        loadComponent:()=>
            import('./auth/login/login.component').then(m=>m.LoginComponent)
    },
    {
        path:'**',
        redirectTo:'register'
    }
];
