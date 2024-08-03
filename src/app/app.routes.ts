import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './mainpage/dashboard/home.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';

export const routes: Routes = [

    
    { path: 'dashboard', component: DashboardComponent },
    { path: 'test', component: TestComponent },
    { path: 'home', component: HomeComponent },

];
