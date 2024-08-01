import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './test123/test/home.component';

export const routes: Routes = [

    
    { path: 'home', component: HomeComponent },
    { path: 'test', component: TestComponent },
];
