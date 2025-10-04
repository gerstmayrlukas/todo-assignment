import { Routes } from '@angular/router';
import {WelcomePageComponent} from './components/welcome-page/welcome-page.component';
import {TodosComponent} from './components/todos/todos.component';

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
