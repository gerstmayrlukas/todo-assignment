import {Component, Input} from '@angular/core';
import {Todo} from '../models/todo.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-todos',
  imports: [
    FormsModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent {

  todo: string = '';

  todos: Todo[] = [];

  addNewTodo() {
    if(this.todo === '') {
      window.alert("Type in a todo!")
    }else (
      this.todos.push({
          id: Date.now().toString(),
          title: this.todo.trim(),
          done: false
        }
      )
    )
    this.todo = '';
  }

  changeDone(id: string) {
    const todo = this.todos.find(todo => todo.id === id);
    if(todo){
      todo.done = !todo.done;
    }
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

}
