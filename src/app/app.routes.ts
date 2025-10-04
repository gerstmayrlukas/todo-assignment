import { Routes } from '@angular/router';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {TodosComponent} from './todos/todos.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },

  {
    path: 'todos',
    component: TodosComponent
  }
];
