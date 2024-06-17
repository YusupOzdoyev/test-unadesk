import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  { path: '', component: UserListComponent},
];
