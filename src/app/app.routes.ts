import { Routes } from '@angular/router';
import { HomeComponent } from './home_main/home/home.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [

    
    { path: 'home', component: HomeComponent },
    { path: 'test', component: TestComponent },
];
