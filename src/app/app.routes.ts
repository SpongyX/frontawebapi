import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './mainpage/test/home.component';

export const routes: Routes = [

    
    { path: 'home', component: HomeComponent },
    { path: 'test', component: TestComponent },
];
